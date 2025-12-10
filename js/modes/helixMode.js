// DNA Helix Mode
class HelixMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.time = 0;
        this.helixRadius = 20;
        this.helixHeight = 80;
    }

    init() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < this.particleSystem.particleCount; i++) {
            const strand = i % 2;
            const t = (i / this.particleSystem.particleCount) * this.helixHeight;
            const angle = t * 0.2 + strand * Math.PI;
            
            positions[i * 3] = Math.cos(angle) * this.helixRadius;
            positions[i * 3 + 1] = t - this.helixHeight / 2;
            positions[i * 3 + 2] = Math.sin(angle) * this.helixRadius;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    update(audioData) {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        this.time += 0.02;
        const bass = audioData.bass / 255;
        const mid = audioData.mid / 255;
        const treble = audioData.treble / 255;
        const radiusMod = this.helixRadius * (1 + bass * 0.3);
        
        for (let i = 0; i < this.particleSystem.particleCount; i++) {
            const strand = i % 2;
            const t = (i / this.particleSystem.particleCount) * this.helixHeight;
            const angle = t * 0.2 + strand * Math.PI + this.time;
            
            positions[i * 3] = Math.cos(angle) * radiusMod;
            positions[i * 3 + 1] = t - this.helixHeight / 2 + Math.sin(this.time * 2 + t * 0.1) * 5 * mid;
            positions[i * 3 + 2] = Math.sin(angle) * radiusMod;
            
            const tNorm = t / this.helixHeight;
            const position = i / this.particleSystem.particleCount;
            const color = Utils.getColorFromPalette(this.particleSystem.colorPalette, position);
            colors[i * 3] = color[0] * (0.5 + tNorm * 0.5 + treble * 0.3);
            colors[i * 3 + 1] = color[1] * (0.7 + bass * 0.3);
            colors[i * 3 + 2] = color[2] * (0.6 + mid * 0.4);
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
}
