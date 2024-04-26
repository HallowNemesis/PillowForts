class Entity extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, textureKey, type){
        super(scene, x, y, textureKey);

        /*------------------VARIABLES----------------------------*/
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.textureKey = textureKey;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0)
        this.type = type;
        this.isDead = false;

    }

    explode(){
        /*------------------ENTITY DEATH----------------------------*/
        if(!this.isDead){
            this.isDead = true;
            this.destroy();
        }
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }
}