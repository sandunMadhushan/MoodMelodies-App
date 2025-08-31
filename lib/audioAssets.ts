// Audio Assets Registry
// This file maps mood-based songs to actual bundled audio files

export interface AudioAsset {
  id: string;
  title: string;
  artist: string;
  asset: any; // Asset from require()
  duration: number;
  image: string;
}

// Your actual audio files with shortened names
export const audioAssets = {
  happy: [
    {
      id: 'happy_1',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      asset: require('../assets/audio/happy/shape-of-you.mp3'),
      duration: 233,
      image:
        'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'happy_2',
      title: 'Beauty And A Beat',
      artist: 'Justin Bieber ft. Nicki Minaj',
      asset: require('../assets/audio/happy/beauty-and-a-beat.mp3'),
      duration: 228,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'happy_3',
      title: "Can't Stop The Feeling!",
      artist: 'Justin Timberlake',
      asset: require('../assets/audio/happy/cant-stop-the-feeling.mp3'),
      duration: 236,
      image:
        'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
  sad: [
    {
      id: 'sad_1',
      title: 'Dear Insecurity',
      artist: 'gnash ft. ben abraham',
      asset: require('../assets/audio/sad/dear-insecurity.mp3'),
      duration: 240,
      image:
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
  calm: [
    {
      id: 'calm_1',
      title: 'Beautiful Things',
      artist: 'Benson Boone',
      asset: require('../assets/audio/calm/beautiful-things.mp3'),
      duration: 180,
      image:
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'calm_2',
      title: 'Glimpse of Us',
      artist: 'Joji',
      asset: require('../assets/audio/calm/glimpse-of-us.mp3'),
      duration: 210,
      image:
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'calm_3',
      title: 'Lose Control',
      artist: 'Teddy Swims',
      asset: require('../assets/audio/calm/lose-control.mp3'),
      duration: 200,
      image:
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
  angry: [
    {
      id: 'angry_1',
      title: 'Seventy Times 7',
      artist: 'Brand New',
      asset: require('../assets/audio/angry/seventy-times-7.mp3'),
      duration: 240,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'angry_2',
      title: 'Seven Nation Army',
      artist: 'The White Stripes',
      asset: require('../assets/audio/angry/seven-nation-army.mp3'),
      duration: 231,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'angry_3',
      title: 'Heathens',
      artist: 'Twenty One Pilots',
      asset: require('../assets/audio/angry/heathens.mp3'),
      duration: 195,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
  anxious: [
    {
      id: 'anxious_1',
      title: 'Anxiety',
      artist: 'Anna Clendening',
      asset: require('../assets/audio/anxious/anxiety-anna.mp3'),
      duration: 220,
      image:
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'anxious_2',
      title: 'Dear Insecurity',
      artist: 'gnash ft. ben abraham',
      asset: require('../assets/audio/anxious/dear-insecurity-gnash.mp3'),
      duration: 240,
      image:
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'anxious_3',
      title: 'Anxiety',
      artist: 'Julia Michaels ft. Selena Gomez',
      asset: require('../assets/audio/anxious/anxiety-julia.mp3'),
      duration: 215,
      image:
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
  surprised: [
    {
      id: 'surprised_1',
      title: 'Three Way Mashup',
      artist: 'Taylor Swift',
      asset: require('../assets/audio/surprised/taylor-mashup.mp3'),
      duration: 300,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'surprised_2',
      title: 'Never Grow Up / The Best Day',
      artist: 'Taylor Swift',
      asset: require('../assets/audio/surprised/never-grow-up.mp3'),
      duration: 250,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
  disgusted: [
    {
      id: 'disgusted_1',
      title: 'brutal',
      artist: 'Olivia Rodrigo',
      asset: require('../assets/audio/disgusted/brutal.mp3'),
      duration: 143,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'disgusted_2',
      title: 'good 4 u',
      artist: 'Olivia Rodrigo',
      asset: require('../assets/audio/disgusted/good-4-u.mp3'),
      duration: 178,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'disgusted_3',
      title: 'Misery Business',
      artist: 'Paramore',
      asset: require('../assets/audio/disgusted/misery-business.mp3'),
      duration: 211,
      image:
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
};

// Fallback demo files (for when your actual files aren't available)
export const demoAudioAssets = {
  demo1: {
    uri: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
  },
  demo2: {
    uri: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
  },
};
