document.addEventListener('DOMContentLoaded', function () {
    let swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,    // Número de slides visibles a la vez
        spaceBetween: 30,    // Espacio entre slides
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,  // Tiempo en milisegundos entre cada slide
        },
        effect: 'slide',  // Efecto de transición
        loop: true,       // Activa el loop infinito
        keyboard: {
            enabled: true,
        },
        mousewheel: {
            enabled: true,
        },
        speed: 800,        // Velocidad de animación en milisegundos
    });
});
