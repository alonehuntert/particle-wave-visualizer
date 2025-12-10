/* ================================
   Configuration
   ================================ */

const CONFIG = {
    // Performance Settings
    performance: {
        defaultQuality: 'high',
        autoAdaptive: true,
        targetFPS: 60,
        fpsCheckInterval: 1000,
        lowFPSThreshold: 30
    },
    
    // Particle Settings
    particles: {
        default: 50000,
        min: 1000,
        max: 100000,
        step: 1000,
        defaultSize: 2.0,
        defaultOpacity: 0.8
    },
    
    // Audio Settings
    audio: {
        fftSize: 2048,
        smoothingTimeConstant: 0.8,
        defaultVolume: 0.8,
        bassRange: [0, 0.1],
        midRange: [0.1, 0.5],
        trebleRange: [0.5, 1.0]
    },
    
    // Color Schemes
    colors: {
        neon: [
            [1.0, 0.0, 0.43],  // Pink
            [0.51, 0.22, 0.93], // Purple
            [0.23, 0.53, 1.0],  // Blue
            [0.0, 0.96, 1.0]    // Cyan
        ],
        rainbow: [
            [1.0, 0.0, 0.0],    // Red
            [1.0, 0.5, 0.0],    // Orange
            [1.0, 1.0, 0.0],    // Yellow
            [0.0, 1.0, 0.0],    // Green
            [0.0, 0.0, 1.0],    // Blue
            [0.5, 0.0, 1.0]     // Purple
        ],
        fire: [
            [1.0, 0.0, 0.0],    // Red
            [1.0, 0.27, 0.0],   // Red-Orange
            [1.0, 0.55, 0.0],   // Orange
            [1.0, 0.84, 0.0]    // Gold
        ],
        ocean: [
            [0.0, 0.07, 0.1],   // Deep Blue
            [0.0, 0.37, 0.45],  // Dark Cyan
            [0.04, 0.58, 0.59], // Cyan
            [0.58, 0.82, 0.74]  // Light Cyan
        ],
        galaxy: [
            [0.2, 0.0, 0.4],    // Deep Purple
            [0.4, 0.0, 0.6],    // Purple
            [0.6, 0.2, 0.8],    // Light Purple
            [0.8, 0.6, 1.0]     // Pale Purple
        ],
        monochrome: [
            [0.2, 0.2, 0.2],    // Dark Gray
            [0.5, 0.5, 0.5],    // Gray
            [0.8, 0.8, 0.8],    // Light Gray
            [1.0, 1.0, 1.0]     // White
        ]
    },
    
    // Camera Settings
    camera: {
        fov: 75,
        near: 0.1,
        far: 2000,
        defaultPosition: { x: 0, y: 50, z: 150 },
        autoRotateSpeed: 0.5,
        orbitSpeed: 1.0,
        zoomSpeed: 1.0,
        minDistance: 50,
        maxDistance: 500
    },
    
    // Visualization Modes
    modes: {
        wave: {
            name: 'Wave Ocean',
            icon: '🌊',
            gridSize: 100,
            spacing: 2,
            waveSpeed: 0.05,
            waveAmplitude: 20
        },
        sphere: {
            name: 'Particle Sphere',
            icon: '🔮',
            radius: 50,
            pulseSpeed: 0.1,
            pulseAmount: 20,
            rotationSpeed: 0.01
        },
        helix: {
            name: 'DNA Helix',
            icon: '🧬',
            radius: 30,
            height: 100,
            coils: 5,
            rotationSpeed: 0.02,
            thickness: 10
        },
        galaxy: {
            name: 'Galaxy Spiral',
            icon: '🌌',
            arms: 3,
            armSpread: 0.5,
            radius: 80,
            rotationSpeed: 0.01
        },
        vortex: {
            name: 'Vortex Tunnel',
            icon: '🌀',
            rings: 30,
            ringRadius: 40,
            spacing: 5,
            rotationSpeed: 0.03,
            tunnelSpeed: 0.5
        },
        bars: {
            name: 'Frequency Bars',
            icon: '📊',
            barCount: 64,
            radius: 60,
            maxHeight: 80,
            barWidth: 2
        }
    },
    
    // Effects Settings
    effects: {
        bloom: {
            enabled: true,
            strength: 1.5,
            radius: 0.8,
            threshold: 0.1
        },
        vignette: {
            enabled: false,
            offset: 1.0,
            darkness: 1.0
        },
        motionBlur: {
            enabled: false,
            amount: 0.5
        }
    },
    
    // Export Settings
    export: {
        screenshotFormat: 'png',
        screenshotQuality: 1.0,
        videoFormat: 'webm',
        videoFrameRate: 60,
        videoDuration: 10
    },
    
    // UI Settings
    ui: {
        panelPosition: 'left',
        autoHideControls: false,
        autoHideDelay: 3000,
        showFPS: true,
        showHelp: false
    },
    
    // Demo Tracks (placeholder URLs - would need actual audio files)
    demoTracks: [
        {
            id: 1,
            name: 'Demo Track 1',
            url: 'assets/audio/demo1.mp3'
        },
        {
            id: 2,
            name: 'Demo Track 2',
            url: 'assets/audio/demo2.mp3'
        }
    ]
};

// Quality presets
const QUALITY_PRESETS = {
    low: {
        particleCount: 10000,
        particleSize: 3.0,
        fftSize: 1024,
        enableBloom: false,
        enableMotionBlur: false,
        shadowMapSize: 512
    },
    medium: {
        particleCount: 30000,
        particleSize: 2.5,
        fftSize: 2048,
        enableBloom: true,
        enableMotionBlur: false,
        shadowMapSize: 1024
    },
    high: {
        particleCount: 50000,
        particleSize: 2.0,
        fftSize: 2048,
        enableBloom: true,
        enableMotionBlur: false,
        shadowMapSize: 2048
    },
    ultra: {
        particleCount: 100000,
        particleSize: 1.5,
        fftSize: 4096,
        enableBloom: true,
        enableMotionBlur: true,
        shadowMapSize: 4096
    }
};
