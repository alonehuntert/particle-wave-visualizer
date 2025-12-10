/* ================================
   Export Manager
   Handles screenshots and video recording
   ================================ */

class ExportManager {
    constructor(renderer, canvas) {
        this.renderer = renderer;
        this.canvas = canvas;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
    }
    
    /**
     * Take screenshot
     */
    takeScreenshot(filename = null) {
        try {
            // Generate filename if not provided
            if (!filename) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                filename = `particle-wave-${timestamp}.png`;
            }
            
            // Get canvas data
            this.canvas.toBlob((blob) => {
                Utils.downloadFile(blob, filename);
                Utils.showNotification('Screenshot saved!');
            }, 'image/png', CONFIG.export.screenshotQuality);
            
            return true;
        } catch (error) {
            console.error('Screenshot failed:', error);
            Utils.showNotification('Screenshot failed!');
            return false;
        }
    }
    
    /**
     * Start video recording
     */
    async startRecording() {
        try {
            // Check if MediaRecorder is supported
            if (!('MediaRecorder' in window)) {
                throw new Error('MediaRecorder not supported');
            }
            
            // Get canvas stream
            const stream = this.canvas.captureStream(CONFIG.export.videoFrameRate);
            
            // Create media recorder
            const options = {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 5000000
            };
            
            this.mediaRecorder = new MediaRecorder(stream, options);
            this.recordedChunks = [];
            
            // Handle data available
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            // Handle stop
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, {
                    type: 'video/webm'
                });
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `particle-wave-${timestamp}.webm`;
                
                Utils.downloadFile(blob, filename);
                Utils.showNotification('Video saved!');
                
                this.recordedChunks = [];
            };
            
            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            
            Utils.showNotification('Recording started...');
            
            // Auto-stop after duration
            setTimeout(() => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            }, CONFIG.export.videoDuration * 1000);
            
            return true;
        } catch (error) {
            console.error('Recording failed:', error);
            Utils.showNotification('Recording not supported!');
            return false;
        }
    }
    
    /**
     * Stop video recording
     */
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            Utils.showNotification('Recording stopped.');
            return true;
        }
        return false;
    }
    
    /**
     * Get shareable configuration
     */
    getShareableConfig(mode, colorScheme, particleCount) {
        const config = {
            mode,
            colorScheme,
            particleCount
        };
        
        // Encode to base64
        const jsonString = JSON.stringify(config);
        const base64 = btoa(jsonString);
        
        // Create shareable URL
        const url = `${window.location.origin}${window.location.pathname}?config=${base64}`;
        
        return url;
    }
    
    /**
     * Load configuration from URL
     */
    loadConfigFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const configParam = urlParams.get('config');
        
        if (configParam) {
            try {
                const jsonString = atob(configParam);
                const config = JSON.parse(jsonString);
                return config;
            } catch (error) {
                console.error('Failed to load config from URL:', error);
                return null;
            }
        }
        
        return null;
    }
}
