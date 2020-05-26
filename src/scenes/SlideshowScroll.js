class SlideshowScroll extends Phaser.Scene {
    constructor() {
        super("slideshowScene");

        // vars
        this.VEL = 175;
        this.SCROLLDURATION = 400;
        this.SCROLLSTYLE = 'Quad';
    }

    preload() {
        // load assets
        this.load.path = "./assets/";
        
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
        //this.cam.setOrigin(0);
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // create player with physics properties
        this.p1 = this.physics.add.sprite(this.cam.centerX, this.cam.centerY, 'skull');
        this.p1.body.setCollideWorldBounds(true);
        this.p1.scrollLock = false; // to prevent movement during cam scrolling

        // set physics colliders
        this.physics.add.collider(this.p1, collisionLayer);

        // define cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug text
        this.debug = this.add.bitmapText(16, h-48, 'gem', '', 12);
        this.debug.setScrollFactor(0); 
    }

    update() {
        // check player against camera edges (in case we need to scroll)
        this.checkCamBounds(this.p1, this.cam);

        // player movement
        this.p1.body.setVelocity(0);

        // only allow move if the camera isn't scrolling
        if(!this.p1.scrollLock) {
            if(cursors.left.isDown) {
                this.p1.body.setVelocityX(-this.VEL);
                this.p1.resetFlip();
            } 
            if(cursors.right.isDown) {
                this.p1.body.setVelocityX(this.VEL);
                this.p1.setFlip(true, false);
            } 
            if(cursors.up.isDown) {
                this.p1.body.setVelocityY(-this.VEL);
            } 
            if(cursors.down.isDown) {
                this.p1.body.setVelocityY(this.VEL);
            } 
        } 

        // debug text
        // this.debug.text = `CAMSCROLLX:${this.cam.scrollX.toFixed(2)}, CAMSCROLLY:${this.cam.scrollY.toFixed(2)}\nPX:${this.p1.x.toFixed(2)}, PY:${this.p1.y.toFixed(2)}\nCAMCENTERX:${this.cam.centerX}, CAMCENTERY:${this.cam.centerY}`;
    }

    // uses a camera pan and object tween to create "slideshow" scrolling
    // assumes object has 0.5 origin
    // calculations in camera pans need to use cam.centerX/centerY b/c pans are relative to camera center
    checkCamBounds(obj, cam) {
        if(obj.x + Math.abs(obj.width/2) > cam.width + cam.scrollX) {
            // PLAYER HITS RIGHT EDGE (SCROLL R->L)
            // lock player
            obj.scrollLock = true;
            // tween player
            this.tweens.add({
                targets: obj,
                duration: this.SCROLLDURATION,
                ease: this.SCROLLSTYLE,
                x: { from: obj.x, to: obj.x + obj.width },
                onComplete: function() {
                    obj.scrollLock = false; // unlock player
                }
            });
            // pan camera
            cam.pan(cam.scrollX + cam.centerX + cam.width, cam.scrollY + cam.centerY, this.SCROLLDURATION, this.SCROLLSTYLE);
        } else if(obj.x - Math.abs(obj.width/2) < cam.scrollX) {
            // PLAYER HITS LEFT EDGE (SCROLL L->R)
            // lock player
            obj.scrollLock = true;
            // tween player
            this.tweens.add({
                targets: obj,
                duration: this.SCROLLDURATION,
                ease: this.SCROLLSTYLE,
                x: { from: obj.x, to: obj.x - obj.width },
                onComplete: function() {
                    obj.scrollLock = false; // unlock player
                }
            });
            // pan camera
            cam.pan(cam.scrollX - cam.centerX, cam.scrollY + cam.centerY, this.SCROLLDURATION, this.SCROLLSTYLE);
        } else if(obj.y + Math.abs(obj.height/2) > cam.height + cam.scrollY) {
            // PLAYER HITS BOTTOM EDGE (SCROLL BOTTOM -> TOP)
            // lock player
            obj.scrollLock = true;
            // tween player
            this.tweens.add({
                targets: obj,
                duration: this.SCROLLDURATION,
                ease: this.SCROLLSTYLE,
                y: { from: obj.y, to: obj.y + obj.height },
                onComplete: function() {
                    obj.scrollLock = false; // unlock player
                }
            });
            // pan camera
            cam.pan(cam.scrollX + cam.centerX, cam.scrollY + cam.centerY + cam.height, this.SCROLLDURATION, this.SCROLLSTYLE);
        } else if(obj.y - Math.abs(obj.height/2) < cam.scrollY) {
            // PLAYER HITS TOP EDGE (SCROLL TOP->BOTTOM)
            // lock player
            obj.scrollLock = true;
            // tween player
            this.tweens.add({
                targets: obj,
                duration: this.SCROLLDURATION,
                ease: this.SCROLLSTYLE,
                y: { from: obj.y, to: obj.y - obj.height },
                onComplete: function() {
                    obj.scrollLock = false; // unlock player
                }
            });
            // pan camera
            cam.pan(cam.scrollX + cam.centerX, cam.scrollY - cam.centerY, this.SCROLLDURATION, this.SCROLLSTYLE);
        }
    }
}