// Vortex Tunnel Mode
class VortexMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.time = 0;
        this.rings = 30;
        this.particlesPerRing = Math.floor(this.particleSystem.particleCount / this.rings);
    }
    initialize() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        let index = 0;
        for (let ring = 0; ring < this.rings; ring++) {
            const z = ring * 10 - 150;
            const radius = 20 + ring * 2;
            for (let i = 0; i < this.particlesPerRing; i++) {
                const angle = (i / this.particlesPerRing) * Math.PI * 2;
                positions[index * 3] = Math.cos(angle) * radius;
                positions[index * 3 + 1] = Math.sin(angle) * radius;
                positions[index * 3 + 2] = z;
                index++;
                if (index >= this.particleSystem.particleCount) break;
            }
            if (index >= this.particleSystem.particleCount) break;
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
        const speed = 2 * (1 + bass);
        let index = 0;
        for (let ring = 0; ring < this.rings; ring++) {
            const radiusMod = (20 + ring * 2) * (1 + mid * 0.3);
            for (let i = 0; i < this.particlesPerRing; i++) {
                const angle = (i / this.particlesPerRing) * Math.PI * 2 + this.time + ring * 0.1;
                positions[index * 3] = Math.cos(angle) * radiusMod;
                positions[index * 3 + 1] = Math.sin(angle) * radiusMod;
                positions[index * 3 + 2] += speed;
                if (positions[index * 3 + 2] > 50) {
                    positions[index * 3 + 2] = -150;
                }
                const depth = (positions[index * 3 + 2] + 150) / 200;
                colors[index * 3] = this.particleSystem.colorScheme[0] * (0.3 + depth * 0.7 + treble * 0.3);
                colors[index * 3 + 1] = this.particleSystem.colorScheme[1] * (0.5 + bass * 0.5);
                colors[index * 3 + 2] = this.particleSystem.colorScheme[2] * (0.7 + mid * 0.3);
                index++;
                if (index >= this.particleSystem.particleCount) break;
            }
            if (index >= this.particleSystem.particleCount) break;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
}