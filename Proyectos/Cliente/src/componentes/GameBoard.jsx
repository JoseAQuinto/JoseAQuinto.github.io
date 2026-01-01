// Importaciones de React y otras librerías
import { useEffect } from 'react'; // Hook de efecto de React
import Cell from './cell.jsx'; // Componente Cell que representa cada casilla del tablero
import { useNavigate } from 'react-router-dom'; // Hook para navegar entre rutas
import { useSelector, useDispatch } from 'react-redux'; // Hooks de Redux para acceder al estado y hacer Dispatch
import { setBoard, setGameOver, setMinesRemaining, updateCellState } from './../features/gameSlice'; // Acciones de Redux para manipular el estado del juego

// Componente principal GameBoard
const GameBoard = () => {
  const navigate = useNavigate(); // Para dirigir al usuario a diferentes rutas
  const dispatch = useDispatch(); // Para hacer dispatch de acciones de Redux
  // Selecciona partes del estado del juego almacenadas en Redux
  const { board, gameOver, minesRemaining, gameData, playerName } = useSelector((state) => state.game);

  // Función asíncrona para revelar una casilla mediante una peticion al servidor (en este caso el local)
  const revealCellServer = async (row, col) => {
    const response = await fetch(`http://localhost:3000/game/${playerName}/${gameData.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row, col }) // Datos enviados al servidor
    });

    const responseData = await response.json(); // Parsea la respuesta JSON del servidor
    if (!response.ok) {
      throw new Error(responseData.error || 'Error al comunicarse con el servidor');
    }

    return responseData; // Devuelve los datos de la respuesta
  };

  // Efecto para inicializar el tablero basado en los datos del juego
  useEffect(() => {
    if (gameData && gameData.height && gameData.width) { // Verifica si los datos del juego están bien
      // Crea un tablero inicial basado en las dimensiones del juego
      const initialBoard = Array.from({ length: gameData.height }, () =>
        Array.from({ length: gameData.width }, () => ({
          revealed: false,
          flagged: false,
          content: '',
          loading: false
        }))
      );
      dispatch(setBoard(initialBoard)); // Establece el tablero en el estado de Redux
      dispatch(setMinesRemaining(gameData.mines)); // Establece el número inicial de minas
    }
  }, [gameData, dispatch]); // Dependencias del useEffect

  // Función para determinar si es posible interactuar con una casilla
  const canInteractWithCell = (row, col) => {
    return !(board[row][col].flagged || board[row][col].revealed || gameOver); // No se puede si está marcada, ya ha sido revelada o si ha acabado el juego
  };

  // Actualiza el estado del juego basado en la casilla revelada
  const updateGameState = (row, col, content) => {
    dispatch(updateCellState({ row, col, updates: { revealed: true, content, loading: false } })); // Actualiza el estado de la casilla

    if (content === 'M') { // Verifica si se ha revelado una mina
      dispatch(setGameOver(true)); // Acaba el juego si se ha revelado una mina
    }
  };

  // Manejador para cuando se hace clic en una casilla
  const handleClickCell = async (row, col) => {
    if (!canInteractWithCell(row, col)) return; // No hace nada si no se puede interactuar con la casilla

    dispatch(updateCellState({ row, col, updates: { loading: true } })); // Indica que la casilla está cargando

    try {
      const { content } = await revealCellServer(row, col); // Revela la casilla a través del servidor
      updateGameState(row, col, content); // Actualiza el estado del juego
    } catch (error) {
      console.error('Error al revelar la casilla:', error);
      dispatch(updateCellState({ row, col, updates: { loading: false } })); // Para la carga si hay un error y muestra un mensaje por consola
    }
  };

  // Manejador para cuando se hace clic derecho en una casilla
  const handleRightClickCell = (e, row, col) => {
    e.preventDefault(); // Hace que el navegador no muestre el tipico menú al hacer click derecho
    if (board[row][col].revealed || gameOver) return; // No hace nada si la casilla ya está revelada o el juego ha acabado

    const flagged = !board[row][col].flagged; // Cambia el estado de marcado de la casilla
    dispatch(updateCellState({ row, col, updates: { flagged: flagged } })); // Actualiza el estado de la casilla
    dispatch(setMinesRemaining(flagged ? minesRemaining - 1 : minesRemaining + 1)); // Actualiza el contador de minas
  };

  // Manejador para reiniciar el juego
  const handleRestartGame = () => {
    navigate('/'); // Navega a la página principal
  };

  // Renderizado del componente
  return (
    <div id="root">
      <header className="page-header">
        <h1>Buscaminas online</h1>
      </header>
      <div className="game-page">
        <h1>Quedan {minesRemaining} minas</h1>
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <Cell
                  key={colIndex}
                  value={cell}
                  onClick={() => handleClickCell(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClickCell(e, rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
        {gameOver && (
          <div className="game-over">
            <h1>Has perdido</h1>
            <button onClick={handleRestartGame} className="button">Jugar otra vez</button>
          </div>
        )}
        <footer className="page-footer">
          <p>Reduciendo la productividad en las empresas desde 1989</p>
        </footer>
      </div>
    </div>
  );
};

export default GameBoard;
