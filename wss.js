// Carregar el mòdul per WebSockets
const WebSocket = require('ws');

// Crear servidor WebSocket
const wss = new WebSocket.Server({ port: 8180 });

const StarHunter = require('./model/StarHunter.js');
const Sala = require('./model/Sala.js');
const { ProxyAuthenticationRequired } = require('http-errors');

const WIDTH = process.env.WIDTH;
const HEIGHT = process.env.HEIGHT;
const ESCALA = process.env.ESCALA;
const MIDAJ = WIDTH / ESCALA;
const MIDASTAR = WIDTH / ESCALA / 2;
const TEMPS = process.env.TEMPS;

var config = {
	width: WIDTH,
	height: HEIGHT,
	escala: ESCALA,
	midaj: MIDAJ,
	midastar: MIDASTAR,
	numStars: process.env.NUMSTARS
};

wss.id = 1;
wss.sala = new Sala(config);
// Esdeveniment del servidor 'wss' per gestionar la connexió d'un client 'ws'
//	Ha d'enviar la configuració actual al client que s'acaba de connectar
// Ha de crear els gestors dels esdeveniments:
//	- missatge (processar les diferents opcions del missatge)
//	- tancar (quan detecta que el client ha tancat la connexió)

wss.on('connection', ws => {
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
		case "crearAdmin":
			crearAdmin(ws, missatge);
			break;
		case "crearJugador":
			crearJugador(ws, missatge);
			break;
		case "configurar el joc":
			configurar(ws, missatge);
			break;
		case "startStop":
			wss.sala.endgame == false ? stop(ws, missatge) : start(ws, missatge);
			break;
		case "actualitzarDireccio":
			actualitzarDireccio(ws, missatge);
			break;
		default:
			console.log("No és pot processar el missatge");
			ws.close();
			break;
	}
	/*
	let response = {
		event: 'actualitzarDades',
		sala: wss.sala
	}
	wss.broadcast(JSON.stringify(response));
	*/
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

function stop(ws, m) {
	if (ws.rol != 'admin') { // Si no és administrador
		ws.close(1001, 'No ets administrador.');
	}
	else if (wss.sala.endgame == true) { // si el joc està en marxa
		ws.send('El joc ja està en aturat.');
	}
	else {
		console.log('stop');
		wss.sala.endgame = true;
		/*
		var msg = {
			accio: 'aturar'
		};
		ws.send(JSON.stringify(msg));
		*/
	}
}

function start(ws, m) {
	if (ws.rol != 'admin') { // Si no és administrador
		ws.close(1001, 'No ets administrador.');
	}
	else if (wss.sala.endgame == false) { // si el joc està en marxa
		ws.send('El joc ja està en marxa.');
	}
	else {
		console.log('start');
		wss.sala.endgame = false;
		wss.sala.reiniciarSala();
		console.log(wss.sala);
		//wss.sala.generarEstrelles();
		/*
		var msg = {
			accio: 'aturar'
		};
		ws.send(JSON.stringify(msg));
		*/
	}
}

var admins = [];
function crearAdmin(ws, m) {
	if (admins.length < 1) { // Si no tenim cap administrador
		ws.rol = "admin";
		admins.push(ws);

		var resultat = {
			accio: 'connectat',
			config: config
		}

		ws.send(JSON.stringify(resultat));
	}
	else {
		ws.close(1013, "Ja existeix un administrador");
	}
	
}

function crearJugador(ws, missatge){
	ws.id =  `starHunter${wss.id++}`;
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
    wss.sala.starHunters.push(new StarHunter(starHunter));
    let response = 
    {
        event: 'connectat',
        starHunter
    }
	//console.log(wss.sala);
    //wss.clients.push(ws);
    //console.log(wss.clients);
    ws.send(JSON.stringify(response));
    //wss.broadcast(JSON.stringify(sala));
    //wss.clients.push(ws);
}

function actualitzarDireccio(ws, missatge){
    //wss.sala.starHunters[ws.id].tecla = missatge.tecla;
	let indexNau = wss.sala.getStarHunterIndexById(ws.id);
	wss.sala.starHunters[indexNau].tecla = missatge.tecla;
}

function actualitzarPosicio(nau, coordenada, suma){
	if (coordenada === "x") {
	  if (nau.xPos + suma < 0) {
		// Si la próxima coordenada al eix X és menor a 0
	  } else if (nau.xPos + suma > WIDTH - MIDAJ) {
		// Si la próxima coordenada al eix X > amplada del joc - mida de la nau
	  } else {
		nau.xPos += suma; //Guarda la nova coordenada
	  }
	}
	if (coordenada === "y") {
	  if (nau.yPos + suma < 0) {
		// Si la próxima coordenada al eix Y és menor a 0
	  } else if (nau.yPos + suma > HEIGHT - MIDAJ) {
		// Si la próxima coordenada al eix Y > alçada del joc - mida de la nau
	  } else {
		nau.yPos += suma; // Guarda la nova coordenada
	  }
	}
	nau.ultimaTeclaPulsada = nau.tecla;
	//console.log(this.obj);

	//this.actualitzarPuntuacio();
  }


function comprovarFinalPartida(){
	if(wss.sala.estrellesRestants() === 0){
		wss.sala.endgame = true;
	}
}

function puntuar(jugador){
	//let index = 0;
	for (star of wss.sala.stars) {
		if (Math.abs(jugador.xPos - star.xPos) <= wss.sala.config.midastar && Math.abs(jugador.yPos - star.yPos) <= wss.sala.config.midastar) { // si el jugador està tocant o sobre la pedra
			/*
			if (pedra.id == undefined) { // si la pedra no la té cap jugador
				pedra.id = jugador.id;
			}
			else if (pedra.id == jugador.id) { // si la pedra ja té un id
				puntuar(jugador, pedra); // intenta puntuar
				delete pedra.id; // eliminar id
			}
			*/
			const index = wss.sala.stars.indexOf(star);
			if (index > -1) {
				jugador.stars.push(wss.sala.stars.splice(index, 1)[0]);
			}
			//let newStar = .slice(index, 1);
			//jugador.stars.push(newStar[0]);
			//console.log(newStar);
		}
	}
	return jugador;
}

let interval = setInterval(mou, TEMPS);
function mou() {
	let copiaJugadors = Object.values(wss.sala.starHunters).slice();
	if (wss.sala.endgame == false) { // si el joc està en marxa
        for (let jugador of copiaJugadors) {
			switch (jugador.tecla) {
				  case "a":
					jugador.rotar = -90;
					actualitzarPosicio(jugador, 'x', -1);
					break;
				  case "s":
					jugador.rotar = 180;
					actualitzarPosicio(jugador, 'y', +1);
					break;
				  case "d":
					jugador.rotar = 90;
					actualitzarPosicio(jugador, "x", 1);
					break;
				  case "w":
					jugador.rotar = 0;
					actualitzarPosicio(jugador, "y", -1);
					break;
			}
			jugador = puntuar(jugador);
        }
		comprovarFinalPartida();
	}
	wss.sala.starHunters = copiaJugadors;
    //console.log(wss.sala);
    let response = {
        event: 'actualitzarDades',
        sala: wss.sala
    }
	wss.broadcast(JSON.stringify(response));
}
//console.log(wss.sala);

module.exports = wss;