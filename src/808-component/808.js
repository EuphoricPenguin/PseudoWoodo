let audioContext;

// Default frequencies for the tunable oscillators
let osc1Frequency = 800; // Oscillator 1 (800 Hz)
let osc2Frequency = 540; // Oscillator 2 (540 Hz)

// Function to update oscillator frequencies and labels
function updateOscillatorFrequencies() {
    // Get slider values
    const osc1Value = parseFloat(document.getElementById('osc1-tune').value);
    const osc2Value = parseFloat(document.getElementById('osc2-tune').value);

    // Update frequencies
    osc1Frequency = osc1Value;
    osc2Frequency = osc2Value;

    // Update label text with current values
    document.getElementById('osc1-label').textContent =
        `Oscillator 1: ${osc1Value.toFixed(1)} Hz`;
    document.getElementById('osc2-label').textContent =
        `Oscillator 2: ${osc2Value.toFixed(1)} Hz`;
}

// Initialize labels with current slider values on page load
updateOscillatorFrequencies();

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function createNoiseBuffer(context) {
    const bufferSize = 2 * context.sampleRate;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

function playSound(soundFn) {
    initAudioContext();
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    soundFn(audioContext);
}

// Sound generators
const sounds = {
    bd: (context) => {
        const osc = context.createOscillator();
        const vca = context.createGain();
        const filter = context.createBiquadFilter();
        const now = context.currentTime;

        // Base frequency settings
        const baseFreq = 55;  // Fundamental frequency of the drum
        const peakFreq = 600; // Initial pitched attack frequency

        // Oscillator configuration
        osc.type = 'sine';
        osc.frequency.setValueAtTime(peakFreq, now);

        // ENV-B - Pitch modulation envelope (batter head simulation)
        osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.03); // Fast pitch drop

        // ENV-A - Amplitude envelope (resonant head simulation)
        vca.gain.setValueAtTime(1, now);
        vca.gain.exponentialRampToValueAtTime(0.001, now + 0.5); // Longer decay

        // Filter to shape tone (simulating drum shell resonance)
        filter.type = 'lowpass';
        filter.frequency.value = 80;  // Allow fundamental through
        filter.Q.value = 0.707;       // Gentle resonance

        // Signal chain
        osc.connect(filter)
            .connect(vca)
            .connect(context.destination);

        osc.start();
        osc.stop(now + 0.55); // Stop after full decay
    },

    sd: (context) => {
        const mainGain = context.createGain();
        const noiseGain = context.createGain();
        const snappy = .9; // 0-1 control for noise amount
        const toneValue = 0.; // Control mix of frequencies
        const fundamentalFreq = 250; // Fundamental frequency of snare drum
        const harmonicFreq = 500;    // Second harmonic frequency
        const noiseFilterFreq = 2000; //Frequency of noise HPF
        const mainDecay = 0.15 //Main decay of synth
        const noiseDecay = 0.3 //Noise decay of synth

        // Create oscillators for fundamental and harmonic frequencies
        const fundamentalOsc = context.createOscillator();
        fundamentalOsc.type = 'sine';
        fundamentalOsc.frequency.value = fundamentalFreq;

        const harmonicOsc = context.createOscillator();
        harmonicOsc.type = 'sine';
        harmonicOsc.frequency.value = harmonicFreq;

        // Create gain nodes for tone control
        const fundamentalGain = context.createGain();
        const harmonicGain = context.createGain();

        // Set gain values based on tone control
        fundamentalGain.gain.value = 1 - toneValue; // Fundamental decreases as tone increases
        harmonicGain.gain.value = toneValue;       // Harmonic increases as tone increases

        // Noise source with HPF
        const noise = context.createBufferSource();
        noise.buffer = createNoiseBuffer(context);
        const noiseFilter = context.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = noiseFilterFreq;

        // Envelopes
        mainGain.gain.setValueAtTime(1, context.currentTime);
        mainGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + mainDecay);

        noiseGain.gain.setValueAtTime(snappy, context.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + noiseDecay);

        // Connect components
        noise.connect(noiseFilter).connect(noiseGain).connect(mainGain);
        fundamentalOsc.connect(fundamentalGain).connect(mainGain);
        harmonicOsc.connect(harmonicGain).connect(mainGain);

        mainGain.connect(context.destination);

        // Start oscillators
        fundamentalOsc.start();
        harmonicOsc.start();
        noise.start();
        fundamentalOsc.stop(context.currentTime + 0.3);
        harmonicOsc.stop(context.currentTime + 0.3);
        noise.stop(context.currentTime + 0.3);
    },

    ht: (context) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'sine'; // Sine wave for a smooth tom sound
        oscillator.frequency.setValueAtTime(300, context.currentTime); // High pitch start
        oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.2); // Pitch sweep down

        gainNode.gain.setValueAtTime(1, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2); // Quick decay

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.4); // Stop after 0.4 seconds
    },

    mt: (context) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'sine'; // Sine wave for a smooth tom sound
        oscillator.frequency.setValueAtTime(200, context.currentTime); // Mid pitch start
        oscillator.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.2); // Pitch sweep down

        gainNode.gain.setValueAtTime(1, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2); // Quick decay

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5); // Stop after 0.5 seconds
    },

    lt: (context) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'sine'; // Sine wave for a smooth tom sound
        oscillator.frequency.setValueAtTime(100, context.currentTime); // Low pitch start
        oscillator.frequency.exponentialRampToValueAtTime(50, context.currentTime + 0.6); // Pitch sweep down

        gainNode.gain.setValueAtTime(1, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.6); // Quick decay

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.6); // Stop after 0.6 seconds
    },

    rs: (context) => {
        const osc1 = context.createOscillator();
        const osc2 = context.createOscillator();
        const mixer = context.createGain();
        const adsrGain = context.createGain();
        const eq1 = context.createBiquadFilter();
        const eq2 = context.createBiquadFilter();

        // Set up oscillators
        osc1.type = 'sawtooth';
        osc1.frequency.value = 449;
        osc2.type = 'square';
        osc2.frequency.value = 1704;

        // Set up mixer
        mixer.gain.value = 0.5; // Adjust as needed

        // Set up ADSR envelope
        const currentTime = context.currentTime;
        const attack = 0.0005; // Shorter attack for sharper click
        const hold = 0.01; // Shorter hold
        const decay = 0.005; // Shorter decay
        const sustain = 0; // No sustain
        const release = 0.005; // Shorter release

        // Attack phase: gain goes from 0 to 1 over 'attack' time
        adsrGain.gain.setValueAtTime(0, currentTime);
        adsrGain.gain.linearRampToValueAtTime(1, currentTime + attack);

        // Hold phase: gain remains at 1 for 'hold' time
        adsrGain.gain.setValueAtTime(1, currentTime + attack);
        adsrGain.gain.setValueAtTime(1, currentTime + attack + hold);

        // Decay phase: gain goes from 1 to 'sustain' level over 'decay' time
        adsrGain.gain.linearRampToValueAtTime(sustain, currentTime + attack + hold + decay);

        // Release phase: gain goes from 'sustain' to 0 over 'release' time
        adsrGain.gain.linearRampToValueAtTime(0, currentTime + attack + hold + decay + release);

        // Set up EQ1 (2822 Hz, peaking)
        eq1.type = 'peaking';
        eq1.frequency.value = 2822;
        eq1.Q.value = 0.3; // Narrower bandwidth for more focus
        eq1.gain.value = 18; // Increased gain for more presence

        // Set up EQ2 (532 Hz, peaking)
        eq2.type = 'peaking';
        eq2.frequency.value = 532;
        eq2.Q.value = 0.4; // Adjusted bandwidth
        eq2.gain.value = 15; // Increased gain

        // Connect the nodes
        osc1.connect(mixer);
        osc2.connect(mixer);
        mixer.connect(adsrGain);
        adsrGain.connect(eq1);
        eq1.connect(eq2);
        eq2.connect(context.destination);

        // Start oscillators
        osc1.start(currentTime);
        osc2.start(currentTime);

        // Stop oscillators after the total duration
        const totalDuration = attack + hold + decay + release;
        osc1.stop(currentTime + totalDuration);
        osc2.stop(currentTime + totalDuration);
    },

    cl: (context) => {
        const osc1 = context.createOscillator();
        const osc2 = context.createOscillator();
        const mixer = context.createGain();
        const adsrGain = context.createGain();
        const eq1 = context.createBiquadFilter();
        const eq2 = context.createBiquadFilter();

        // Set up oscillators
        osc2.type = 'square';
        osc2.frequency.value = 2349.318;

        // Set up mixer
        mixer.gain.value = 0.1; // Adjust as needed

        // Set up ADSR envelope
        const currentTime = context.currentTime;
        const attack = 0.0005; // Shorter attack for sharper click
        const hold = 0.02; // Shorter hold
        const decay = 0.002; // Shorter decay
        const sustain = 0; // No sustain
        const release = 0.005; // Shorter release

        // Attack phase: gain goes from 0 to 1 over 'attack' time
        adsrGain.gain.setValueAtTime(0, currentTime);
        adsrGain.gain.linearRampToValueAtTime(1, currentTime + attack);

        // Hold phase: gain remains at 1 for 'hold' time
        adsrGain.gain.setValueAtTime(1, currentTime + attack);
        adsrGain.gain.setValueAtTime(1, currentTime + attack + hold);

        // Decay phase: gain goes from 1 to 'sustain' level over 'decay' time
        adsrGain.gain.linearRampToValueAtTime(sustain, currentTime + attack + hold + decay);

        // Release phase: gain goes from 'sustain' to 0 over 'release' time
        adsrGain.gain.linearRampToValueAtTime(0, currentTime + attack + hold + decay + release);

        // Set up EQ1 (2822 Hz, peaking)
        eq1.type = 'peaking';
        eq1.frequency.value = 2822;
        eq1.Q.value = 0.3; // Narrower bandwidth for more focus
        eq1.gain.value = 18; // Increased gain for more presence

        // Set up EQ2 (532 Hz, peaking)
        eq2.type = 'peaking';
        eq2.frequency.value = 532;
        eq2.Q.value = 0.4; // Adjusted bandwidth
        eq2.gain.value = 15; // Increased gain

        // Connect the nodes
        osc2.connect(mixer);
        mixer.connect(adsrGain);
        adsrGain.connect(eq1);
        eq1.connect(eq2);
        eq2.connect(context.destination);

        // Start oscillators
        osc2.start(currentTime);

        // Stop oscillators after the total duration
        const totalDuration = attack + hold + decay + release;
        osc2.stop(currentTime + totalDuration);
    },

    cp: (context) => {
        // Create white noise buffer
        const noiseBuffer = createNoiseBuffer(context, 0.15); // 150ms of noise
        const noise = context.createBufferSource();
        noise.buffer = noiseBuffer;

        // Bandpass filter (centered at 1000Hz)
        const filter = context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000; // Center frequency
        filter.Q.value = 4; // Quality factor

        // Create two VCAs for parallel paths
        const vca1 = context.createGain(); // Snap envelope VCA
        const vca2 = context.createGain(); // Reverb envelope VCA

        // Connect the audio graph
        noise.connect(filter);
        filter.connect(vca1);
        filter.connect(vca2);
        vca1.connect(context.destination);
        vca2.connect(context.destination);

        // Get current time
        const now = context.currentTime;

        // Snap envelope (3 fast decays + 1 longer decay)
        vca1.gain.setValueAtTime(0, now);
        const snapTimes = [
            [0, 0.01],   // 0-10ms
            [0.01, 0.01],// 10-20ms
            [0.02, 0.01],// 20-30ms
            [0.03, 0.02] // 30-50ms
        ];

        snapTimes.forEach(([start, duration]) => {
            vca1.gain.setValueAtTime(1, now + start);
            vca1.gain.linearRampToValueAtTime(0.001, now + start + duration);
        });

        // Reverb envelope (100ms exponential decay)
        vca2.gain.setValueAtTime(1, now);
        vca2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        // Start noise and stop when envelopes complete
        noise.start(now);
        noise.stop(now + 0.15); // Stop after 150ms
    },

    ma: (context) => {
        const noise = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();

        noise.buffer = createNoiseBuffer(context);
        filter.type = 'highpass';
        filter.frequency.value = 6500;

        gain.gain.setValueAtTime(0.05, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.5, context.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.05);

        noise.connect(filter).connect(gain).connect(context.destination);
        noise.start();
        noise.stop(context.currentTime + 0.08);
    },

    cb: (context) => {
        // Create oscillators
        const osc1 = context.createOscillator(); // Lower frequency oscillator
        const osc2 = context.createOscillator(); // Higher frequency oscillator

        // Set oscillator types to square waves
        osc1.type = 'square';
        osc2.type = 'square';

        // Set frequencies with slight detuning
        osc1.frequency.value = 540; // C#5 -45c (from service manual)
        osc2.frequency.value = 800; // G5 +35c (from service manual)

        // Create a mixer to balance the oscillators
        const mixer = context.createGain();
        mixer.gain.value = 0.5; // Overall gain

        // Create a bandpass filter
        const filter = context.createBiquadFilter();
        filter.type = 'bandpass'; // BP2 (default)
        filter.frequency.value = 1200; // Center frequency (adjust to taste)
        filter.Q.value = 4; // Moderate resonance

        // Create a VCA with an AR envelope
        const vca = context.createGain();
        vca.gain.setValueAtTime(0, context.currentTime);

        // AR envelope settings
        const attackTime = 0.005; // Very short attack (5ms)
        const releaseTime = 0.25; // Moderate release (250ms)

        // Apply the envelope
        vca.gain.linearRampToValueAtTime(1, context.currentTime + attackTime); // Attack
        vca.gain.exponentialRampToValueAtTime(0.001, context.currentTime + attackTime + releaseTime); // Release

        // Connect the audio graph
        osc1.connect(mixer);
        osc2.connect(mixer);
        mixer.connect(filter);
        filter.connect(vca);
        vca.connect(context.destination);

        // Start oscillators
        osc1.start();
        osc2.start();

        // Stop oscillators after the sound completes
        const totalDuration = attackTime + releaseTime;
        osc1.stop(context.currentTime + totalDuration);
        osc2.stop(context.currentTime + totalDuration);
    },

    cy: (context) => {
        // Frequencies for the oscillators (enharmonic, high-pitched)
        const frequencies = [osc1Frequency, osc2Frequency, 522.7, 369.6, 304.4, 205.3]; // High frequencies for metallic texture
        const oscillators = frequencies.map(freq => {
            const osc = context.createOscillator();
            osc.type = 'square'; // Square waves for brightness
            osc.frequency.value = freq;
            return osc;
        });

        // Create noise source for metallic texture
        const noise = context.createBufferSource();
        noise.buffer = createNoiseBuffer(context);

        // Create band-pass filters
        const bandpassOne = context.createBiquadFilter();
        bandpassOne.type = 'bandpass';
        bandpassOne.frequency.value = 7100; // Center frequency in the high range
        bandpassOne.Q.value = 2; // Moderate resonance

        const bandpassTwo = context.createBiquadFilter();
        bandpassTwo.type = 'bandpass';
        bandpassTwo.frequency.value = 3440; // Center frequency for the mid-high range
        bandpassTwo.Q.value = 2; // Moderate resonance

        // Connect oscillators and noise to filters
        oscillators.forEach(osc => {
            osc.connect(bandpassOne);
            osc.connect(bandpassTwo);
        });
        noise.connect(bandpassOne);
        noise.connect(bandpassTwo);

        // Create VCAs and high-pass filters for each band
        const vcaOne = context.createGain();
        vcaOne.gain.setValueAtTime(0, context.currentTime);

        const vcaTwo = context.createGain();
        vcaTwo.gain.setValueAtTime(0, context.currentTime);

        const highpassOne = context.createBiquadFilter();
        highpassOne.type = 'highpass';
        highpassOne.frequency.value = 6000; // High-pass cutoff for the first band

        const highpassTwo = context.createBiquadFilter();
        highpassTwo.type = 'highpass';
        highpassTwo.frequency.value = 10000; // High-pass cutoff for the second band

        // Connect band-pass filters to VCAs and high-pass filters
        bandpassOne.connect(vcaOne);
        vcaOne.connect(highpassOne);

        bandpassTwo.connect(vcaTwo);
        vcaTwo.connect(highpassTwo);

        // Create a final mixer to recombine the bands
        const finalMixer = context.createGain();
        highpassOne.connect(finalMixer);
        highpassTwo.connect(finalMixer);

        // Connect the final mixer to the audio context destination
        finalMixer.connect(context.destination);

        // Envelope parameters
        const attackTime = 0.01; // Very short attack
        const decayTimeOne = 1.2; // Decay time for the first band
        const decayTimeTwo = 1.2; // Decay time for the second band
        const now = context.currentTime;

        // Apply envelopes to the VCAs
        vcaOne.gain.linearRampToValueAtTime(1, now + attackTime); // Attack
        vcaOne.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTimeOne); // Decay

        vcaTwo.gain.linearRampToValueAtTime(1, now + attackTime); // Attack
        vcaTwo.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTimeTwo); // Decay

        // Start oscillators and noise
        oscillators.forEach(osc => osc.start());
        noise.start();

        // Stop oscillators and noise after decay
        const stopTime = now + attackTime + Math.max(decayTimeOne, decayTimeTwo) + 0.1;
        oscillators.forEach(osc => osc.stop(stopTime));
        noise.stop(stopTime)
    },

    oh: (context) => {
        // Frequencies for the hihat oscillators
        const frequencies = [osc1Frequency, osc2Frequency, 522.7, 369.6, 304.4, 205.3]; // Frequencies in Hz
        const oscillators = frequencies.map(freq => {
            const osc = context.createOscillator();
            osc.type = 'square';
            osc.frequency.value = freq;
            return osc;
        });

        // Create noise source for metallic texture
        const noise = context.createBufferSource();
        noise.buffer = createNoiseBuffer(context);

        // Create filters (bandpass and high-pass in parallel)
        const bandpass = context.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 10000; // Center frequency (8,000 to 12,000 Hz)
        bandpass.Q.value = 4; // Moderate resonance

        const highpass = context.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 8000; // High-pass cutoff

        // Create a mixer for the filters
        const mixer = context.createGain();
        mixer.gain.value = 0.2; // Adjust to taste

        // Create VCA with envelope
        const vca = context.createGain();
        vca.gain.setValueAtTime(0, context.currentTime);

        // Simulate MIDI pitch CV controlling decay time (high pitch = longer decay)
        const decayTime = 0.6; // Longer decay for open hihat

        // Apply envelope
        vca.gain.linearRampToValueAtTime(1, context.currentTime + 0.01); // Attack
        vca.gain.exponentialRampToValueAtTime(0.001, context.currentTime + decayTime); // Decay

        // Connect oscillators and noise to filters
        oscillators.forEach(osc => {
            osc.connect(bandpass);
            osc.connect(highpass);
        });
        noise.connect(bandpass);
        noise.connect(highpass);

        // Connect filters to mixer
        bandpass.connect(mixer);
        highpass.connect(mixer);

        // Connect mixer to VCA
        mixer.connect(vca);
        vca.connect(context.destination);

        // Start oscillators and noise
        oscillators.forEach(osc => osc.start());
        noise.start();

        // Stop oscillators and noise after decay
        oscillators.forEach(osc => osc.stop(context.currentTime + decayTime));
        noise.stop(context.currentTime + decayTime);
    },

    ch: (context) => {
        // Frequencies for the hihat oscillators
        const frequencies = [osc1Frequency, osc2Frequency, 522.7, 369.6, 304.4, 205.3]; // Frequencies in Hz
        const oscillators = frequencies.map(freq => {
            const osc = context.createOscillator();
            osc.type = 'square';
            osc.frequency.value = freq;
            return osc;
        });

        // Create noise source for metallic texture
        const noise = context.createBufferSource();
        noise.buffer = createNoiseBuffer(context);

        // Create filters (bandpass and high-pass in parallel)
        const bandpass = context.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 10000; // Center frequency (8,000 to 12,000 Hz)
        bandpass.Q.value = 4; // Moderate resonance

        const highpass = context.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 8000; // High-pass cutoff

        // Create a mixer for the filters
        const mixer = context.createGain();
        mixer.gain.value = 0.5; // Adjust to taste

        // Create VCA with envelope
        const vca = context.createGain();
        vca.gain.setValueAtTime(0, context.currentTime);

        // Simulate MIDI pitch CV controlling decay time (low pitch = shorter decay)
        const decayTime = 0.1; // Shorter decay for closed hihat

        // Apply envelope
        vca.gain.linearRampToValueAtTime(1, context.currentTime + 0.01); // Attack
        vca.gain.exponentialRampToValueAtTime(0.001, context.currentTime + decayTime); // Decay

        // Connect oscillators and noise to filters
        oscillators.forEach(osc => {
            osc.connect(bandpass);
            osc.connect(highpass);
        });
        noise.connect(bandpass);
        noise.connect(highpass);

        // Connect filters to mixer
        bandpass.connect(mixer);
        highpass.connect(mixer);

        // Connect mixer to VCA
        mixer.connect(vca);
        vca.connect(context.destination);

        // Start oscillators and noise
        oscillators.forEach(osc => osc.start());
        noise.start();

        // Stop oscillators and noise after decay
        oscillators.forEach(osc => osc.stop(context.currentTime + decayTime));
        noise.stop(context.currentTime + decayTime);
    }
};

// Add event listeners
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        if (sounds[e.target.id]) {
            playSound(sounds[e.target.id]);
        }
    });
});

// Add event listeners for tuning knobs
document.getElementById('osc1-tune').addEventListener('input', updateOscillatorFrequencies);
document.getElementById('osc2-tune').addEventListener('input', updateOscillatorFrequencies);