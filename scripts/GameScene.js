class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        /*------------------MAP/TILEST----------------------------*/
        this.load.image("tiles", "assets/Tilemap/pillowfort.png");
        this.load.tilemapTiledJSON("map", "scripts/final_map.json");

        /*------------------PLAYER----------------------------*/
        this.load.spritesheet("player", "assets/guy.png", {
            frameWidth: 32,
            frameHieght: 48,
        });

        /*------------------MOVABLES----------------------------*/
        this.load.atlas(
            "objects",
            "assets/sprites/pillowobject.png",
            "assets/sprites/pillowobject.json"
        );

        /*------------------ENEMIES----------------------------*/
        this.load.atlas(
            "enemy",
            "assets/sprites/skeleton.png",
            "assets/sprites/skeleton.json"
        );

        /*------------------VARIABLES----------------------------*/
        this.player;
        this.enemies;
        this.objects;
        this.item;
        this.blackout = 0;

        this.isDayTime = true;
        this.isNightTime = false;
        this.isEvening = false;
        this.isMorning = false;
        this.light;
        this.halo;
        this.flashlight;

        this.sceneEvents;
        this.dayTimeTimer = 0;
        this.nightTimeTimer = 0;
        this.lightOffTimer = 0;
        this.spawnTimer = 0;
        this.day = 0;
        this.emmiter

        this.zoneMap

        this.objectEnemyCollider;
        this.playerEnemyCollider;
        this.zoneCollider;
        this.zones;
        this.inZone = false;

        this.ui = this.scene.get("UIScene")

        this.keys;
        this.breaker;
        this.dynamicObjects;
        this.mapLayers = [];
    }

    create() {
        // this.scene.run('GameUI');
        /*------------------TILESET----------------------------*/
        const map = this.make.tilemap({
            key: "map",
        });
        const tileset = map.addTilesetImage("pillowfort", "tiles");

        /*------------------MAP LAYERS----------------------------*/
        const BelowPlayer = map.createLayer("Below Player", tileset, 0, 0);
        const BelowFurniture = map.createLayer("Below Furniture", tileset, 0, 0);
        const WallLayer = map.createLayer("Wall Layer", tileset, 0, 0);
        const MovableObjects = map.getObjectLayer("MovableObjects");
        const AbovePlayer = map.createLayer("Above Player", tileset, 0, 0);
        const FurnitureLayer = map.createLayer("Furniture Layer", tileset, 0, 0);
        const Placeable = map.getObjectLayer("Placeable");
        this.zoneMap = map.createLayer("ZoneMap", tileset, 0, 0);
        this.mapLayers.push(
            BelowPlayer,
            BelowFurniture,
            WallLayer,
            AbovePlayer,
            FurnitureLayer,
            this.zoneMap,
        );
        for (let i = 0; i < this.mapLayers.length; i++) {
            this.mapLayers[i].setPipeline("Light2D");
            this.mapLayers[i].setDepth(i);
            this.mapLayers[i].setCollisionByProperty({
                collides: true,
            });

            this.mapLayers[i].forEachTile((tile) => {
                /*------------------LIGHTS----------------------------*/
                if (tile.properties.lights) {
                    const x = tile.getCenterX() * 3;
                    const y = tile.getCenterY() * 3;
                    this.lights.addLight(x, y, 500, 0xffffff, 2);
                }
            });
            this.mapLayers[i].scale = 3;
        }

        this.zones = this.physics.add.group({
            moves: false,
            active: false,
        });
        Placeable.objects.forEach((zone) => {
            const newZone = this.add.zone(zone.x * 3 + zone.width / 2 * 3, zone.y * 3 + zone.height / 2 * 3, zone.width * 3, zone.height * 3);
            this.zones.add(newZone);
        })

        /*------------------MOVABLES----------------------------*/
        this.dynamicObjects = this.physics.add.group({
            moves: false,
            active: false,
        });
        MovableObjects.objects.forEach((movable) => {
            switch (movable.gid) {
                case 127:
                    this.item = new Materials(
                        this,
                        movable.x * 3 + movable.width * 0.5,
                        movable.y * 3 - movable.height * 0.5,
                        "objects",
                        "pillow"
                    );
                    break;
                case 481:
                    this.item = new Materials(
                        this,
                        movable.x * 3 + movable.width * 0.5,
                        movable.y * 3 - movable.height * 0.5,
                        "objects",
                        "box"
                    );
                    break;
                case 183:
                    this.item = new Exit(
                        this,
                        movable.x * 3 + movable.width * 0.5,
                        movable.y * 3 - movable.height * 0.5,
                        "objects",
                        "breaker"
                    );
                    break;
            }
            this.dynamicObjects.add(this.item);
        });
        this.dynamicObjects.setDepth(2);


        /*------------------BOUNDRIES----------------------------*/
        this.physics.world.bounds.width = map.widthInPixels * 3;
        this.physics.world.bounds.height = map.heightInPixels * 3;
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels * 3,
            map.heightInPixels * 3
        );

        /*------------------PLAYER----------------------------*/
        this.player = new Player(this, 264, 264, "player").setPipeline("Light2D"); 
        this.player.scale = 2;
        this.player.setDepth(1);
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
        this.player.body.setCollideWorldBounds(true);

        /*------------------FLASHLIGHT----------------------------*/
        this.halo = this.lights.addLight(
            this.player.getX(),
            this.player.getY(),
            200
        );
        this.flashlight = this.lights.addLight(0, 0, 200);


        this.lights.enable().setAmbientColor(0x555555);

        /*------------------ENEMIES----------------------------*/
        this.enemies = this.add.group();
        if (this.enemies.length == undefined) {
            const e = new EnemyLogic(this, 600, 600, "enemy", "chase").setPipeline(
                "Light2D"
            );
            e.scale = 5;
            e.setDepth(2);
            e.body.setCollideWorldBounds(true);
            e.setTint(0x9999ff);
            this.enemies.add(e);
        }
        this.enemies.setVisible(false);

        /*------------------COLLISION----------------------------*/
        this.physics.add.collider(this.player, WallLayer);
        this.physics.add.collider(this.player, FurnitureLayer);
        this.physics.add.collider(this.player, BelowPlayer);
        this.physics.add.collider(
            this.player,
            this.dynamicObjects,
            this.handlePlayerMovableObjectCollision,
            null,
            this
        );
        this.playerEnemyCollider = this.physics.add.overlap(
            this.player,
            this.enemies,
            this.handlePlayerEnemyCollision,
            null,
            this
        );
        this.playerEnemyCollider.active = false;
        this.objectEnemyCollider = this.physics.add.collider(
            this.dynamicObjects,
            this.enemies,
            this.handleEnemyObjectCollision,
            null,
            this
        );
        this.objectEnemyCollider.active = false;
        this.physics.add.collider(this.dynamicObjects, WallLayer);
        this.physics.add.collider(this.dynamicObjects, FurnitureLayer);
        this.physics.add.collider(this.dynamicObjects, AbovePlayer);
        this.physics.add.collider(this.dynamicObjects, BelowFurniture);
        this.physics.add.collider(this.dynamicObjects, BelowPlayer);
        this.physics.add.collider(this.dynamicObjects, this.dynamicObjects);


    }


    update(time, delta) {
        /*---------------------ZONE OVERLAP-------------------------- */
        this.physics.add.overlap(this.zones, this.dynamicObjects, (zone, object) => {
            if (this.player.activeObject && object == this.player.activeObject && this.player.getObject().isUp && zone.body.touching) {
                this.inZone = true;
            } else if(this.player.activeObject && object == this.player.activeObject && this.player.getObject().isUp && !zone.body.touching) {
                this.inZone = true;
            }
        });
        
        if (this.player.activeObject && this.player.activeObject.isUp) {
            this.zoneMap.visible = true;
        } else {
            this.zoneMap.visible = false;
        }

        /*---------------------ENTITY UPDATE-------------------------- */
        if (!this.player.isDead) {
            this.player.update();
            for (let i = 0; i < this.dynamicObjects.length; i++) {
                this.dynamicObjects[i].update(this.player);
            }

            if (this.isNightTime) {
                this.objectEnemyCollider.active = true;
                this.playerEnemyCollider.active = true;

                this.enemies.setVisible(true);

                this.physics.add.overlap(this.flashlight, this.enemies, function () {
                    this.enemies.setVisible(false);
                });
                this.enemies.children.iterate((child) => {
                    child.update(this.player.body.position, time);
                });
            } else {
                this.enemies.setVisible(false);
                this.objectEnemyCollider.active = false;
                this.playerEnemyCollider.active = false;
            }
        }


        /*---------------------DAY/NIGHT CYCLE-------------------------- */
        this.lights.lights.forEach(function (currLight, index) {


            // const randLightOff = Math.random() * 10000;
            // // console.log(this.blackout + '========== ' + randLightOff)
            // if(currLight.visible && currLight.contains(this.player.body.x, this.player.body.y)){
            //     if(this.blackout >= 50000 && randLightOff >= 9980){
            //         currLight.intensity = 0;
            //         this.blackout = 0;
            //     }
            // } else if(this.lightOff){
            //     let lightTimer = 0
            //     if(lightTimer > 2000){
            //         currLight.intensity = 2;
            //         lightTimer = 0;
            //     } else{ lightTimer++;}
            // }else{
            //     // currLight.visible = true;
            //     this.blackout++;
            // }

            /*---------------------DAYTIME-------------------------- */
            if (
                this.halo !== currLight &&
                this.flashlight !== currLight &&
                currLight.intensity >= 2 &&
                this.isDayTime
            ) {
                if (this.dayTimeTimer >= 2000) {
                    //60 seconds
                    this.isDayTime = false;
                    this.isEvening = true;
                    this.dayTimeTimer = 0;
                } else {
                    this.dayTimeTimer++;
                }
            } else if (
                /*---------------------EVENING-------------------------- */
                this.halo !== currLight &&
                this.flashlight !== currLight &&
                currLight.visible &&
                this.isEvening &&
                currLight.intensity > 0
            ) {
                currLight.setIntensity(currLight.intensity - 0.001);
                // if (!this.enemies.visible && currLight.intensity == 2) {
                //     this.enemies.setVisible(true);
                // }
                if (currLight.intensity <= 0.1) {
                    this.isEvening = false;
                    this.isNightTime = true;
                }
            } else if (
                /*---------------------NIGHTTIME-------------------------- */
                this.halo !== currLight &&
                this.flashlight !== currLight &&
                currLight.intensity <= 0.1 &&
                currLight.visible &&
                this.isNightTime
            ) {
                if (this.nightTimeTimer >= 2000) {
                    //60 seconds
                    this.isNightTime = false;
                    this.isMorning = true;
                    this.nightTimeTimer = 0;
                    this.ui.updateDay()
                } else {
                    this.nightTimeTimer++;
                }
            } else if (
                /*---------------------MORNING-------------------------- */
                this.halo !== currLight &&
                this.flashlight !== currLight &&
                currLight.visible &&
                this.isMorning &&
                currLight.intensity < 2
            ) {
                currLight.setIntensity(currLight.intensity + 0.001); //60 seconds
                if (currLight.intensity == 2) {
                    this.isMorning = false;
                    this.isDayTime = true;
                }
                // if (!this.enemies.visible && currLight.intensity == 2) {
                //     this.enemies.setVisible(false);
                // }
            }
        }, this);

        this.halo.x = this.player.x;
        this.halo.y = this.player.y;
    }

    handlePlayerMovableObjectCollision(player, object) {
        /*------------------MOVE FURNITURE----------------------------*/
        object.body.setImmovable(true);
        object.setActive(false);
        object.body.setVelocity(0);
        if (player.body.touching && object.body.touching) {
            if (object instanceof Materials) {
                player.setObject(object);
            }
            if (object instanceof Exit) {
                player.setWinCondition(object);
            }
        } else {
            player.setObject(null);
        }
        if (object.isUp) {
            object.body.setImmovable(false);
            object.setActive(true);
            //Place in front of player
        }
    }

    handleEnemyObjectCollision(enemy, object) {
        /*------------------MOVE FURNITURE----------------------------*/
        if (!object.isUp) {
            object.body.setImmovable(true);
            object.body.moves = false;
            object.body.active = true;
        }
    }

    handlePlayerEnemyCollision(p, e) {
        /*------------------PLAYER DEATH ANIMATION----------------------------*/
        if (e.visible && this.playerEnemyCollider.active) {
            p.explode();
            this.finish('loseScene')
        }
    }

    finish(Scene) {
        this.cameras.main.shake(100, 0.05);
        this.cameras.main.fade(250, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {

            this.scene.stop('UIScene');
            this.scene.stop("GameScene");
            this.scene.restart();
            this.scene.start(Scene);
        });
    }


}
