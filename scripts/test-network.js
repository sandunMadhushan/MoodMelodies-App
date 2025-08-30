#!/usr/bin/env node
/**
 * Network Connectivity Test for Mood Melodies App
 * Tests if the Face API server is reachable from different network addresses
 */

const http = require('http');
const { execSync } = require('child_process');

console.log('🔍 Testing Face API Server Connectivity...\n');

// Get current IP addresses
function getCurrentIPs() {
  try {
    const output = execSync('ipconfig', { encoding: 'utf-8' });
    const ipMatches = output.match(/IPv4 Address[.\s]*: ([\d.]+)/g);
    if (ipMatches) {
      return ipMatches.map((match) => match.match(/([\d.]+)$/)[1]);
    }
  } catch (error) {
    console.log('⚠️  Could not get IP addresses automatically');
  }
  return [];
}

// Test connectivity to a URL
function testConnection(url) {
  return new Promise((resolve) => {
    const request = http.get(url + '/health', { timeout: 5000 }, (response) => {
      let data = '';
      response.on('data', (chunk) => (data += chunk));
      response.on('end', () => {
        resolve({
          success: true,
          status: response.statusCode,
          data: data.substring(0, 50) + '...',
        });
      });
    });

    request.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({ success: false, error: 'Connection timeout' });
    });
  });
}

async function runTests() {
  const currentIPs = getCurrentIPs();
  console.log('📡 Current IP Addresses:', currentIPs.join(', '), '\n');

  const testUrls = [
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://10.0.2.2:3001',
    ...currentIPs.map((ip) => `http://${ip}:3001`),
  ];

  console.log('🧪 Testing connectivity to Face API server...\n');

  for (const url of testUrls) {
    console.log(`Testing: ${url}`);
    const result = await testConnection(url);

    if (result.success) {
      console.log(`✅ SUCCESS - Status: ${result.status}`);
      console.log(`   Response: ${result.data}\n`);
    } else {
      console.log(`❌ FAILED - ${result.error}\n`);
    }
  }

  console.log('💡 Usage Instructions:');
  console.log(
    '1. Make sure Face API server is running: cd face-api-service && npm start'
  );
  console.log(
    '2. Update lib/faceApiService.ts with a working IP address from above'
  );
  console.log('3. Restart your mobile app to pick up the new configuration');
}

runTests().catch(console.error);
