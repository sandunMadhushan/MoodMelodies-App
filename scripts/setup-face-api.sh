#!/bin/bash

# Face API Service Setup Script
echo "🚀 Setting up Face API Service..."

# Create service directory
mkdir -p face-api-service
cd face-api-service

# Install dependencies
echo "📦 Installing dependencies..."
npm install express cors multer face-api.js canvas @tensorflow/tfjs @tensorflow/tfjs-node
npm install -D nodemon

# Create uploads and temp directories
mkdir -p uploads temp models

# Download face-api.js models
echo "📥 Downloading face-api.js models..."
cd models

# Download model files
curl -o tiny_face_detector_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -o tiny_face_detector_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

curl -o face_expression_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
curl -o face_expression_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1

curl -o face_landmark_68_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -o face_landmark_68_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

cd ..

echo "✅ Face API Service setup complete!"
echo "🚀 To start the service:"
echo "   cd face-api-service"
echo "   npm start"
