
class StarHunter {
  constructor(starhunter) {
    //var a = this;

    this.id = starhunter.id;
    this.xPos = starhunter.xPos;
    this.yPos = starhunter.yPos;
    this.rotar = starhunter.rotar;
    this.stars = starhunter.stars;
  }

  actualitzarPuntuacio() {
    $("#estrelles").attr("value", this.stars.length);
  }
}

module.exports = StarHunter;
