class Materials extends Entity{
    constructor(scene, x, y, textureKey, type){
        super(scene, x, y, textureKey, 'Object', type);
        /*-----------------VARIABLES---------------------*/
        const anims = scene.anims;
        this.scene = scene;
        this.textureKey = textureKey;
        this.isUp = false;
        this.type = type;
        this.health;

        if(this.type == 'box'){
            this.health = 3;
        } else{
            this.health = 1;
        }
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

    pickup(){
        this.play(this.type + 'up', true)
        this.isUp = true;
    }

    putdown(){
        this.play(this.type + 'down', true)
        this.isUp = false;
    }

    getUp(){
        this.isUp;
    }

    getZone(){
        this.inZone;
    }
}