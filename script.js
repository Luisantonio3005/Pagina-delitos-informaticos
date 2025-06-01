document.addEventListener('DOMContentLoaded', () => {
    // 1. Añadir una clase al body para indicar que JS está listo
    // Esto permite que el CSS controle las animaciones solo cuando JS está presente
    document.body.classList.add('js-ready');

    // Seleccionar todas las secciones que queremos animar
    const sectionsToAnimate = document.querySelectorAll('section');
    const footerToAnimate = document.querySelector('footer');

    // Track last scroll position to determine direction
    let lastScrollY = window.scrollY;

    // Function to determine scroll direction
    function getScrollDirection() {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;
        return direction;
    }

    // Función para añadir la clase con delay
    const addVisibleClassWithDelay = (element, delay) => {
        setTimeout(() => {
            element.classList.add('is-visible');
            // Habilitar interacciones después de que la animación termine
            setTimeout(() => {
                element.style.pointerEvents = 'auto';
            }, 1200); // Tiempo igual a la duración de la animación
        }, delay);
    };

    // Función para animar elementos inicialmente visibles
    const animateInitialVisibleElements = () => {
        const viewportHeight = window.innerHeight;
        
        sectionsToAnimate.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            // Si el elemento está en el viewport inicial
            if (rect.top < viewportHeight) {
                const delay = Math.min(index * 200, 600);
                section.style.pointerEvents = 'none';
                addVisibleClassWithDelay(section, delay);
            }
        });

        // Animar el footer si está visible
        if (footerToAnimate) {
            const footerRect = footerToAnimate.getBoundingClientRect();
            if (footerRect.top < viewportHeight) {
                footerToAnimate.style.pointerEvents = 'none';
                addVisibleClassWithDelay(footerToAnimate, 800);
            }
        }
    };

    // Función para animar un elemento
    function animateElement(element) {
        // Remover la clase de animación y forzar un reflow
        element.classList.remove('slide-animation');
        void element.offsetWidth;
        // Añadir la clase para iniciar la animación
        element.classList.add('slide-animation');
    }

    // Opciones para el Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '100px', // Aumentado de 50px a 100px para detectar aún más temprano
        threshold: 0.05 // Reducido aún más para activar más temprano
    };

    // Crear el Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        const scrollDirection = getScrollDirection();
        
        entries.forEach(entry => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                // Remover clases anteriores antes de añadir nuevas
                element.classList.remove('slide-animation-up', 'slide-animation-down');
                
                // Forzar un reflow antes de añadir la nueva animación
                void element.offsetWidth;
                
                // Añadir la clase de animación según la dirección
                if (scrollDirection === 'down') {
                    element.classList.add('slide-animation-down');
                } else {
                    element.classList.add('slide-animation-up');
                }
            }
        });
    }, observerOptions);

    // Observar todas las secciones y el footer
    sectionsToAnimate.forEach(section => observer.observe(section));
    if (footerToAnimate) observer.observe(footerToAnimate);

    // Mejorar el manejo de clics en los enlaces de navegación
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Remover animaciones previas
                targetElement.classList.remove('slide-animation-up', 'slide-animation-down');
                
                // Forzar reflow
                void targetElement.offsetWidth;
                
                // Añadir nueva animación
                targetElement.classList.add('slide-animation-down');
                
                // Calcular la posición del elemento
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                // Scroll suave a la posición
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Activar animaciones de imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.classList.add('floating-image');
    });

    // Opcional: Resetear las animaciones cuando el usuario vuelve al principio
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('slide-animation');
            });
        }
    });
});