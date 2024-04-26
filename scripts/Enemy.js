class Enemy extends Entity{
    constructor(scene, x, y, textureKey, type){
        super(scene,x,y,textureKey,'Enemy', type);


        /*------------------ANIMATION----------------------------*/
        this.scene = scene;
        const animFrameRate = 4;
        this.textureKey = textureKey;
        this.type = type;
 
        this.anims.create({
            key: 'enemy-left',
            frames: this.anims.generateFrameNames(this.textureKey, {
                prefix: 'walk-left-',
                suffix: '.png',
                start: 1,
                end: 3,
                zeroPad: 2 
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'enemy-right',
            frames: this.anims.generateFrameNames(this.textureKey, {
                prefix: 'walk-right-',
                suffix: '.png',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'enemy-up',
            frames: this.anims.generateFrameNames(this.textureKey, {
                prefix: 'walk-up-',
                suffix: '.png',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'enemy-down',
            frames: this.anims.generateFrameNames(this.textureKey, {
                prefix: 'walk-down-',
                suffix: '.png',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        
        /*------------------DIRECTION----------------------------*/
        this.speed = 200;
        let dir = Math.floor(Math.random()*4)
        switch (dir) {
            case 0:
                this.body.setVelocity(0,-this.speed)//up
                this.anims.play('enemy-up')
                break
            case 1:
                this.body.setVelocity(-this.speed,0)//left
                this.anims.play('enemy-left')
                break
            case 2:
                this.body.setVelocity(0,this.speed)//down
                this.anims.play('enemy-down')
                break
            case 3:
                this.body.setVelocity(this.speed,0)//right
                this.anims.play('enemy-right')
                break
            default:
                break;
        }
    }

    update(){
        /*------------------WALL COLLISION LOGIC----------------------------*/
        const {speed} = this 
        const enemyBlocked = this.body.blocked

        if (enemyBlocked.down || enemyBlocked.up || enemyBlocked.left || enemyBlocked.right){

            let possibleDirections = []
            for (const direction in enemyBlocked){
                possibleDirections.push(direction)
            }

            const newDirection = possibleDirections[Math.floor(Math.random()*4)+1]

            switch (newDirection) {
                case 'up':
                    this.body.setVelocity(0,-this.speed)//up
                    this.anims.play('enemy-up')
                    break
                case 'left':
                    this.body.setVelocity(-this.speed,0)//left
                    this.anims.play('enemy-left')
                    break
                case 'down':
                    this.body.setVelocity(0,this.speed)//down
                    this.anims.play('enemy-down')
                    break
                case 'right':
                    this.body.setVelocity(this.speed,0)//right
                    this.anims.play('enemy-right')
                    break
                case 'none':
                    this.body.setVelocity(0,0)//right
                    this.anims.stop()
                    break
                default:
                    break;
            }
        }
     }
}