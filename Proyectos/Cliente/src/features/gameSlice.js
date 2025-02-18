// Importación de herramientas necesarias de Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Creación del slice para el juego utilizando Redux Toolkit
export const gameSlice = createSlice({
  name: 'game', // Nombre del slice, utilizado en acciones y selectores
  initialState: { // Estado inicial del slice
    playerName: '', // Nombre del jugador
    difficulty: 'EASY', // Nivel de dificultad del juego, predeterminado a fácil
    board: [], // Tablero de juego, inicialmente vacío
    gameOver: false, // Bandera para determinar si el juego ha terminado
    minesRemaining: 0, // Contador de minas restantes
    gameData: {}, // Datos adicionales del juego, podría incluir ID de partida, etc.
    // Aquí puedes agregar más estados iniciales según sea necesario para tu juego
  },
  reducers: { // Reducers para actualizar el estado
    setGameData: (state, action) => { // Establece los datos del juego
      state.gameData = action.payload; // Actualiza gameData con los datos proporcionados
    },
    setPlayerName: (state, action) => { // Establece el nombre del jugador
      state.playerName = action.payload; // Actualiza playerName con el valor proporcionado
    },
    setDifficulty: (state, action) => { // Establece la dificultad del juego
      state.difficulty = action.payload; // Actualiza difficulty con el valor proporcionado
    },
    setBoard: (state, action) => { // Establece el tablero del juego
      state.board = action.payload; // Actualiza board con el arreglo proporcionado
    },
    setGameOver: (state, action) => { // Establece si el juego ha terminado
      state.gameOver = action.payload; // Actualiza gameOver con el valor booleano proporcionado
    },
    setMinesRemaining: (state, action) => { // Establece el número de minas restantes
      state.minesRemaining = action.payload; // Actualiza minesRemaining con el número proporcionado
    },
    updateCellState: (state, action) => { // Actualiza el estado de una celda específica
      const { row, col, updates } = action.payload; // Extrae fila, columna y actualizaciones
      const cell = state.board[row][col]; // Accede a la celda específica
      Object.assign(cell, updates); // Actualiza la celda con los nuevos valores
      
    },
    // Aquí puedes definir más reducers para manejar diferentes aspectos del estado del juego
  },
});

// Exporta las acciones generadas por el slice para ser usadas en componentes y thunks
export const { setPlayerName, setDifficulty, setBoard, setGameOver, setMinesRemaining, updateCellState, setGameData } = gameSlice.actions;

// Exporta el reducer del slice para ser incluido en el store de Redux
export default gameSlice.reducer;
