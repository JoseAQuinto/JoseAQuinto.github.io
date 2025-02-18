// Importaciones básicas de React y otras librerías.
import React from 'react'; // React base library.
import ReactDOM from 'react-dom/client'; // React DOM, necesario para el montaje en el navegador.
import './app.css'; // Estilos globales de la aplicación.
import App from './app/App'; // Componente principal de la aplicación.
import { store } from './app/store'; // Almacenamiento de Redux configurado para el estado global.
import { Provider } from 'react-redux'; // Componente de React Redux necesario para pasar el store a los componentes.

// Pone el componente principal App dentro del elemento 'root' del DOM.
// ReactDOM.createRoot() crea un contenedor de React (root)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provider envuelve a <App /> para que todos los componentes puedan acceder al store de Redux. */}
    <Provider store={store}>
      <App /> {/* Componente principal que ahora tiene acceso al store de Redux. */}
    </Provider>
  </React.StrictMode>
);
