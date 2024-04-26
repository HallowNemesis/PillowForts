class Exit extends Entity{
    constructor(scene, x, y, textureKey, type){
        super(scene, x, y, textureKey, 'Exit', type);
        /*-----------------VARIABLES---------------------*/
        this.scene = scene;
        const anims = scene.anims;
        this.textureKey = textureKey;
        this.isUp = false;
        this.type = type;

        this.timer = 0;
        /*-----------------ANIMATIONS---------------------*/
            this.anims.create({
                key: type +'down',
                frames: this.anims.generateFrameNames(this.textureKey, {
                    start: 0,
                    end: 0,
                    prefix: this.type,
                    suffix: '.png',
                }),
                frameRate: 1,
                repeat: -1,
            })
    
            this.anims.create({
                key: this.type + 'up',
                frames: this.anims.generateFrameNames(this.textureKey, {
                    start: 1,
                    end: 1,
                    prefix: this.type,
                    suffix: '.png',
                    delay: 1000
                }),
                frameRate: 1,
                repeat: -1,
            })
            

            this.play(this.type + 'down');
    }

    updateTimer(){
        this.timer+=1;
        this.scene.ui.timer.updateTime(this.timer);

    }
}