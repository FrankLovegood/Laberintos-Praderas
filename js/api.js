document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================================================
    // CONFIGURACIÓN GLOBAL
    // ===================================================================
    const BACKEND_BASE_URL = 'http://localhost:5071';
    const API_BASE_URL = `${BACKEND_BASE_URL}/api/portfolio`;
    const PREVIEW_DELAY = 1500; // Delay de 1.5 segundos

    let hoverTimer = null; // Variable para el temporizador

    // ===================================================================
    // LÓGICA DE VISTA PREVIA DE IMAGEN (REUTILIZABLE)
    // ===================================================================
    const attachPreviewEvents = () => {
        // Selecciona CUALQUIER elemento que tenga el atributo 'data-full-image-url'
        const previewableCards = document.querySelectorAll('[data-full-image-url]');

        previewableCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const fullImageUrl = card.dataset.fullImageUrl;
                if (!fullImageUrl) return;
                hoverTimer = setTimeout(() => showImagePreview(fullImageUrl), PREVIEW_DELAY);
            });

            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
                hideImagePreview();
            });
        });
    };

    const showImagePreview = (imageUrl) => {
        hideImagePreview();
        const popup = document.createElement('div');
        popup.className = 'image-preview-popup';
        popup.innerHTML = `<img src="${imageUrl}" alt="Vista previa ampliada">`;
        document.body.appendChild(popup);
        setTimeout(() => { popup.style.opacity = '1'; }, 10);
    };

    const hideImagePreview = () => {
        const existingPopup = document.querySelector('.image-preview-popup');
        if (existingPopup) existingPopup.remove();
    };

    // ===================================================================
    // FUNCIONES PARA CARGAR DATOS (API)
    // ===================================================================
    const loadClientsList = () => {
        const container = document.getElementById('client-logos-container');
        if (!container) return;

        fetch(`${API_BASE_URL}/clientes`)
            .then(response => response.json())
            .then(clientes => {
                container.innerHTML = '';
                const ul = document.createElement('ul');
                ul.className = 'client-logos-grid';
                clientes.forEach(cliente => {
                    const logoUrlCompleta = cliente.logoUrl ? `${BACKEND_BASE_URL}/${cliente.logoUrl}` : 'images/clients/placeholder.png';
                    const li = `<li><a href="cliente-detalle.html?id=${cliente.id}"><img src="${logoUrlCompleta}" alt="Logo de ${cliente.nombre}"></a></li>`;
                    ul.innerHTML += li;
                });
                container.appendChild(ul);
            })
            .catch(error => {
                console.error('Error al cargar clientes:', error);
                container.innerHTML = '<p>No se pudieron cargar los clientes.</p>';
            });
    };

    const loadProjectsList = () => {
        const container = document.getElementById('projects-container');
        if (!container) return;

        fetch(`${API_BASE_URL}/proyectos`)
            .then(response => response.json())
            .then(proyectos => {
                container.innerHTML = '';
                proyectos.forEach(proyecto => {
                    const imageUrlCompleta = proyecto.imagenUrl ? `${BACKEND_BASE_URL}/${proyecto.imagenUrl}` : 'images/projects/placeholder.png';
                    const projectCardHTML = `
                        <div class="project-card" data-full-image-url="${imageUrlCompleta}">
                            <img src="${imageUrlCompleta}" alt="Imagen de ${proyecto.nombreProyecto}">
                            <h3>${proyecto.nombreProyecto}</h3>
                            <p>${proyecto.descripcion}</p>
                            <small>Cliente: ${proyecto.nombreCliente}</small>
                        </div>
                    `;
                    container.innerHTML += projectCardHTML;
                });
                attachPreviewEvents(); // Activa el hover después de cargar los proyectos
            })
            .catch(error => {
                console.error('Error al cargar proyectos:', error);
                container.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
            });
    };

    const loadClientDetail = () => {
        const container = document.getElementById('client-detail-container');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('id');

        if (!clientId) {
            container.innerHTML = '<h2>Error: No se especificó un cliente.</h2>';
            return;
        }

        fetch(`${API_BASE_URL}/clientes/${clientId}`)
            .then(response => {
                if (!response.ok) throw new Error('Cliente no encontrado o no es público.');
                return response.json();
            })
            .then(cliente => {
                document.title = `${cliente.nombre} - Portafolio`;
                const logoUrlCompleta = cliente.logoUrl ? `${BACKEND_BASE_URL}/${cliente.logoUrl}` : '';
                const detailHTML = `
                    <section class="client-detail-header">
                        ${logoUrlCompleta ? `<img src="${logoUrlCompleta}" alt="Logo de ${cliente.nombre}">` : ''}
                        <h1>${cliente.nombre}</h1>
                    </section>
                    <section class="client-detail-content">
                        ${cliente.detalleHtml || '<p>Más información sobre nuestros proyectos con este cliente próximamente.</p>'}
                    </section>
                    <a href="portafolio.html" class="btn-back">← Volver al Portafolio</a>
                `;
                container.innerHTML = detailHTML;
            })
            .catch(error => {
                console.error('Error al cargar detalle de cliente:', error);
                container.innerHTML = '<h2>Cliente no encontrado</h2><p>La página que buscas no existe o el cliente no es público.</p>';
            });
    };

     loadClientsList();
    loadProjectsList();
    loadClientDetail();
    attachPreviewEvents();
});