/* ═══════════════════════════════════════════
   🎂  Birthday Card — JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. 漂浮愛心 ── */
  const heartsContainer = document.querySelector('.floating-hearts');
  const heartEmojis = ['💖', '💗', '💕', '🌸', '🩷', '✨', '🎀', '🌷'];

  function createHeart() {
    const heart = document.createElement('span');
    heart.classList.add('heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
    heart.style.animationDelay = (Math.random() * 4) + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 14000);
  }

  for (let i = 0; i < 15; i++) createHeart();
  setInterval(createHeart, 800);

  /* ── 2. 點擊「打開卡片」── */
  const enterBtn = document.getElementById('enter-btn');
  const cover    = document.getElementById('cover');
  const mainEl   = document.getElementById('main-content');

  enterBtn.addEventListener('click', () => {
    launchConfetti();
    cover.style.transition = 'opacity .8s ease, transform .8s ease';
    cover.style.opacity    = '0';
    cover.style.transform  = 'scale(1.05)';
    setTimeout(() => {
      cover.style.display = 'none';
      mainEl.classList.remove('hidden-main');
      mainEl.classList.add('show-main');
      checkReveal();
    }, 800);
  });

  /* ── 3. Scroll Reveal ── */
  function checkReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowH = window.innerHeight;
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < windowH - 80) el.classList.add('visible');
    });
  }
  window.addEventListener('scroll', checkReveal, { passive: true });

  /* ── 4. Confetti（紙花）── */
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  let confettiPieces = [];
  let animating      = false;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Confetti {
    constructor() { this.reset(); }

    reset() {
      this.x        = Math.random() * canvas.width;
      this.y        = -20;
      this.size     = Math.random() * 8 + 4;
      this.speedY   = Math.random() * 3 + 2;
      this.speedX   = (Math.random() - 0.5) * 2;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 10;
      this.opacity  = 1;
      this.color    = [
        '#e8537a','#ff8fab','#ffc2d1',
        '#f5c542','#ff6b8a','#ffa0c0',
        '#ff4d79','#ffe066','#ff99bb'
      ][Math.floor(Math.random() * 9)];
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }

    update() {
      this.y        += this.speedY;
      this.x        += this.speedX + Math.sin(this.y * 0.02) * 0.5;
      this.rotation += this.rotSpeed;
      this.opacity  -= 0.003;
      return this.y <= canvas.height && this.opacity > 0;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = this.color;
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function launchConfetti() {
    for (let i = 0; i < 160; i++) {
      const p  = new Confetti();
      p.y      = Math.random() * canvas.height * 0.3;
      p.speedY = Math.random() * 4 + 1.5;
      confettiPieces.push(p);
    }
    if (!animating) { animating = true; animateConfetti(); }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces = confettiPieces.filter(p => { const a = p.update(); if (a) p.draw(); return a; });
    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      animating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /* ── 5. 照片卡片 3D tilt（桌機限定）── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform =
          `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── 6. 便條隨機微旋轉 ── */
  document.querySelectorAll('.sticky-note').forEach(note => {
    const r = (Math.random() - 0.5) * 6;
    note.style.setProperty('--rotate', r + 'deg');
  });

});
