/* ================================
   Utility Functions
   ================================ */

const Utils = {
    /**
     * Map a value from one range to another
     */
    map: (value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    },
    
    /**
     * Clamp a value between min and max
     */
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * Linear interpolation
     */
    lerp: (start, end, amount) => {
        return start + (end - start) * amount;
    },
    
    /**
     * Calculate average of an array
     */
    average: (array) => {
        if (!array || array.length === 0) return 0;
        const sum = array.reduce((a, b) => a + b, 0);
        return sum / array.length;
    },
    
    /**
     * Calculate average of a slice of array
     */
    averageSlice: (array, start, end) => {
        const slice = array.slice(start, end);
        return Utils.average(slice);
    },
    
    /**
     * Smoothly interpolate between values over time
     */
    smooth: (current, target, smoothing) => {
        return current + (target - current) * smoothing;
    },
    
    /**
     * Format time in MM:SS format
     */
    formatTime: (seconds) => {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Format number with K suffix
     */
    formatNumber: (num) => {
        if (num >= 1000) {
            return Math.floor(num / 1000) + 'k';
        }
        return num.toString();
    },
    
    /**
     * Generate random number between min and max
     */
    random: (min, max) => {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * Generate random integer between min and max
     */
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Convert hex color to RGB array
     */
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
        ] : [1, 1, 1];
    },
    
    /**
     * Convert RGB array to hex color
     */
    rgbToHex: (r, g, b) => {
        const toHex = (val) => {
            const hex = Math.round(val * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    },
    
    /**
     * Interpolate between colors
     */
    lerpColor: (color1, color2, amount) => {
        return [
            Utils.lerp(color1[0], color2[0], amount),
            Utils.lerp(color1[1], color2[1], amount),
            Utils.lerp(color1[2], color2[2], amount)
        ];
    },
    
    /**
     * Get color from palette based on position (0-1)
     */
    getColorFromPalette: (palette, position) => {
        position = Utils.clamp(position, 0, 1);
        const scaledPos = position * (palette.length - 1);
        const index = Math.floor(scaledPos);
        const nextIndex = Math.min(index + 1, palette.length - 1);
        const amount = scaledPos - index;
        return Utils.lerpColor(palette[index], palette[nextIndex], amount);
    },
    
    /**
     * Detect if device is mobile
     */
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * Detect if browser supports WebGL2
     */
    supportsWebGL2: () => {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }
    },
    
    /**
     * Request fullscreen
     */
    requestFullscreen: (element) => {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    
    /**
     * Exit fullscreen
     */
    exitFullscreen: () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    
    /**
     * Check if in fullscreen mode
     */
    isFullscreen: () => {
        return !!(document.fullscreenElement || 
                  document.mozFullScreenElement || 
                  document.webkitFullscreenElement || 
                  document.msFullscreenElement);
    },
    
    /**
     * Debounce function calls
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function calls
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Download file
     */
    downloadFile: (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    
    /**
     * Show notification
     */
    showNotification: (message, duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = 'notification glass-panel';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            z-index: 10000;
            animation: notificationSlide 3s ease-in-out;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, duration);
    },
    
    /**
     * Detect beat (simple bass threshold detection)
     */
    detectBeat: (() => {
        let lastBeatTime = 0;
        const minTimeBetweenBeats = 300; // ms
        
        return (bassLevel, threshold = 200) => {
            const now = Date.now();
            if (bassLevel > threshold && now - lastBeatTime > minTimeBetweenBeats) {
                lastBeatTime = now;
                return true;
            }
            return false;
        };
    })()
};
