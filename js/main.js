document.addEventListener('DOMContentLoaded', () => {
    // =====================
    // CUSTOM CURSOR
    // =====================
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
    });

    // Ring follows with lag
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .benefit-card, .pricing-card, .social-icons a, .hamburger');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });

    // =====================
    // INTRO SCREEN — PARTICLE CANVAS
    // =====================
    const introScreen = document.getElementById('intro-screen');
    const canvas = document.getElementById('intro-canvas');

    if (introScreen && canvas) {
        document.body.style.overflow = 'hidden';
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle system
        const PARTICLE_COUNT = 100;
        const particles = [];
        const PRIMARY_COLOR = '16, 185, 129';

        function randomBetween(a, b) { return a + Math.random() * (b - a); }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: randomBetween(0, window.innerWidth),
                y: randomBetween(0, window.innerHeight),
                r: randomBetween(0.5, 2.5),
                vx: randomBetween(-0.4, 0.4),
                vy: randomBetween(-0.8, -0.2),
                alpha: randomBetween(0.1, 0.6),
                alphaSpeed: randomBetween(0.003, 0.008),
                alphaDir: 1
            });
        }

        let animFrameId;
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // subtle radial glow at center
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.55);
            grad.addColorStop(0,   `rgba(${PRIMARY_COLOR}, 0.06)`);
            grad.addColorStop(1,   `rgba(${PRIMARY_COLOR}, 0)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                // drift
                p.x += p.vx;
                p.y += p.vy;

                // wrap
                if (p.y < -5)             p.y = canvas.height + 5;
                if (p.x < -5)             p.x = canvas.width  + 5;
                if (p.x > canvas.width+5) p.x = -5;

                // breathe alpha
                p.alpha += p.alphaSpeed * p.alphaDir;
                if (p.alpha > 0.65 || p.alpha < 0.05) p.alphaDir *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${PRIMARY_COLOR}, ${p.alpha})`;
                ctx.fill();
            });

            animFrameId = requestAnimationFrame(drawParticles);
        }

        drawParticles();

        // ---- Curtain Exit ----
        // After 2.6s: curtains close (slam), then screen collapses
        setTimeout(() => {
            // Phase 1: curtains slide in (close)
            introScreen.classList.add('exit-curtain');

            setTimeout(() => {
                // Phase 2: collapse entire intro
                cancelAnimationFrame(animFrameId);
                introScreen.classList.remove('exit-curtain');
                introScreen.classList.add('exit-collapse');
                document.body.style.overflow = '';

                setTimeout(() => {
                    introScreen.remove();
                    // Trigger hero animations after intro gone
                    triggerHeroAnimations();
                }, 650);
            }, 800);
        }, 2800);
    }

    // =====================
    // HERO — trigger after intro
    // =====================
    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero .animate-up');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('active');
            }, i * 130);
        });

        const navItems = document.querySelectorAll('.nav-item-anim');
        navItems.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('active');
            }, 300 + (i * 100)); // Sutil cascada en el menú
        });

        spawnHeroParticles();
    }

    // Floating particles in hero
    function spawnHeroParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'hero-particle';
                const size = Math.random() * 4 + 1.5;
                const left = Math.random() * 100;
                const dur  = (Math.random() * 8 + 5).toFixed(1);
                const delay = (Math.random() * 6).toFixed(1);
                const op  = (Math.random() * 0.35 + 0.1).toFixed(2);
                p.style.cssText = `
                    left:${left}%;
                    bottom:-10px;
                    width:${size}px;
                    height:${size}px;
                    --dur:${dur}s;
                    --delay:${delay}s;
                    --op:${op};
                `;
                container.appendChild(p);
            }, i * 150);
        }
    }

    // =====================
    // NAVBAR SCROLL EFFECT
    // =====================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // =====================
    // MOBILE MENU
    // =====================
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // =====================
    // SCROLL REVEAL
    // =====================
    // Prepare stat items
    document.querySelectorAll('.stat-item').forEach((el, index) => {
        el.classList.add('reveal', `delay-${index % 3}`);
    });

    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // =====================
    // STAT COUNTERS
    // =====================
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
                const numbers = document.querySelectorAll('.stat-number');
                numbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    const duration = 2000;
                    const steps = 60;
                    const increment = target / steps;
                    let current = 0;
                    let step = 0;

                    const timer = setInterval(() => {
                        step++;
                        // Ease-out: slower near the end
                        const progress = step / steps;
                        const eased = 1 - Math.pow(1 - progress, 3);
                        current = Math.round(target * eased);

                        num.innerHTML = current.toLocaleString() + '+';

                        if (step >= steps) {
                            num.innerHTML = target.toLocaleString() + '+';
                            clearInterval(timer);
                        }
                    }, duration / steps);
                });
                // Add underline animation to stat items
                document.querySelectorAll('.stat-item').forEach(el => el.classList.add('active'));
                obs.unobserve(statsSection);
            }
        }, { threshold: 0.4 });
        statsObserver.observe(statsSection);
    }

    // =====================
    // MAGNETIC BUTTONS
    // =====================
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width  / 2;
            const y = e.clientY - rect.top  - rect.height / 2;
            btn.style.transform = `translateY(-3px) translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // =====================
    // SMOOTH SCROLL
    // =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                const offset = target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });
});
