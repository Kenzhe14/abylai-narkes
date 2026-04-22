/* ============================================
   WEDDING INVITATION — JavaScript
   Абылай & Наркес
   With Google Sheets Integration
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // CONFIG: Google Sheets
    // ===========================
    // ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
    // 1. Создайте Google Таблицу
    // 2. Откройте Extensions > Apps Script
    // 3. Вставьте код из файла google-apps-script.js
    // 4. Deploy > New deployment > Web app > Anyone
    // 5. Скопируйте URL и вставьте сюда:
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyc3wgq1r9Dq7W2PmoH5AnHtVCui_lbOD6djSENmVzBGkwT_LcA9ZVJVL4rbdHxOarL/exec'; // <-- ВСТАВЬТЕ СЮДА URL ВАШЕГО GOOGLE APPS SCRIPT

    // ===========================
    // 1. SCROLL ANIMATIONS
    // ===========================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                const siblingIndex = Array.from(siblings).indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, siblingIndex * 150);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ===========================
    // 2. COUNTDOWN TIMER
    // ===========================
    const weddingDate = new Date('2026-08-15T17:00:00+06:00');

    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        animateNumber('days', days.toString());
        animateNumber('hours', hours.toString().padStart(2, '0'));
        animateNumber('minutes', minutes.toString().padStart(2, '0'));
        animateNumber('seconds', seconds.toString().padStart(2, '0'));
    }

    function animateNumber(id, newValue) {
        const el = document.getElementById(id);
        if (el && el.textContent !== newValue) {
            el.style.transform = 'translateY(-4px)';
            el.style.opacity = '0.5';
            setTimeout(() => {
                el.textContent = newValue;
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
            }, 150);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===========================
    // 3. FLOATING PETALS
    // ===========================
    const petalsContainer = document.getElementById('petals-container');
    const petalColors = [
        'rgba(92, 107, 82, 0.15)',
        'rgba(122, 140, 110, 0.12)',
        'rgba(184, 151, 106, 0.10)',
        'rgba(92, 107, 82, 0.10)',
    ];

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const size = Math.random() * 10 + 6;
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 10;
        const delay = Math.random() * 5;
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];

        petal.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            background: ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            border-radius: ${Math.random() > 0.5 ? '50% 0 50% 50%' : '50% 50% 0 50%'};
        `;

        petalsContainer.appendChild(petal);

        setTimeout(() => {
            if (petal.parentNode) petal.remove();
        }, (duration + delay) * 1000);
    }

    // Create initial petals
    for (let i = 0; i < 6; i++) {
        setTimeout(() => createPetal(), i * 800);
    }

    // Continue creating petals
    setInterval(() => {
        if (petalsContainer.children.length < 12) createPetal();
    }, 2500);

    // ===========================
    // 4. RSVP FORM + GOOGLE SHEETS
    // ===========================
    const form = document.getElementById('rsvp-form');
    const successDiv = document.getElementById('rsvp-success');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            attendance: formData.get('attendance'),
            wishes: formData.get('wishes') || '',
            timestamp: new Date().toLocaleString('kk-KZ', {
                timeZone: 'Asia/Almaty',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            })
        };

        try {
            if (GOOGLE_SCRIPT_URL) {
                // Send to Google Sheets
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify(data)
                });
            } else {
                // Demo mode: just log the data
                console.log('📋 RSVP Data (demo mode — Google Sheets URL not configured):', data);
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Show success
            form.classList.add('hidden');
            successDiv.classList.remove('hidden');
            createCelebrationEffect();

        } catch (error) {
            console.error('Error sending RSVP:', error);
            // Still show success since no-cors won't return response
            form.classList.add('hidden');
            successDiv.classList.remove('hidden');
            createCelebrationEffect();
        }
    });

    function createCelebrationEffect() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => createPetal(), i * 100);
        }
    }

    // ===========================
    // 5. MUSIC TOGGLE
    // ===========================
    const musicBtn = document.getElementById('music-toggle');
    const iconOn = document.getElementById('music-icon-on');
    const iconOff = document.getElementById('music-icon-off');
    const bgMusic = document.getElementById('bg-music');
    let isMusicPlaying = false;

    // Start with music off icon showing
    iconOn.classList.add('hidden');
    iconOff.classList.remove('hidden');

    musicBtn.addEventListener('click', () => {
        if (!bgMusic) return;

        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            iconOn.classList.add('hidden');
            iconOff.classList.remove('hidden');
            musicBtn.style.borderColor = 'rgba(92, 107, 82, 0.25)';
        } else {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                iconOff.classList.add('hidden');
                iconOn.classList.remove('hidden');
                musicBtn.style.borderColor = 'var(--accent)';
            }).catch(err => {
                console.log('Audio play blocked by browser:', err);
            });
        }
    });

    // ===========================
    // 7. HAPTIC FEEDBACK (mobile)
    // ===========================
    document.querySelectorAll('button, .radio-label, .venue-map-btn').forEach(el => {
        el.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });

});
