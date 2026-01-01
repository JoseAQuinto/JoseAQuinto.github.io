// Componente funcional Loading para mostrar un indicador de carga en la interfaz de usuario.
function Loading() {
  return (
    // Contenedor div de la animación.
    <div className="loading">
      {/* Animación CSS para el spinner de carga */}
      <div className="lds-roller">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
}

export default Loading;
