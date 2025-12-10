/* ================================
   Wave Ocean Mode
   ================================ */

class WaveMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.config = CONFIG.modes.wave;
        this.time = 0;
    }
    
    /**
     * Initialize wave grid
     */
    init() {
        const particleCount = this.particleSystem.particleCount;
        const gridSize = Math.floor(Math.sqrt(particleCount));
        const spacing = this.config.spacing;
        const offset = (gridSize * spacing) / 2;
        
        let index = 0;
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                if (index >= particleCount) break;
                
                const i = index * 3;
                this.particleSystem.positions[i] = x * spacing - offset;
                this.particleSystem.positions[i + 1] = 0;
                this.particleSystem.positions[i + 2] = z * spacing - offset;
                
                this.particleSystem.originalPositions[i] = this.particleSystem.positions[i];
                this.particleSystem.originalPositions[i + 1] = this.particleSystem.positions[i + 1];
                this.particleSystem.originalPositions[i + 2] = this.particleSystem.positions[i + 2];
                
                index++;
            }
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors();
    }
    
    /**
     * Update wave animation
     */
    update(audioData) {
        this.time += this.config.waveSpeed;
        
        const particleCount = this.particleSystem.particleCount;
        const gridSize = Math.floor(Math.sqrt(particleCount));
        const amplitude = this.config.waveAmplitude * (1 + audioData.bass / 255);
        
        let index = 0;
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                if (index >= particleCount) break;
                
                const i = index * 3;
                const px = this.particleSystem.originalPositions[i];
                const pz = this.particleSystem.originalPositions[i + 2];
                
                // Calculate wave height
                const distance = Math.sqrt(px * px + pz * pz);
                const wave1 = Math.sin(distance * 0.1 + this.time) * amplitude;
                const wave2 = Math.sin(px * 0.05 + this.time * 0.5) * amplitude * 0.5;
                const wave3 = Math.sin(pz * 0.05 - this.time * 0.5) * amplitude * 0.5;
                
                // Add audio reactivity
                const audioInfluence = (audioData.mid / 255) * 10;
                
                this.particleSystem.positions[i + 1] = wave1 + wave2 + wave3 + audioInfluence;
                
                index++;
            }
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors(audioData);
    }
}
