// Seleccionamos los elementos
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const cajaPrincipal = document.querySelector(".cajaprincipal");
const body = document.body;

// Evento para alternar el menú y ajustar el padding del contenido
menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active"); // Abre/cierra el menú

    if (sidebar.classList.contains("active")) {
        menuBtn.style.backgroundColor = "#fff";
        menuBtn.style.color = "#000";
        cajaPrincipal.style.paddingLeft = "250px"; // Ajusta al ancho del menú
    } else {
        menuBtn.style.backgroundColor = "#333";
        menuBtn.style.color = "#fff";
        cajaPrincipal.style.paddingLeft = "0";
    }
});
