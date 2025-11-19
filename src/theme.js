(function(){
  const KEY = 'site-theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeSwitch');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-bs-theme', 'dark');

      updateButtonIcon('moon');
    } else {
      root.setAttribute('data-bs-theme', 'light');

      updateButtonIcon('sun');
    }
  }

  function updateButtonIcon(iconType) {
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = iconType === 'moon' ? 'bi bi-moon' : 'bi bi-sun';
      }
    }
  }

  const saved = localStorage.getItem(KEY) || 'light';
  applyTheme(saved);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-bs-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(KEY, next);
    });
  }
})();

// Lazy loading для изображений
(function(){
  const images = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });
})();


