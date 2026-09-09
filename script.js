const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Random burst glitch on the name — "chirk chk" then quiet
const heading = document.querySelector('.glitch');

function triggerGlitch() {
    heading.classList.add('glitch-active');

    const burstDuration = 150 + Math.random() * 200;
    setTimeout(() => heading.classList.remove('glitch-active'), burstDuration);

    const nextDelay = 2000 + Math.random() * 2000;
    setTimeout(triggerGlitch, nextDelay);
}

triggerGlitch();

// Highlight the nav link for whichever section is currently in view
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// Live GitHub repo fetch — pulls Utsav's repos fresh on every page load
const GITHUB_USERNAME = 'UnsoundUtsav';
const projectGrid = document.getElementById('project-grid');

async function loadRepos() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
        );

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const repos = await response.json();
        const ownRepos = repos.filter(repo => !repo.fork);

        if (ownRepos.length === 0) {
            projectGrid.innerHTML = '<p class="loading-text">NO REPOSITORIES FOUND.</p>';
            return;
        }

        projectGrid.innerHTML = '';

        ownRepos.forEach(repo => {
            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.className = 'project-card';

            const description = repo.description || 'No description provided.';
            const language = repo.language || 'Misc';

            card.innerHTML = `
                <div class="project-top">
                    <span class="project-name">${repo.name}</span>
                    <span class="project-lang">${language}</span>
                </div>
                <p class="project-desc">${description}</p>
                <span class="project-link">VIEW REPO →</span>
            `;

            projectGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to fetch GitHub repos:', error);
        projectGrid.innerHTML = '<p class="loading-text">COULD NOT LOAD REPOSITORIES. CHECK CONNECTION.</p>';
    }
}

loadRepos();

// ============================================
// BACKGROUND NETWORK CANVAS
// Draws floating dots that connect with faint lines
// whenever they drift close to one another — classic
// "hacker network" background effect.
// ============================================
const canvas = document.getElementById('network-bg');
const ctx = canvas.getContext('2d');

let nodes = [];
const NODE_COUNT = 60;
const CONNECT_DISTANCE = 130;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, // slow drift, both directions
            vy: (Math.random() - 0.5) * 0.3
        });
    }
}
createNodes();

function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // move + draw each node
    nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // bounce off edges instead of drifting off-screen
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(46, 255, 122, 0.6)';
        ctx.fill();
    });

    // connect nearby nodes with a line whose opacity fades with distance
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECT_DISTANCE) {
                const opacity = 1 - distance / CONNECT_DISTANCE;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(46, 255, 122, ${opacity * 0.25})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(drawNetwork);
}
drawNetwork();

// ============================================
// RANDOM FULL-SCREEN GLITCH FLASH
// Briefly overlays scanline distortion + a screen
// shake across the entire page, then clears —
// separate from the name glitch, on its own random timer.
// ============================================
const screenGlitch = document.getElementById('screen-glitch');

function triggerScreenGlitch() {
    screenGlitch.classList.add('flash-active');

    const flashDuration = 100 + Math.random() * 150;
    setTimeout(() => screenGlitch.classList.remove('flash-active'), flashDuration);

    const nextDelay = 4000 + Math.random() * 5000; // 4-9 sec between flashes
    setTimeout(triggerScreenGlitch, nextDelay);
}

setTimeout(triggerScreenGlitch, 3000); // first flash after 3s, so it's not instant on load