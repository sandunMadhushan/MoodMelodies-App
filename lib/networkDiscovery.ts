/**
 * Network Discovery Service for Mood Melodies App
 * Automatically discovers and tests Face API server endpoints
 * Works on any laptop without manual IP configuration
 * No additional dependencies required
 */

export interface NetworkEndpoint {
  url: string;
  type: 'localhost' | 'network' | 'emulator';
  tested: boolean;
  working: boolean;
  responseTime?: number;
}

class NetworkDiscoveryService {
  private cachedWorkingUrl: string | null = null;
  private lastDiscoveryTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private ngrokTunnelUrl: string | null = null; // For ngrok tunnel support

  /**
   * Get the best working Face API endpoint automatically
   */
  async getWorkingEndpoint(): Promise<string> {
    // Return cached URL if still valid
    if (
      this.cachedWorkingUrl &&
      Date.now() - this.lastDiscoveryTime < this.CACHE_DURATION
    ) {
      console.log(`🔄 Using cached endpoint: ${this.cachedWorkingUrl}`);
      return this.cachedWorkingUrl;
    }

    console.log('🔍 Discovering Face API endpoints...');

    try {
      const workingUrl = await this.discoverWorkingEndpoint();
      this.cachedWorkingUrl = workingUrl;
      this.lastDiscoveryTime = Date.now();
      console.log(`✅ Auto-discovered working endpoint: ${workingUrl}`);
      return workingUrl;
    } catch (error) {
      console.warn('❌ Network discovery failed:', error);
      // Return most likely default
      return 'http://localhost:3001';
    }
  }

  /**
   * Discover all possible endpoints and test them
   */
  async discoverAllEndpoints(): Promise<NetworkEndpoint[]> {
    const endpoints = await this.generatePossibleEndpoints();

    console.log(`🧪 Testing ${endpoints.length} possible endpoints...`);

    // Test all endpoints in parallel with timeout
    const testPromises = endpoints.map((endpoint) =>
      this.testEndpoint(endpoint.url).then((result) => ({
        ...endpoint,
        tested: true,
        working: result.success,
        responseTime: result.responseTime,
      }))
    );

    const results = await Promise.all(testPromises);

    const workingEndpoints = results.filter((ep) => ep.working);
    console.log(`✅ Found ${workingEndpoints.length} working endpoints`);

    return results;
  }

  /**
   * Find the first working endpoint (fastest discovery)
   */
  private async discoverWorkingEndpoint(): Promise<string> {
    const possibleUrls = await this.generatePossibleUrls();

    // Test endpoints with progressive timeout
    for (const url of possibleUrls) {
      try {
        console.log(`🔄 Testing: ${url}`);
        const result = await this.testEndpoint(url, 3000); // 3 second timeout

        if (result.success) {
          console.log(
            `✅ Found working endpoint: ${url} (${result.responseTime}ms)`
          );
          return url;
        }
      } catch (error) {
        console.log(`❌ Failed: ${url}`);
        continue;
      }
    }

    throw new Error('No working Face API endpoints found');
  }

  /**
   * Generate all possible endpoint URLs based on network discovery
   * Now includes support for tunnel mode, ngrok URLs, and various network configurations
   */
  private async generatePossibleUrls(): Promise<string[]> {
    const urls: string[] = [];
    const port = '3001';

    // 1. NGROK TUNNEL SUPPORT - Highest priority if available
    if (this.ngrokTunnelUrl) {
      urls.unshift(this.ngrokTunnelUrl); // Add to beginning of array
    }

    // 2. ACTIVE NGROK TUNNEL - Your current tunnel URL
    urls.unshift('https://297f5d18cb69.ngrok-free.app');

    // 3. Check for common ngrok patterns (if tunnel URL not manually set)
    const ngrokPatterns = [
      'https://localhost.ngrok.io',
      'https://127-0-0-1.ngrok.io',
      // These would be actual ngrok URLs when tunnel is active
      // The actual URL will be provided by ngrok when started
    ];
    urls.push(...ngrokPatterns); // 3. Standard localhost variants (highest priority for development)
    urls.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);

    // 4. Android emulator specific
    urls.push(`http://10.0.2.2:${port}`);

    // 5. PRIORITIZE WiFi networks (192.168.x.x) - Most likely to work from phone in LAN mode
    const wifiIPs = this.generateWiFiNetworkRanges();
    urls.push(...wifiIPs.map((ip) => `http://${ip}:${port}`));

    // 6. Expo tunnel mode support - when using Expo tunnel
    // The Face API should be accessible via ngrok tunnel URL
    // This will be dynamically set when ngrok is running

    // 7. Other network ranges (lower priority - often virtual interfaces)
    const otherIPs = this.generateOtherNetworkRanges();
    urls.push(...otherIPs.map((ip) => `http://${ip}:${port}`));

    // Remove duplicates and return
    return [...new Set(urls)];
  }

  /**
   * Generate endpoint objects with metadata
   */
  private async generatePossibleEndpoints(): Promise<NetworkEndpoint[]> {
    const urls = await this.generatePossibleUrls();

    return urls.map((url) => {
      let type: 'localhost' | 'network' | 'emulator' = 'network';

      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        type = 'localhost';
      } else if (url.includes('10.0.2.2')) {
        type = 'emulator';
      }

      return {
        url,
        type,
        tested: false,
        working: false,
      };
    });
  }

  /**
   * Discover actual network IP addresses from device (simplified)
   */
  private async discoverNetworkIPs(): Promise<string[]> {
    // For now, return common network IPs
    // This could be enhanced with actual network discovery in the future
    return this.generateCommonNetworkRanges();
  }

  /**
   * Derive potential server IPs from device IP
   */
  private deriveNetworkIPs(deviceIP: string): string[] {
    const ips: string[] = [];

    try {
      const parts = deviceIP.split('.');
      if (parts.length === 4) {
        const network = `${parts[0]}.${parts[1]}.${parts[2]}`;

        // Common server IPs in the same network
        const candidates = [1, 2, 10, 100, 101, 102, 254];

        candidates.forEach((lastOctet) => {
          const ip = `${network}.${lastOctet}`;
          if (ip !== deviceIP) {
            // Don't include device's own IP
            ips.push(ip);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to derive network IPs:', error);
    }

    return ips;
  }

  /**
   * Generate WiFi network IP ranges (most likely to work from phone)
   */
  private generateWiFiNetworkRanges(): string[] {
    const wifiIPs: string[] = [];

    // Standard home WiFi ranges
    const wifiRanges = [
      '192.168.1', // Most common home router range
      '192.168.0', // Common home router range
      '192.168.4', // Some routers
      '192.168.2', // Some routers
      '192.168.16', // Detected in your network
    ];

    wifiRanges.forEach((range) => {
      [1, 2, 10, 100, 101, 254].forEach((last) => {
        wifiIPs.push(`${range}.${last}`);
      });
    });

    return wifiIPs;
  }

  /**
   * Generate other network ranges (virtual interfaces, etc.)
   */
  private generateOtherNetworkRanges(): string[] {
    const otherIPs: string[] = [];

    // Virtual network ranges (often Docker, VMware, etc.)
    const ranges = [
      '192.168.56', // VirtualBox host-only
      '172.16.0', // Docker
      '172.31.98', // Detected
      '172.29.112', // Detected
      '172.30.224', // Detected
      '172.17.208', // Detected
      '172.20.96', // Detected
      '10.0.0', // Private network
      '10.0.1', // Private network
    ];

    ranges.forEach((range) => {
      [1, 2, 10, 100, 101, 254].forEach((last) => {
        otherIPs.push(`${range}.${last}`);
      });
    });

    return otherIPs;
  }

  /**
   * Generate common network IP ranges for fallback
   */
  private generateCommonNetworkRanges(): string[] {
    const commonIPs: string[] = [];

    // Common home/office network ranges
    const ranges = [
      '192.168.1',
      '192.168.0',
      '192.168.56',
      '172.16.0',
      '172.31.98',
      '172.29.112',
      '10.0.0',
      '10.0.1',
    ];

    ranges.forEach((range) => {
      [1, 2, 10, 100, 101, 254].forEach((last) => {
        commonIPs.push(`${range}.${last}`);
      });
    });

    return commonIPs;
  }

  /**
   * Test if an endpoint is working
   */
  private async testEndpoint(
    url: string,
    timeout: number = 5000
  ): Promise<{
    success: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${url}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return { success: true, responseTime };
      } else {
        return {
          success: false,
          responseTime,
          error: `HTTP ${response.status}`,
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Set the ngrok tunnel URL for Face API
   * Call this when ngrok tunnel is started
   */
  setNgrokTunnelUrl(url: string): void {
    this.ngrokTunnelUrl = url;
    this.clearCache(); // Force rediscovery to use ngrok URL
    console.log(`🌐 Ngrok tunnel URL set: ${url}`);
  }

  /**
   * Get current ngrok tunnel URL
   */
  getNgrokTunnelUrl(): string | null {
    return this.ngrokTunnelUrl;
  }

  /**
   * Clear cached endpoint (force rediscovery)
   */
  clearCache(): void {
    this.cachedWorkingUrl = null;
    this.lastDiscoveryTime = 0;
    console.log('🔄 Network discovery cache cleared');
  }

  /**
   * Get current cached endpoint without testing
   */
  getCachedEndpoint(): string | null {
    return this.cachedWorkingUrl;
  }
}

export const networkDiscovery = new NetworkDiscoveryService();
