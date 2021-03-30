"use strict";

var arrel = "http://localhost:8080";

var ws = new WebSocket('ws://localhost:8180/');

let WIDTH;
let HEIGHT;
let ESCALA;
let MIDAJ;
let MIDASTAR;

var windowGame;
var endGame;

var sala;
var starHunter;

var idJugador;

function dibuixarStar(id) {
  return `<svg id="${id}" class="star" width="${MIDASTAR}" height="${MIDASTAR}" version="1.1" viewBox="-45 -45 90 90" xmlns="http://www.w3.org/2000/svg">
    <path d="m-4-35c2-4 6-4 8 0l10 19 22 4c4 1 5 4 2 7l-15 16 3 24c0 3-1 4-4 3l-22-11-22 11c-2 1-4 0-4-3l3-24-15-16c-3-3-3-6 2-7l22-4z" style="fill:#ff0;stroke-linecap:round;stroke-linejoin:round;stroke-width:3;stroke:#000"/>
    </svg>
    `;
}

function dibuixarNau(id) {
  return `<svg id="${id}" class="nau" width="${MIDAJ}" height="${MIDAJ}" version="1.1" viewBox="-45 -60 90 90" xmlns="http://www.w3.org/2000/svg">
     <path d="m6-11h-12l4-20c1-2.66 3-2.73 4 0zm-10 14h8v24h-8zm42 16-3-30-3 12-16-12-9-38c-3-11-11-11-14 0l-9 38-16 12-3-12-3 30z" style="stroke-linecap:round;stroke-linejoin:round;stroke-width:4;stroke:#000"/>
    </svg>`;
}

function end() {
  endGame = true;
}

class Star {
  constructor(star) {
    this.id = star.id;
    this.xPos = star.xPos;
    this.yPos = star.yPos;

    this.spawn();
  }

  spawn() {
    windowGame.append(dibuixarStar(`${this.id}`));
    this.obj = $(`#${this.id}`);

    // First Spawn Position
    var transformAttr = { transform: `translate(${this.xPos}px, ${this.yPos}px)` };
    this.obj.css(transformAttr);
  }

}

class StarHunter {
  constructor(starhunter) {
    //var a = this;

    this.id = starhunter.id;
    this.xPos = starhunter.xPos;
    this.yPos = starhunter.yPos;
    this.stars = starhunter.stars;
    this.rotar = starhunter.rotar;

    this.spawn();
    this.actualitzarPuntuacio();
  }

  spawn() {
    windowGame.append(dibuixarNau(`${this.id}`));
    $('#taula-puntuacions').find('tbody').append(`<tr id="puntuacio-${this.id}"><td>${this.id}</td><td>${this.stars.length}</tr>`);
    this.obj = $(`#${this.id}`);

    // First Spawn Position
    var transformAttr = { transform: `translate(${this.xPos}px, ${this.yPos}px) rotate(${this.rotar}deg)` };
    this.obj.css(transformAttr);
  }

  actualitzarPuntuacio() {
    $("#estrelles").attr("value", this.stars.length);
  }
}

let ultimaTeclaPulsada;
  // Mou la nau depenent de la tecla pulsada
function mou(tecla) { 
    const enviarTeclaPulsada = () => {
      let msg = {
        event : 'actualitzarDireccio',
        tecla: tecla,
      }
     
			ws.send(JSON.stringify(msg));

      ultimaTeclaPulsada = tecla;
      console.log(tecla);
    };
    if (ultimaTeclaPulsada != tecla) {
      switch (tecla) {
        case "a":
          enviarTeclaPulsada();
          break;
        case "s":
          enviarTeclaPulsada();
          break;
        case "d":
          enviarTeclaPulsada();
          break;
        case "w":
          enviarTeclaPulsada();
          break;
      }
    }
  }

const actualitzarDades = (dades) => {
      
      sala = dades.sala;
      endGame = sala.endgame;
      $('#taula-puntuacions').find('tbody').empty();
      windowGame.empty();
      configurar(sala.config);

      for (let star of sala.stars) {
        new Star(star);
      }

      for (let starHunter of sala.starHunters) {
        console.log(starHunter);
        let jugador = new StarHunter(starHunter);
        if(jugador.id === idJugador){
          jugador.obj.attr("id", idJugador);
          jugador.obj.addClass("self");
          $(`#puntuacio-${idJugador}`).css('background','red');
        }
      }

      isGameEnded();
      
}

function isGameEnded(){
  (endGame) ? $('#joc').css('border', '1px solid red') : $('#joc').css('border', '1px solid palegreen');
} 

function configurar(config){

 let {escala, height, midaj, midastar, numStars, width} = config;
  ESCALA = escala;
  HEIGHT = height;
  MIDAJ = midaj;
  MIDASTAR = midastar;
  WIDTH = width;

 windowGame.css({
    width: WIDTH,
    height: HEIGHT,
  });
 console.log(config);
}

function processar(dades){
	switch(dades.event){
		case 'connectat':
			idJugador = dades.starHunter.id;
			break;
		case 'configurar':
			config = dades.config;
			configurar(config);
		break;
		case 'actualitzarDades':
      actualitzarDades(dades);
			break;
		case 'missatge':
			console.log(dades.missatge);
			break;
	}
}

// Afegir controladors d'esdeveniments (teclat i ratolí)
// i qualsevol altre cosa que calgui inicialitzar
function init() {
    window.addEventListener("keydown", (e) => mou(e.key));

    ws.onopen = () => {
      var m = {event: 'crearJugador'};
      ws.send(JSON.stringify(m));
    };

    ws.onclose = e => {
      alert(`S'ha tancat la connexió: ${e.reason}`);
      window.location.replace(arrel);
    }

    ws.onmessage = e => {
      var dades = JSON.parse(e.data);
      processar(dades);
    }

    window.onbeforeunload = () => {
      ws.onclose = function () {};
      ws.close();
    };
}

(function _init() {
  windowGame = $("#joc");
  init();
})();
