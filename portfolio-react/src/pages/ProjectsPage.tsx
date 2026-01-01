import { useEffect, useMemo, useState } from "react";

const PROJECTS = [
  {
    id: 1,
    title: "Proyecto 1",
    description: "Landing page minimalista y responsive. | BOOTSTRAP | CSS | HTML |",
    image: "/img/zoo1.png",
    href: "/Proyectos/LandingPageBoostrap/index.html",
  },
  {
    id: 2,
    title: "Proyecto 2",
    description: "Proyecto de página web de restaurante. | HTML | CSS | JS |",
    image: "/img/restaur1.png",
    href: "/Proyectos/LaDolceTavolaRestaurante/DolceTavolaHome.html",
  },
  {
    id: 3,
    title: "Proyecto 3",
    description: "Próximo proyecto | ? |",
    image: "/img/prox.jpg",
    href: "",
    disabled: true,
  },
];

export default function ProjectsPage() {
  // 1) Estado del modo oscuro (simple)
  const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem("darkMode");
  return saved === "true";
});


  // 2) Estado para animación de cards
  const [visibleIds, setVisibleIds] = useState(() => new Set());

useEffect(() => {
  document.body.classList.toggle("dark-mode", darkMode);
  localStorage.setItem("darkMode", String(darkMode));

  return () => {
    document.body.classList.remove("dark-mode");
  };
}, [darkMode]);


  // Cada vez que cambie darkMode: (a) aplicar clase al body y (b) guardar en localStorage
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", String(darkMode));

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [darkMode]);

  // Animación escalonada al cargar
  useEffect(() => {
    const timers = PROJECTS.map((p, index) =>
      window.setTimeout(() => {
        setVisibleIds((prev) => new Set(prev).add(p.id));
      }, index * 200)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const projects = useMemo(
    () => PROJECTS.map((p) => ({ ...p, isVisible: visibleIds.has(p.id) })),
    [visibleIds]
  );

  return (
    <>
      <button
        id="darkModeToggle"
        className="btn btn-secondary"
        onClick={() => setDarkMode((v) => !v)}
        aria-pressed={darkMode}
        aria-label="Alternar modo oscuro"
        type="button"
      >
        🌙 Modo Oscuro
      </button>

      <div className="parallax">
        Bienvenido a mi Portafolio
        <div className="scroll-indicator">
          <i className="fas fa-chevron-down" aria-hidden="true"></i>
        </div>
      </div>

      <div className="container my-5">
        <a href="/index.html" className="btnatras">
          Volver atrás
        </a>

        <h2 className="text-center mb-4 title2">Mis Proyectos</h2>

        <div className="row g-4">
          {projects.map((p) => (
            <div key={p.id} className="col-md-4">
              <div className={`card project-card hidden ${p.isVisible ? "fade-in" : ""}`}>
                <img src={p.image} className="card-img-top" alt={p.title} />
                <div className="card-body text-center">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text">{p.description}</p>

                  {p.disabled ? (
                    <button className="btn btn-primary" disabled type="button">
                      Ver más
                    </button>
                  ) : (
                    <a
                      href={p.href}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver más
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BackToTop />

      <footer className="footer-section text-center py-4">
        <div className="container">
          <div className="social-icons mb-3">
            <a
              href="https://www.linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/"
              className="text-white mx-2"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin" aria-hidden="true"></i>
            </a>
            <a
              href="https://github.com/JoseAQuinto/JoseAQuinto.github.io"
              className="text-white mx-2"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github" aria-hidden="true"></i>
            </a>
          </div>
          <p>&copy; Jose Ángel Quinto Ferrández | Portafolio 2025 | Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      id="backToTop"
      className={`back-to-top ${show ? "show" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      type="button"
      aria-label="Volver arriba"
    >
      <i className="fas fa-arrow-up" aria-hidden="true"></i>
    </button>
  );
}
