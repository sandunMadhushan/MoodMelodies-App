import React, { useRef, useState } from 'react';
import { View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebViewFaceApiProps {
  imageUri: string;
  onResult: (result: any) => void;
  onError: (error: string) => void;
}

export const WebViewFaceApi: React.FC<WebViewFaceApiProps> = ({
  imageUri,
  onResult,
  onError,
}) => {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
    </head>
    <body>
        <canvas id="canvas" style="display: none;"></canvas>
        
        <script>
            async function loadModels() {
                try {
                    await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/');
                    await faceapi.nets.faceExpressionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/');
                    console.log('Models loaded');
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
                } catch (error) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ 
                        type: 'error', 
                        message: 'Failed to load models: ' + error.message 
                    }));
                }
            }

            async function analyzeImage(imageData) {
                try {
                    const img = new Image();
                    img.onload = async () => {
                        const canvas = document.getElementById('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);

                        const detections = await faceapi
                            .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
                            .withFaceExpressions();

                        if (detections.length === 0) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({ 
                                type: 'error', 
                                message: 'No face detected' 
                            }));
                            return;
                        }

                        const expressions = detections[0].expressions;
                        
                        // Find dominant emotion
                        let maxEmotion = 'neutral';
                        let maxValue = 0;
                        
                        Object.entries(expressions).forEach(([emotion, value]) => {
                            if (value > maxValue) {
                                maxValue = value;
                                maxEmotion = emotion;
                            }
                        });

                        const moodMapping = {
                            angry: 'Angry',
                            disgusted: 'Disgusted',
                            fearful: 'Anxious',
                            happy: 'Happy',
                            neutral: 'Calm',
                            sad: 'Sad',
                            surprised: 'Surprised',
                        };

                        const result = {
                            mood: moodMapping[maxEmotion] || 'Calm',
                            confidence: maxValue,
                            emotions: {
                                angry: expressions.angry,
                                disgusted: expressions.disgusted,
                                fearful: expressions.fearful,
                                happy: expressions.happy,
                                neutral: expressions.neutral,
                                sad: expressions.sad,
                                surprised: expressions.surprised,
                            }
                        };

                        window.ReactNativeWebView.postMessage(JSON.stringify({ 
                            type: 'result', 
                            data: result 
                        }));
                    };
                    
                    img.src = imageData;
                } catch (error) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ 
                        type: 'error', 
                        message: 'Analysis failed: ' + error.message 
                    }));
                }
            }

            // Listen for messages from React Native
            window.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'analyze' && data.imageData) {
                    analyzeImage(data.imageData);
                }
            });

            // Load models on page load
            loadModels();
        </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case 'ready':
          // Send image data to WebView
          webViewRef.current?.postMessage(
            JSON.stringify({
              type: 'analyze',
              imageData: imageUri,
            })
          );
          break;

        case 'result':
          onResult(data.data);
          break;

        case 'error':
          onError(data.message);
          break;
      }
    } catch (error) {
      onError('Failed to parse WebView message');
    }
  };

  return (
    <View style={{ width: 1, height: 1, opacity: 0 }}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};
