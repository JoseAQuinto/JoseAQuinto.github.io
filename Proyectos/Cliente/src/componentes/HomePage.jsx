import { useState } from 'react'; // Hook para manejar estado en componentes funcionales
import { useDispatch, useSelector } from 'react-redux'; // Hooks de Redux para manejar acciones y estado
import { setPlayerName, setDifficulty, setGameData, setGameOver } from './../features/gameSlice'; // Acciones de slice de Redux
import { useNavigate } from 'react-router-dom'; // Hook para el useNavigate
import Loading from './Loading'; // Componente para mostrar una pantalla de carga

// Componente Home
const Home = () => {
  const dispatch = useDispatch(); // Permite hacer dispatch a acciones de Redux
  const navigate = useNavigate(); // Permite cambiar de ruta
  // Accede al estado de Redux para obtener el nombre del jugador y la dificultad
  const { playerName, difficulty } = useSelector((state) => state.game);
  // Estado local para manejar la visualización de la pantalla de carga
  const [loading, setLoading] = useState(false);

  // Manejador para cambios en el nombre del jugador
  const handleNameChange = (e) => {
    dispatch(setPlayerName(e.target.value)); // Actualiza el nombre del jugador en el estado de Redux
  };

  // Manejador para cambios en la dificultad del juego
  const handleDifficultyChange = (e) => {
    dispatch(setDifficulty(e.target.value)); // Actualiza la dificultad en el estado de Redux
  };

  // Manejador para la creación de un nuevo juego
  const handleCreateGame = async (e) => {
    e.preventDefault(); // Evita la recarga de la página para que se vea de fondo
    setLoading(true); // Activa la pantalla de carga

    try {
      // Realiza una petición POST para crear un nuevo juego
      const response = await fetch('http://localhost:3000/create-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: playerName, difficulty: difficulty }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la red');
      }

      const gameData = await response.json(); // Extrae los datos del juego de la respuesta
      dispatch(setGameData(gameData)); // Actualiza los datos del juego en el estado de Redux
      dispatch(setGameOver(false)); // Reinicia el estado de finalicación del juego
      navigate('/game', { state: { gameData, playerName } }); // Cambia a la página del juego
    } catch (error) {
      console.error('Falló la creación del juego:', error);
    } finally {
      setLoading(false); // Desactiva la pantalla de carga independientemente del resultado
    }
  };

  // Devuelve el html de la página
  return (
    <div id="root">
      <header className="page-header">
        <h1>Buscaminas online</h1>
      </header>
      <main>
        <div id="home" className="container">
          <h1>Crea un nuevo juego</h1>
          <div className="container">
            <input 
              type="text" 
              className="player-name" 
              placeholder="Introduce tu nombre" 
              value={playerName}
              onChange={handleNameChange}
            />
            <form className="create-game" onSubmit={handleCreateGame}>
              <div className="difficulty">
                { /* Opciones de dificultad para el juego */ }
                <div className="custom-radio">
                  <input 
                    type="radio" 
                    name="difficulty" 
                    id="radio1" 
                    value="EASY" 
                    checked={difficulty === 'EASY'}
                    onChange={handleDifficultyChange}
                  />
                  <label htmlFor="radio1">Principiante</label>
                </div>
                <div className="custom-radio">
                  <input 
                    type="radio" 
                    name="difficulty" 
                    id="radio2" 
                    value="MEDIUM"
                    checked={difficulty === 'MEDIUM'}
                    onChange={handleDifficultyChange}
                  />
                  <label htmlFor="radio2">Intermedio</label>
                </div>
                <div className="custom-radio">
                  <input 
                    type="radio" 
                    name="difficulty" 
                    id="radio3" 
                    value="HARD"
                    checked={difficulty === 'HARD'}
                    onChange={handleDifficultyChange}
                  />
                  <label htmlFor="radio3">Experto</label>
                </div>
              </div>
              <button 
                type="submit" 
                className={`btn btn-primary ${!playerName ? 'disabled' : ''}`} 
                disabled={!playerName}>Crear juego</button>
            </form>
          </div>
        </div>
      </main>
      <footer className="page-footer">
        <p>Reduciendo la productividad en las empresas desde 1989</p>
      </footer>
      {loading && <Loading />} {/* Muestra la pantalla de carga si loading es true */}
    </div>
  );
};

export default Home;
