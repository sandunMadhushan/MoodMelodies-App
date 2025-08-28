const express = require('express');
const cors = require('cors');
const multer = require('multer');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configure face-api.js to use node canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Load face-api.js models
async function loadModels() {
  const MODEL_URL = path.join(__dirname, 'models');

  try {
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    console.log('✅ Face-API models loaded successfully');
  } catch (error) {
    console.error('❌ Error loading face-api models:', error);
  }
}

// Download models if they don't exist
async function downloadModels() {
  const modelDir = path.join(__dirname, 'models');

  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }

  const models = [
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    'face_expression_model-weights_manifest.json',
    'face_expression_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
  ];

  for (const model of models) {
    const modelPath = path.join(modelDir, model);
    if (!fs.existsSync(modelPath)) {
      console.log(`Downloading ${model}...`);
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/${model}`
        );
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(modelPath, Buffer.from(buffer));
        console.log(`✅ Downloaded ${model}`);
      } catch (error) {
        console.error(`❌ Error downloading ${model}:`, error);
      }
    }
  }
}

// Analyze mood from image
async function analyzeMood(imagePath) {
  try {
    const img = await Canvas.loadImage(imagePath);
    const canvas = new Canvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const detections = await faceapi
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length === 0) {
      throw new Error('No face detected in the image');
    }

    const expressions = detections[0].expressions;

    // Get dominant emotion
    let maxEmotion = 'neutral';
    let maxValue = 0;

    Object.entries(expressions).forEach(([emotion, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    });

    // Map to user-friendly mood names
    const moodMapping = {
      angry: 'Angry',
      disgusted: 'Disgusted',
      fearful: 'Anxious',
      happy: 'Happy',
      neutral: 'Calm',
      sad: 'Sad',
      surprised: 'Surprised',
    };

    return {
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
      },
    };
  } catch (error) {
    console.error('Error analyzing mood:', error);
    throw error;
  }
}

// Routes
app.post('/analyze-mood', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const result = await analyzeMood(req.file.path);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (error) {
    console.error('Error in /analyze-mood:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze mood' });
  }
});

app.post('/analyze-mood-base64', async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Convert base64 to buffer and save temporarily
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const tempPath = path.join(__dirname, 'temp', `${Date.now()}.jpg`);

    // Ensure temp directory exists
    const tempDir = path.dirname(tempPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempPath, buffer);

    const result = await analyzeMood(tempPath);

    // Clean up temp file
    fs.unlinkSync(tempPath);

    res.json(result);
  } catch (error) {
    console.error('Error in /analyze-mood-base64:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze mood' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Face API service is running' });
});

// Start server
async function startServer() {
  try {
    await downloadModels();
    await loadModels();

    app.listen(PORT, () => {
      console.log(`🚀 Face API service running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
}

startServer();
