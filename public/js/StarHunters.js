"use strict";

var ws = new WebSocket('ws://localhost:8180/'); // The '81' here is the Port where the WebSocket server will communicate with
// The instance of the WebSocket() class (i.e. Socket here), must need to be globally defined

const WIDTH = 640;
const HEIGHT = 480;
const ESCALA = 10;
const MIDAJ = WIDTH / ESCALA;
const MIDASTAR = WIDTH / ESCALA / 2;

var offset;

var windowGame;
var destructor;
var exercit;
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
  //clearInterval(starHunter.timer);
  //clearInterval(exercit.timer);
  //clearInterval(missil.timer);
}

/*
class Missil {
    constructor() {
        var a = this;

        this.active = false;
        this.xPos = 0;
        this.yPos = 0;

        windowGame.innerHTML += "<line id='missil' x1='0' y1='-10' x2='0' y2='-20' stroke='#000000' stroke-width='4' fill='none'></line>";

        // Velocitat de moviment del míssil
        this.timer = setInterval(function () { a.move(); }, 10);
    }
    
    // Inicialitza posició del míssil
    fire(x, y) {
        if (this.active || endGame) return;
        var m = document.getElementById('missil');
        this.xPos = x;
        this.yPos = y;
        m.setAttribute("x1", x);
        m.setAttribute("y1", y);
        m.setAttribute("x2", x);
        m.setAttribute("y2", y + 12);
        this.active = true;
    }

    // Detecta si el míssil ha tocat un alien
    impact(x, y) {
        var a, ar;
        for (a of exercit.obj.children) {
            ar = a.getBoundingClientRect();
            if (x >= ar.left && x <= ar.right && y >= ar.top && y <= ar.bottom) {
                // Elimina l'alien
                a.remove();         // Elimina l'alien
                this.yPos = -20;        // Amaga el míssil
                exercit.impact();   // Notifica que s'ha eliminat un alien
                return;
            }
        }
    }
    
    // Fa avançar el míssil si està actiu
    move() {
        if (!this.active) return;
        var m = document.getElementById('missil');
        this.yPos -= 5;
        m.setAttribute("y1", this.yPos); 
        m.setAttribute("y2", this.yPos + 12);

        // Desactivar el míssil si està fora de la pantalla
        if (this.yPos < -12) this.active = false;

        // Comprovar si ha tocat un alien
        var r = m.getBoundingClientRect();
        this.impact(r.left, r.top);
    }
}
*/

class Star {
  constructor(star) {
    //var a = this;
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

  /*
    // Comprovacions per acabar el joc
    impact() {
        if (!exercit.obj) return false;

        var r = this.obj.getBoundingClientRect();
        var re = exercit.obj.getBoundingClientRect();

        // Detectar si els aliens poden tocar la nau (si estan prou avall)
        if (r.top > re.bottom) return false;

        // Detectar si algun alien està tocant la nau
        var a, ar;
        for (a of exercit.obj.children) {
            ar = a.getBoundingClientRect();
            if (ar.bottom >= r.top && 
                ((ar.left >= r.left && ar.left <= r.right) ||
                 (ar.right >= r.left && ar.right <= r.right))) {
                return true;
            }
        }

        // Detectar si els aliens han arribat a terra
        if (r.bottom < re.bottom) return true;

        return false;
    }

    // Comprovar si s'ha de finalitzar el joc
    check() {
        if (this.impact()) {
            end();
            this.obj.remove();
        }
    }
        */

  // Mou la nau depenent de la tecla pulsada
  /*
    move(key) {
        const updatePosition = (coordenada, suma) => {
            console.log(this.xPos, this.yPos);
            if (coordenada === 'x') {
                if (this.xPos + suma < 0) { // Si la próxima coordenada al eix x és menor a 0
                    clearInterval(this.timer);
                }
                else if (this.xPos + suma > WIDTH - MIDAJ) { // Si la próxima coordenada al eix x > amplada del joc - mida de la nau
                    clearInterval(this.timer);
                }
                else {
                    this.xPos += suma; //Guarda la nova coordenada
                }
            }
            if (coordenada === 'y') {
                if (this.yPos + suma < 0) { // Si la próxima coordenada al eix y és menor a 0
                    clearInterval(this.timer);
                }
                else if (this.yPos + suma > HEIGHT - MIDAJ) { // Si la próxima coordenada al eix y > alçada del joc - mida de la nau
                    clearInterval(this.timer);
                }
                else {
                    this.yPos += suma; // Guarda la nova coordenada
                }
            }

            // Mou la nau
            this.obj.css({
                'transform': `translate(${this.xPos}px, ${this.yPos}px) rotate(${this.rotate}deg)`
            });
        };
        let move;
        const sendKey = () => {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(move, 20);
            this.lastKey = key;
            console.log(key);
        }
        if (this.lastKey != key) {
            switch (key) {
                case 'a':
                    this.rotate = -90;
                    move = () => {
                        updatePosition('x', -1);
                    }
                    sendKey();
                    break;
                case 's':
                    this.rotate = 180;
                    move = () => {
                        updatePosition('y', 1);
                    }
                    sendKey();
                    break;
                case 'd':
                    this.rotate = 90;
                    move = () => {
                        updatePosition('x', 1);
                    }
                    sendKey();
                    break;
                case 'w':
                    this.rotate = 0;
                    move = () => {
                        updatePosition('y', -1);
                    }
                    sendKey();
                    break;
            }
        }
    }
    */

  /*
    // Dispara un míssil segons la posició de la nau    
    fire() {
        this.missil.fire(destructor.xPos, destructor.yPos - 15);
    }
    */
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
      //this.timer = setInterval(mou, 20);
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
      endGame = sala.endGame;
      $('#taula-puntuacions').find('tbody').empty();
      windowGame.empty();

      //debugger;

      /*
      sala.stars.forEach((star, i) => {
        sala.stars[i] = new Star(star);
        console.log(sala.stars[i].obj.get(0).getBoundingClientRect());
      });
      */
      
      //let selfIndex = sala.starHunters.findIndex((starhunter) => starhunter.id === idJugador);
/*       let self = new StarHunter(sala.starHunters[idJugador]);
      self.obj.attr("id", "self"); */

      //console.log(idJugador);
      //console.log(dades);
      for (let star of sala.stars) {
        new Star(star);
        //sala.starHunters.push(new StarHunter(starHunter));
        //console.log(sala.starHunters[property].xPos);
      }
      console.log(sala.stars);

      for (let starHunter of sala.starHunters) {
        console.log(starHunter);
        let jugador = new StarHunter(starHunter);
        //sala.starHunters.push(new StarHunter(starHunter));
        if(jugador.id === idJugador){
          //let indexNau = sala.starHunters.findIndex((starhunter) => starhunter.id === idJugador);
          jugador.obj.attr("id", idJugador);
          jugador.obj.addClass("self");
          $(`#puntuacio-${idJugador}`).css('background','red');
        }
        //console.log(sala.starHunters[property].xPos);
      }

      isGameEnded();
      

      //console.log(sala.starHunters[idJugador].xPos);
      
      //let naus = Object.entries(sala.starHunters);
      //naus.forEach((nau, i) => sala.starHunters[i] = new StarHunter(nau));
}

function isGameEnded(){
  (endGame) ? $('#joc').removeClass('start-joc') : $('#joc').addClass('start-joc');
} 

function processar(dades){
	switch(dades.event){
		case 'connectat':
			idJugador = dades.starHunter.id;
			//config = dades.config;
			//configurar(config);
			break;
		case 'configurar':
			config = dades.config;
			configurar(config);
			document.getElementById('pisos').value=dades.config.pisos;
		break;
		case 'actualitzarDades':
      actualitzarDades(dades);
			//dibuixar(dades.jugadors, dades.pedres, dades.punts);
			break;
		case 'missatge':
			console.log(dades.missatge);
			break;
	}
}

// Afegir controladors d'esdeveniments (teclat i ratolí)
// i qualsevol altre cosa que calgui inicialitzar
function init() {
    //setTimeout(actualitzarDades, 0);
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
    //actualitzarDades();
}

/***********************************************
 * FINAL DE L'APARTAT ON POTS FER MODIFICACIONS *
 ***********************************************/

(function _init() {
  windowGame = $("#joc");
  windowGame.css({
    width: WIDTH,
    height: HEIGHT,
  });
  //offset = windowGame.getBoundingClientRect().left;
  endGame = false;
  //console.log(offset);
  //starHunter = new StarHunter();
  //console.log(starHunter);

  //destructor = new Destructor();
  //exercit = new Exercit();

  //setInterval(init, 1000);
  init();
})();
