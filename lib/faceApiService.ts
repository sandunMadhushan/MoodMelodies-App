export interface MoodResult {
  mood: string;
  confidence: number;
  emotions: {
    angry: number;
    disgusted: number;
    fearful: number;
    happy: number;
    neutral: number;
    sad: number;
    surprised: number;
  };
}

class FaceApiService {
  // Configuration for your face API service
  private getApiBaseUrl(): string {
    if (!__DEV__) {
      return 'https://your-face-api-service.herokuapp.com'; // Production
    }

    // Development - Try multiple endpoints for better connectivity
    // The service will automatically try these in order and use the first one that works
    return 'http://172.19.144.1:3001'; // Your computer's IP address
  }

  private readonly FALLBACK_URLS = __DEV__
    ? [
        'http://localhost:3001', // For web/simulator testing
        'http://127.0.0.1:3001', // Alternative localhost
        'http://10.0.2.2:3001', // Android emulator host
      ]
    : [];

  async analyzeMood(imageUri: string): Promise<MoodResult> {
    try {
      console.log('Analyzing mood for image:', imageUri);

      // Try real API first, fallback to mock if fails
      try {
        return await this.analyzeWithAPI(imageUri);
      } catch (apiError) {
        console.warn('API analysis failed, using mock:', apiError);
        return await this.analyzeMoodMock(imageUri);
      }
    } catch (error) {
      console.error('Error analyzing mood:', error);
      throw new Error('Failed to analyze mood from image');
    }
  }

  private async analyzeWithAPI(imageUri: string): Promise<MoodResult> {
    // Convert image to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await this.blobToBase64(blob);

    // Try primary URL first, then fallbacks
    const urlsToTry = [this.getApiBaseUrl(), ...this.FALLBACK_URLS];

    for (const baseUrl of urlsToTry) {
      try {
        console.log(`🔄 Trying API endpoint: ${baseUrl}`);

        // Call face API service with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const apiResponse = await fetch(`${baseUrl}/analyze-mood-base64`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!apiResponse.ok) {
          throw new Error(`API request failed: ${apiResponse.status}`);
        }

        const result = await apiResponse.json();
        console.log(
          `✅ Real face API analysis complete via ${baseUrl}:`,
          result
        );
        return result;
      } catch (error) {
        console.warn(`❌ Failed to connect to ${baseUrl}:`, error);
        // Continue to next URL
      }
    }

    // If all URLs fail, throw error
    throw new Error('Could not connect to Face API service');
  }

  private async analyzeMoodMock(imageUri: string): Promise<MoodResult> {
    console.log('🔄 Using mock analysis...');

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate more realistic mock emotions based on some randomness
    const mockEmotions = this.generateRealisticMockEmotions();
    const dominantMood = this.getDominantMood(mockEmotions);

    return {
      mood: dominantMood.mood,
      confidence: dominantMood.confidence,
      emotions: mockEmotions,
    };
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private generateRealisticMockEmotions() {
    // Create more realistic emotion distributions
    const scenarios = [
      // Happy scenario
      {
        happy: 0.7,
        neutral: 0.2,
        surprised: 0.05,
        sad: 0.03,
        angry: 0.01,
        fearful: 0.01,
        disgusted: 0.0,
      },
      // Sad scenario
      {
        sad: 0.6,
        neutral: 0.25,
        angry: 0.08,
        fearful: 0.04,
        happy: 0.02,
        surprised: 0.01,
        disgusted: 0.0,
      },
      // Neutral scenario
      {
        neutral: 0.5,
        happy: 0.2,
        sad: 0.15,
        surprised: 0.08,
        angry: 0.04,
        fearful: 0.02,
        disgusted: 0.01,
      },
      // Surprised scenario
      {
        surprised: 0.5,
        happy: 0.25,
        neutral: 0.15,
        fearful: 0.05,
        angry: 0.03,
        sad: 0.02,
        disgusted: 0.0,
      },
      // Angry scenario
      {
        angry: 0.55,
        disgusted: 0.2,
        neutral: 0.15,
        sad: 0.06,
        fearful: 0.03,
        surprised: 0.01,
        happy: 0.0,
      },
    ];

    // Randomly select a scenario
    const selectedScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)];

    // Add some randomness to the selected scenario
    const emotions = { ...selectedScenario };
    Object.keys(emotions).forEach((key) => {
      // Add small random variation (±10%)
      const variation = (Math.random() - 0.5) * 0.2;
      emotions[key as keyof typeof emotions] = Math.max(
        0,
        emotions[key as keyof typeof emotions] + variation
      );
    });

    // Normalize to ensure they sum to 1
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    Object.keys(emotions).forEach((key) => {
      emotions[key as keyof typeof emotions] =
        emotions[key as keyof typeof emotions] / total;
    });

    return emotions;
  }

  private getDominantMood(emotions: {
    angry: number;
    disgusted: number;
    fearful: number;
    happy: number;
    neutral: number;
    sad: number;
    surprised: number;
  }): { mood: string; confidence: number } {
    let maxEmotion = 'neutral';
    let maxValue = 0;

    Object.entries(emotions).forEach(([emotion, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    });

    // Map technical emotion names to user-friendly mood names
    const moodMapping: { [key: string]: string } = {
      angry: 'Angry',
      disgusted: 'Disgusted',
      fearful: 'Anxious',
      happy: 'Happy',
      neutral: 'Calm',
      sad: 'Sad',
      surprised: 'Surprised',
    };

    return {
      mood: moodMapping[maxEmotion] || 'Neutral',
      confidence: maxValue,
    };
  }

  // Helper method to get mood-based music recommendations
  getMoodBasedPlaylist(mood: string): string[] {
    const playlists: { [key: string]: string[] } = {
      Happy: [
        'Upbeat Pop Hits',
        'Feel Good Classics',
        'Dance Party',
        'Summer Vibes',
        'Positive Energy',
      ],
      Sad: [
        'Melancholic Melodies',
        'Emotional Ballads',
        'Rainy Day Blues',
        'Heartbreak Healing',
        'Introspective Indie',
      ],
      Angry: [
        'Rock Anthems',
        'Heavy Metal',
        'Punk Rock',
        'Aggressive Hip-Hop',
        'Power Songs',
      ],
      Calm: [
        'Ambient Chill',
        'Peaceful Piano',
        'Nature Sounds',
        'Meditation Music',
        'Lo-Fi Beats',
      ],
      Anxious: [
        'Calming Instrumentals',
        'Soothing Sounds',
        'Relaxation Music',
        'Mindfulness',
        'Gentle Acoustic',
      ],
      Surprised: [
        'Energetic Pop',
        'Uplifting Beats',
        'Feel Good Mix',
        'Motivational Music',
        'Discovery Playlist',
      ],
      Disgusted: [
        'Cleansing Beats',
        'Fresh Start',
        'Renewal Playlist',
        'Positive Vibes',
        'Mood Lifter',
      ],
    };

    return playlists[mood] || playlists['Calm'];
  }
}

export const faceApiService = new FaceApiService();
