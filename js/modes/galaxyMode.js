/* ================================
   Galaxy Spiral Mode
   ================================ */

class GalaxyMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.config = CONFIG.modes.galaxy;
        this.time = 0;
    }
    
    /**
     * Initialize galaxy spiral
     */
    init() {
        const particleCount = this.particleSystem.particleCount;
        const arms = this.config.arms;
        const radius = this.config.radius;
        const armSpread = this.config.armSpread;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Determine which arm
            const arm = i % arms;
            const armAngle = (arm / arms) * Math.PI * 2;
            
            // Distance from center (0 to 1)
            const distance = Math.pow(i / particleCount, 0.5);
            const r = distance * radius;
            
            // Spiral angle
            const angle = armAngle + distance * Math.PI * 4 * armSpread;
            
            // Add some randomness
            const randomAngle = (Math.random() - 0.5) * 0.5;
            const randomRadius = (Math.random() - 0.5) * 10;
            
            const x = Math.cos(angle + randomAngle) * (r + randomRadius);
            const z = Math.sin(angle + randomAngle) * (r + randomRadius);
            const y = (Math.random() - 0.5) * 20 * (1 - distance);
            
            this.particleSystem.positions[i3] = x;
            this.particleSystem.positions[i3 + 1] = y;
            this.particleSystem.positions[i3 + 2] = z;
            
            this.particleSystem.originalPositions[i3] = distance;
            this.particleSystem.originalPositions[i3 + 1] = armAngle;
            this.particleSystem.originalPositions[i3 + 2] = y;
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors();
    }
    
    /**
     * Update galaxy animation
     */
    update(audioData) {
        this.time += this.config.rotationSpeed;
        
        const particleCount = this.particleSystem.particleCount;
        const radius = this.config.radius;
        const armSpread = this.config.armSpread;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            const distance = this.particleSystem.originalPositions[i3];
            const armAngle = this.particleSystem.originalPositions[i3 + 1];
            const baseY = this.particleSystem.originalPositions[i3 + 2];
            
            const r = distance * radius;
            
            // Rotation speed varies with distance
            const rotationSpeed = this.time * (1 - distance * 0.5);
            const angle = armAngle + distance * Math.PI * 4 * armSpread + rotationSpeed;
            
            // Add audio reactivity
            const bassBoost = (audioData.bass / 255) * 10;
            const midWave = Math.sin(angle + this.time * 2) * (audioData.mid / 255) * 5;
            
            this.particleSystem.positions[i3] = Math.cos(angle) * (r + bassBoost);
            this.particleSystem.positions[i3 + 1] = baseY + midWave;
            this.particleSystem.positions[i3 + 2] = Math.sin(angle) * (r + bassBoost);
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors(audioData);
    }
}
