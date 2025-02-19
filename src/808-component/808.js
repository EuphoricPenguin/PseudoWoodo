class DrumSynth {
    constructor(externalContext) {
      this.context = externalContext || new (window.AudioContext || window.webkitAudioContext)();
      this.sounds = this.createSoundGenerators();
      this.gainNodes = new Map();
  
      // Create gain nodes for all sounds
      Object.keys(this.sounds).forEach((key) => {
        const gainNode = this.context.createGain();
        gainNode.connect(this.context.destination);
        this.gainNodes.set(key, gainNode);
      });
    }
  
    createNoiseBuffer(duration = 0.15) {
      const bufferSize = 2 * this.context.sampleRate * duration;
      const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
      const output = buffer.getChannelData(0);
  
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }
  
    createSoundGenerators() {
      return {
        bd: (context, destination) => {
          const osc = context.createOscillator();
          const vca = context.createGain();
          const filter = context.createBiquadFilter();
          const now = context.currentTime;
  
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(55, now + 0.03);
  
          vca.gain.setValueAtTime(1, now);
          vca.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  
          filter.type = 'lowpass';
          filter.frequency.value = 80;
          filter.Q.value = 0.707;
  
          osc.connect(filter).connect(vca).connect(destination);
          osc.start();
          osc.stop(now + 0.55);
        },
  
        sd: (context, destination) => {
          const mainGain = context.createGain();
          const noiseGain = context.createGain();
          const snappy = 0.9;
          const toneValue = 0.0;
          const fundamentalFreq = 250;
          const harmonicFreq = 500;
          const noiseFilterFreq = 2000;
          const mainDecay = 0.15;
          const noiseDecay = 0.3;
  
          const fundamentalOsc = context.createOscillator();
          fundamentalOsc.type = 'sine';
          fundamentalOsc.frequency.value = fundamentalFreq;
  
          const harmonicOsc = context.createOscillator();
          harmonicOsc.type = 'sine';
          harmonicOsc.frequency.value = harmonicFreq;
  
          const fundamentalGain = context.createGain();
          const harmonicGain = context.createGain();
  
          fundamentalGain.gain.value = 1 - toneValue;
          harmonicGain.gain.value = toneValue;
  
          const noise = context.createBufferSource();
          noise.buffer = this.createNoiseBuffer();
          const noiseFilter = context.createBiquadFilter();
          noiseFilter.type = 'highpass';
          noiseFilter.frequency.value = noiseFilterFreq;
  
          mainGain.gain.setValueAtTime(1, context.currentTime);
          mainGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + mainDecay);
  
          noiseGain.gain.setValueAtTime(snappy, context.currentTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + noiseDecay);
  
          noise.connect(noiseFilter).connect(noiseGain).connect(mainGain);
          fundamentalOsc.connect(fundamentalGain).connect(mainGain);
          harmonicOsc.connect(harmonicGain).connect(mainGain);
  
          mainGain.connect(destination);
  
          fundamentalOsc.start();
          harmonicOsc.start();
          noise.start();
          fundamentalOsc.stop(context.currentTime + 0.3);
          harmonicOsc.stop(context.currentTime + 0.3);
          noise.stop(context.currentTime + 0.3);
        },
  
        ht: (context, destination) => {
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();
  
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(300, context.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.2);
  
          gainNode.gain.setValueAtTime(1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
  
          oscillator.connect(gainNode).connect(destination);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.4);
        },
  
        mt: (context, destination) => {
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();
  
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(200, context.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.2);
  
          gainNode.gain.setValueAtTime(1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
  
          oscillator.connect(gainNode).connect(destination);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.5);
        },
  
        lt: (context, destination) => {
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();
  
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(100, context.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(50, context.currentTime + 0.6);
  
          gainNode.gain.setValueAtTime(1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.6);
  
          oscillator.connect(gainNode).connect(destination);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.6);
        },
  
        rs: (context, destination) => {
          const osc1 = context.createOscillator();
          const osc2 = context.createOscillator();
          const mixer = context.createGain();
          const adsrGain = context.createGain();
          const eq1 = context.createBiquadFilter();
          const eq2 = context.createBiquadFilter();
  
          osc1.type = 'sawtooth';
          osc1.frequency.value = 449;
          osc2.type = 'square';
          osc2.frequency.value = 1704;
  
          mixer.gain.value = 0.5;
  
          const currentTime = context.currentTime;
          const attack = 0.0005;
          const hold = 0.01;
          const decay = 0.005;
          const sustain = 0;
          const release = 0.005;
  
          adsrGain.gain.setValueAtTime(0, currentTime);
          adsrGain.gain.linearRampToValueAtTime(1, currentTime + attack);
          adsrGain.gain.setValueAtTime(1, currentTime + attack + hold);
          adsrGain.gain.linearRampToValueAtTime(sustain, currentTime + attack + hold + decay);
          adsrGain.gain.linearRampToValueAtTime(0, currentTime + attack + hold + decay + release);
  
          eq1.type = 'peaking';
          eq1.frequency.value = 2822;
          eq1.Q.value = 0.3;
          eq1.gain.value = 18;
  
          eq2.type = 'peaking';
          eq2.frequency.value = 532;
          eq2.Q.value = 0.4;
          eq2.gain.value = 15;
  
          osc1.connect(mixer);
          osc2.connect(mixer);
          mixer.connect(adsrGain);
          adsrGain.connect(eq1);
          eq1.connect(eq2);
          eq2.connect(destination);
  
          osc1.start(currentTime);
          osc2.start(currentTime);
  
          const totalDuration = attack + hold + decay + release;
          osc1.stop(currentTime + totalDuration);
          osc2.stop(currentTime + totalDuration);
        },
  
        cl: (context, destination) => {
          const osc1 = context.createOscillator();
          const osc2 = context.createOscillator();
          const mixer = context.createGain();
          const adsrGain = context.createGain();
          const eq1 = context.createBiquadFilter();
          const eq2 = context.createBiquadFilter();
  
          osc2.type = 'square';
          osc2.frequency.value = 2349.318;
  
          mixer.gain.value = 0.1;
  
          const currentTime = context.currentTime;
          const attack = 0.0005;
          const hold = 0.02;
          const decay = 0.002;
          const sustain = 0;
          const release = 0.005;
  
          adsrGain.gain.setValueAtTime(0, currentTime);
          adsrGain.gain.linearRampToValueAtTime(1, currentTime + attack);
          adsrGain.gain.setValueAtTime(1, currentTime + attack + hold);
          adsrGain.gain.linearRampToValueAtTime(sustain, currentTime + attack + hold + decay);
          adsrGain.gain.linearRampToValueAtTime(0, currentTime + attack + hold + decay + release);
  
          eq1.type = 'peaking';
          eq1.frequency.value = 2822;
          eq1.Q.value = 0.3;
          eq1.gain.value = 18;
  
          eq2.type = 'peaking';
          eq2.frequency.value = 532;
          eq2.Q.value = 0.4;
          eq2.gain.value = 15;
  
          osc2.connect(mixer);
          mixer.connect(adsrGain);
          adsrGain.connect(eq1);
          eq1.connect(eq2);
          eq2.connect(destination);
  
          osc2.start(currentTime);
  
          const totalDuration = attack + hold + decay + release;
          osc2.stop(currentTime + totalDuration);
        },
  
        cp: (context, destination) => {
          const noiseBuffer = this.createNoiseBuffer(0.15);
          const noise = context.createBufferSource();
          noise.buffer = noiseBuffer;
  
          const filter = context.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1000;
          filter.Q.value = 4;
  
          const vca1 = context.createGain();
          const vca2 = context.createGain();
  
          noise.connect(filter);
          filter.connect(vca1);
          filter.connect(vca2);
          vca1.connect(destination);
          vca2.connect(destination);
  
          const now = context.currentTime;
          const snapTimes = [
            [0, 0.01],
            [0.01, 0.01],
            [0.02, 0.01],
            [0.03, 0.02],
          ];
  
          snapTimes.forEach(([start, duration]) => {
            vca1.gain.setValueAtTime(1, now + start);
            vca1.gain.linearRampToValueAtTime(0.001, now + start + duration);
          });
  
          vca2.gain.setValueAtTime(1, now);
          vca2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  
          noise.start(now);
          noise.stop(now + 0.5);
        },
  
        ma: (context, destination) => {
          const noise = context.createBufferSource();
          const filter = context.createBiquadFilter();
          const gain = context.createGain();
  
          noise.buffer = this.createNoiseBuffer();
          filter.type = 'highpass';
          filter.frequency.value = 6500;
  
          gain.gain.setValueAtTime(0.05, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.5, context.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.05);
  
          noise.connect(filter).connect(gain).connect(destination);
          noise.start();
          noise.stop(context.currentTime + 0.08);
        },
  
        cb: (context, destination) => {
          const osc1 = context.createOscillator();
          const osc2 = context.createOscillator();
  
          osc1.type = 'square';
          osc2.type = 'square';
  
          osc1.frequency.value = 540;
          osc2.frequency.value = 800;
  
          const mixer = context.createGain();
          mixer.gain.value = 0.5;
  
          const filter = context.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1200;
          filter.Q.value = 4;
  
          const vca = context.createGain();
          vca.gain.setValueAtTime(0, context.currentTime);
  
          const attackTime = 0.005;
          const releaseTime = 0.25;
  
          vca.gain.linearRampToValueAtTime(1, context.currentTime + attackTime);
          vca.gain.exponentialRampToValueAtTime(0.001, context.currentTime + attackTime + releaseTime);
  
          osc1.connect(mixer);
          osc2.connect(mixer);
          mixer.connect(filter);
          filter.connect(vca);
          vca.connect(destination);
  
          osc1.start();
          osc2.start();
  
          const totalDuration = attackTime + releaseTime;
          osc1.stop(context.currentTime + totalDuration);
          osc2.stop(context.currentTime + totalDuration);
        },
  
        cy: (context, destination) => {
          const frequencies = [800, 540, 522.7, 369.6, 304.4, 205.3];
          const oscillators = frequencies.map((freq) => {
            const osc = context.createOscillator();
            osc.type = 'square';
            osc.frequency.value = freq;
            return osc;
          });
  
          const noise = context.createBufferSource();
          noise.buffer = this.createNoiseBuffer();
  
          const bandpassOne = context.createBiquadFilter();
          bandpassOne.type = 'bandpass';
          bandpassOne.frequency.value = 7100;
          bandpassOne.Q.value = 2;
  
          const bandpassTwo = context.createBiquadFilter();
          bandpassTwo.type = 'bandpass';
          bandpassTwo.frequency.value = 3440;
          bandpassTwo.Q.value = 2;
  
          oscillators.forEach((osc) => {
            osc.connect(bandpassOne);
            osc.connect(bandpassTwo);
          });
          noise.connect(bandpassOne);
          noise.connect(bandpassTwo);
  
          const vcaOne = context.createGain();
          vcaOne.gain.setValueAtTime(0, context.currentTime);
  
          const vcaTwo = context.createGain();
          vcaTwo.gain.setValueAtTime(0, context.currentTime);
  
          const highpassOne = context.createBiquadFilter();
          highpassOne.type = 'highpass';
          highpassOne.frequency.value = 6000;
  
          const highpassTwo = context.createBiquadFilter();
          highpassTwo.type = 'highpass';
          highpassTwo.frequency.value = 10000;
  
          bandpassOne.connect(vcaOne);
          vcaOne.connect(highpassOne);
  
          bandpassTwo.connect(vcaTwo);
          vcaTwo.connect(highpassTwo);
  
          const finalMixer = context.createGain();
          highpassOne.connect(finalMixer);
          highpassTwo.connect(finalMixer);
  
          finalMixer.connect(destination);
  
          const attackTime = 0.01;
          const decayTimeOne = 1.2;
          const decayTimeTwo = 1.2;
          const now = context.currentTime;
  
          vcaOne.gain.linearRampToValueAtTime(1, now + attackTime);
          vcaOne.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTimeOne);
  
          vcaTwo.gain.linearRampToValueAtTime(1, now + attackTime);
          vcaTwo.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTimeTwo);
  
          oscillators.forEach((osc) => osc.start());
          noise.start();
  
          const stopTime = now + attackTime + Math.max(decayTimeOne, decayTimeTwo) + 0.1;
          oscillators.forEach((osc) => osc.stop(stopTime));
          noise.stop(stopTime);
        },
  
        oh: (context, destination) => {
          const frequencies = [800, 540, 522.7, 369.6, 304.4, 205.3];
          const oscillators = frequencies.map((freq) => {
            const osc = context.createOscillator();
            osc.type = 'square';
            osc.frequency.value = freq;
            return osc;
          });
  
          const noise = context.createBufferSource();
          noise.buffer = this.createNoiseBuffer();
  
          const bandpass = context.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.value = 10000;
          bandpass.Q.value = 4;
  
          const highpass = context.createBiquadFilter();
          highpass.type = 'highpass';
          highpass.frequency.value = 8000;
  
          const mixer = context.createGain();
          mixer.gain.value = 0.2;
  
          const vca = context.createGain();
          vca.gain.setValueAtTime(0, context.currentTime);
  
          const decayTime = 0.6;
  
          vca.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
          vca.gain.exponentialRampToValueAtTime(0.001, context.currentTime + decayTime);
  
          oscillators.forEach((osc) => {
            osc.connect(bandpass);
            osc.connect(highpass);
          });
          noise.connect(bandpass);
          noise.connect(highpass);
  
          bandpass.connect(mixer);
          highpass.connect(mixer);
  
          mixer.connect(vca);
          vca.connect(destination);
  
          oscillators.forEach((osc) => osc.start());
          noise.start();
  
          oscillators.forEach((osc) => osc.stop(context.currentTime + decayTime));
          noise.stop(context.currentTime + decayTime);
        },
  
        ch: (context, destination) => {
          const frequencies = [800, 540, 522.7, 369.6, 304.4, 205.3];
          const oscillators = frequencies.map((freq) => {
            const osc = context.createOscillator();
            osc.type = 'square';
            osc.frequency.value = freq;
            return osc;
          });
  
          const noise = context.createBufferSource();
          noise.buffer = this.createNoiseBuffer();
  
          const bandpass = context.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.value = 10000;
          bandpass.Q.value = 4;
  
          const highpass = context.createBiquadFilter();
          highpass.type = 'highpass';
          highpass.frequency.value = 8000;
  
          const mixer = context.createGain();
          mixer.gain.value = 0.5;
  
          const vca = context.createGain();
          vca.gain.setValueAtTime(0, context.currentTime);
  
          const decayTime = 0.1;
  
          vca.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
          vca.gain.exponentialRampToValueAtTime(0.001, context.currentTime + decayTime);
  
          oscillators.forEach((osc) => {
            osc.connect(bandpass);
            osc.connect(highpass);
          });
          noise.connect(bandpass);
          noise.connect(highpass);
  
          bandpass.connect(mixer);
          highpass.connect(mixer);
  
          mixer.connect(vca);
          vca.connect(destination);
  
          oscillators.forEach((osc) => osc.start());
          noise.start();
  
          oscillators.forEach((osc) => osc.stop(context.currentTime + decayTime));
          noise.stop(context.currentTime + decayTime);
        },
      };
    }
  
    play(soundKey) {
      const sound = this.sounds[soundKey];
      if (!sound) return;
  
      const destination = this.gainNodes.get(soundKey);
      sound(this.context, destination);
    }
  
    setGain(soundKey, gainValue) {
      const gainNode = this.gainNodes.get(soundKey);
      if (gainNode) {
        gainNode.gain.setValueAtTime(gainValue, this.context.currentTime);
      }
    }
  }