// ===================================================================
// FUNCIÓN PRINCIPAL PARA LA ANIMACIÓN DE "ENTRADA"
// ===================================================================
function playExplosionIn() {
    const explosionColor = sessionStorage.getItem('explosionColor');
    if (explosionColor) {
        // Coordenadas guardadas
        const explosionX = sessionStorage.getItem('explosionX');
        const explosionY = sessionStorage.getItem('explosionY');

        // Crea el elemento de la explosión
        const explosion = document.createElement('div');
        explosion.classList.add('color-explosion-in');
        explosion.style.backgroundColor = explosionColor;
        explosion.style.top = explosionY;
        explosion.style.left = explosionX;
        document.body.appendChild(explosion);

        // Limpia el sessionStorage para que no se repita
        sessionStorage.removeItem('explosionColor');
        sessionStorage.removeItem('explosionX');
        sessionStorage.removeItem('explosionY');
    }
}

// ===================================================================
// EVENTO DE CARGA INICIAL DE LA PÁGINA
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica para la animación de "salida" ---
    const links = document.querySelectorAll('header nav a'); 
    const colors = ['#FF2000', '#FFDD00', '#008000', '#0000ff']; 

    links.forEach(link => {
        // No animar el enlace del panel de admin que abre en una nueva pestaña
        if (link.getAttribute('target') === '_blank') {
            return; 
        }

        link.addEventListener('click', (e) => {
            e.preventDefault(); // Detiene la navegación
            const href = link.getAttribute('href');
            
            // Lógica para la explosión de salida
            const color = colors[Math.floor(Math.random() * colors.length)];
            const rect = link.getBoundingClientRect();

            // Guarda el estado para la próxima página
            sessionStorage.setItem('explosionColor', color);
            sessionStorage.setItem('explosionX', `${rect.left + rect.width / 2}px`);
            sessionStorage.setItem('explosionY', `${rect.top + rect.height / 2}px`);

            const explosion = document.createElement('div');
            explosion.classList.add('color-explosion-out');
            explosion.style.backgroundColor = color;
            explosion.style.top = `${rect.top + rect.height / 2}px`;
            explosion.style.left = `${rect.left + rect.width / 2}px`;
            document.body.appendChild(explosion);

            // Navega después de que la animación tenga tiempo de empezar
            setTimeout(() => {
                window.location.href = href;
            }, 750);
        });
    });

    // --- Lógica para la animación de "entrada" en la carga inicial ---
    playExplosionIn();
});

// ===================================================================
// EVENTO PARA EL BACK/FORWARD CACHE (LA SOLUCIÓN A EL PROBLEMA)
// ===================================================================
window.addEventListener('pageshow', function (event) {
    // Si la página se restaura desde el caché (ej. botón "atrás")
    if (event.persisted) {
        // La animación de "entrada" probablemente ya se ejecutó y se quedó "pegada".
        // Vamos a forzar una limpieza de cualquier posible explosión visible
        // y luego intentar ejecutar la animación de entrada de nuevo si es necesario.
        
        // Elimina cualquier explosión que se haya quedado en la pantalla
        const existingExplosion = document.querySelector('.color-explosion-in, .color-explosion-out');
        if (existingExplosion) {
            existingExplosion.remove();
        }

        // Vuelve a ejecutar la lógica de la animación de entrada
        playExplosionIn();
    }
});