document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================================================
    // CONFIGURACIÓN GLOBAL
    // ===================================================================
    const BACKEND_BASE_URL = 'http://localhost:5071';
    const API_BASE_URL = `${BACKEND_BASE_URL}/api/portfolio`;
    const PREVIEW_DELAY = 1500; // Delay de 1.5 segundos, más ágil

    let hoverTimer = null; // Variable para controlar el temporizador del hover

    // ===================================================================
    // ELEMENTOS DEL DOM
    // ===================================================================
    const clientsContainer = document.getElementById('client-logos-container');
    const projectsContainer = document.getElementById('projects-container');
    const clientDetailContainer = document.getElementById('client-detail-container');

    // ===================================================================
    // LÓGICA DE VISTA PREVIA DE IMAGEN (NUEVO)
    // ===================================================================
    const attachPreviewEvents = () => {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
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
        hideImagePreview(); // Limpia cualquier popup anterior
        const popup = document.createElement('div');
        popup.className = 'image-preview-popup';
        popup.innerHTML = `<img src="${imageUrl}" alt="Vista previa ampliada">`;
        document.body.appendChild(popup);
        setTimeout(() => { popup.style.opacity = '1'; }, 10); // Fade-in
    };

    const hideImagePreview = () => {
        const existingPopup = document.querySelector('.image-preview-popup');
        if (existingPopup) existingPopup.remove();
    };

    // ===================================================================
    // FUNCIONES PARA CARGAR DATOS
    // ===================================================================
    const loadClientsList = () => {
        if (!clientsContainer) return;
        fetch(`${API_BASE_URL}/clientes`)
            .then(response => response.json())
            .then(clientes => {
                clientsContainer.innerHTML = '';
                const ul = document.createElement('ul');
                ul.className = 'client-logos-grid';
                clientes.forEach(cliente => {
                    const logoUrlCompleta = cliente.logoUrl ? `${BACKEND_BASE_URL}/${cliente.logoUrl}` : 'images/clients/placeholder.png';
                    const li = `<li><a href="cliente-detalle.html?id=${cliente.id}"><img src="${logoUrlCompleta}" alt="Logo de ${cliente.nombre}"></a></li>`;
                    ul.innerHTML += li;
                });
                clientsContainer.appendChild(ul);
            })
            .catch(error => {
                console.error('Error al cargar clientes:', error);
                clientsContainer.innerHTML = '<p>No se pudieron cargar los clientes.</p>';
            });
    };

    const loadProjectsList = () => {
        if (!projectsContainer) return;
        fetch(`${API_BASE_URL}/proyectos`)
            .then(response => response.json())
            .then(proyectos => {
                projectsContainer.innerHTML = '';
                proyectos.forEach(proyecto => {
                    const imageUrlCompleta = proyecto.imagenUrl ? `${BACKEND_BASE_URL}/${proyecto.imagenUrl}` : 'images/projects/placeholder.png';
                    
                    // --- INTEGRACIÓN: Añadimos 'data-full-image-url' a la tarjeta ---
                    const projectCardHTML = `
                        <div class="project-card" data-full-image-url="${imageUrlCompleta}">
                            <img src="${imageUrlCompleta}" alt="Imagen de ${proyecto.nombreProyecto}">
                            <h3>${proyecto.nombreProyecto}</h3>
                            <p>${proyecto.descripcion}</p>
                            <small>Cliente: ${proyecto.nombreCliente}</small>
                        </div>
                    `;
                    projectsContainer.innerHTML += projectCardHTML;
                });

                // --- INTEGRACIÓN: Después de crear las tarjetas, les añadimos los eventos de hover ---
                attachPreviewEvents();
            })
            .catch(error => {
                console.error('Error al cargar proyectos:', error);
                projectsContainer.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
            });
    };

    const loadClientDetail = () => {
        // ... (esta función no cambia y se queda igual que en tu código)
    };

    // ===================================================================
    // ENRUTADOR: Decide qué funciones ejecutar
    // ===================================================================
    if (clientsContainer && projectsContainer) {
        loadClientsList();
        loadProjectsList();
    } else if (clientDetailContainer) {
        const loadClientDetail = () => {
        if (!clientDetailContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('id');

        if (!clientId) {
            clientDetailContainer.innerHTML = '<h2>Error: No se especificó un cliente.</h2>';
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
                        <h1> ${cliente.nombre}</h1>
                    </section>
                    <section class="client-detail-content">
                        ${cliente.detalleHtml || '<p>Más información sobre nuestros proyectos con este cliente próximamente.</p>'}
                    </section>
                    <a href="portafolio.html" class="btn-back">← Volver al Portafolio</a>
                `;
                clientDetailContainer.innerHTML = detailHTML;
            })
            .catch(error => {
                console.error('Error al cargar detalle de cliente:', error);
                clientDetailContainer.innerHTML = '<h2>Cliente no encontrado</h2><p>La página que buscas no existe o el cliente no es público.</p>';
            });
    };
        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('id');
        if (!clientId) {
            clientDetailContainer.innerHTML = '<h2>Error: No se especificó un cliente.</h2>';
        } else {
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
                        <h1> ${cliente.nombre}</h1>
                    </section>
                    <section class="client-detail-content">
                        ${cliente.detalleHtml || '<p>Más información sobre nuestros proyectos con este cliente próximamente.</p>'}
                    </section>
                    <a href="portafolio.html" class="btn-back">← Volver al Portafolio</a>
                `;
                clientDetailContainer.innerHTML = detailHTML;
            })
            .catch(error => {
                console.error('Error al cargar detalle de cliente:', error);
                clientDetailContainer.innerHTML = '<h2>Cliente no encontrado</h2><p>La página que buscas no existe o el cliente no es público.</p>';
            });
        }
    }
});