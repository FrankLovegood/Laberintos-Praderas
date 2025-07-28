document.addEventListener('DOMContentLoaded', () => {
    
    // ----- CONFIGURACIÓN -----
    const BACKEND_BASE_URL = 'http://localhost:5071';
    const API_BASE_URL = `${BACKEND_BASE_URL}/api/portfolio`;

    // ----- ELEMENTOS DEL DOM -----
    const clientsContainer = document.getElementById('client-logos-container');
    const projectsContainer = document.getElementById('projects-container');

    // ----- FUNCIÓN PARA CARGAR CLIENTES -----
    const loadClients = () => {
        fetch(`${API_BASE_URL}/clientes`)
            // PASO 1: Recibir la "bandeja" (Response object)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de red al cargar clientes');
                }
                // PASO 2: Levantar la tapa y devolver los "platillos" (el JSON)
                return response.json(); 
            })
            // AHORA SÍ, 'clientes' es un array
            .then(clientes => {
                clientsContainer.innerHTML = '';
                if (clientes.length === 0) {
                    clientsContainer.innerHTML = '<p>Nuestros valiosos clientes se mostrarán aquí pronto.</p>';
                    return;
                }
                
                const ul = document.createElement('ul');
                ul.className = 'client-logos-grid';
                
                clientes.forEach(cliente => {
                    const logoUrlCompleta = cliente.logoUrl ? `${BACKEND_BASE_URL}/${cliente.logoUrl}` : 'images/clients/placeholder.png';
                    const li = `<li><a href="#"><img src="${logoUrlCompleta}" alt="Logo de ${cliente.nombre}"></a></li>`;
                    ul.innerHTML += li;
                });
                clientsContainer.appendChild(ul);
            })
            .catch(error => {
                console.error('Error en fetch de clientes:', error);
                clientsContainer.innerHTML = '<p>No se pudieron cargar los clientes.</p>';
            });
    };

    // ----- FUNCIÓN PARA CARGAR PROYECTOS -----
    const loadProjects = () => {
        fetch(`${API_BASE_URL}/proyectos`)
            // PASO 1: Recibir la "bandeja"
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de red al cargar proyectos');
                }
                // PASO 2: Devolver los "platillos"
                return response.json();
            })
            // AHORA SÍ, 'proyectos' es un array
            .then(proyectos => {
                projectsContainer.innerHTML = '';
                if (proyectos.length === 0) {
                    projectsContainer.innerHTML = '<p>Nuestros emocionantes proyectos se mostrarán aquí pronto.</p>';
                    return;
                }

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
                console.error('Error en fetch de proyectos:', error);
                projectsContainer.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
            });
    };

    // ----- INICIAR LA CARGA DE DATOS -----
    if (clientsContainer && projectsContainer) {
        loadClients();
        loadProjects();
    }
});