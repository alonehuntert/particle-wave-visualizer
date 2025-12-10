/* ================================
   Camera Controls
   ================================ */

class CameraController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        
        // Settings
        this.autoRotate = false;
        this.autoRotateSpeed = CONFIG.camera.autoRotateSpeed;
        this.orbitSpeed = CONFIG.camera.orbitSpeed;
        this.zoomSpeed = CONFIG.camera.zoomSpeed;
        this.minDistance = CONFIG.camera.minDistance;
        this.maxDistance = CONFIG.camera.maxDistance;
        
        // State
        this.isMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.theta = 0;
        this.phi = Math.PI / 4;
        this.radius = CONFIG.camera.defaultPosition.z;
        this.targetRadius = this.radius;
        
        // Touch support
        this.lastTouchDistance = 0;
        
        // Camera shake
        this.shakeIntensity = 0;
        this.shakeDecay = 0.9;
        
        this.initEvents();
        this.updatePosition();
    }
    
    /**
     * Initialize event listeners
     */
    initEvents() {
        // Mouse events
        this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.domElement.addEventListener('wheel', this.onWheel.bind(this));
        
        // Touch events
        this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        // Prevent context menu
        this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    /**
     * Mouse down handler
     */
    onMouseDown(event) {
        this.isMouseDown = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }
    
    /**
     * Mouse move handler
     */
    onMouseMove(event) {
        if (!this.isMouseDown) return;
        
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;
        
        this.theta += deltaX * 0.005 * this.orbitSpeed;
        this.phi += deltaY * 0.005 * this.orbitSpeed;
        
        // Clamp phi to avoid flipping
        this.phi = Utils.clamp(this.phi, 0.1, Math.PI - 0.1);
        
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }
    
    /**
     * Mouse up handler
     */
    onMouseUp(event) {
        this.isMouseDown = false;
    }
    
    /**
     * Mouse wheel handler
     */
    onWheel(event) {
        event.preventDefault();
        
        const delta = event.deltaY * 0.1 * this.zoomSpeed;
        this.targetRadius += delta;
        this.targetRadius = Utils.clamp(this.targetRadius, this.minDistance, this.maxDistance);
    }
    
    /**
     * Touch start handler
     */
    onTouchStart(event) {
        if (event.touches.length === 1) {
            // Single touch - orbit
            this.lastMouseX = event.touches[0].clientX;
            this.lastMouseY = event.touches[0].clientY;
            this.isMouseDown = true;
        } else if (event.touches.length === 2) {
            // Two finger - pinch zoom
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            this.lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
        }
    }
    
    /**
     * Touch move handler
     */
    onTouchMove(event) {
        event.preventDefault();
        
        if (event.touches.length === 1 && this.isMouseDown) {
            // Single touch - orbit
            const deltaX = event.touches[0].clientX - this.lastMouseX;
            const deltaY = event.touches[0].clientY - this.lastMouseY;
            
            this.theta += deltaX * 0.005 * this.orbitSpeed;
            this.phi += deltaY * 0.005 * this.orbitSpeed;
            this.phi = Utils.clamp(this.phi, 0.1, Math.PI - 0.1);
            
            this.lastMouseX = event.touches[0].clientX;
            this.lastMouseY = event.touches[0].clientY;
        } else if (event.touches.length === 2) {
            // Two finger - pinch zoom
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (this.lastTouchDistance > 0) {
                const delta = (this.lastTouchDistance - distance) * 0.5;
                this.targetRadius += delta;
                this.targetRadius = Utils.clamp(this.targetRadius, this.minDistance, this.maxDistance);
            }
            
            this.lastTouchDistance = distance;
        }
    }
    
    /**
     * Touch end handler
     */
    onTouchEnd(event) {
        this.isMouseDown = false;
        this.lastTouchDistance = 0;
    }
    
    /**
     * Update camera position
     */
    updatePosition() {
        // Smooth zoom
        this.radius = Utils.lerp(this.radius, this.targetRadius, 0.1);
        
        // Auto-rotate
        if (this.autoRotate) {
            this.theta += 0.001 * this.autoRotateSpeed;
        }
        
        // Calculate position
        let x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
        let y = this.radius * Math.cos(this.phi);
        let z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
        
        // Apply camera shake
        if (this.shakeIntensity > 0.01) {
            x += (Math.random() - 0.5) * this.shakeIntensity;
            y += (Math.random() - 0.5) * this.shakeIntensity;
            z += (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeIntensity *= this.shakeDecay;
        }
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }
    
    /**
     * Trigger camera shake
     */
    shake(intensity = 5) {
        this.shakeIntensity = intensity;
    }
    
    /**
     * Set camera preset
     */
    setPreset(preset) {
        switch (preset) {
            case 'front':
                this.theta = 0;
                this.phi = Math.PI / 2;
                break;
            case 'top':
                this.theta = 0;
                this.phi = 0.1;
                break;
            case 'side':
                this.theta = Math.PI / 2;
                this.phi = Math.PI / 2;
                break;
            case 'isometric':
                this.theta = Math.PI / 4;
                this.phi = Math.PI / 4;
                break;
        }
    }
    
    /**
     * Toggle auto-rotate
     */
    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        return this.autoRotate;
    }
    
    /**
     * Reset camera
     */
    reset() {
        this.theta = 0;
        this.phi = Math.PI / 4;
        this.targetRadius = CONFIG.camera.defaultPosition.z;
    }
    
    /**
     * Update (call in animation loop)
     */
    update() {
        this.updatePosition();
    }
}
