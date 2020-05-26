class SnapScroll extends Phaser.Scene {
    constructor() {
        super("snapscrollScene");

        // vars
        this.VEL = 150;
    }

    preload() {
        // load assets
        this.load.path = "./assets/";
        this.load.image("1bit_tiles", "map/colored_packed.png");    
        this.load.tilemapTiledJSON("snapmap", "map/snapmap.json");
        this.load.image('skull', 'img/skull.png');
        // load font
        this.load.bitmapFont('gem', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        // setup tilemap
        const map = this.add.tilemap("snapmap");
        const tileset = map.addTilesetImage("colored_packed", "1bit_tiles");
        const bgLayer = map.createStaticLayer("bgLayer", tileset, 0, 0);
        const collisionLayer = map.createDynamicLayer("collisionLayer", tileset, 0, 0);

        // set map collision
        collisionLayer.setCollisionByProperty({ collides: true });

        // tilemap collision debug
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        // collisionLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(255, 135, 50, 255),
        //     //faceColor: new Phaser.Display.Color(40, 40, 40, 255)
        // });

        // set camera and physics bounds
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cam.setOrigin(0);
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // create player with physics properties
        this.p1 = this.physics.add.sprite(100, 100, 'skull');
        this.p1.setScale(0.5);
        this.p1.body.setCollideWorldBounds(true);

        // set physics colliders
        this.physics.add.collider(this.p1, collisionLayer);

        // define cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug text
        this.debug = this.add.bitmapText(16, h-48, 'gem', '', 12);
        this.debug.setScrollFactor(0); 

        // debug
        this.scene.start("slideshowScene");
    }

    update() {
        // check player against camera bounds (in case we need to scroll)
        this.checkCamBounds(this.p1, this.cam);

        // player movement
        this.p1.body.setVelocity(0);

        if(cursors.left.isDown) {
            this.p1.body.setVelocityX(-this.VEL);
        } 
        if(cursors.right.isDown) {
            this.p1.body.setVelocityX(this.VEL);
        } 
        if(cursors.up.isDown) {
            this.p1.body.setVelocityY(-this.VEL);
        } 
        if(cursors.down.isDown) {
            this.p1.body.setVelocityY(this.VEL);
        } 

        // debug text
        this.debug.text = `CAMSCROLLX:${this.cam.scrollX.toFixed(2)}, CAMSCROLLY:${this.cam.scrollY.toFixed(2)}\nPX:${this.p1.x}, PY:${this.p1.y}`;
        
    }

    // check passed obj against passed camera bounds to scroll camera
    // assumes object origin is 0.5 and cam origin is 0
    // also relies upon player tile & physics world collisions to keep player inside world
    checkCamBounds(obj, cam) {
        if(obj.x + Math.abs(obj.width/2) > cam.width + cam.scrollX) {
            // move camera
            cam.setScroll(cam.scrollX + cam.width, cam.scrollY);
            // move player
            obj.x = cam.scrollX + Math.abs(obj.width/2);
        } else if(obj.x - Math.abs(obj.width/2) < cam.scrollX) {
            cam.setScroll(cam.scrollX - cam.width, cam.scrollY);
            obj.x = cam.scrollX + w - Math.abs(obj.width/2);
        } else if(obj.y + Math.abs(obj.height/2) > cam.height + cam.scrollY) {
            cam.setScroll(cam.scrollX, cam.scrollY + cam.height);
            obj.y = cam.scrollY + Math.abs(obj.height/2);
        } else if(obj.y - Math.abs(obj.height/2) < cam.scrollY) {
            cam.setScroll(cam.scrollX, cam.scrollY - cam.height);
            obj.y = cam.scrollY + cam.height - Math.abs(obj.height/2);
        }
    }
}