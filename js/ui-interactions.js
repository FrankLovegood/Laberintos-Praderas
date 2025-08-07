document.addEventListener('DOMContentLoaded', () => {
    
    // Variables y funciones relacionadas con la vista previa
    const PREVIEW_DELAY = 1500;
    let hoverTimer = null;

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

    const attachPreviewEvents = () => {
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

    // --- EJECUCIÓN ---
    // Simplemente activamos el detector de eventos en cualquier página que cargue este script.
    attachPreviewEvents();
});