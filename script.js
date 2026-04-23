/* ============================================
   WEDDING INVITATION — JavaScript
   Абылай & Наркес — Tilda-style
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyc3wgq1r9Dq7W2PmoH5AnHtVCui_lbOD6djSENmVzBGkwT_LcA9ZVJVL4rbdHxOarL/exec';

    // ===========================
    // 1. SCROLL ANIMATIONS
    // ===========================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                const idx = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('visible'), idx * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ===========================
    // 2. COUNTDOWN TIMER
    // ===========================
    const weddingDate = new Date('2026-08-15T17:00:00+06:00');

    function updateCountdown() {
        const diff = weddingDate - new Date();
        if (diff <= 0) {
            ['days','hours','minutes','seconds'].forEach(id => {
                document.getElementById(id).textContent = '0';
            });
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        animateNum('days', d.toString());
        animateNum('hours', h.toString());
        animateNum('minutes', m.toString());
        animateNum('seconds', s.toString());
    }

    function animateNum(id, val) {
        const el = document.getElementById(id);
        if (el && el.textContent !== val) {
            el.style.transform = 'translateY(-3px)';
            el.style.opacity = '0.4';
            setTimeout(() => {
                el.textContent = val;
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
            }, 120);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===========================
    // 3. MUSIC TOGGLE (play/pause button)
    // ===========================
    const musicBtn = document.getElementById('music-toggle');
    const playIcon = document.getElementById('music-icon-play');
    const pauseIcon = document.getElementById('music-icon-pause');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (!bgMusic) return;
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        } else {
            bgMusic.play().then(() => {
                isPlaying = true;
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            }).catch(e => console.log('Audio blocked:', e));
        }
    });

    // ===========================
    // 4. RSVP FORM
    // ===========================
    const form = document.getElementById('rsvp-form');
    const successDiv = document.getElementById('rsvp-success');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        submitBtn.disabled = true;

        const fd = new FormData(form);
        const data = {
            name: fd.get('name'),
            attendance: fd.get('attendance'),
            wishes: '',
            timestamp: new Date().toLocaleString('kk-KZ', {
                timeZone: 'Asia/Almaty',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            })
        };

        try {
            if (GOOGLE_SCRIPT_URL) {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(data)
                });
            }
            form.classList.add('hidden');
            successDiv.classList.remove('hidden');
        } catch (err) {
            form.classList.add('hidden');
            successDiv.classList.remove('hidden');
        }
    });

    // ===========================
    // 5. HAPTIC
    // ===========================
    document.querySelectorAll('button, .radio-label, .gis-btn').forEach(el => {
        el.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });

});
