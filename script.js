document.addEventListener('DOMContentLoaded', () => {
    // 1. Añadir una clase al body para indicar que JS está listo
    // Esto permite que el CSS controle las animaciones solo cuando JS está presente
    document.body.classList.add('js-ready');

    // Seleccionar todas las secciones que queremos animar
    const sectionsToAnimate = document.querySelectorAll('section');
    const footerToAnimate = document.querySelector('footer');

    // Track last scroll position to determine direction
    let lastScrollY = window.scrollY;

    // Función simplificada para determinar dirección del scroll
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

    // Observer simplificado para las secciones
    const sectionObserver = new IntersectionObserver((entries) => {
        const scrollDirection = getScrollDirection();
        
        entries.forEach(entry => {
            const element = entry.target;
            
            // Si el elemento entra en el viewport
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    // Reiniciar la animación removiendo las clases
                    element.classList.remove('slide-animation-up', 'slide-animation-down');
                    // Forzar reflow
                    void element.offsetWidth;
                    // Aplicar la nueva animación
                    element.classList.add(scrollDirection === 'down' ? 
                        'slide-animation-down' : 'slide-animation-up');
                });
            } else {
                // Cuando sale del viewport, remover las clases para preparar la siguiente animación
                element.classList.remove('slide-animation-up', 'slide-animation-down');
            }
        });
    }, {
        root: null,
        rootMargin: '10px',
        threshold: 0
    });

    // Observer simplificado para el footer
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    // Reiniciar la animación
                    element.classList.remove('slide-animation-down');
                    void element.offsetWidth;
                    element.classList.add('slide-animation-down');
                });
            } else {
                // Preparar para la siguiente animación
                element.classList.remove('slide-animation-down');
            }
        });
    }, {
        root: null,
        rootMargin: '10px',
        threshold: 0
    });

    // Observar elementos
    sectionsToAnimate.forEach(section => {
        sectionObserver.observe(section);
    });

    if (footerToAnimate) {
        footerObserver.observe(footerToAnimate);
    }

    // Navegación mejorada
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                requestAnimationFrame(() => {
                    // Reiniciar la animación
                    targetElement.classList.remove('slide-animation-up', 'slide-animation-down');
                    void targetElement.offsetWidth;
                    targetElement.classList.add('slide-animation-down');
                    
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                });
            }
        });
    });

    // Activar animaciones de imágenes
    document.querySelectorAll('img').forEach(img => {
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