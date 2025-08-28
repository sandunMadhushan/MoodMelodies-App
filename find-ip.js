// Script to find your computer's IP address for mobile testing
const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();

  console.log("🔍 Finding your computer's IP address...\n");

  for (const devName in interfaces) {
    const iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];

      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        console.log(`✅ Found IP Address: ${alias.address}`);
        console.log(
          `📱 Use this in your mobile app: http://${alias.address}:3001`
        );
        console.log(
          `🔧 Update lib/faceApiService.ts with: 'http://${alias.address}:3001'`
        );
        console.log('');
        return alias.address;
      }
    }
  }

  console.log('❌ No external IPv4 address found');
  console.log("💡 Make sure you're connected to WiFi");
  return null;
}

getLocalIPAddress();
