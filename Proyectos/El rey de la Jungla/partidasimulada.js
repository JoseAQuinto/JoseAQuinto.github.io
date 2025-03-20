// ranked simulator
// Mensajes aleatorios para el simulador
const resultados = [
    "HardyaUgS ha decidido invadir solo a nivel 1... y ha muerto sin usar smite. Buena suerte en el 4v5.",
    "Minuto 10: HardyaUgS aún no ha gankeado ninguna línea, pero ha farmeado Krugs 7 veces. Objetivos: 0.",
    "El equipo enemigo empieza Dragón. HardyaUgS sigue en Gromp. La jugada maestra de ‘scaling’ en acción.",
    "HardyaUgS ha intentado robar el Barón, pero smiteó a un minion en su lugar. GG.",
    "Tu equipo inicia una pelea 4v5 porque HardyaUgS ha decidido que Krugs son más importantes.",
    "Minuto 15: HardyaUgS tiene 0/6/1, pero ya ha pingueado 'report team'.",
    "HardyaUgS ha hecho un ‘gank sorpresa’… sin mirar el minimapa. El jungla enemigo lo esperaba.",
    "El ADC enemigo está solo en bot, pusheando sin wards. HardyaUgS decide gankear top bajo torre enemiga.",
    "‘Tranquilos, estoy escalando’, dice HardyaUgS mientras el marcador está 5-20 en minuto 8.",
    "El equipo enemigo hace Barón. HardyaUgS flashea dentro… pero se olvida de smitear. Robado por el support enemigo.",
    "HardyaUgS va 0/7/2 pero ha comprado Mejai’s ‘para el comeback’.",
    "HardyaUgS decide jugar Lee Sin, pero se da cuenta en minuto 5 de que no sabe hacer Insec. Procede a jugar full tanque.",
    "‘No tengo smite, pero podemos pelear el dragón’, dice HardyaUgS segundos antes de perderlo por 700 de vida.",
    "El enemigo invade la jungla de HardyaUgS. HardyaUgS se queda en base escribiendo un ensayo sobre por qué mid no le hace follow.",
    "HardyaUgS ultea con Vi… a una Lulu con Zhonya y Flash. Luego dice ‘wtf, no sé qué pasó’ en el chat.",
    "El equipo enemigo se hace el Alma de Dragón. HardyaUgS pinguea a su equipo, pero él estaba… en Krugs, totalmente de chill.",
    "HardyaUgS pingeó ‘en camino’ a mid. Luego cambió de opinión y se fue a farmear golems.",
    "El support de HardyaUgS ha comprado wards. HardyaUgS ha comprado otro espadón porque ‘más daño, mejor’.",
    "HardyaUgS inicia una teamfight… y luego smitea el rojo en medio del combate. Muere instantáneamente.",
    "HardyaUgS gankea bot... pero olvida que la línea está pusheada. Su equipo lo ve morir bajo torre enemiga.",
    "Minuto 25, HardyaUgS aún no ha comprado el item de jungla completo. ‘No lo necesito’, dice mientras muere en un 1v1 contra el soporte enemigo.",
    "HardyaUgS no ha visto el minimapa en 20 minutos. Dice que ‘todo está controlado’ segundos antes de ser emboscado.",
    "‘No puedo pelear sin smite’, dice HardyaUgS, pero segundos después gankea top con 300 de vida y sin flash.",
    "HardyaUgS roba el red enemigo a nivel 1. Procede a escribir ‘carryo yo’ en el chat y termina 0/9/4.",
    "HardyaUgS pinguea asistencia en el cangrejo del río mientras su equipo está en una pelea 4v5.",
    "HardyaUgS decide que la mejor forma de ayudar a su equipo es... hacer split push con un campeón sin escape.",
    "‘Mejor no peleamos’, dice HardyaUgS justo después de fallar un smite a dragón por 800 de vida.",
    "HardyaUgS juega Udyr jungla, pero en minuto 20 aún no ha usado la R. ‘No es meta’, dice con confianza.",
    "Tu equipo ha ganado la partida. HardyaUgS dice ‘ez’ en /all después de ser carreado con un KDA de 2/11/5.",
];


// Función que elige un resultado aleatorio
function simularRanked() {
    const resultado = resultados[Math.floor(Math.random() * resultados.length)];
    document.getElementById("resultado-partida").innerText = resultado;
}

// Agregar el evento al botón
document.getElementById("simulador-btn").addEventListener("click", simularRanked);

