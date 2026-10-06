document.addEventListener('DOMContentLoaded', () => {

  const elementos = document.querySelectorAll('.pieza, .ficha, .evento, .cuadro');
  elementos.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => observer.observe(el));

  const estiloAnim = document.createElement('style');
  estiloAnim.textContent = `
    @keyframes flotar {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100vh) translateX(25px); opacity: 0; }
    }
  `;
  document.head.appendChild(estiloAnim);

  function crearParticulas(contenedor, cantidad, color) {
    for (let i = 0; i < cantidad; i++) {
      const particula = document.createElement('div');
      const tam = Math.random() * 4 + 2;
      particula.style.position = 'absolute';
      particula.style.width = tam + 'px';
      particula.style.height = tam + 'px';
      particula.style.background = color;
      particula.style.borderRadius = '50%';
      particula.style.left = Math.random() * 100 + '%';
      particula.style.top = Math.random() * 100 + '%';
      particula.style.animation = `flotar ${6 + Math.random() * 8}s linear infinite`;
      particula.style.animationDelay = `-${Math.random() * 10}s`;
      contenedor.appendChild(particula);
    }
  }

  const contenedorEntrada = document.getElementById('particles');
  if (contenedorEntrada) crearParticulas(contenedorEntrada, 45, 'rgba(212,175,55,0.7)');

  const coloresPorSala = {
    'artista': 'rgba(212,175,55,0.55)',
    'cimientos': 'rgba(63,201,192,0.55)',
    'herramientas': 'rgba(212,175,55,0.55)',
    'exposiciones': 'rgba(212,64,95,0.55)',
    'recorrido': 'rgba(77,111,224,0.55)',
    'contacto': 'rgba(212,175,55,0.55)'
  };

  Object.keys(coloresPorSala).forEach(id => {
    const sala = document.getElementById(id);
    if (!sala) return;
    const capa = document.createElement('div');
    capa.className = 'sala-particles';
    sala.insertBefore(capa, sala.firstChild);
    crearParticulas(capa, 30, coloresPorSala[id]);
  });

  // ===== FORMULARIO DE CONTACTO -> BASE DE DATOS =====
  const form = document.querySelector('.form-contacto');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const Nombre = document.getElementById('Nombre').value.trim();
      const Correo = document.getElementById('Correo').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      if (!Nombre || !Correo || !mensaje) {
        alert('Completá todos los campos.');
        return;
      }

      try {
        const respuesta = await fetch('guardar.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Nombre, Correo, mensaje })
        });

        if (respuesta.ok) {
          alert('¡Mensaje enviado! Gracias por escribirme.');
          form.reset();
        } else {
          alert('Error al enviar el mensaje.');
        }
      } catch (error) {
        alert('No se pudo conectar con el servidor.');
        console.error(error);
      }
    });
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const destino = document.querySelector(link.getAttribute('href'));
      destino.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const horizontalSection = document.querySelector('.horizontal-section');
  const track = document.getElementById('galeriaTrack');

  if (horizontalSection && track && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const rect = horizontalSection.getBoundingClientRect();
      const scrollableHeight = horizontalSection.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollableHeight);
      const progress = scrollableHeight > 0 ? scrolled / scrollableHeight : 0;
      const maxTranslate = Math.max(track.scrollWidth - track.clientWidth, 0);
      track.style.transform = `translateX(-${progress * maxTranslate}px)`;
    });
  }

});