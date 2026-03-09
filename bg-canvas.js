// ===========================================
// Cosmic Hex Network — Animated Background
// ===========================================
(function () {
	'use strict';

	const canvas = document.createElement('canvas');
	canvas.id = 'bg-canvas';
	document.body.prepend(canvas);
	const ctx = canvas.getContext('2d');

	let width, height;
	let stars = [];
	let hexagons = [];
	let animationId;
	let mouseX = -1000;
	let mouseY = -1000;
	let lastWidth = 0;
	let resizeTimer = null;
	let scrollY = 0;

	// --- Scroll tracking for parallax ---
	window.addEventListener('scroll', () => {
		scrollY = window.pageYOffset || document.documentElement.scrollTop;
	}, { passive: true });

	// --- Resize to viewport ---
	function resize() {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
	}
	window.addEventListener('resize', () => {
		const newWidth = window.innerWidth;
		// Always update canvas dimensions so it renders correctly
		resize();
		// Only regenerate elements when the width actually changes.
		// Mobile browsers fire resize when the address bar hides/shows
		// on scroll, which only changes height — ignore those.
		if (newWidth !== lastWidth) {
			lastWidth = newWidth;
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				initStars();
				initHexagons();
			}, 150);
		}
	});

	// --- Mouse tracking ---
	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});
	document.addEventListener('mouseleave', () => {
		mouseX = -1000;
		mouseY = -1000;
	});

	// ============================
	// STARS
	// ============================
	const STAR_PARALLAX = 0.05;  // stars drift very slightly

	function createStar() {
		return {
			x: Math.random() * width,
			y: Math.random() * height,
			size: 0.4 + Math.random() * 1.2,
			baseOpacity: 0.08 + Math.random() * 0.2,
			twinkleOffset: Math.random() * Math.PI * 2,
			twinkleSpeed: 0.003 + Math.random() * 0.006,
			drift: (Math.random() - 0.5) * 0.08,
		};
	}

	function initStars() {
		stars = [];
		const count = Math.max(Math.floor((width * height) / 22000), 25);
		for (let i = 0; i < count; i++) {
			stars.push(createStar());
		}
	}

	function drawStars(time) {
		const starOffsetY = scrollY * STAR_PARALLAX;
		for (const star of stars) {
			const twinkle = 0.3 + 0.7 * ((Math.sin(time * star.twinkleSpeed + star.twinkleOffset) + 1) / 2);
			const opacity = star.baseOpacity * twinkle;

			star.x += star.drift;
			if (star.x < -5) star.x = width + 5;
			if (star.x > width + 5) star.x = -5;

			// Apply parallax offset — wrap vertically so stars cycle
			let drawY = ((star.y - starOffsetY) % height + height) % height;

			ctx.beginPath();
			ctx.arc(star.x, drawY, star.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(200, 205, 255, ${opacity})`;
			ctx.fill();
		}
	}

	// ============================
	// HEXAGONS
	// ============================
	// Color palette: indigo + amber honeycomb
	const HEX_COLORS = [
		{ r: 99, g: 102, b: 241 },  // indigo
		{ r: 99, g: 102, b: 241 },  // indigo
		{ r: 130, g: 120, b: 230 }, // soft violet
		{ r: 220, g: 170, b: 50 },  // amber/gold
		{ r: 200, g: 150, b: 40 },  // deep gold
	];

	function createHexagon() {
		const color = HEX_COLORS[Math.floor(Math.random() * HEX_COLORS.length)];
		return {
			x: Math.random() * width,
			y: Math.random() * height,
			size: 20 + Math.random() * 50,
			rotation: Math.random() * Math.PI,
			rotationSpeed: (Math.random() - 0.5) * 0.004,
			vx: (Math.random() - 0.5) * 0.4,
			vy: (Math.random() - 0.5) * 0.25,
			baseOpacity: 0.06 + Math.random() * 0.1,
			pulseOffset: Math.random() * Math.PI * 2,
			pulseSpeed: 0.002 + Math.random() * 0.004,
			color,
			depth: 0.1 + Math.random() * 0.25, // parallax depth per hexagon
		};
	}

	function initHexagons() {
		hexagons = [];
		const count = Math.max(Math.floor((width * height) / 50000), 8);
		for (let i = 0; i < count; i++) {
			hexagons.push(createHexagon());
		}
	}

	function drawHex(x, y, size, rotation) {
		ctx.beginPath();
		for (let i = 0; i < 6; i++) {
			const angle = rotation + (Math.PI / 3) * i;
			const px = x + size * Math.cos(angle);
			const py = y + size * Math.sin(angle);
			if (i === 0) ctx.moveTo(px, py);
			else ctx.lineTo(px, py);
		}
		ctx.closePath();
	}

	function drawHexagons(time) {
		for (const hex of hexagons) {
			hex.x += hex.vx;
			hex.y += hex.vy;
			hex.rotation += hex.rotationSpeed;

			const m = hex.size + 10;
			if (hex.x < -m) hex.x = width + m;
			if (hex.x > width + m) hex.x = -m;
			if (hex.y < -m) hex.y = height + m;
			if (hex.y > height + m) hex.y = -m;

			// Parallax offset — each hex drifts at its own depth rate
			const drawY = ((hex.y - scrollY * hex.depth) % height + height) % height;

			const pulse = 0.5 + 0.5 * Math.sin(time * hex.pulseSpeed + hex.pulseOffset);
			let opacity = hex.baseOpacity * (0.6 + 0.4 * pulse);

			const dx = hex.x - mouseX;
			const dy = drawY - mouseY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const mouseInfluence = dist < 250 ? (1 - dist / 250) : 0;
			opacity += mouseInfluence * 0.25;

			// Cluster glow: more connections = brighter hex
			const clusterBoost = Math.min(hex.connections || 0, 5) * 0.06;
			opacity += clusterBoost;

			opacity = Math.min(opacity, 0.45);

			const { r, g, b } = hex.color;

			// Store the draw position for connections to use
			hex.drawX = hex.x;
			hex.drawY = drawY;

			drawHex(hex.x, drawY, hex.size, hex.rotation);
			ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
			ctx.lineWidth = 1.2;
			ctx.stroke();

			if (mouseInfluence > 0.1) {
				drawHex(hex.x, drawY, hex.size * 0.85, hex.rotation);
				ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${mouseInfluence * 0.12})`;
				ctx.lineWidth = 0.6;
				ctx.stroke();

				drawHex(hex.x, drawY, hex.size, hex.rotation);
				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${mouseInfluence * 0.04})`;
				ctx.fill();
			}
		}
	}

	// ============================
	// CONNECTIONS + CLUSTER GLOW
	// ============================
	function drawConnections() {
		const maxDist = 140;

		// Use parallax-offset positions for distance checks
		const connectionCount = new Array(hexagons.length).fill(0);
		const pairs = [];

		for (let i = 0; i < hexagons.length; i++) {
			const aY = ((hexagons[i].y - scrollY * hexagons[i].depth) % height + height) % height;
			for (let j = i + 1; j < hexagons.length; j++) {
				const bY = ((hexagons[j].y - scrollY * hexagons[j].depth) % height + height) % height;
				const dx = hexagons[i].x - hexagons[j].x;
				const dy = aY - bY;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < maxDist) {
					connectionCount[i]++;
					connectionCount[j]++;
					pairs.push({ i, j, dist, aY, bY });
				}
			}
		}

		// Store connection count on each hex for glow boost
		for (let i = 0; i < hexagons.length; i++) {
			hexagons[i].connections = connectionCount[i];
		}

		// Draw lines using parallax positions
		for (const pair of pairs) {
			const a = hexagons[pair.i];
			const b = hexagons[pair.j];
			const clusterStrength = Math.min(connectionCount[pair.i] + connectionCount[pair.j], 8) / 8;
			const baseOpacity = 0.15 + clusterStrength * 0.35;
			const opacity = baseOpacity * (1 - pair.dist / maxDist);

			const mr = Math.round((a.color.r + b.color.r) / 2);
			const mg = Math.round((a.color.g + b.color.g) / 2);
			const mb = Math.round((a.color.b + b.color.b) / 2);
			ctx.beginPath();
			ctx.moveTo(a.x, pair.aY);
			ctx.lineTo(b.x, pair.bY);
			ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${opacity})`;
			ctx.lineWidth = 0.5 + clusterStrength * 0.6;
			ctx.stroke();
		}
	}

	// ============================
	// ANIMATION LOOP
	// ============================
	function animate(timestamp) {
		ctx.clearRect(0, 0, width, height);
		drawStars(timestamp);
		drawConnections();
		drawHexagons(timestamp);
		animationId = requestAnimationFrame(animate);
	}

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			cancelAnimationFrame(animationId);
		} else {
			animationId = requestAnimationFrame(animate);
		}
	});

	// --- Init ---
	resize();
	lastWidth = window.innerWidth;
	initStars();
	initHexagons();
	animationId = requestAnimationFrame(animate);
})();
