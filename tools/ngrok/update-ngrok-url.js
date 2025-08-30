#!/usr/bin/env node

/**
 * Update the current ngrok URL in the React Native app
 * This script fetches the current ngrok URL and updates the dynamicNetworkDiscovery.ts file
 */

const fs = require('fs');
const http = require('http');
const path = require('path');

async function getCurrentNgrokUrl() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:4040/api/tunnels', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data);

          if (tunnels.tunnels && tunnels.tunnels.length > 0) {
            const httpsTunnel = tunnels.tunnels.find(
              (t) => t.public_url && t.public_url.startsWith('https://')
            );

            if (httpsTunnel) {
              resolve(httpsTunnel.public_url);
            } else {
              reject(new Error('No HTTPS tunnel found'));
            }
          } else {
            reject(new Error('No active tunnels found'));
          }
        } catch (error) {
          reject(
            new Error('Failed to parse ngrok API response: ' + error.message)
          );
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error('Failed to connect to ngrok API: ' + error.message));
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout connecting to ngrok API'));
    });
  });
}

async function updateNgrokUrlInCode(newUrl) {
  const filePath = path.join(__dirname, 'lib', 'dynamicNetworkDiscovery.ts');

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find and replace the current ngrok URL
    const urlRegex =
      /const currentNgrokUrl = 'https:\/\/[a-z0-9]+\.ngrok-free\.app';/;
    const newLine = `const currentNgrokUrl = '${newUrl}';`;

    if (urlRegex.test(content)) {
      content = content.replace(urlRegex, newLine);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(
        `✅ Updated ngrok URL in dynamicNetworkDiscovery.ts: ${newUrl}`
      );
      return true;
    } else {
      console.log(
        '❌ Could not find ngrok URL pattern in dynamicNetworkDiscovery.ts'
      );
      return false;
    }
  } catch (error) {
    console.error('❌ Error updating file:', error.message);
    return false;
  }
}

async function updateFaceApiServiceUrl(newUrl) {
  const filePath = path.join(__dirname, 'lib', 'faceApiService.ts');

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find and replace the current ngrok URL in warning message
    const urlRegex = /Current URL: https:\/\/[a-z0-9]+\.ngrok-free\.app/;
    const newLine = `Current URL: ${newUrl}`;

    if (urlRegex.test(content)) {
      content = content.replace(urlRegex, newLine);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ngrok URL in faceApiService.ts: ${newUrl}`);
      return true;
    } else {
      console.log('❌ Could not find ngrok URL pattern in faceApiService.ts');
      return false;
    }
  } catch (error) {
    console.error('❌ Error updating file:', error.message);
    return false;
  }
}

async function main() {
  try {
    console.log('🔍 Fetching current ngrok URL...');
    const currentUrl = await getCurrentNgrokUrl();
    console.log(`🌐 Current ngrok URL: ${currentUrl}`);

    console.log('📝 Updating React Native code...');
    const discoveryUpdated = await updateNgrokUrlInCode(currentUrl);
    const serviceUpdated = await updateFaceApiServiceUrl(currentUrl);

    if (discoveryUpdated && serviceUpdated) {
      console.log('🎉 Successfully updated all files!');
      console.log('📱 Restart your Expo app to use the new URL');
    } else {
      console.log('⚠️ Some files could not be updated');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getCurrentNgrokUrl,
  updateNgrokUrlInCode,
  updateFaceApiServiceUrl,
};
