// Carregar el mòdul per WebSockets
const WebSocket = require('ws');

// Crear servidor WebSocket
const wss = new WebSocket.Server({ port: 8180 });

const StarHunter = require('./model/StarHunter.js');
const Sala = require('./model/Sala.js');

const WIDTH = process.env.WIDTH;
const HEIGHT = process.env.HEIGHT;
const ESCALA = process.env.ESCALA;
const MIDAJ = WIDTH / ESCALA;
const MIDASTAR = WIDTH / ESCALA / 2;
const TEMPS = process.env.TEMPS;

wss.id = 1;
wss.sala = new Sala();
// Esdeveniment del servidor 'wss' per gestionar la connexió d'un client 'ws'
//	Ha d'enviar la configuració actual al client que s'acaba de connectar
// Ha de crear els gestors dels esdeveniments:
//	- missatge (processar les diferents opcions del missatge)
//	- tancar (quan detecta que el client ha tancat la connexió)

wss.on('connection', ws => {
    ws.id =  `starHunter${wss.id++}`;
	ws.on('message', missatge => {
		processar(ws, missatge);
	})

	ws.on('close', (code, reason) => { 
		tancar(ws);
	})
})

// Funció Broadcast
wss.broadcast = msg => {
   wss.clients.forEach(client => {
       client.send(msg);
    });
};

function processar(ws, missatge) {
	missatge = JSON.parse(missatge);
	switch (missatge.event) {
		case "crear administrador":
			crearAdmin(ws, missatge);
			break;
		case "crearJugador":
			crearJugador(ws, missatge);
			break;
		case "configurar el joc":
			configurar(ws, missatge);
			break;
		case "start o stop":
			estatDelJoc == false ? start(ws, missatge) : stop(ws, missatge);
			break;
		case "actualitzarDireccio":
			actualitzarDireccio(ws, missatge);
			break;
		default:
			console.log("No és pot processar el missatge");
			ws.close();
			break;
	}
}

// Esdeveniment: un client  ha tidJugadorncat la connexió
// Tenir en compte si és un jugador
//	per comptar els que té cada equip
function tancar(ws) {
	if (ws.rol == 'admin') {
		admins.shift(); // Elimina la connexió de l'administrador de l'array admins[]
	}
	else if (ws.rol == 'jugador') {
		//var indexJugador = wss.sala.starHunters.findIndex((jugador) => jugador.id == ws.id); // index del jugador en l'array del seu equip
		//wss.sala.starHunters.splice(indexJugador, 1); // elimina el jugador de l'array equip0[]
	}
	ws.close(); // Tanca el websocket
}

function crearJugador(ws, missatge){
    ws.rol = 'jugador';
    let xPos = Math.floor(Math.random() * (WIDTH - MIDAJ)) + 1;
    let yPos = Math.floor(Math.random() * (HEIGHT - MIDAJ)) + 1;

    let starHunter = 
    {
        id: ws.id,
        xPos: xPos,
        yPos: yPos,
        stars: [],
    };
    wss.sala.starHunters[ws.id] = new StarHunter(starHunter);
    let response = 
    {
        event: 'connectat',
        idJugador: starHunter.id,
    }
	console.log(wss.sala);
    //wss.clients.push(ws);
    //console.log(wss.clients);
    ws.send(JSON.stringify(response));
    //wss.broadcast(JSON.stringify(sala));
    //wss.clients.push(ws);
}

function actualitzarDireccio(ws, missatge){
    wss.sala.starHunters[ws.id].tecla = missatge.tecla;
}

let interval = setInterval(mou, TEMPS);
function mou() {
	if (wss.sala.endgame == false) { // si el joc està en marxa
        for (const property in wss.sala.starHunters) {
			//wss.sala.starHunters[property].xPos = wss.sala.starHunters[property].xPos + 1;
			//wss.sala.starHunters[property].yPos = wss.sala.starHunters[property].yPos + 1;

			
			if (wss.sala.starHunters[property].ultimaTeclaPulsada != wss.sala.starHunters[property].tecla) {
				switch (wss.sala.starHunters[property].tecla) {
				  case "a":
					wss.sala.starHunters[property].rotar = -90;
					  wss.sala.starHunters[property].xPos = wss.sala.starHunters[property].xPos - 1;
					  //actualitzarPosicio("x", -1);
					break;
				  case "s":
					wss.sala.starHunters[property].rotar = 180;
						wss.sala.starHunters[property].yPos = wss.sala.starHunters[property].yPos + 1;
					  //actualitzarPosicio("y", 1);
					break;
				  case "d":
					wss.sala.starHunters[property].rotar = 90;
					wss.sala.starHunters[property].xPos = wss.sala.starHunters[property].xPos + 1;
					  //actualitzarPosicio("x", 1);
					break;
				  case "w":
					wss.sala.starHunters[property].rotar = 0;
					wss.sala.starHunters[property].yPos = wss.sala.starHunters[property].yPos - 1;
					  //actualitzarPosicio("y", -1);
					break;
				}
			}
        }
	}
    //console.log(wss.sala);
    let response = {
        event: 'actualitzarDades',
        sala: wss.sala
    }
	console.log(wss.sala.starHunters);
	wss.broadcast(JSON.stringify(response));
}
//console.log(wss.sala);

module.exports = wss;