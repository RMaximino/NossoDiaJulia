fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        setTimeout(() => {
          showDedicationText();
          startFloatingObjects();
          showCountdown();
          playBackgroundMusic();
        }, 1200);
      }, totalDuration);
    }, 50);

    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { 
  let text = getURLParam('text');
  if (!text) {
    text = `Para Júlia, o amor da minha vida:\n\nDesde que nos conhecemos, eu sabia que você era especial, e hoje tenho certeza de que é você. Seu jeito bobo, gentil e amoroso de ser… tudo em você foi, e é, perfeito para mim.\n\nSou muito grato a Deus por ter colocado você na minha vida, meu amor. Sinto-me a cada dia mais amado por você, e sou extremamente grato e feliz por isso e por toda a atenção, carinho e cuidado que você tem comigo.\n\nTe amo mais do que tudo neste mundo. Você mudou completamente a minha vida. Muito obrigado, amor! Para sempre nós!`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

function showSignature() {
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Com todo amor do mundo, seu José.";
  signature.classList.add('visible');
}

function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

function showCountdown() {
  const container = document.getElementById('countdown');
  if (!container) return;

  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');

  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2025-04-14T00:00:00');
  if (isNaN(startDate.getTime())) startDate = new Date('2025-04-14T00:00:00');

  let eventRef = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2026-04-14T00:00:00');
  if (isNaN(eventRef.getTime())) eventRef = new Date('2026-04-14T00:00:00');

  const anniversaryMonth = eventRef.getMonth();
  const anniversaryDay = eventRef.getDate();

  function diffYearsMonthsDays(start, end) {
    if (start > end) return { years: 0, months: 0, days: 0 };

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      let lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }
    if (years < 0) years = 0;
    return { years, months, days };
  }

  function getNextAnniversary(now, month, day) {
    let candidate = new Date(now.getFullYear(), month, day);
    if (candidate <= now) {
      candidate = new Date(now.getFullYear() + 1, month, day);
    }
    return candidate;
  }

  function update() {
    const now = new Date();

    const together = diffYearsMonthsDays(startDate, now);
    const anos = together.years;
    const meses = together.months;
    const dias = together.days;

    const anosStr = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    const mesesStr = `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    const diasStr = `${dias} ${dias === 1 ? 'dia' : 'dias'}`;

    const nextAnniv = getNextAnniversary(now, anniversaryMonth, anniversaryDay);
    let diffMs = nextAnniv - now;
    if (diffMs < 0) diffMs = 0;
    const totalSeg = Math.floor(diffMs / 1000);
    const eventDays = Math.floor(totalSeg / 86400);
    const eventHours = Math.floor((totalSeg % 86400) / 3600);
    const eventMinutes = Math.floor((totalSeg % 3600) / 60);
    const eventSeconds = totalSeg % 60;

    container.innerHTML =
      `Estamos Juntos há: <b>${anosStr}, ${mesesStr} e ${diasStr}</b><br>` +
      `Nosso aniversário em: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;

    container.classList.add('visible');
  }

  update();
  setInterval(update, 1000);
}

function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;
  audio.play().then(() => {
    btn.textContent = '🔊 Música';
  }).catch(() => {
    btn.textContent = '▶️ Música';
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});
