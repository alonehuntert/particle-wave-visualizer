/* ================================
   Visualizer
   Main Three.js scene manager
   ================================ */

class Visualizer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particleSystem = null;
        this.currentMode = null;
        this.modes = {};
        
        this.init();
    }
    
    /**
     * Initialize Three.js scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0f);
        this.scene.fog = new THREE.Fog(0x0a0a0f, 100, 500);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            window.innerWidth / window.innerHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        this.camera.position.set(
            CONFIG.camera.defaultPosition.x,
            CONFIG.camera.defaultPosition.y,
            CONFIG.camera.defaultPosition.z
        );
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Create particle system
        this.particleSystem = new ParticleSystem(this.scene, CONFIG.particles.default);
        
        // Initialize modes
        this.initModes();
        
        // Set default mode
        this.setMode('wave');
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        console.log('Visualizer initialized');
    }
    
    /**
     * Initialize all visualization modes
     */
    initModes() {
        this.modes.wave = new WaveMode(this.particleSystem);
        this.modes.sphere = new SphereMode(this.particleSystem);
        this.modes.helix = new HelixMode(this.particleSystem);
        this.modes.galaxy = new GalaxyMode(this.particleSystem);
        this.modes.vortex = new VortexMode(this.particleSystem);
        this.modes.bars = new BarsMode(this.particleSystem);
    }
    
    /**
     * Set visualization mode
     */
    setMode(modeName) {
        if (this.modes[modeName]) {
            this.currentMode = this.modes[modeName];
            this.currentMode.init();
            console.log('Mode set to:', modeName);
        }
    }
    
    /**
     * Set color scheme
     */
    setColorScheme(schemeName) {
        this.particleSystem.setColorPalette(schemeName);
    }
    
    /**
     * Update particle count
     */
    updateParticleCount(count) {
        this.particleSystem.updateParticleCount(count);
        
        // Reinitialize current mode
        if (this.currentMode) {
            this.currentMode.init();
        }
    }
    
    /**
     * Update visualization
     */
    update(audioData) {
        if (this.currentMode) {
            this.currentMode.update(audioData);
        }
    }
    
    /**
     * Render scene
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Get renderer canvas
     */
    getCanvas() {
        return this.renderer.domElement;
    }
    
    /**
     * Dispose visualizer
     */
    dispose() {
        this.particleSystem.dispose();
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}
