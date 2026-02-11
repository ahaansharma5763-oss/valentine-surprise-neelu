document.addEventListener('DOMContentLoaded', () => {
    // --- Audio Control ---
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isPlaying = false;

    // Try to play audio on first user interaction (browser policy)
    function enableAudio() {
        if (!isPlaying) {
            music.play().then(() => {
                isPlaying = true;
                musicToggle.textContent = '🎵'; // Playing icon
            }).catch(e => {
                console.log("Audio autoplay prevented", e);
            });
        }
        document.removeEventListener('click', enableAudio);
    }
    document.addEventListener('click', enableAudio, { once: true });

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            musicToggle.textContent = '🔇'; // Muted icon
            isPlaying = false;
        } else {
            music.play();
            musicToggle.textContent = '🎵';
            isPlaying = true;
        }
    });

    // --- Stage Management ---
    window.nextStage = function (currentStageId, nextStageId) {
        const current = document.getElementById(currentStageId);
        const next = document.getElementById(nextStageId);

        // Fade out current
        current.style.opacity = '0';

        setTimeout(() => {
            current.classList.add('hidden');
            current.classList.remove('active');

            // Show next
            next.classList.remove('hidden');
            // Force reflow
            void next.offsetWidth;

            next.classList.add('active');
            next.style.opacity = '1';

            // Trigger stage specific initializers
            if (nextStageId === 'stage-2') {
                if (window.startGame) window.startGame();
            }
            if (nextStageId === 'stage-3') {
                if (window.startTypewriter) window.startTypewriter();
            }

        }, 1000); // 1s transition matching CSS
    };

    // --- Stage 3: Typewriter & Confetti ---
    const letterText = "To my favorite person,\n\nFrom the moment we met, every day has been an adventure. You make my world brighter, my heart lighter, and my smile wider.\n\nThank you for 18 amazing months. Here's to a lifetime more.\n\nI love you. 💗";
    const speed = 50;
    let i = 0;

    window.startTypewriter = function () {
        const target = document.getElementById('typewriter-text');
        target.innerHTML = "";
        i = 0;
        type();
    };

    function type() {
        if (i < letterText.length) {
            const char = letterText.charAt(i);
            const target = document.getElementById('typewriter-text');

            if (char === '\n') {
                target.innerHTML += '<br>';
            } else {
                target.innerHTML += char;
            }
            i++;
            setTimeout(type, speed);
        }
    }

    // Final Button Logic
    const finalBtn = document.getElementById('final-btn');
    const finalMessage = document.getElementById('final-message');

    finalBtn.addEventListener('click', () => {
        // Trigger Consfetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // multiple origins
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // Show Final Message
        finalBtn.style.display = 'none';
        finalMessage.classList.remove('hidden');

        // Intensify music? (Optional, requires volume control logic which is restricted on some mobile browsers without user interaction, 
        // but we can try to reset volume to 1.0 if it was lower)
        const music = document.getElementById('bg-music');
        if (music) music.volume = 1.0;

        // Launch more confetti
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });
    });

});
