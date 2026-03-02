// ===========================================
// Portfolio Script
// ===========================================

document.addEventListener('DOMContentLoaded', () => {

	// --- Dynamic Year ---
	const yearSpan = document.getElementById('current-year');
	if (yearSpan) {
		yearSpan.textContent = new Date().getFullYear();
	}

	// --- Mobile Menu Toggle ---
	const menuToggle = document.querySelector('.menu-toggle');
	const navLinks = document.querySelector('.nav-links');
	const navOverlay = document.querySelector('.nav-overlay');

	if (menuToggle && navLinks) {
		menuToggle.addEventListener('click', () => {
			menuToggle.classList.toggle('open');
			navLinks.classList.toggle('open');
			if (navOverlay) {
				navOverlay.classList.toggle('visible');
			}
			document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
		});

		// Close menu when clicking a link
		navLinks.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				menuToggle.classList.remove('open');
				navLinks.classList.remove('open');
				if (navOverlay) {
					navOverlay.classList.remove('visible');
				}
				document.body.style.overflow = '';
			});
		});

		// Close menu when clicking overlay
		if (navOverlay) {
			navOverlay.addEventListener('click', () => {
				menuToggle.classList.remove('open');
				navLinks.classList.remove('open');
				navOverlay.classList.remove('visible');
				document.body.style.overflow = '';
			});
		}
	}

	// --- Scroll Reveal (Intersection Observer) ---
	const revealElements = document.querySelectorAll('.fade-in-up');

	if (revealElements.length > 0 && 'IntersectionObserver' in window) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.1,
			rootMargin: '0px 0px -40px 0px'
		});

		revealElements.forEach(el => observer.observe(el));
	}
});
