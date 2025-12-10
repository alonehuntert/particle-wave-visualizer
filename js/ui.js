/* ================================
   UI Controller
   ================================ */

class UIController {
    constructor(app) {
        this.app = app;
        this.elements = {};
        this.initElements();
        this.initEventListeners();
        this.initKeyboardShortcuts();
    }
    
    /**
     * Initialize DOM element references
     */
    initElements() {
        // Main elements
        this.elements.controlsPanel = document.getElementById('controls-panel');
        this.elements.loadingScreen = document.getElementById('loading-screen');
        this.elements.fpsCounter = document.getElementById('fps-counter');
        
        // Audio input
        this.elements.micBtn = document.getElementById('mic-btn');
        this.elements.fileInput = document.getElementById('file-input');
        this.elements.demoTracks = document.querySelectorAll('.demo-track');
        
        // Audio controls
        this.elements.playPauseBtn = document.getElementById('play-pause-btn');
        this.elements.playIcon = document.getElementById('play-icon');
        this.elements.seekBar = document.getElementById('seek-bar');
        this.elements.currentTime = document.getElementById('current-time');
        this.elements.duration = document.getElementById('duration');
        this.elements.volumeSlider = document.getElementById('volume-slider');
        this.elements.volumeValue = document.getElementById('volume-value');
        
        // Visualization controls
        this.elements.modeSelect = document.getElementById('mode-select');
        this.elements.colorSelect = document.getElementById('color-select');
        this.elements.particleCount = document.getElementById('particle-count');
        this.elements.particleCountValue = document.getElementById('particle-count-value');
        this.elements.sensitivity = document.getElementById('sensitivity');
        this.elements.sensitivityValue = document.getElementById('sensitivity-value');
        
        // Action buttons
        this.elements.settingsBtn = document.getElementById('settings-btn');
        this.elements.screenshotBtn = document.getElementById('screenshot-btn');
        this.elements.fullscreenBtn = document.getElementById('fullscreen-btn');
        
        // Modals
        this.elements.settingsModal = document.getElementById('settings-modal');
        this.elements.helpModal = document.getElementById('help-modal');
        this.elements.closeSettings = document.getElementById('close-settings');
        this.elements.closeHelp = document.getElementById('close-help');
        
        // Settings
        this.elements.qualitySelect = document.getElementById('quality-select');
        this.elements.autoQuality = document.getElementById('auto-quality');
        this.elements.showFps = document.getElementById('show-fps');
        this.elements.bloomEffect = document.getElementById('bloom-effect');
        this.elements.motionBlur = document.getElementById('motion-blur');
        this.elements.vignette = document.getElementById('vignette');
        this.elements.autoRotate = document.getElementById('auto-rotate');
        this.elements.cameraShake = document.getElementById('camera-shake');
        
        // Drop zone
        this.elements.dropZone = document.getElementById('drop-zone');
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Audio input
        this.elements.micBtn.addEventListener('click', () => this.handleMicrophoneToggle());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.elements.demoTracks.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDemoTrack(e));
        });
        
        // Audio controls
        this.elements.playPauseBtn.addEventListener('click', () => this.handlePlayPause());
        this.elements.seekBar.addEventListener('input', (e) => this.handleSeek(e));
        this.elements.volumeSlider.addEventListener('input', (e) => this.handleVolumeChange(e));
        
        // Visualization controls
        this.elements.modeSelect.addEventListener('change', (e) => this.handleModeChange(e));
        this.elements.colorSelect.addEventListener('change', (e) => this.handleColorChange(e));
        this.elements.particleCount.addEventListener('input', (e) => this.handleParticleCountChange(e));
        this.elements.sensitivity.addEventListener('input', (e) => this.handleSensitivityChange(e));
        
        // Action buttons
        this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
        this.elements.screenshotBtn.addEventListener('click', () => this.handleScreenshot());
        this.elements.fullscreenBtn.addEventListener('click', () => this.handleFullscreen());
        
        // Modal close
        this.elements.closeSettings.addEventListener('click', () => this.hideSettings());
        this.elements.closeHelp.addEventListener('click', () => this.hideHelp());
        
        // Settings changes
        this.elements.qualitySelect.addEventListener('change', (e) => this.handleQualityChange(e));
        this.elements.showFps.addEventListener('change', (e) => this.handleShowFpsToggle(e));
        this.elements.bloomEffect.addEventListener('change', (e) => this.handleBloomToggle(e));
        this.elements.autoRotate.addEventListener('change', (e) => this.handleAutoRotateToggle(e));
        
        // Drag and drop
        this.initDragDrop();
    }
    
    /**
     * Initialize drag and drop
     */
    initDragDrop() {
        const body = document.body;
        
        body.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.remove('hidden');
        });
        
        body.addEventListener('dragleave', (e) => {
            if (e.target === body) {
                this.elements.dropZone.classList.add('hidden');
            }
        });
        
        body.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.add('hidden');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('audio/')) {
                    this.app.loadAudioFile(file);
                }
            }
        });
    }
    
    /**
     * Initialize keyboard shortcuts
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            
            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    this.handlePlayPause();
                    break;
                case 'm':
                    this.handleMicrophoneToggle();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                    this.handleModeShortcut(parseInt(e.key));
                    break;
                case 'c':
                    this.cycleColorScheme();
                    break;
                case 'r':
                    this.handleAutoRotateToggle({ target: { checked: !this.elements.autoRotate.checked } });
                    this.elements.autoRotate.checked = !this.elements.autoRotate.checked;
                    break;
                case 'f':
                    this.handleFullscreen();
                    break;
                case 's':
                    this.handleScreenshot();
                    break;
                case '?':
                    this.showHelp();
                    break;
                case 'arrowleft':
                    this.seekRelative(-5);
                    break;
                case 'arrowright':
                    this.seekRelative(5);
                    break;
                case 'arrowup':
                    e.preventDefault();
                    this.adjustVolume(5);
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    this.adjustVolume(-5);
                    break;
                case '+':
                case '=':
                    this.adjustParticles(5000);
                    break;
                case '-':
                case '_':
                    this.adjustParticles(-5000);
                    break;
            }
        });
    }
    
    /**
     * Event handlers
     */
    async handleMicrophoneToggle() {
        try {
            if (this.app.audioEngine.isMicActive) {
                this.app.audioEngine.stopMicrophone();
                this.elements.micBtn.classList.remove('active');
            } else {
                await this.app.audioEngine.startMicrophone();
                this.elements.micBtn.classList.add('active');
                this.updatePlayPauseButton(true);
            }
        } catch (error) {
            Utils.showNotification('Microphone access denied');
        }
    }
    
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            await this.app.loadAudioFile(file);
        }
    }
    
    async handleDemoTrack(event) {
        const trackId = event.target.dataset.track;
        const track = CONFIG.demoTracks.find(t => t.id == trackId);
        if (track) {
            try {
                await this.app.audioEngine.loadAudioURL(track.url);
                this.app.audioEngine.play();
                this.updatePlayPauseButton(true);
            } catch (error) {
                Utils.showNotification('Demo track not available');
            }
        }
    }
    
    handlePlayPause() {
        this.app.audioEngine.togglePlayPause();
        this.updatePlayPauseButton(this.app.audioEngine.isPlaying);
    }
    
    handleSeek(event) {
        const seekTime = (event.target.value / 100) * this.app.audioEngine.getDuration();
        this.app.audioEngine.seek(seekTime);
    }
    
    handleVolumeChange(event) {
        const volume = event.target.value / 100;
        this.app.audioEngine.setVolume(volume);
        this.elements.volumeValue.textContent = event.target.value + '%';
    }
    
    handleModeChange(event) {
        this.app.setMode(event.target.value);
    }
    
    handleColorChange(event) {
        this.app.setColorScheme(event.target.value);
    }
    
    handleParticleCountChange(event) {
        const count = parseInt(event.target.value);
        this.elements.particleCountValue.textContent = Utils.formatNumber(count);
        
        // Debounce actual update
        clearTimeout(this.particleCountTimeout);
        this.particleCountTimeout = setTimeout(() => {
            this.app.updateParticleCount(count);
        }, 500);
    }
    
    handleSensitivityChange(event) {
        const value = event.target.value;
        this.elements.sensitivityValue.textContent = value + '%';
        
        const sensitivity = value / 100;
        this.app.audioEngine.setSensitivity(sensitivity, sensitivity, sensitivity);
    }
    
    handleScreenshot() {
        this.app.exportManager.takeScreenshot();
    }
    
    handleFullscreen() {
        if (Utils.isFullscreen()) {
            Utils.exitFullscreen();
        } else {
            Utils.requestFullscreen(document.body);
        }
    }
    
    handleQualityChange(event) {
        this.app.setQuality(event.target.value);
    }
    
    handleShowFpsToggle(event) {
        this.elements.fpsCounter.style.display = event.target.checked ? 'block' : 'none';
    }
    
    handleBloomToggle(event) {
        this.app.effectsManager.setBloom(event.target.checked);
    }
    
    handleAutoRotateToggle(event) {
        this.app.cameraController.autoRotate = event.target.checked;
    }
    
    handleModeShortcut(num) {
        const modes = ['wave', 'sphere', 'helix', 'galaxy', 'vortex', 'bars'];
        if (num >= 1 && num <= modes.length) {
            this.elements.modeSelect.value = modes[num - 1];
            this.handleModeChange({ target: this.elements.modeSelect });
        }
    }
    
    cycleColorScheme() {
        const options = Array.from(this.elements.colorSelect.options);
        const currentIndex = this.elements.colorSelect.selectedIndex;
        const nextIndex = (currentIndex + 1) % options.length;
        this.elements.colorSelect.selectedIndex = nextIndex;
        this.handleColorChange({ target: this.elements.colorSelect });
    }
    
    seekRelative(seconds) {
        const currentTime = this.app.audioEngine.getCurrentTime();
        this.app.audioEngine.seek(currentTime + seconds);
    }
    
    adjustVolume(delta) {
        const currentValue = parseInt(this.elements.volumeSlider.value);
        const newValue = Utils.clamp(currentValue + delta, 0, 100);
        this.elements.volumeSlider.value = newValue;
        this.handleVolumeChange({ target: this.elements.volumeSlider });
    }
    
    adjustParticles(delta) {
        const currentValue = parseInt(this.elements.particleCount.value);
        const newValue = Utils.clamp(
            currentValue + delta,
            CONFIG.particles.min,
            CONFIG.particles.max
        );
        this.elements.particleCount.value = newValue;
        this.handleParticleCountChange({ target: this.elements.particleCount });
    }
    
    /**
     * UI updates
     */
    updatePlayPauseButton(isPlaying) {
        this.elements.playIcon.textContent = isPlaying ? '⏸️' : '▶️';
    }
    
    updateTimeDisplay(currentTime, duration) {
        this.elements.currentTime.textContent = Utils.formatTime(currentTime);
        this.elements.duration.textContent = Utils.formatTime(duration);
        
        if (duration > 0) {
            this.elements.seekBar.value = (currentTime / duration) * 100;
        }
    }
    
    updateFPS(fps) {
        this.elements.fpsCounter.textContent = `FPS: ${fps}`;
    }
    
    /**
     * Modal controls
     */
    showSettings() {
        this.elements.settingsModal.classList.remove('hidden');
    }
    
    hideSettings() {
        this.elements.settingsModal.classList.add('hidden');
    }
    
    showHelp() {
        this.elements.helpModal.classList.remove('hidden');
    }
    
    hideHelp() {
        this.elements.helpModal.classList.add('hidden');
    }
    
    /**
     * Hide loading screen
     */
    hideLoading() {
        this.elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            this.elements.loadingScreen.style.display = 'none';
        }, 500);
    }
}
