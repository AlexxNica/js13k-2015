import GameState from "./GameState"
import ShipGenerator from "./ShipGenerator"

export default class TitleState extends GameState {

  constructor(engine) {
    super(engine);
    this.selected = 0;
    this.uiTime = this.engine.timestamp;

    let generator = new ShipGenerator();
    let foeSprites = [];
    for (let i = 0; i < 50; i++) {
      let sub2Canvas = document.createElement("canvas");
      sub2Canvas.width = 40;
      sub2Canvas.height = 40;
      let sub2Ctx = sub2Canvas.getContext("2d");
      // subCtx.fillStyle = "#000";
      // subCtx.fillRect(0, 0, 40, 40);
      sub2Ctx.translate(20, 20);
      sub2Ctx.rotate(-0.5 * Math.PI);
      sub2Ctx.scale(0.2, 0.2);
      generator.paintShip(sub2Ctx);
      foeSprites.push(sub2Canvas);
    }
    this.foeSprites = foeSprites;
  }

  update(timestamp) {
    if (this.engine.gamepad.fire && (timestamp - this.uiTime) > 200) {
      switch (this.selected) {
        case 0:
          this.engine.setState("levelState");
          break;
        case 1:
          this.engine.setState("controlsState");
          break;
        case 2:
          this.engine.setState("aboutState");
          break;
      }
    }
    if (this.engine.gamepad.up && (timestamp - this.uiTime) > 200) {
      this.selected = (this.selected + 2) % 3;
      this.uiTime = timestamp;
    }
    if (this.engine.gamepad.down && (timestamp - this.uiTime) > 200) {
      this.selected = (this.selected + 1) % 3;
      this.uiTime = timestamp;
    }

    let ctx = this.engine.ctx;
    ctx.fillStyle = "#002";
    ctx.fillRect(0, 0, this.engine.width, this.engine.height);


    ctx.strokeStyle = "#013";
    ctx.save();
    ctx.translate(0.5 * this.engine.width - Math.cos(0.0006 * timestamp) * 100, 0.5 * this.engine.height +  - Math.sin(0.001 * timestamp) * 100);
    ctx.rotate(2 * Math.cos(0.0001 * timestamp));
    let levelx = timestamp * 0.2;
    ctx.beginPath();
    for (let x = -700; x < 700; x+= 50) {
      ctx.moveTo(x, -700);
      ctx.lineTo(x, 700);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let y = -700; y < 700; y+= 50) {
      ctx.moveTo(-700, y);
      ctx.lineTo(700, y);
    }
    ctx.stroke();
    ctx.restore();

    ctx.globalAlpha = 0.2;
    let rot = this.engine.timestamp * 0.0005;
    for (let i = 0; i < 50; i++) {
      let a = Math.PI / 25;
      let x = 0.5 * this.engine.width + Math.cos(a * i + rot) * (this.engine.width - 50) * 0.5;
      let y = 0.5 * this.engine.height + Math.sin(a * i + rot) * (this.engine.height - 50) * 0.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a * i + rot + Math.PI * 0.5);
      ctx.drawImage(this.foeSprites[i], 0, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = `rgba(128,255,255,${0.15+0.05*Math.cos(timestamp*0.005)})`;
    ctx.fillRect(0, 340 + this.selected * 40, this.engine.width, 40);

    ctx.fillStyle = "#fff";

    ctx.font = "100px sans-serif";
    this.engine.centerText("Galactic Backfire", 250);

    ctx.font = "20px sans-serif";
    this.engine.centerText("A space shooter in reverse", 280);

    ctx.font = "32px sans-serif";
    this.engine.centerText("New Game", 370);
    this.engine.centerText("Controls", 410);
    this.engine.centerText("About", 450);
  }

}
