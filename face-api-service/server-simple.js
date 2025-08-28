const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

// Realistic mock analysis that simulates face-api.js results
function generateRealisticMoodAnalysis() {
  // Different emotion scenarios with realistic distributions
  const scenarios = [
    // Happy scenario
    {
      dominant: 'happy',
      emotions: {
        happy: 0.72,
        neutral: 0.18,
        surprised: 0.06,
        sad: 0.02,
        angry: 0.01,
        fearful: 0.01,
        disgusted: 0.0,
      },
    },
    // Sad scenario
    {
      dominant: 'sad',
      emotions: {
        sad: 0.65,
        neutral: 0.2,
        angry: 0.08,
        fearful: 0.04,
        happy: 0.02,
        surprised: 0.01,
        disgusted: 0.0,
      },
    },
    // Neutral scenario
    {
      dominant: 'neutral',
      emotions: {
        neutral: 0.55,
        happy: 0.2,
        sad: 0.12,
        surprised: 0.08,
        angry: 0.03,
        fearful: 0.02,
        disgusted: 0.0,
      },
    },
    // Surprised scenario
    {
      dominant: 'surprised',
      emotions: {
        surprised: 0.58,
        happy: 0.22,
        neutral: 0.15,
        fearful: 0.03,
        angry: 0.01,
        sad: 0.01,
        disgusted: 0.0,
      },
    },
    // Angry scenario
    {
      dominant: 'angry',
      emotions: {
        angry: 0.6,
        disgusted: 0.15,
        neutral: 0.15,
        sad: 0.06,
        fearful: 0.03,
        surprised: 0.01,
        happy: 0.0,
      },
    },
    // Calm/Peaceful scenario
    {
      dominant: 'neutral',
      emotions: {
        neutral: 0.68,
        happy: 0.25,
        sad: 0.04,
        surprised: 0.02,
        angry: 0.01,
        fearful: 0.0,
        disgusted: 0.0,
      },
    },
  ];

  // Randomly select a scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  // Add slight randomness to make it more realistic
  const emotions = { ...scenario.emotions };
  Object.keys(emotions).forEach((key) => {
    // Add small random variation (±5%)
    const variation = (Math.random() - 0.5) * 0.1;
    emotions[key] = Math.max(0, Math.min(1, emotions[key] + variation));
  });

  // Normalize to ensure they sum to 1
  const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  Object.keys(emotions).forEach((key) => {
    emotions[key] = emotions[key] / total;
  });

  // Find the actual dominant emotion after randomization
  let maxEmotion = 'neutral';
  let maxValue = 0;

  Object.entries(emotions).forEach(([emotion, value]) => {
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
      angry: emotions.angry || 0,
      disgusted: emotions.disgusted || 0,
      fearful: emotions.fearful || 0,
      happy: emotions.happy || 0,
      neutral: emotions.neutral || 0,
      sad: emotions.sad || 0,
      surprised: emotions.surprised || 0,
    },
  };
}

// Simulate processing delay
async function simulateProcessing() {
  const delay = 1500 + Math.random() * 1000; // 1.5-2.5 seconds
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// Routes
app.post('/analyze-mood', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('📸 Analyzing uploaded image:', req.file.filename);

    // Simulate processing time
    await simulateProcessing();

    // Generate realistic mock analysis
    const result = generateRealisticMoodAnalysis();

    console.log('✅ Analysis complete:', result);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (error) {
    console.error('❌ Error in /analyze-mood:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze mood' });
  }
});

app.post('/analyze-mood-base64', async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    console.log('📸 Analyzing base64 image...');

    // Simulate processing time
    await simulateProcessing();

    // Generate realistic mock analysis
    const result = generateRealisticMoodAnalysis();

    console.log('✅ Analysis complete:', result);

    res.json(result);
  } catch (error) {
    console.error('❌ Error in /analyze-mood-base64:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze mood' });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Face API service is running',
    version: '1.0.0',
    mode: 'realistic-mock',
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Face API Service',
    endpoints: {
      health: 'GET /health',
      analyzeMood: 'POST /analyze-mood (multipart/form-data)',
      analyzeMoodBase64: 'POST /analyze-mood-base64 (JSON)',
    },
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Face API service starting...');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🏥 Health check (local): http://localhost:${PORT}/health`);
  console.log(`🏥 Health check (network): http://172.19.144.1:${PORT}/health`);
  console.log(`🎯 Mode: Realistic Mock Analysis`);
  console.log('✅ Ready to receive requests from all network interfaces!');
  console.log('');
  console.log('📋 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/health (local)`);
  console.log(`   GET  http://172.19.144.1:${PORT}/health (network)`);
  console.log(`   POST http://172.19.144.1:${PORT}/analyze-mood`);
  console.log(`   POST http://172.19.144.1:${PORT}/analyze-mood-base64`);
});
