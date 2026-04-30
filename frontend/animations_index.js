document.addEventListener("DOMContentLoaded", () => {
    // Animación de aparición al hacer scroll
    const elementos = document.querySelectorAll("section, .highlight-card, .feature-item, .testimonial-card");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animado");
            }

        });
    }, {
        threshold: 0.15
    });
    elementos.forEach(el => {
        el.classList.add("oculto");
        observer.observe(el);
    });

    // Animación botones
    const botones = document.querySelectorAll("a");
    botones.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            btn.style.transform = "scale(1.05)";
            btn.style.transition = "transform 0.2s ease";
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "scale(1)";
        });
    });

    // Animación imágenes
    const imagenes = document.querySelectorAll("img");
    imagenes.forEach(img => {
        img.addEventListener("mouseenter", () => {
            img.style.transform = "scale(1.03)";
            img.style.transition = "transform 0.4s ease";
        });
        img.addEventListener("mouseleave", () => {
            img.style.transform = "scale(1)";
        });
    });

    // Animación header al cargar
    const header = document.querySelector("header");
    header.style.opacity = "0";
    header.style.transform = "translateY(-20px)";
    header.style.transition = "all 0.6s ease";
    setTimeout(() => {
        header.style.opacity = "1";
        header.style.transform = "translateY(0)";
    }, 200);
});

// Clases de animación
const style = document.createElement("style");
style.innerHTML = `
.oculto{
opacity:0;
transform: translateY(40px);
transition: all 0.8s ease;
}

.animado{
opacity:1;
transform: translateY(0);
}
`;

document.head.appendChild(style);