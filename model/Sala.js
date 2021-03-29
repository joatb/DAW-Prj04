const Star = require('./Star.js');
class Sala{
    constructor(config) {
        this.config = config;
        this.endgame = true;
        this.starHunters = [];
        this.stars = [];
    }
    getStarHunterIndexById(id){
        //return this.starHunters.find(jugador => jugador.id == id);
        return this.starHunters.findIndex((starhunter) => starhunter.id === id);
    }
    reiniciarSala(){
        this.starHunters.forEach(starhunter => {
            starhunter.stars = [];
        });
        this.generarEstrelles();
    }
    generarEstrelles(){
        for (let index = 0; index < this.config.numStars; index++) {
            let xPos = Math.floor(Math.random() * (this.config.width - this.config.midastar)) + 1;
            let yPos = Math.floor(Math.random() * (this.config.height - this.config.midastar)) + 1;
        
            let star = 
            {
                id: index,
                xPos: xPos,
                yPos: yPos,
            };
            this.stars.push(new Star(star));
        }
    }

    estrellesRestants(){
        return this.stars.length;
    }
}
module.exports = Sala;