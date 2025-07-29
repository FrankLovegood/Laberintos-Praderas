document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================================================
    // CONFIGURACIÓN GLOBAL
    // ===================================================================
    const BACKEND_BASE_URL = 'http://localhost:5071'; // URL raíz de tu backend
    const API_BASE_URL = `${BACKEND_BASE_URL}/api/portfolio`;

    // ===================================================================
    // ELEMENTOS DEL DOM (Detecta en qué página estamos)
    // ===================================================================
    const clientsContainer = document.getElementById('client-logos-container');
    const projectsContainer = document.getElementById('projects-container');
    const clientDetailContainer = document.getElementById('client-detail-container');

    // ===================================================================
    // FUNCIONES PARA LA PÁGINA DE PORTAFOLIO
    // ===================================================================
    const loadClientsList = () => {
        if (!clientsContainer) return; // Seguridad: no hacer nada si el contenedor no existe
        fetch(`${API_BASE_URL}/clientes`)
            .then(response => response.json())
            .then(clientes => {
                clientsContainer.innerHTML = '';
                const ul = document.createElement('ul');
                ul.className = 'client-logos-grid';
                
                clientes.forEach(cliente => {
                    const logoUrlCompleta = cliente.logoUrl ? `${BACKEND_BASE_URL}/${cliente.logoUrl}` : 'images/clients/placeholder.png';
                    // ¡Enlace corregido para apuntar a la página de detalle con el ID del cliente!
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
                    const projectCardHTML = `
                        <div class="project-card">
                            <img src="${imageUrlCompleta}" alt="Imagen de ${proyecto.nombreProyecto}">
                            <h3>${proyecto.nombreProyecto}</h3>
                            <p>${proyecto.descripcion}</p>
                            <small>Cliente: ${proyecto.nombreCliente}</small>
                        </div>
                    `;
                    projectsContainer.innerHTML += projectCardHTML;
                });
            })
            .catch(error => {
                console.error('Error al cargar proyectos:', error);
                projectsContainer.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
            });
    };

    // ===================================================================
    // FUNCIÓN PARA LA PÁGINA DE DETALLE DE CLIENTE
    // ===================================================================
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

    // ===================================================================
    // ENRUTADOR: Decide qué funciones ejecutar basado en la página actual
    // ===================================================================
    if (clientsContainer && projectsContainer) {
        // Estamos en portfolio.html
        loadClientsList();
        loadProjectsList();
    } else if (clientDetailContainer) {
        // Estamos en cliente-detalle.html
        loadClientDetail();
    }
});