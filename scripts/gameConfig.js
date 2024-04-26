
window.addEventListener('load', () => {
    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: 0x999999,
        maxLights: 100,
        willReadFrequently: true,
        physics: {
            default: 'arcade',
            arcade: {
                // debug: true,
                gravity: {
                    y: 0
                }
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame"
        },
        pixelArt: true,
        scene: [TitleScene, GameScene, UIScene, WinScene, LoseScene]
        
    }
    const game = new Phaser.Game(config)
    }) //end load listener
    
    
    
    
    class TitleScene extends Phaser.Scene {
        constructor() {
            super('titleScene')
            
        }
    
        preload() {
            this.load.image('titlescreen-image', 'assets/demo-titlescreen.jpg')

        } 
    
        create(){
            let background = this.add.image(0,0,'titlescreen-image').setOrigin(0);
            background.setScale( this.cameras.main.height / background.height);
            
            this.text = this.add.text(this.cameras.main.width/2 - 300, 40, 'Pillow Forts', {
                fontSize: '48px',
                bold: true,
                fill:'#ffffff',
            })

            this.input.once('pointerdown', function ()
            {
        
                this.scene.stop('titleScene');
                this.scene.start('GameScene');
                this.scene.start('UIScene');
    
            }, this);
        }
    
        update() {
        } 
    }
    
    class WinScene extends Phaser.Scene {
        constructor() {
            super('winScene')
        }
    
        preload() {
            this.load.image('win-screen', 'assets/winCard.png')
        } 
    
        create() {
            let background = this.add.image(0,0,'win-screen').setOrigin(0);
            background.setScale(this.cameras.main.width /background.width);

            
            this.text = this.add.text(this.cameras.main.width/2 - 300, 20, 'Congratulations \n You Win', {
                fontSize: '48px',
                bold: true,
                fill:'#ffffff',
            })


            this.input.once('pointerdown', function ()
            {
        
                this.scene.stop('GameUI')
                this.scene.stop('GameScene');
                this.scene.start('titleScene');
    
            }, this);
        } 
    
        update() {
    
        } 
    } 
    
    class LoseScene extends Phaser.Scene {
        constructor() {
            super('loseScene')
        }
    
        preload() {
            this.load.image('gameover-screen', 'assets/gameover.png')
        } //end preload
    
        create() {
            let background = this.add.image(0,0,'gameover-screen').setOrigin(0);
            background.setScale(this.cameras.main.width /background.width);

            this.input.once('pointerdown', function ()
            {
        
                this.scene.stop('GameUI')
                this.scene.stop('GameScene');
                this.scene.start('titleScene');
    
            }, this);
        } 
    
        update() {
    
        } 
    }