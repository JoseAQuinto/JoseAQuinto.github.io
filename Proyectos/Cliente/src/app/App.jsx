// Importaciones
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './../componentes/HomePage.jsx';
import GameBoard from './../componentes/GameBoard.jsx';

// Componente principal de la aplicación que define la estructura de navegación.
function App() {
  return (
    // Router envuelve las rutas de la aplicación para habilitar la navegación entre páginas.
    <Router>
      {/* Routes contiene las definiciones de ruta individuales. */}
      <Routes>
        {/* Ruta para la página de inicio (Home). Al visitar '/', muestra el componente Home. */}
        <Route path="/" element={<Home />} />
        {/* Ruta para el tablero del juego (GameBoard). Al visitar '/game', muestra GameBoard. */}
        <Route path="/game" element={<GameBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
