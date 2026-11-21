# Rediseño del portfolio · notas

Fecha: 21/11/2026 · Rama de trabajo: `redesign/portfolio-20261121`

## 1. Punto de partida y respaldo

| Qué | Valor |
| --- | --- |
| Rama predeterminada | `main` (verificado con `git ls-remote`) |
| Versión publicada (`origin/main`) al empezar | `335ba96b6b43f7d1e8a542622c23503cedc6f166` |
| HEAD local al empezar | `335ba96b6b43f7d1e8a542622c23503cedc6f166` (misma versión, árbol limpio) |
| Etiqueta anotada de respaldo | `pre-portfolio-redesign-20261121-1627` → `335ba96…` |
| Rama remota de respaldo | `backup/pre-portfolio-redesign-20261121-1627` → `335ba96…` |
| Rama `gh-pages` | `5a01b08` (feb. 2025), contenido antiguo sin relación con la web actual; no se ha tocado |

**Estado remoto del respaldo.** La etiqueta existe en la copia local de
`C:\Users\Quinto\OneDrive\Escritorio\porfolio-refactor`, pero **no se ha podido
subir a GitHub**: el entorno de trabajo bloquea el push de etiquetas (HTTP 403)
y el de la carpeta local solo permite clonar y descargar. Como respaldo remoto
equivalente se subió la rama `backup/pre-portfolio-redesign-20261121-1627`, que
apunta exactamente al mismo commit. Para subir también la etiqueta, desde una
terminal en tu equipo:

```powershell
cd "C:\Users\Quinto\OneDrive\Escritorio\porfolio-refactor"
git push origin refs/tags/pre-portfolio-redesign-20261121-1627
git ls-remote --tags origin pre-portfolio-redesign-20261121-1627
```

No había cambios locales sin commit, así que no hizo falta checkpoint aparte.

## 2. Dirección visual

Valoré tres direcciones:

1. **Plano de almacén** (elegida). Papel gris frío, tinta azul pizarra y el
   ámbar de las marcas de suelo de un almacén como único acento.
2. **Hoja técnica suiza.** Monocroma, filetes y tablas. Descartada: fría y
   muy cercana a la plantilla "editorial" genérica.
3. **Panel de operario (HMI).** Oscura con pilotos de estado. Descartada: cae
   en el tópico oscuro + acento chillón y empeora la lectura.

La 1 sale directamente de tu trabajo (SGA/WMS, MES, SAT, ERP) y comunica
software real sin terminales falsas ni neón.

**Decisiones principales**

- **Tipografía:** Archivo variable, autoalojada con
  `@fontsource-variable/archivo` (sin llamadas a Google Fonts). Su eje de
  anchura da titulares condensados con carácter de señalética industrial; el
  texto usa la anchura normal. Escala de 13 → 84 px, cuerpo a 17 px. Sin
  versalitas espaciadas: las etiquetas van en minúscula y peso medio.
- **Color como sistema** (`portfolio.css`, variables `--pf-*`): papel
  `#eef1f0`, superficie `#fff`, tinta `#14212b`, texto secundario `#485763`,
  líneas `#c9d2d5`/`#8f9ca4`, ámbar `#f0a202` solo para estado (sección
  activa, foco, paso del ratón) y para la marca de pasillo.
- **Pieza propia:** en el hero, un "plano del sistema" con los módulos en los
  que trabajas (SGA/WMS, MES, SAT) sobre las capas técnicas que tocas
  (interfaz, API, datos, integración), separados por la cinta de suelo. Es la
  única animación automática: se monta en orden al cargar y se desactiva con
  `prefers-reduced-motion`.
- **Ritmo variado:** proyectos destacados en paneles con puntos clave tipo
  albarán, demos en filas (no tarjetas), apps publicadas en dos columnas,
  experiencia como línea temporal con fechas reales, tecnologías como tabla
  "qué uso y para qué", contacto en bloque oscuro.
- **Radios por jerarquía** (4/6/10 px), no uno para todo; sin sombras
  decorativas ni degradados.
- **Copy:** el H1 dice qué haces; se eliminan frases genéricas ("Enfoque",
  "Selected work", "Listo para producción") y los números decorativos 01–06.

## 3. Contenido actualizado según el CV

Fuente: `CV_JoseAngelQuinto_FullStack.pdf` (versión del 10/11/2026).

- Experiencia: Full-stack developer en Grupo Innova (abr. 2025 – actualidad)
  con las cinco áreas del CV (SGA/WMS, MES, SAT, integración ERP, datos y
  despliegue) y prácticas (ene. – mar. 2025). Sustituye a "consultora
  tecnológica" y a la búsqueda de "rol junior/early-mid".
- Formación (DAW, Administración y Finanzas) e idiomas (ES, valenciano,
  inglés B2, alemán A1), que antes no aparecían.
- Tecnologías: se añaden Zustand, JWT, SignalR, triggers, Gitea Actions y
  .NET 7/8; se conservan TimescaleDB, Row-Level Security y Stimulsoft.
- Contacto: LinkedIn y GitHub pasan a las URLs del CV
  (`linkedin.com/in/joseangelquintoferrandez`, `github.com/JoseAQuinto`).
  **Revisa que la URL de LinkedIn del CV es la vigente**; la anterior era
  `linkedin.com/in/jose-%C3%A1ngel-quinto-ferr%C3%A1ndez-34b2121a0/`.
  El teléfono del CV no se publica en la web.
- Se conservan íntegros los textos, enlaces y credenciales de demo de
  Arcadia WMS, ArcadiaDimension, las demos y las apps publicadas.
- Se retira el contador automático de experiencia: las fechas lo explican
  sin redondeos.

## 4. CV servido

| Ubicación | SHA-256 |
| --- | --- |
| PDF adjuntado (`CV_JoseAngelQuinto_FullStack (1).pdf`) | `ed08b0db8859e73c38fbedff8be6d62480f26bcb513992f074464b8ab143b8d9` |
| `portfolio-react/public/cv/CV_JoseAngelQuinto_FullStack.pdf` (fuente) | igual |
| `cv/CV_JoseAngelQuinto_FullStack.pdf` (copia de publicación) | igual |
| `portfolio-react/dist/cv/…` (build) | igual |
| Descargado desde la vista previa local (`/cv/…`, `application/pdf`) | igual |

Ruta pública: `/cv/CV_JoseAngelQuinto_FullStack.pdf` (sin cambios). Los tres
enlaces de descarga (cabecera, hero y contacto) usan esa ruta y el nombre
`CV_JoseAngelQuinto_FullStack.pdf`.

No tuve acceso de lectura a tu carpeta Descargas, así que la comparación se
hizo con el archivo que adjuntaste. Para confirmarlo contra el original:

```powershell
(Get-FileHash -LiteralPath "C:\Users\Quinto\Downloads\CV_JoseAngelQuinto_FullStack (1).pdf" -Algorithm SHA256).Hash
# Debe dar ED08B0DB8859E73C38FBEDFF8BE6D62480F26BCB513992F074464B8AB143B8D9
```

## 5. Archivos modificados

Todo dentro de `portfolio-react/` salvo el CV de la raíz y este documento.

- `src/modules/portfolio/ProjectsPage.tsx`: portada reescrita.
- `src/modules/portfolio/PortfolioGalleryPage.tsx`: galería armonizada.
- `src/modules/portfolio/components/`: `PortfolioHeader`, `FeaturedProject`,
  `ProjectCard`, `PortfolioGalleryTeaser` reescritos; nuevos `SystemMap`,
  `ContactSection`, `SectionLink`; eliminado `Reveal` (sin consumidores).
- `src/modules/portfolio/sectionNav.ts`, `contact.ts`: nuevos.
- `src/modules/portfolio/portfolio.css`: sistema de diseño nuevo bajo `.pf`;
  eliminado todo el CSS del estilo "Tecno" ya desactivado.
- `src/modules/portfolio/portfolio.types.ts`: tipos ajustados.
- `src/translations/translations.ts`: solo los bloques `projectsPage` (ES/EN).
- `src/modules/components/chatbot/ChatbotWidget.css`: solo se eliminan las
  reglas `body.portfolio-techno-active …` (código muerto). El componente, el
  servicio y la integración del chatbot no cambian.
- `package.json` / `package-lock.json`: `@fontsource-variable/archivo`.
- `portfolio-react/public/cv/…pdf` y `cv/…pdf`: CV nuevo.

**Sin cambios** frente al respaldo (comprobado con `git diff 335ba96`):
`src/projects/**`, `public/visual-planner/**`, `public/img/**`,
`visual-planner/**`, `ProyectosEstudiosGS/**`, `api/**`, `img/**`,
`src/app/AppRoutes.tsx`, `main.tsx`, `App.tsx`, `ChatbotWidget.tsx`,
`chatbotService.ts`.

## 6. Comprobaciones realizadas

- `npm ci` con el lockfile; `npm run build` correcto.
- `npm run lint`: **3 errores y 1 aviso, idénticos a los previos** al
  rediseño (en `src/projects/api-utilityes`, `src/projects/portfolio-demo` y
  `src/translations/LanguageContext.tsx`). Ninguno nuevo; no se tocaron.
- Capturas con Playwright/Chromium a 320, 390, 768, 1024 y 1440 px (ES) y
  390/1440 (EN), antes y después, con el mismo tamaño e idioma. Sin
  desbordamiento horizontal en ningún ancho (se corrigió uno de 4 px a 320).
- Zoom 200 % (viewport CSS 720×450 a escala 2): sin desbordamientos; el
  menú móvil muestra todos los destinos.
- axe-core 4 (WCAG 2.0/2.1 A y AA + buenas prácticas): **0 infracciones** en
  portada ES 1440, portada EN 1440, portada ES 390 y galería. Incluye
  contraste de color.
- Teclado: el primer Tab es "Saltar al contenido"; foco visible (anillo de
  tinta + halo ámbar) en todos los controles; menú móvil con
  `aria-expanded`, cierre con Escape y foco devuelto al botón.
- Jerarquía: un H1 por página, H2 por sección, H3/H4 anidados.
- Navegación: cada enlace del menú (escritorio y móvil) deja la sección
  justo bajo la cabecera fija, mueve el foco a ella, actualiza la sección
  activa y **no cambia la URL** (`/#/`), así que no interfiere con
  `HashRouter`. "Volver arriba" vuelve a 0.
- Idioma: el selector cambia textos y `<html lang>`.
- Copiar email: muestra "Email copiado al portapapeles" (región `aria-live`)
  y el portapapeles contiene la dirección.
- Movimiento reducido: sin animación en el plano ni transiciones.
- Rutas protegidas: `/#/portfolio-demo`, `/#/stock-system`,
  `/#/api-utilities`, `/#/portfolio-gallery` y
  `/visual-planner/index.html` cargan sin errores de página; los enlaces de
  la portada llevan a sus rutas. No se enviaron formularios.
- Consola: sin errores en la portada. En la galería aparecen errores de los
  iframes de las webs externas (Netlify), también presentes en la versión
  anterior: en el entorno de pruebas no hay red hacia esos dominios.

**No verificado / pendiente**

- Sin Lighthouse: no se ejecutó, así que no hay puntuaciones.
- `ProyectosEstudiosGS/` vive solo en la raíz (no en `public/`), por lo que
  `vite preview` no lo sirve; en GitHub Pages sigue igual que antes porque
  ni la carpeta ni el despliegue la tocan.
- La URL de LinkedIn del CV no se pudo abrir desde el entorno (LinkedIn
  exige sesión).

## 7. Vista previa y recuperación

Vista previa local de la rama:

```powershell
cd "C:\Users\Quinto\OneDrive\Escritorio\porfolio-refactor"
git switch redesign/portfolio-20261121
cd portfolio-react
npm ci
npm run dev            # http://localhost:5173/#/
# o, como en producción:
npm run build; npm run preview   # http://localhost:4173/#/
```

Abrir la versión anterior **sin borrar nada** (en una rama aparte):

```powershell
git fetch origin
git switch -c revisar-version-anterior pre-portfolio-redesign-20261121-1627
# o, si no tienes la etiqueta en ese equipo:
git switch -c revisar-version-anterior origin/backup/pre-portfolio-redesign-20261121-1627
```

Recuperar archivos concretos de la versión anterior sobre la rama actual
(crea cambios nuevos, no reescribe historia):

```powershell
git restore --source pre-portfolio-redesign-20261121-1627 -- portfolio-react/src/modules/portfolio
git restore --source pre-portfolio-redesign-20261121-1627 -- portfolio-react/public/cv cv
```

Volver a publicar la versión anterior sin reescribir historia: crear un
commit que revierta los del rediseño (`git revert <sha>…`) en `main` y
ejecutar `deploy.ps1`. No se ha ejecutado ninguna restauración.
