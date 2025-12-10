# 🌊 Particle Wave Visualizer

> Stunning 3D audio visualizer with real-time particle animations

**Created by [alonehuntert](https://alonehuntert.com)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![Particle Wave Visualizer](https://img.shields.io/badge/WebGL-Enabled-green) ![Three.js](https://img.shields.io/badge/Three.js-r150-blue) ![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-Enabled-orange)

Experience music in a whole new dimension with this mesmerizing 3D particle visualizer. Built with Three.js and Web Audio API, it transforms audio into stunning visual performances with multiple visualization modes, color schemes, and customization options.

## ✨ Features

### 🎵 Multiple Input Methods
- **Microphone** - Real-time audio capture from your device
- **File Upload** - Support for MP3, WAV, OGG audio files
- **Drag & Drop** - Simply drag audio files onto the canvas
- **Demo Tracks** - Pre-loaded tracks for instant testing

### 🌊 6 Visualization Modes
1. **Wave Ocean** - Fluid particle waves that ripple with the music
2. **Particle Sphere** - Pulsing 3D sphere that reacts to bass
3. **DNA Helix** - Double helix spiral with rotation
4. **Galaxy Spiral** - Rotating spiral galaxy formation
5. **Vortex Tunnel** - Infinite tunnel effect with depth
6. **Frequency Bars** - 3D circular spectrum analyzer

### 🎨 Customization Options
- **7 Color Schemes**: Neon, Rainbow, Fire, Ocean, Galaxy, Monochrome, Custom
- **Adjustable Particle Count**: 1,000 - 100,000 particles
- **Audio Sensitivity Controls**: Fine-tune bass, mid, and treble response
- **Visual Effects**: Bloom, motion blur, vignette
- **Quality Presets**: Low, Medium, High, Ultra

### 🎮 Interactive Controls
- **Mouse/Touch Controls**: Orbit camera, zoom in/out
- **Auto-Rotate Mode**: Automatic camera rotation
- **Fullscreen Support**: Immersive viewing experience
- **Keyboard Shortcuts**: Quick access to all features

### 📹 Export Features
- **Screenshot Capture**: Save stunning frames as PNG
- **Video Recording**: Record WebM clips (10-30 seconds)
- **Shareable Configurations**: Generate URLs with your settings

## 🚀 Getting Started

### Quick Start
1. Clone this repository:
```bash
git clone https://github.com/alonehuntert/particle-wave-visualizer.git
cd particle-wave-visualizer
```

2. Serve with a local web server (required for audio features):
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

### Online Demo
🌐 **[Try it now →](https://alonehuntert.github.io/particle-wave-visualizer)**

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause audio |
| `M` | Toggle microphone input |
| `1-6` | Switch between visualization modes |
| `C` | Cycle through color schemes |
| `R` | Toggle auto-rotate camera |
| `F` | Enter/exit fullscreen |
| `S` | Take screenshot |
| `+/-` | Adjust particle count |
| `←/→` | Seek audio backward/forward |
| `↑/↓` | Increase/decrease volume |
| `?` | Show keyboard shortcuts help |

## 🛠️ Technologies

- **[Three.js](https://threejs.org/)** (r150+) - 3D graphics and WebGL rendering
- **Web Audio API** - Real-time audio analysis and processing
- **WebGL** - Hardware-accelerated graphics
- **Vanilla JavaScript** - No framework dependencies
- **Modern CSS** - Glassmorphism UI design with smooth animations

## 🎯 How It Works

1. **Audio Input** → Web Audio API captures sound from microphone or file
2. **FFT Analysis** → Fast Fourier Transform extracts frequency data
3. **Data Mapping** → Frequency data controls particle positions and colors
4. **3D Rendering** → Three.js renders particles in real-time using WebGL
5. **Camera System** → Responds to user input and audio beats
6. **Post-Processing** → Optional bloom and effects enhance visuals

## 📁 Project Structure

```
particle-wave-visualizer/
├── index.html              # Main HTML entry point
├── css/
│   ├── styles.css         # Core styles and layout
│   ├── controls.css       # UI control panel styles
│   └── animations.css     # Animation keyframes
├── js/
│   ├── app.js            # Main application controller
│   ├── config.js         # Configuration and settings
│   ├── utils.js          # Utility functions
│   ├── audioEngine.js    # Web Audio API handling
│   ├── visualizer.js     # Three.js scene management
│   ├── particles.js      # Particle system logic
│   ├── camera.js         # Camera controls
│   ├── effects.js        # Post-processing effects
│   ├── export.js         # Screenshot/video export
│   ├── ui.js             # UI event handlers
│   └── modes/            # Visualization modes
│       ├── waveMode.js
│       ├── sphereMode.js
│       ├── helixMode.js
│       ├── galaxyMode.js
│       ├── vortexMode.js
│       └── barsMode.js
├── assets/
│   ├── audio/            # Demo audio files
│   ├── shaders/          # Custom GLSL shaders
│   └── screenshots/      # Captured screenshots
└── README.md
```

## 🎨 Customization

### Modify Default Settings

Edit `js/config.js` to customize:
```javascript
const CONFIG = {
    particles: {
        default: 50000,  // Default particle count
        defaultSize: 2.0 // Default particle size
    },
    camera: {
        autoRotateSpeed: 0.5,
        defaultPosition: { x: 0, y: 50, z: 150 }
    },
    // ... more settings
};
```

### Add Custom Color Schemes

Add new color palettes in `js/config.js`:
```javascript
colors: {
    myCustomScheme: [
        [1.0, 0.0, 0.0],  // Red
        [0.0, 1.0, 0.0],  // Green
        [0.0, 0.0, 1.0]   // Blue
    ]
}
```

## 🌟 Performance Tips

- Start with **10,000 particles** and increase gradually
- Use **High quality** on desktop, **Medium** on laptops
- Enable **Adaptive Quality** for automatic optimization
- Disable **Motion Blur** for better FPS on lower-end devices
- Use a **WebGL2-compatible browser** for best performance

## 📋 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Full Support |
| Firefox | 75+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 80+ | ✅ Full Support |

**Requirements:**
- WebGL support
- Web Audio API support
- ES6+ JavaScript support

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**alonehuntert**
- Website: [alonehuntert.com](https://alonehuntert.com)
- GitHub: [@alonehuntert](https://github.com/alonehuntert)

## 🙏 Acknowledgments

- Built with [Three.js](https://threejs.org/)
- Inspired by music visualization pioneers
- Special thanks to the WebGL and Web Audio API communities

## 📸 Screenshots

[Add screenshots of different visualization modes here]

## 🎵 Demo Videos

[Add demo videos or GIFs here]

---

<div align="center">
  <strong>Made with 💜 and 🎵 by alonehuntert</strong>
  <br>
  <em>Experience music in a whole new dimension</em>
</div>
