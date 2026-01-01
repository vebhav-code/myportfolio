/* 
   ADVANCED CYBER PORTFOLIO LOGIC
   - Particle Background (Canvas)
   - Typed Text Animation
   - Intersection Observer (Scroll Reveal)
   - Terminal Logic & Skill Bars
*/

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTyping();
    initScrollReveal();
    initSkillBars();
    initClock();
    initLogs();
    // Three.js globe remains compatible
    if (typeof initHeroVisuals === 'function') initHeroVisuals();
});

/* 1. PARTICLE BACKGROUND */
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const count = 60;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(34, 243, 193, 0.2)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < count; i++) particles.push(new Particle());
    animate();
}

/* 2. TYPED TEXT ANIMATION */
function initTyping() {
    const target = document.getElementById('typing-text');
    if (!target) return;

    const phrases = [
        "SOC Operations",
        "Incident Response",
        "SIEM & SOAR",
        "Threat Intelligence",
        "Python Automation"
    ];

    let pIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[pIdx];
        if (isDeleting) {
            target.textContent = current.substring(0, charIdx--);
        } else {
            target.textContent = current.substring(0, charIdx++);
        }

        let speed = isDeleting ? 40 : 80;
        if (!isDeleting && charIdx === current.length + 1) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            pIdx = (pIdx + 1) % phrases.length;
            speed = 500;
        }

        target.classList.add('typing-cursor');
        setTimeout(type, speed);
    }
    type();
}

/* 3. SCROLL REVEAL (Intersection Observer) */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* 4. ANIMATED SKILL BARS */
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target.querySelector('.skill-bar-fill');
                if (bar) {
                    const val = bar.getAttribute('data-level');
                    bar.style.width = val + '%';
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-bar-wrapper').forEach(el => observer.observe(el));
}

/* 5. THREE.JS 3D CYBER GLOBE & HUD */
function initHeroVisuals() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Globe with Lat/Lon Lines
    const globeRadius = 150;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({
        color: 0x22f3c1,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    mainGroup.add(globe);

    // Dotted Point Cloud
    const pointsGeometry = new THREE.SphereGeometry(globeRadius + 2, 64, 64);
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x22f3c1,
        size: 1.5,
        transparent: true,
        opacity: 0.2
    });
    const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
    mainGroup.add(globePoints);

    // 2. HUD Elements (Reticles, Brackets, Ticks)
    function createHUD() {
        const hudGroup = new THREE.Group();

        // Main Reticle Rings
        const ring1 = new THREE.Mesh(
            new THREE.RingGeometry(180, 181, 64),
            new THREE.MeshBasicMaterial({ color: 0x22f3c1, transparent: true, opacity: 0.15, side: THREE.DoubleSide })
        );
        ring1.rotation.x = Math.PI / 2.2;
        hudGroup.add(ring1);

        const ring2 = new THREE.Mesh(
            new THREE.RingGeometry(220, 220.5, 32),
            new THREE.MeshBasicMaterial({ color: 0x22f3c1, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
        );
        ring2.rotation.y = Math.PI / 4;
        hudGroup.add(ring2);

        // Brackets / Ticks
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const bracket = new THREE.Mesh(
                new THREE.BoxGeometry(20, 1, 1),
                new THREE.MeshBasicMaterial({ color: 0x22f3c1, transparent: true, opacity: 0.4 })
            );
            bracket.position.x = Math.cos(angle) * 200;
            bracket.position.y = Math.sin(angle) * 200;
            bracket.rotation.z = angle + Math.PI / 2;
            hudGroup.add(bracket);
        }

        return hudGroup;
    }
    const hudElements = createHUD();
    mainGroup.add(hudElements);

    // 3. Threat Nodes (Pulsing)
    const nodesGroup = new THREE.Group();
    mainGroup.add(nodesGroup);
    for (let i = 0; i < 6; i++) {
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        const node = new THREE.Mesh(
            new THREE.SphereGeometry(4, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0.8 })
        );
        node.position.setFromSphericalCoords(globeRadius + 5, phi, theta);
        nodesGroup.add(node);
    }

    camera.position.z = 400;

    // Interactions
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.04;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.04;
    });

    // Scroll Opacity
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const opacity = Math.max(0.1, 0.5 - scrolled / 800);
        container.style.opacity = opacity;
    });

    let isActive = true;
    function animate() {
        if (!isActive) return;
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Slow Rotations
        globe.rotation.y += 0.0015;
        globePoints.rotation.y += 0.0015;
        hudElements.rotation.z += 0.001;

        // Node Pulsing
        nodesGroup.children.forEach((node, i) => {
            node.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.4);
            node.material.opacity = 0.4 + Math.sin(time * 3 + i) * 0.4;
        });

        // Global Slow Pulse (HUD)
        const globalPulse = 0.8 + Math.sin(time * 0.5) * 0.2;
        hudElements.scale.setScalar(globalPulse);

        // Smooth Mouse Parallax
        mainGroup.rotation.y += (mouseX * 0.0001 - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (mouseY * 0.0001 - mainGroup.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }

    document.addEventListener('visibilitychange', () => {
        isActive = (document.visibilityState === 'visible');
        if (isActive) animate();
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
}

/* 6. SOC LOGS & CLOCK */
function initClock() {
    const socTimeEl = document.getElementById("soc-time");
    if (!socTimeEl) return;
    setInterval(() => {
        socTimeEl.textContent = new Date().toLocaleTimeString();
    }, 1000);
}

function initLogs() {
    const logFeed = document.getElementById("log-feed");
    if (!logFeed) return;

    const events = [
        { msg: "Wazuh Alert: Successful login", sev: "low" },
        { msg: "Suspicious IP blocked: 185.143.21.77", sev: "high" },
        { msg: "Brute-force attempt detected", sev: "high" },
        { msg: "Malware hash matched (Threat Intel)", sev: "critical" }
    ];

    setInterval(() => {
        const event = events[Math.floor(Math.random() * events.length)];
        const entry = document.createElement("div");
        entry.style.cssText = "color: #22f3c1; margin-bottom: 5px; font-family: monospace; font-size: 0.85rem;";
        entry.innerHTML = `[${new Date().toLocaleTimeString()}] <span class="${event.sev === 'high' ? 'text-red-400' : ''}">${event.msg}</span>`;
        logFeed.prepend(entry);
        if (logFeed.childNodes.length > 10) logFeed.removeChild(logFeed.lastChild);
    }, 2500);
}
