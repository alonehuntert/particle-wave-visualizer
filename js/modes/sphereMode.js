// Particle Sphere Mode
class SphereMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.time = 0;
        this.radius = 50;
    }

    init() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < this.particleSystem.particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = this.radius;
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    update(audioData) {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        this.time += 0.01;
        const bass = audioData.bass / 255;
        const mid = audioData.mid / 255;
        const treble = audioData.treble / 255;
        const radiusMod = this.radius * (1 + bass * 0.5);
        
        for (let i = 0; i < this.particleSystem.particleCount; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];
            const dist = Math.sqrt(x * x + y * y + z * z);
            const norm = radiusMod / dist;
            
            positions[i * 3] = x * norm;
            positions[i * 3 + 1] = y * norm;
            positions[i * 3 + 2] = z * norm;
            
            const pulse = Math.sin(this.time * 5 + i * 0.01) * mid * 0.3;
            colors[i * 3] = this.particleSystem.colorScheme[0][0] * (0.7 + pulse + treble * 0.3);
            colors[i * 3 + 1] = this.particleSystem.colorScheme[0][1] * (0.7 + bass * 0.3);
            colors[i * 3 + 2] = this.particleSystem.colorScheme[0][2] * (0.7 + mid * 0.3);
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
}
