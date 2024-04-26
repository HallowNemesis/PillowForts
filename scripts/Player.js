class Player extends Entity {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey, 'Player');
        /*------------------VARIABLES----------------------------*/
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.activeObject;
        this.breaker;

        /*------------------ANIMATION----------------------------*/
        const animFrameRate = 6;
        this.facing = 'down';

        this.anims.create({
            key: 'player-left',
            frames: this.anims.generateFrameNumbers(this.textureKey, {
                start: 3,
                end: 5
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'player-right',
            frames: this.anims.generateFrameNumbers(this.textureKey, {
                start: 6,
                end: 8
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'player-up',
            frames: this.anims.generateFrameNumbers(this.textureKey, {
                start: 9,
                end: 11
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'player-down',
            frames: this.anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.idleFrame = {
            down: 0,
            left: 3,
            right: 6,
            up: 9,
        }
        this.setFrame(this.idleFrame.down);


        /*------------------KEYS----------------------------*/
        const { LEFT, RIGHT, UP, DOWN, W, A, S, D, SPACE, } = Phaser.Input.Keyboard.KeyCodes
        this.keys = this.scene.input.keyboard.addKeys({
            space: SPACE,
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D
        })
    }

    update() {
        const { keys } = this;
        const speed = 200;
        const previousVelocity = this.body.velocity.clone();

        this.body.setVelocity(0);
        /*------------------MOVEMENT----------------------------*/
        if (keys.left.isDown || keys.a.isDown) {
            this.body.setVelocityX(-speed)
            if (this.activeObject && this.activeObject.isUp && this.body.touching) {
                this.activeObject.setPosition(this.body.x - 30, this.body.y + this.body.height / 2)
            }
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(speed)
            if (this.activeObject && this.activeObject.isUp && this.body.touching) {
                this.activeObject.setPosition(this.body.x + this.body.width + 30, this.body.y + this.body.height / 2)
            }
        }
        if (keys.up.isDown || keys.w.isDown) {
            this.body.setVelocityY(-speed)
            if (this.activeObject && this.activeObject.isUp && this.body.touching) {
                this.activeObject.setPosition(this.body.x + this.body.width / 2, this.body.y - 30)
            }
        } else if (keys.down.isDown || keys.s.isDown) {
            this.body.setVelocityY(speed)
            if (this.activeObject && this.activeObject.isUp && this.body.touching) {
                this.activeObject.setPosition(this.body.x + this.body.width / 2, this.body.y + this.body.height + 30)
            }
        }

        this.body.velocity.normalize().scale(speed)

        /*------------------OBJECT PICKUP----------------------------*/
        if (Phaser.Input.Keyboard.JustDown(keys.space) && !this.isDead) {
            if (this.activeObject && !this.activeObject.isUp && this.body.touching) {
                this.activeObject.pickup();
                this.activeObject.immovable = false
            } else if (this.activeObject && this.activeObject.isUp && this.body.touching && this.scene.inZone) {
                this.activeObject.putdown();
                this.activeObject = null;
            }

        }
        else if (keys.space.isDown && !this.isDead && this.breaker && !this.activeObject) {
            this.breaker.updateTimer();
            if (this.breaker.timer >= 250) {
                this.scene.finish('winScene')
            }
        }



        /*------------------ANIMATIONS----------------------------*/
        if (keys.up.isDown || keys.w.isDown) {
            this.anims.play('player-up', true)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.anims.play('player-down', true)
        } else
            if (keys.left.isDown || keys.a.isDown) {
                this.anims.play('player-left', true)
            } else if (keys.right.isDown || keys.d.isDown) {
                this.anims.play('player-right', true)
            } else {
                this.anims.stop()
            }

        if (this.anims.currentAnim) {
            this.facing = this.anims.currentAnim.key.split('-')[1];
        }

        /*------------------IDLE ANIMATIONS----------------------------*/
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            if (previousVelocity.x < 0) {
                this.setFrame(this.idleFrame.left)
            } else if (previousVelocity.x > 0) {
                this.setFrame(this.idleFrame.right)
            } else if (previousVelocity.y < 0) {
                this.setFrame(this.idleFrame.up)
            } else if (previousVelocity.y > 0) {
                this.setFrame(this.idleFrame.down)
            }
        }
    }

    setObject(object) {
        if (this.activeObject != null && this.activeObject.isUp) {
            return
        }
        this.activeObject = object;
    }

    getObject(){
        return this.activeObject;
    }
    setWinCondition(object) {
        if (this.activeObject != null) {
            return;
        }
        this.breaker = object;
        // this.cameras.main.shake(100, 0.05);
        //     this.cameras.main.fade(250, 0, 0, 0);
        //     this.cameras.main.once("camerafadeoutcomplete", () => {

        //         this.scene.stop('UIScene');
        //         this.scene.stop("GameScene");
        //         this.scene.restart();
        //         this.scene.start("winScene");
        //     });
    }

    
}