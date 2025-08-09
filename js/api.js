document.addEventListener('DOMContentLoaded', () => {
    
    const BACKEND_BASE_URL = 'https://app.laberintospraderas.com';
    const API_BASE_URL = `${BACKEND_BASE_URL}/api/portfolio`;
    
    // Contenedor principal que vamos a modificar
    const mainContentContainer = document.querySelector('main'); 

    // ===================================================================
    // PLANTILLAS HTML
    // ===================================================================
    const createPortfolioView = () => {
        mainContentContainer.innerHTML = `
            <section class="hero">
                <h1>Nuestra Experiencia en Acción</h1>
                <p>...</p>
            </section>
            <section class="clients-section">
                <h2>La Confianza de los Líderes...</h2>
                <div id="client-logos-container"><p>Cargando clientes...</p></div>
            </section>
            <section class="projects-section">
                <h2>Proyectos que Inspiran Sonrisas</h2>
                <div id="projects-container"><p>Cargando proyectos...</p></div>
            </section>
        `;
        loadClientsList();
        loadProjectsList();
    };

    const createClientDetailView = (clientId) => {
        mainContentContainer.innerHTML = `<div id="client-detail-container"><p>Cargando detalles del cliente...</p></div>`;
        loadClientDetail(clientId);
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
                    const logoUrl = cliente.logoUrl || 'images/clients/placeholder.png';
                    // ¡ENLACE CORRECTO!
                    const li = `<li><a href="/cliente-detalle.html?id=${cliente.id}"><img src="${logoUrl}" alt="Logo de ${cliente.nombre}"></a></li>`;
                    ul.innerHTML += li;
                });
                container.appendChild(ul);
            })
            .catch(error => { console.error('Error al cargar clientes:', error); });
    };


     const loadProjectsList = () => {
        const container = document.getElementById('projects-container');
        if (!container) return;
        fetch(`${API_BASE_URL}/proyectos`)
            .then(response => response.json())
            .then(proyectos => {
                container.innerHTML = '';
                proyectos.forEach(proyecto => {
                    const imageUrl = proyecto.imagenUrl || 'images/projects/placeholder.png';
                    const projectCardHTML = `
                        <div class="project-card" data-full-image-url="${imageUrl}">
                            <img src="${imageUrl}" alt="Imagen de ${proyecto.nombreProyecto}">
                            <h3>${proyecto.nombreProyecto}</h3>
                            <p>${proyecto.descripcion}</p>
                            <small>Cliente: ${proyecto.nombreCliente}</small>
                        </div>
                    `;
                    container.innerHTML += projectCardHTML;
                });
                attachPreviewEvents();
            })
            .catch(error => { console.error('Error al cargar proyectos:', error); });
    };

       const loadClientDetail = (clientId) => {
        const container = document.getElementById('client-detail-container');
        if (!container) return;
        
        fetch(`${API_BASE_URL}/clientes/${clientId}`)
            .then(response => { if (!response.ok) throw new Error('Cliente no encontrado'); return response.json(); })
            .then(cliente => {
                document.title = `${cliente.nombre} - Portafolio`;
                const logoUrl = cliente.logoUrl || '';
                const detailHTML = `
                    <section class="client-detail-header">
                        ${logoUrl ? `<img src="${logoUrl}" alt="Logo de ${cliente.nombre}">` : ''}
                        <h1>${cliente.nombre}</h1>
                    </section>
                    <section class="client-detail-content">${cliente.detalleHtml || '<p>Información próximamente.</p>'}</section>
                    <a href="/portafolio.html" class="btn-back">← Volver al Portafolio</a>
                `;
                container.innerHTML = detailHTML;
            })
            .catch(error => { container.innerHTML = '<h2>Cliente no encontrado</h2>'; });
    };

    // ===================================================================
    // ENRUTADOR PRINCIPAL
    // ===================================================================
    const router = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('id');

        if (window.location.pathname.includes('cliente-detalle')) {
            createClientDetailView(clientId);
        } else {
            createPortfolioView();
        }
    };

    // Ejecuta el enrutador
    router();
});