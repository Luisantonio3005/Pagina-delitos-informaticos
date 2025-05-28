document.body.classList.add('js-enabled');

function revealSectionsOnScroll(forceId) {
    const elements = document.querySelectorAll('section, footer');
    const triggerBottom = window.innerHeight * 0.85;
    const triggerTop = 0;
    let anyVisible = false;

    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < triggerBottom && rect.bottom > triggerTop) {
            element.classList.add('is-visible');
            anyVisible = true;
        } else {
            element.classList.remove('is-visible');
        }
    });

    // Si ninguna sección es visible y hay un id forzado, fuerza la visibilidad
    if (!anyVisible && forceId) {
        const forced = document.querySelector(forceId);
        if (forced) forced.classList.add('is-visible');
    }
}

window.addEventListener('scroll', () => revealSectionsOnScroll());
window.addEventListener('DOMContentLoaded', () => revealSectionsOnScroll());

// Forzar animación y scroll suave al hacer clic en los enlaces del menú
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Espera a que termine el scroll suave antes de revelar
                let lastPosition = -1;
                let checks = 0;
                const checkScroll = setInterval(() => {
                    const current = window.scrollY;
                    if (current === lastPosition || checks > 30) {
                        clearInterval(checkScroll);
                        // Forzar visibilidad de la sección destino si ninguna está visible
                        revealSectionsOnScroll(href);
                    }
                    lastPosition = current;
                    checks++;
                }, 20);
            }
        } else {
            setTimeout(() => revealSectionsOnScroll(), 100);
        }
    });
});