/* ================================
   Audio Engine
   Handles Web Audio API and audio analysis
   ================================ */

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.source = null;
        this.audioElement = null;
        this.gainNode = null;
        this.isPlaying = false;
        this.isMicActive = false;
        this.audioData = {
            bass: 0,
            mid: 0,
            treble: 0,
            full: null
        };
        
        this.sensitivity = {
            bass: 1.0,
            mid: 1.0,
            treble: 1.0
        };
    }
    
    /**
     * Initialize audio context and analyser
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = CONFIG.audio.fftSize;
            this.analyser.smoothingTimeConstant = CONFIG.audio.smoothingTimeConstant;
            
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.audioData.full = this.dataArray;
            
            // Create gain node for volume control
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = CONFIG.audio.defaultVolume;
            
            console.log('Audio Engine initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            return false;
        }
    }
    
    /**
     * Load audio from file
     */
    async loadAudioFile(file) {
        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Disconnect existing source
            this.disconnectSource();
            
            // Create audio element
            this.audioElement = new Audio();
            this.audioElement.src = URL.createObjectURL(file);
            
            // Setup audio nodes
            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Wait for audio to be loadable
            await new Promise((resolve, reject) => {
                this.audioElement.addEventListener('canplaythrough', resolve, { once: true });
                this.audioElement.addEventListener('error', reject, { once: true });
            });
            
            console.log('Audio file loaded:', file.name);
            return true;
        } catch (error) {
            console.error('Failed to load audio file:', error);
            throw error;
        }
    }
    
    /**
     * Load audio from URL
     */
    async loadAudioURL(url) {
        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Disconnect existing source
            this.disconnectSource();
            
            // Create audio element
            this.audioElement = new Audio();
            this.audioElement.src = url;
            this.audioElement.crossOrigin = 'anonymous';
            
            // Setup audio nodes
            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Wait for audio to be loadable
            await new Promise((resolve, reject) => {
                this.audioElement.addEventListener('canplaythrough', resolve, { once: true });
                this.audioElement.addEventListener('error', reject, { once: true });
                setTimeout(() => reject(new Error('Load timeout')), 10000);
            });
            
            console.log('Audio URL loaded:', url);
            return true;
        } catch (error) {
            console.error('Failed to load audio URL:', error);
            throw error;
        }
    }
    
    /**
     * Start microphone input
     */
    async startMicrophone() {
        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Disconnect existing source
            this.disconnectSource();
            
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            // Create media stream source
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.source.connect(this.analyser);
            // Note: Don't connect to destination to avoid feedback
            
            this.isMicActive = true;
            this.isPlaying = true;
            
            console.log('Microphone started');
            return true;
        } catch (error) {
            console.error('Failed to start microphone:', error);
            throw error;
        }
    }
    
    /**
     * Stop microphone input
     */
    stopMicrophone() {
        if (this.source && this.source.mediaStream) {
            this.source.mediaStream.getTracks().forEach(track => track.stop());
        }
        this.disconnectSource();
        this.isMicActive = false;
        this.isPlaying = false;
        console.log('Microphone stopped');
    }
    
    /**
     * Play audio
     */
    play() {
        if (this.audioElement && !this.isMicActive) {
            this.audioElement.play();
            this.isPlaying = true;
        }
    }
    
    /**
     * Pause audio
     */
    pause() {
        if (this.audioElement && !this.isMicActive) {
            this.audioElement.pause();
            this.isPlaying = false;
        }
    }
    
    /**
     * Toggle play/pause
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    /**
     * Set volume (0-1)
     */
    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = Utils.clamp(volume, 0, 1);
        }
    }
    
    /**
     * Get current time
     */
    getCurrentTime() {
        return this.audioElement ? this.audioElement.currentTime : 0;
    }
    
    /**
     * Get duration
     */
    getDuration() {
        return this.audioElement ? this.audioElement.duration : 0;
    }
    
    /**
     * Seek to time
     */
    seek(time) {
        if (this.audioElement) {
            this.audioElement.currentTime = Utils.clamp(time, 0, this.getDuration());
        }
    }
    
    /**
     * Get audio data (frequency analysis)
     */
    getAudioData() {
        if (!this.analyser) return this.audioData;
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate bass, mid, treble averages
        const bassEnd = Math.floor(this.bufferLength * CONFIG.audio.bassRange[1]);
        const midEnd = Math.floor(this.bufferLength * CONFIG.audio.midRange[1]);
        const trebleEnd = Math.floor(this.bufferLength * CONFIG.audio.trebleRange[1]);
        
        this.audioData.bass = Utils.averageSlice(this.dataArray, 0, bassEnd) * this.sensitivity.bass;
        this.audioData.mid = Utils.averageSlice(this.dataArray, bassEnd, midEnd) * this.sensitivity.mid;
        this.audioData.treble = Utils.averageSlice(this.dataArray, midEnd, trebleEnd) * this.sensitivity.treble;
        
        return this.audioData;
    }
    
    /**
     * Set sensitivity for frequency ranges
     */
    setSensitivity(bass, mid, treble) {
        this.sensitivity.bass = bass;
        this.sensitivity.mid = mid;
        this.sensitivity.treble = treble;
    }
    
    /**
     * Disconnect current source
     */
    disconnectSource() {
        if (this.source) {
            try {
                this.source.disconnect();
            } catch (e) {
                // Ignore disconnect errors
            }
            this.source = null;
        }
        
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
            this.audioElement = null;
        }
        
        this.isPlaying = false;
    }
    
    /**
     * Cleanup
     */
    dispose() {
        this.disconnectSource();
        this.stopMicrophone();
        
        if (this.analyser) {
            this.analyser.disconnect();
        }
        
        if (this.gainNode) {
            this.gainNode.disconnect();
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}
