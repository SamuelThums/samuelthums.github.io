// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Definir data atual no rodapé
    const now = new Date();
    const cd = document.getElementById('currentDate');
    if (cd) cd.textContent = now.toLocaleDateString('pt-BR');

    // Inicializar gráfico de habilidades
    initSkillsChart();

    // Ativar animações de scroll
    setupScrollAnimations();

    // Adicionar event listeners (form, tema, print, nav)
    setupEventListeners();

    // Inicializar o player flutuante (garante botões funcionando corretamente)
    initFloatingVideo();
});

/* -------------------------
   Event listeners gerais
   ------------------------- */
function setupEventListeners() {
    // Formulário de contato (simples)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name')?.value || '';
            alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Entrarei em contato em breve.`);
            form.reset();
        });
    }

    // Alternador de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
                localStorage.setItem('theme', 'dark');
            } else {
                if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
                localStorage.setItem('theme', 'light');
            }
            // redesenhar gráfico com esquema atual
            initSkillsChart();
            // Remover foco para evitar scroll
            this.blur();
        });

        // aplicar tema salvo no carregamento
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            document.body.classList.add('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        }
    }

    // Botão de impressão
    const printBtn = document.getElementById('printBtn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    // Botão atualizar gráfico
    const toggleChart = document.getElementById('toggleChart');
    if (toggleChart) {
        toggleChart.addEventListener('click', function(e) {
            e.preventDefault();
            initSkillsChart();
            // Remover foco para evitar scroll
            this.blur();
        });
    }

    // Smooth scroll e active menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({ top: offsetTop > 0 ? offsetTop : 0, behavior: 'smooth' });
            }
            document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/* -------------------------
   Gráfico de habilidades (canvas)
   ------------------------- */
function initSkillsChart() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ajustar para devicePixelRatio para ficar nítido
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        // fallback sizes
        canvas.width = 800 * ratio;
        canvas.height = 400 * ratio;
    } else {
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
    }
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Dados
    const skills = ['Python','JavaScript','HTML/CSS','Power BI','SQL','C++'];
    const levels = [85,75,90,80,70,65];
    const colors = ['#D4AF37','#FFD700','#C5A000','#D4AF37','#FFD700','#C5A000'];

    const padding = 48;
    const baseY = (rect.height || 250) - 40;
    const maxBarHeight = Math.min(180, (rect.height || 250) - 80);
    const barWidth = Math.min(48, ((rect.width || 400) - padding*2) / skills.length - 12);
    const startX = padding;

    // Eixos
    ctx.beginPath(); ctx.moveTo(32,20); ctx.lineTo(32, baseY); ctx.lineTo((rect.width||400)-20, baseY);
    ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#B0B0B0' : '#64748b';
    ctx.lineWidth = 1; ctx.stroke();

    // Título
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#FFD700' : '#D4AF37';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Nível de Proficiência', 36, 16);

    ctx.textAlign = 'center';
    for (let i=0;i<skills.length;i++){
        const x = startX + i*(barWidth + 18);
        const val = levels[i] / 100;
        const h = val * maxBarHeight;
        const y = baseY - h;

        // background bar
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(x, baseY - maxBarHeight, barWidth, maxBarHeight);

        // valores
        ctx.fillStyle = colors[i] || '#D4AF37';
        ctx.fillRect(x, y, barWidth, h);

        // labels
        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#FFFFFF' : '#000000';
        ctx.font = '12px Arial';
        ctx.fillText(skills[i], x + barWidth/2, baseY + 18);

        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#FFD700' : '#D4AF37';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(levels[i] + '%', x + barWidth/2, y - 8);
    }
}

/* -------------------------
   Scroll animação/tentativa
   ------------------------- */
function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('animate');
                obs.unobserve(en.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('section').forEach(s => io.observe(s));
}

/*Player de video */
function initFloatingVideo(){
  const minBtn = document.getElementById('videoMinBtn');
  const panel = document.getElementById('floatingVideo');
  const header = document.getElementById('fvHeader');
  const btnMin = document.getElementById('fvMinimize');
  const btnClose = document.getElementById('fvClose');
  const video = document.getElementById('introVideo');

  if(!minBtn || !panel || !header) return;

  // Inicialmente, o painel está oculto e o botão minimizado visível.
  panel.setAttribute('aria-hidden','true');
  minBtn.setAttribute('aria-hidden','false');

  // Abre do botão minimizado
  minBtn.addEventListener('click', ()=>{
    panel.setAttribute('aria-hidden','false');
    minBtn.setAttribute('aria-hidden','true');
  });

  // Minimize (pause video)
  if(btnMin) btnMin.addEventListener('click', ()=>{
    panel.setAttribute('aria-hidden','true');
    minBtn.setAttribute('aria-hidden','false');
    if(video && !video.paused) try{ video.pause(); }catch(e){}
  });

  // Close.
  if(btnClose) btnClose.addEventListener('click', ()=>{
    panel.setAttribute('aria-hidden','true');
    minBtn.setAttribute('aria-hidden','false');
    if(video && !video.paused) try{ video.pause(); }catch(e){}
  });

  // Escape fecha
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false'){
      panel.setAttribute('aria-hidden','true');
      minBtn.setAttribute('aria-hidden','false');
      if(video && !video.paused) try{ video.pause(); }catch(e){}
    }
  });

  // draggable: saves pos during dragging callback
  makeDraggable(panel, header, (left, top)=>{
    // Não salva mais no localStorage para evitar problemas
  });
}

/* -------------------------
   Ponteiros e Drag
   ------------------------- */
function makeDraggable(container, handle, onMove) {
    if (!container || !handle) return;
    let dragging = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;
    let pointerId = null;

    handle.style.touchAction = 'none';

    handle.addEventListener('pointerdown', (e) => {
        dragging = true;
        pointerId = e.pointerId;
        try { handle.setPointerCapture(pointerId); } catch(e){}
        container.classList.add('dragging');
        const rect = container.getBoundingClientRect();
        origLeft = rect.left;
        origTop = rect.top;
        startX = e.clientX;
        startY = e.clientY;
    });

    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newLeft = origLeft + dx;
        let newTop = origTop + dy;
        // constrain
        const vw = window.innerWidth, vh = window.innerHeight;
        const w = container.offsetWidth, h = container.offsetHeight;
        if (newLeft < 8) newLeft = 8;
        if (newTop < 8) newTop = 8;
        if (newLeft + w > vw - 8) newLeft = vw - w - 8;
        if (newTop + h > vh - 8) newTop = vh - h - 8;
        container.style.left = newLeft + 'px';
        container.style.top = newTop + 'px';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
        if (typeof onMove === 'function') onMove(newLeft, newTop);
    });

    function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        try { handle.releasePointerCapture(pointerId); } catch(e){}
        container.classList.remove('dragging');
    }
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
    window.addEventListener('blur', endDrag);
}