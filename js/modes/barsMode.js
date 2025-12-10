/* ================================
   Frequency Bars Mode
   ================================ */

class BarsMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.config = CONFIG.modes.bars;
        this.barHeights = new Array(this.config.barCount).fill(0);
        this.time = 0;
    }
    
    /**
     * Initialize frequency bars
     */
    init() {
        const particleCount = this.particleSystem.particleCount;
        const barCount = this.config.barCount;
        const particlesPerBar = Math.floor(particleCount / barCount);
        const radius = this.config.radius;
        
        let index = 0;
        for (let bar = 0; bar < barCount; bar++) {
            const angle = (bar / barCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            for (let p = 0; p < particlesPerBar; p++) {
                if (index >= particleCount) break;
                
                const i3 = index * 3;
                const y = 0;
                
                this.particleSystem.positions[i3] = x;
                this.particleSystem.positions[i3 + 1] = y;
                this.particleSystem.positions[i3 + 2] = z;
                
                this.particleSystem.originalPositions[i3] = bar;
                this.particleSystem.originalPositions[i3 + 1] = p / particlesPerBar;
                this.particleSystem.originalPositions[i3 + 2] = angle;
                
                index++;
            }
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors();
    }
    
    /**
     * Update frequency bars
     */
    update(audioData) {
        this.time += 0.01;
        
        const particleCount = this.particleSystem.particleCount;
        const barCount = this.config.barCount;
        const maxHeight = this.config.maxHeight;
        const radius = this.config.radius;
        
        // Update bar heights from frequency data
        if (audioData.full) {
            const dataPerBar = Math.floor(audioData.full.length / barCount);
            
            for (let bar = 0; bar < barCount; bar++) {
                const start = bar * dataPerBar;
                const end = start + dataPerBar;
                const avg = Utils.averageSlice(audioData.full, start, end);
                
                // Smooth transition
                this.barHeights[bar] = Utils.lerp(
                    this.barHeights[bar],
                    (avg / 255) * maxHeight,
                    0.3
                );
            }
        }
        
        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            const bar = this.particleSystem.originalPositions[i3];
            const heightPos = this.particleSystem.originalPositions[i3 + 1];
            const angle = this.particleSystem.originalPositions[i3 + 2];
            
            const barHeight = this.barHeights[Math.floor(bar)] || 0;
            const y = heightPos * barHeight;
            
            // Add some width variation
            const widthMod = Math.sin(y * 0.1 + this.time) * 2;
            const radiusMod = radius + widthMod;
            
            this.particleSystem.positions[i3] = Math.cos(angle + this.time * 0.1) * radiusMod;
            this.particleSystem.positions[i3 + 1] = y;
            this.particleSystem.positions[i3 + 2] = Math.sin(angle + this.time * 0.1) * radiusMod;
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors(audioData);
    }
}
