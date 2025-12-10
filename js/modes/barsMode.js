// Frequency Bars Mode
class BarsMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.barCount = 48;
        this.particlesPerBar = Math.floor(this.particleSystem.particleCount / this.barCount);
        this.maxHeight = 60;
        this.radius = 50;
    }
    initialize() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        let index = 0;
        for (let bar = 0; bar < this.barCount; bar++) {
            const angle = (bar / this.barCount) * Math.PI * 2;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            for (let i = 0; i < this.particlesPerBar; i++) {
                positions[index * 3] = x;
                positions[index * 3 + 1] = i * 2;
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
        const freqData = audioData.full;
        const barWidth = Math.floor(freqData.length / this.barCount);
        let index = 0;
        for (let bar = 0; bar < this.barCount; bar++) {
            const angle = (bar / this.barCount) * Math.PI * 2;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            const startFreq = bar * barWidth;
            const endFreq = startFreq + barWidth;
            let barValue = 0;
            for (let f = startFreq; f < endFreq; f++) {
                barValue += freqData[f];
            }
            barValue = barValue / barWidth / 255;
            const barHeight = barValue * this.maxHeight;
            for (let i = 0; i < this.particlesPerBar; i++) {
                const y = i * 2;
                const visible = y < barHeight;
                positions[index * 3] = visible ? x : 0;
                positions[index * 3 + 1] = visible ? y : -1000;
                positions[index * 3 + 2] = visible ? z : 0;
                const heightNorm = y / this.maxHeight;
                colors[index * 3] = this.particleSystem.colorScheme[0] * (0.3 + heightNorm * 0.7);
                colors[index * 3 + 1] = this.particleSystem.colorScheme[1] * (0.5 + barValue * 0.5);
                colors[index * 3 + 2] = this.particleSystem.colorScheme[2] * (0.8 + heightNorm * 0.2);
                index++;
                if (index >= this.particleSystem.particleCount) break;
            }
            if (index >= this.particleSystem.particleCount) break;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
}