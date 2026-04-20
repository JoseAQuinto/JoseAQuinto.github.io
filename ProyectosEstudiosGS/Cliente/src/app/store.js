// Importaciones necesarias para configurar el almacenamiento global de Redux.
import { configureStore } from '@reduxjs/toolkit'; // Herramienta de Redux Toolkit para configurar la tienda.
import gameReducer from './../features/gameSlice'; // Reductor específico para la lógica del juego.

// Creación y exportación del store de Redux.
// Se configura el store global de la aplicación utilizando Redux Toolkit.
export const store = configureStore({
  reducer: {
    game: gameReducer, // Asigna el gameReducer al slice 'game' del estado global.
  },
});
