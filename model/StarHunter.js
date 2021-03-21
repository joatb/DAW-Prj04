const WIDTH = process.env.WIDTH;
const HEIGHT = process.env.HEIGHT;
const ESCALA = process.env.ESCALA;
const MIDAJ = WIDTH / ESCALA;
const MIDASTAR = WIDTH / ESCALA / 2;
const TEMPS = process.env.TEMPS;

class StarHunter {
  constructor(starhunter) {
    //var a = this;

    this.id = starhunter.id;
    this.xPos = starhunter.xPos;
    this.yPos = starhunter.yPos;
    this.stars = starhunter.stars;
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
  mou() {
    const actualitzarPosicio = (coordenada, suma) => {
        if (coordenada === "x") {
          if (this.xPos + suma < 0) {
            // Si la próxima coordenada al eix X és menor a 0
          } else if (this.xPos + suma > WIDTH - MIDAJ) {
            // Si la próxima coordenada al eix X > amplada del joc - mida de la nau
          } else {
            this.xPos += suma; //Guarda la nova coordenada
          }
          this.xPos += suma; //Guarda la nova coordenada
        }
        if (coordenada === "y") {
          if (this.yPos + suma < 0) {
            // Si la próxima coordenada al eix Y és menor a 0
          } else if (this.yPos + suma > HEIGHT - MIDAJ) {
            // Si la próxima coordenada al eix Y > alçada del joc - mida de la nau
          } else {
            this.yPos += suma; // Guarda la nova coordenada
          }
          this.yPos += suma; // Guarda la nova coordenada
        }
        this.ultimaTeclaPulsada = this.tecla;
        //console.log(this.obj);
    
        //this.actualitzarPuntuacio();
      }
    if (this.ultimaTeclaPulsada != this.tecla) {
      switch (this.tecla) {
        case "a":
          this.rotar = -90;
            actualitzarPosicio("x", -1);
          break;
        case "s":
          this.rotar = 180;
            actualitzarPosicio("y", 1);
          break;
        case "d":
          this.rotar = 90;
            actualitzarPosicio("x", 1);
          break;
        case "w":
          this.rotar = 0;
            actualitzarPosicio("y", -1);
          break;
      }
    }
  }

  actualitzarPuntuacio() {
    $("#estrelles").attr("value", this.stars.length);
  }
}

module.exports = StarHunter;
