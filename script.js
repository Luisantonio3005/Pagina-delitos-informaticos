document.addEventListener('DOMContentLoaded', () => {
    // 1. Añadir una clase al body para indicar que JS está listo
    // Esto permite que el CSS controle las animaciones solo cuando JS está presente
    document.body.classList.add('js-ready');

    // Seleccionar las secciones y el footer
    const elementsToAnimate = [...document.querySelectorAll('section'), document.querySelector('footer')];

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
        
        elementsToAnimate.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            // Si el elemento está en el viewport inicial
            if (rect.top < viewportHeight) {
                const delay = Math.min(index * 200, 600);
                element.style.pointerEvents = 'none';
                addVisibleClassWithDelay(element, delay);
            }
        });
    };

    // Función para animar un elemento
    function animateElement(element) {
        // Remover la clase de animación y forzar un reflow
        element.classList.remove('slide-animation');
        void element.offsetWidth;
        // Añadir la clase para iniciar la animación
        element.classList.add('slide-animation');
    }

    // Observer unificado para secciones y footer
    const observer = new IntersectionObserver((entries) => {
        const scrollDirection = getScrollDirection();
        
        entries.forEach(entry => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    // Remover clases anteriores
                    element.classList.remove('slide-animation-up', 'slide-animation-down');
                    // Forzar reflow
                    void element.offsetWidth;
                    // Aplicar nueva animación
                    element.classList.add(scrollDirection === 'down' ? 
                        'slide-animation-down' : 'slide-animation-up');
                });
            } else {
                element.classList.remove('slide-animation-up', 'slide-animation-down');
            }
        });
    }, {
        root: null,
        rootMargin: '10px',
        threshold: 0
    });

    // Observar todos los elementos
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Navegación mejorada
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
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
            elementsToAnimate.forEach(element => {
                element.classList.remove('slide-animation');
            });
        }
    });
});