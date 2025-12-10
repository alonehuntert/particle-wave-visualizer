// Wave Ocean Mode - Particles form a 3D wave grid
class WaveMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.time = 0;
        this.gridSize = 100;
    }

    init() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const gridSpacing = this.gridSize / Math.sqrt(this.particleSystem.particleCount);
        let index = 0;
        const rows = Math.sqrt(this.particleSystem.particleCount);
        const cols = rows;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = (i - rows / 2) * gridSpacing;
                const z = (j - cols / 2) * gridSpacing;
                const y = 0;
                positions[index * 3] = x;
                positions[index * 3 + 1] = y;
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
        this.time += 0.01;
        const bass = audioData.bass / 255;
        const mid = audioData.mid / 255;
        const treble = audioData.treble / 255;

        let index = 0;
        const rows = Math.sqrt(this.particleSystem.particleCount);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rows; j++) {
                const x = positions[index * 3];
                const z = positions[index * 3 + 2];
                const distance = Math.sqrt(x * x + z * z);
                const waveHeight = Math.sin(distance * 0.05 - this.time * 2) * 10 * (1 + bass * 2);
                const ripple = Math.sin(this.time * 3 + i * 0.1) * 2 * mid;

                positions[index * 3 + 1] = waveHeight + ripple;

                const heightNorm = (waveHeight + 20) / 40;
                const position = index / this.particleSystem.particleCount;
                const color = Utils.getColorFromPalette(this.particleSystem.colorPalette, position);
                colors[index * 3] = color[0] * (0.5 + heightNorm * 0.5 + treble * 0.3);
                colors[index * 3 + 1] = color[1] * (0.5 + bass * 0.5);
                colors[index * 3 + 2] = color[2] * (0.5 + mid * 0.5);

                index++;
                if (index >= this.particleSystem.particleCount) break;
            }
            if (index >= this.particleSystem.particleCount) break;
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
}
