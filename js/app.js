/* ================================
   Main Application
   ================================ */

class App {
    constructor() {
        this.visualizer = null;
        this.audioEngine = null;
        this.cameraController = null;
        this.effectsManager = null;
        this.exportManager = null;
        this.uiController = null;
        
        this.isRunning = false;
        this.frameCount = 0;
        this.fps = 60;
        this.lastFrameTime = performance.now();
        this.fpsUpdateInterval = 1000;
        this.lastFpsUpdate = 0;
        
        this.quality = 'high';
        this.cameraShakeEnabled = true;
        
        this.init();
    }
    
    /**
     * Initialize application
     */
    async init() {
        try {
            console.log('Initializing Particle Wave Visualizer...');
            
            // Initialize visualizer
            const container = document.getElementById('canvas-container');
            this.visualizer = new Visualizer(container);
            
            // Initialize audio engine
            this.audioEngine = new AudioEngine();
            this.audioEngine.init();
            
            // Initialize camera controller
            this.cameraController = new CameraController(
                this.visualizer.camera,
                this.visualizer.getCanvas()
            );
            
            // Initialize effects manager
            this.effectsManager = new EffectsManager(
                this.visualizer.scene,
                this.visualizer.camera,
                this.visualizer.renderer
            );
            this.effectsManager.init();
            
            // Initialize export manager
            this.exportManager = new ExportManager(
                this.visualizer.renderer,
                this.visualizer.getCanvas()
            );
            
            // Initialize UI controller
            this.uiController = new UIController(this);
            
            // Load config from URL if available
            const urlConfig = this.exportManager.loadConfigFromURL();
            if (urlConfig) {
                this.applyConfig(urlConfig);
            }
            
            // Hide loading screen
            setTimeout(() => {
                this.uiController.hideLoading();
            }, 1000);
            
            // Start animation loop
            this.start();
            
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }
    
    /**
     * Start animation loop
     */
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    /**
     * Stop animation loop
     */
    stop() {
        this.isRunning = false;
    }
    
    /**
     * Main animation loop
     */
    animate() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(() => this.animate());
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Update FPS counter
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
            this.uiController.updateFPS(this.fps);
        }
        
        // Get audio data
        const audioData = this.audioEngine.getAudioData();
        
        // Check for beat and shake camera
        if (this.cameraShakeEnabled && Utils.detectBeat(audioData.bass)) {
            this.cameraController.shake(5);
        }
        
        // Update visualizer
        this.visualizer.update(audioData);
        
        // Update camera
        this.cameraController.update();
        
        // Update effects
        this.effectsManager.update();
        
        // Update time display
        if (this.audioEngine.audioElement) {
            const currentTime = this.audioEngine.getCurrentTime();
            const duration = this.audioEngine.getDuration();
            this.uiController.updateTimeDisplay(currentTime, duration);
        }
        
        // Render scene
        this.effectsManager.render();
    }
    
    /**
     * Load audio file
     */
    async loadAudioFile(file) {
        try {
            await this.audioEngine.loadAudioFile(file);
            this.audioEngine.play();
            this.uiController.updatePlayPauseButton(true);
            Utils.showNotification(`Playing: ${file.name}`);
        } catch (error) {
            console.error('Failed to load audio file:', error);
            Utils.showNotification('Failed to load audio file');
        }
    }
    
    /**
     * Set visualization mode
     */
    setMode(modeName) {
        this.visualizer.setMode(modeName);
    }
    
    /**
     * Set color scheme
     */
    setColorScheme(schemeName) {
        this.visualizer.setColorScheme(schemeName);
    }
    
    /**
     * Update particle count
     */
    updateParticleCount(count) {
        this.visualizer.updateParticleCount(count);
    }
    
    /**
     * Set quality preset
     */
    setQuality(quality) {
        this.quality = quality;
        const preset = QUALITY_PRESETS[quality];
        
        if (preset) {
            // Update particle count
            this.updateParticleCount(preset.particleCount);
            this.uiController.elements.particleCount.value = preset.particleCount;
            this.uiController.elements.particleCountValue.textContent = 
                Utils.formatNumber(preset.particleCount);
            
            // Update effects
            this.effectsManager.setBloom(preset.enableBloom);
            this.effectsManager.setMotionBlur(preset.enableMotionBlur);
            
            // Update FFT size
            if (this.audioEngine.analyser) {
                this.audioEngine.analyser.fftSize = preset.fftSize;
            }
            
            Utils.showNotification(`Quality set to: ${quality}`);
        }
    }
    
    /**
     * Apply configuration
     */
    applyConfig(config) {
        if (config.mode) {
            this.uiController.elements.modeSelect.value = config.mode;
            this.setMode(config.mode);
        }
        
        if (config.colorScheme) {
            this.uiController.elements.colorSelect.value = config.colorScheme;
            this.setColorScheme(config.colorScheme);
        }
        
        if (config.particleCount) {
            this.uiController.elements.particleCount.value = config.particleCount;
            this.updateParticleCount(config.particleCount);
        }
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new App();
    });
} else {
    window.app = new App();
}
