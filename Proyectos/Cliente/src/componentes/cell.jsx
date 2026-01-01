import { useState } from 'react';
import Spinner from './Spinner';

// Determina el contenido visual de una casilla basándose en su estado.
const determineCellContent = (value) => {
  // Muestra un spinner (el circulito que gira), si la casilla está cargando.
  if (value.loading) {
    return <Spinner />;
  } 
  // Muestra un icono de bomba o el número de minas alrededor si en la casilla se ha hecho click.
  else if (value.revealed) {
    return value.content === 'M' ? <div className="bomb"></div> : <span className={`color-${value.content}`}>{value.content}</span>;
  } 
  // Muestra una bandera si la casilla ha sido marcada.
  else if (value.flagged) {
    return <div className="flag"></div>;
  }
  // Por defecto, no muestra contenido si la casilla no cumple ninguna condición anterior, es decir si no se le ha hecho nada.
  return null;
};

// Componente que representa una casilla individual en el tablero del jeugo.
const Cell = ({ value, onClick, onContextMenu }) => {
  // Controla si la casilla ha sido clickada para cambiarla.
  const [clicked, setClicked] = useState(false);

  // Maneja el evento click en la casilla, activando la lógica del juego y cambiando su estado visual.
  const handleClick = (e) => {
    if (!value.flagged) { // Ignora clics si la casilla está marcada con una bandera (una flag).
      onClick(e);
      setClicked(true); // Cambia la casilla a un estado "clickado" para cambiar la visualización.
    }
  };

  // Asigna el contenido de la casilla basado en su estado actual.
  const cellContent = determineCellContent(value);

  // Escoge el elemento HTML para la casilla basado en si ha sido clickada o revelada y no está marcada.
  const CellElement = (clicked || value.revealed) && !value.flagged ? 'div' : 'button';

  // Renderiza la casilla con el contenido y los manejadores de eventos que se han aplicado.
  return (
    <CellElement 
      className="square"
      onClick={handleClick}
      onContextMenu={onContextMenu}
    >
      {cellContent}
    </CellElement>
  );
};

export default Cell;
