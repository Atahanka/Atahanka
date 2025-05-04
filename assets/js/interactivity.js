// Theme toggle logic
window.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'theme-toggle';
    toggleButton.innerText = 'Toggle Theme';
    document.body.appendChild(toggleButton);
  
    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };
  
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  
    toggleButton.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  });
  