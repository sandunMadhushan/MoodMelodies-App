#!/usr/bin/env node

/**
 * Dynamically fetch the current ngrok tunnel URL
 * This script queries the ngrok API to get the active tunnel URL
 */

const http = require('http');

async function getNgrokUrl() {
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
            // Find the HTTPS tunnel
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

// If called directly from command line
if (require.main === module) {
  getNgrokUrl()
    .then((url) => {
      console.log(url);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = { getNgrokUrl };
