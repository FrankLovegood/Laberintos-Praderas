document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav a');
    const colors = ['#FF2000', '#FFDD00', '#008000', '#0000ff'];

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const rect = link.getBoundingClientRect();

            sessionStorage.setItem('explosionColor', color);
            sessionStorage.setItem('explosionX', `${rect.left + rect.width / 2}px`);
            sessionStorage.setItem('explosionY', `${rect.top + rect.height / 2}px`);

            const explosion = document.createElement('div');
            explosion.classList.add('color-explosion-out');
            explosion.style.backgroundColor = color;
            explosion.style.top = `${rect.top + rect.height / 2}px`;
            explosion.style.left = `${rect.left + rect.width / 2}px`;
            document.body.appendChild(explosion);

            setTimeout(() => {
                window.location.href = href;
            }, 750);
        });
    });

    const explosionColor = sessionStorage.getItem('explosionColor');
    if (explosionColor) {
        const explosion = document.createElement('div');
        explosion.classList.add('color-explosion-in');
        explosion.style.backgroundColor = explosionColor;
        explosion.style.top = sessionStorage.getItem('explosionY');
        explosion.style.left = sessionStorage.getItem('explosionX');
        document.body.appendChild(explosion);
        sessionStorage.removeItem('explosionColor');
        sessionStorage.removeItem('explosionX');
        sessionStorage.removeItem('explosionY');
    }
});