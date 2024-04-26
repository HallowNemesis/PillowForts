class StatusBar{
    constructor(scene, x, y, time){
        this.scene = scene
        this.visible = true;
        this.currentTime = time
        this.maxTime = time;
        this.x = x
        this.y = y

        this.graphics = this.scene.add.graphics()
        this.graphics2 = this.scene.add.graphics()
        this.newGraphics = this.scene.add.graphics()
        const statusBar = new Phaser.Geom.Rectangle(x+32, y, 254, 18)
        const statusBar2 = new Phaser.Geom.Rectangle(x+34, y+2, this.time, 14)
        const statusBarFill = new Phaser.Geom.Rectangle(x+34, y + 2, this.currentTime, 14)

        this.graphics.fillStyle(0xffffff, 0.5)
        this.graphics2.fillStyle(0xff0099, 1)
        this.graphics.fillRectShape(statusBar)
        this.graphics2.fillRectShape(statusBar2)
        this.newGraphics.fillStyle(0x3587e2, 1)
        this.newGraphics.fillRectShape(statusBarFill)
    }//end constructor

    updateTime(time){
        this.currentTime = time;
        if(this.currentTime >= 250){
            this.currentTime = 250;
        }
        this.newGraphics.clear()
        this.newGraphics.fillStyle(0x3587e2, 1)
        const statusBarFill = new Phaser.Geom.Rectangle(this.x+34, this.y+2, this.currentTime, 14)
        this.newGraphics.fillRectShape(statusBarFill)
    }
}