export interface NetworkEndpoint {
  url: string;
  type: 'ngrok' | 'local' | 'network';
  priority: number;
}

/**
 * React Native compatible endpoint discovery
 * For tunnel mode, we'll try common ngrok patterns and known working endpoints
 */
export async function discoverFaceApiEndpoint(): Promise<string> {
  console.log('🔍 Starting Face API endpoint discovery...');

  // For tunnel mode, always prioritize ngrok URL
  const currentNgrokUrl = 'https://e4da985e45e8.ngrok-free.app';
  console.log('🎯 Tunnel mode: prioritizing ngrok URL:', currentNgrokUrl);

  try {
    console.log('🧪 Testing ngrok endpoint with proper headers...');
    const isHealthy = await testEndpointHealth(currentNgrokUrl);
    if (isHealthy) {
      console.log('✅ ngrok endpoint is working! Using:', currentNgrokUrl);
      return currentNgrokUrl;
    } else {
      console.log('❌ ngrok endpoint health check failed');
    }
  } catch (error) {
    console.log(
      '❌ ngrok endpoint test error:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  // In tunnel mode, mobile can't reach localhost anyway, so always use ngrok
  console.log(
    '⚠️ Using ngrok URL regardless for tunnel mode:',
    currentNgrokUrl
  );
  return currentNgrokUrl;
}

async function testEndpointHealth(baseUrl: string): Promise<boolean> {
  try {
    console.log(`🔍 Testing health: ${baseUrl}/health`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'any',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(
      `📊 Health response status: ${response.status} ${response.statusText}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`📋 Health response data:`, data);
      const isHealthy = data.status === 'OK';
      console.log(`✅ Health check result: ${isHealthy}`);
      return isHealthy;
    }

    console.log(`❌ Health check failed: HTTP ${response.status}`);
    return false;
  } catch (error) {
    console.log(
      `❌ Health check error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    return false;
  }
}

// Cache the endpoint for performance
let cachedEndpoint: string | null = null;
let lastDiscoveryTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function getFaceApiEndpoint(): Promise<string> {
  const now = Date.now();

  // Use cached endpoint if recent
  if (cachedEndpoint && now - lastDiscoveryTime < CACHE_DURATION) {
    return cachedEndpoint;
  }

  // Discover new endpoint
  console.log('🔄 Refreshing Face API endpoint discovery...');
  cachedEndpoint = await discoverFaceApiEndpoint();
  lastDiscoveryTime = now;

  return cachedEndpoint;
}
