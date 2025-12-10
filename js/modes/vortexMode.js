/* ================================
   Vortex Tunnel Mode
   ================================ */

class VortexMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.config = CONFIG.modes.vortex;
        this.time = 0;
        this.tunnelOffset = 0;
    }
    
    /**
     * Initialize vortex tunnel
     */
    init() {
        const particleCount = this.particleSystem.particleCount;
        const rings = this.config.rings;
        const particlesPerRing = Math.floor(particleCount / rings);
        
        let index = 0;
        for (let ring = 0; ring < rings; ring++) {
            const z = ring * this.config.spacing - (rings * this.config.spacing) / 2;
            
            for (let p = 0; p < particlesPerRing; p++) {
                if (index >= particleCount) break;
                
                const i3 = index * 3;
                const angle = (p / particlesPerRing) * Math.PI * 2;
                
                const radius = this.config.ringRadius;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                this.particleSystem.positions[i3] = x;
                this.particleSystem.positions[i3 + 1] = y;
                this.particleSystem.positions[i3 + 2] = z;
                
                this.particleSystem.originalPositions[i3] = angle;
                this.particleSystem.originalPositions[i3 + 1] = ring;
                this.particleSystem.originalPositions[i3 + 2] = z;
                
                index++;
            }
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors();
    }
    
    /**
     * Update vortex animation
     */
    update(audioData) {
        this.time += this.config.rotationSpeed;
        this.tunnelOffset += this.config.tunnelSpeed * (1 + audioData.bass / 255);
        
        const particleCount = this.particleSystem.particleCount;
        const rings = this.config.rings;
        const spacing = this.config.spacing;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            const baseAngle = this.particleSystem.originalPositions[i3];
            const ring = this.particleSystem.originalPositions[i3 + 1];
            let z = this.particleSystem.originalPositions[i3 + 2];
            
            // Apply tunnel movement
            z = (z + this.tunnelOffset) % (rings * spacing) - (rings * spacing) / 2;
            
            // Rotation varies by depth
            const rotation = this.time + (ring * 0.2);
            const angle = baseAngle + rotation;
            
            // Radius pulsates with audio
            const radiusMod = Math.sin(this.time * 2 + ring * 0.5) * 5;
            const bassBoost = (audioData.bass / 255) * 10;
            const radius = this.config.ringRadius + radiusMod + bassBoost;
            
            // Wave motion based on mid frequencies
            const midWave = Math.sin(angle * 3 + this.time * 2) * (audioData.mid / 255) * 3;
            
            this.particleSystem.positions[i3] = Math.cos(angle) * (radius + midWave);
            this.particleSystem.positions[i3 + 1] = Math.sin(angle) * (radius + midWave);
            this.particleSystem.positions[i3 + 2] = z;
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors(audioData);
    }
}
