// Galaxy Spiral Mode
class GalaxyMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.time = 0;
        this.arms = 3;
        this.maxRadius = 80;
    }
    init() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < this.particleSystem.particleCount; i++) {
            const arm = i % this.arms;
            const armAngle = (arm / this.arms) * Math.PI * 2;
            const distance = Math.pow(Math.random(), 0.5) * this.maxRadius;
            const angle = armAngle + distance * 0.1;
            positions[i * 3] = Math.cos(angle) * distance;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = Math.sin(angle) * distance;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    update(audioData) {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        this.time += 0.005;
        const bass = audioData.bass / 255;
        const mid = audioData.mid / 255;
        const treble = audioData.treble / 255;
        for (let i = 0; i < this.particleSystem.particleCount; i++) {
            const arm = i % this.arms;
            const armAngle = (arm / this.arms) * Math.PI * 2;
            const distance = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2);
            const angle = armAngle + distance * 0.1 + this.time;
            const distMod = distance * (1 + bass * 0.2);
            positions[i * 3] = Math.cos(angle) * distMod;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10 * (1 + mid * 0.5);
            positions[i * 3 + 2] = Math.sin(angle) * distMod;
            const distNorm = distance / this.maxRadius;
            const position = i / this.particleSystem.particleCount;
            const color = Utils.getColorFromPalette(this.particleSystem.colorPalette, position);
            colors[i * 3] = color[0] * (0.5 + distNorm * 0.5 + treble * 0.3);
            colors[i * 3 + 1] = color[1] * (0.5 + bass * 0.5);
            colors[i * 3 + 2] = color[2] * (0.8 + mid * 0.2);
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
}
