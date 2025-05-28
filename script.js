document.addEventListener('DOMContentLoaded', () => {
    // 1. Añadir una clase al body para indicar que JS está listo
    // Esto permite que el CSS controle las animaciones solo cuando JS está presente
    document.body.classList.add('js-ready');

    // Seleccionar todas las secciones que queremos animar al hacer scroll
    const sectionsToAnimate = document.querySelectorAll('section');
    const footerToAnimate = document.querySelector('footer');

    // Opciones para el Intersection Observer
    // root: null significa el viewport del navegador
    // rootMargin: '0px' significa que la intersección se activa cuando el elemento entra/sale del viewport
    // threshold: 0.2 significa que la intersección se activa cuando el 20% del elemento es visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Puedes ajustar este valor (0.0 a 1.0)
    };

    // Crear una nueva instancia de Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el elemento es visible, añadir la clase 'is-visible'
                entry.target.classList.add('is-visible');
                // Opcional: Si quieres que la animación se ejecute solo una vez,
                // puedes dejar de observar el elemento después de que sea visible.
                // observer.unobserve(entry.target);
            } else {
                // Opcional: Si quieres que la animación se reinicie cada vez que el usuario sale y vuelve a entrar
                // en la sección (scroll hacia arriba y hacia abajo), puedes quitar la clase.
                // Si no quieres que se reinicie, elimina esta línea.
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Observar cada sección
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    // Observar el footer también
    if (footerToAnimate) {
        observer.observe(footerToAnimate);
    }

    // Funcionalidad de scroll suave para los enlaces de navegación
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

            const targetId = this.getAttribute('href'); // Obtener el ID del destino (e.g., "#introduccion")
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll suave hasta el elemento
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Añadir la clase 'is-visible' inmediatamente al elemento objetivo
                // para que aparezca si se navega a él directamente
                targetElement.classList.add('is-visible');
            }
        });
    });
});