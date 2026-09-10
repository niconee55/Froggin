import { AudioLoader, Audio, AudioListener } from 'three';

import music from './sounds/music.mp3';
import jump from './sounds/jump.wav';
import land from './sounds/land.wav';
import death from './sounds/death.wav';
import lick from './sounds/lick.mp3';
import gulp from './sounds/gulp.wav';

export const Sounds = {
    music,
    jump,
    land,
    death,
    lick,
    gulp,
};

const listener = new AudioListener();
const audioLoader = new AudioLoader();
const buffers = new Map();
const activeSounds = new Set();

let backgroundMusic = null;

function loadBuffer(url, onLoad) {
    if (buffers.has(url)) {
        onLoad(buffers.get(url));
        return;
    }

    audioLoader.load(url, (buffer) => {
        buffers.set(url, buffer);
        onLoad(buffer);
    });
}

export function playSound(url, { loop = false, volume = 1 } = {}) {
    const sound = new Audio(listener);
    activeSounds.add(sound);

    loadBuffer(url, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(loop);
        sound.setVolume(volume);
        sound.play();

        if (sound.source) {
            sound.source.onended = () => activeSounds.delete(sound);
        }
    });

    return sound;
}

export function playBackgroundMusic() {
    if (backgroundMusic && backgroundMusic.isPlaying) {
        return;
    }

    backgroundMusic = playSound(Sounds.music, { loop: true, volume: 0.2 });
}
