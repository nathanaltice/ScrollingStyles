class SnapScroll extends Phaser.Scene {
    constructor() {
        super("snapscrollScene")
    }

    init() {
        this.VEL = 175
    }

    preload() {
        // load visual assets
        this.load.path = "./assets/"
        this.load.image("1bit_tiles", "map/colored_packed.png")
        this.load.spritesheet('kenny_sprites', 'map/colored_packed.png', {
            frameWidth: 16
        })    
        this.load.tilemapTiledJSON("snapmap", "map/snapmap.json")
        // load font
        this.load.bitmapFont('gem', 'font/gem.png', 'font/gem.xml')
    }

    create() {
        // setup tilemap
        const map = this.add.tilemap("snapmap")
        const tileset = map.addTilesetImage("colored_packed", "1bit_tiles")
        const bgLayer = map.createLayer("bgLayer", tileset, 0, 0)
        const collisionLayer = map.createLayer("collisionLayer", tileset, 0, 0)

        // set map collision
        collisionLayer.setCollisionByProperty({ collides: true })

        // tilemap collision debug
        const debugGraphics = this.add.graphics().setAlpha(0.75)
        // collisionLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(255, 135, 50, 255),
        //     //faceColor: new Phaser.Display.Color(40, 40, 40, 255)
        // })

        // create player with physics properties
        this.p1 = this.physics.add.sprite(centerX*3, centerY*3, 'kenny_sprites', 222)
        this.p1.body.setCollideWorldBounds(true)

        // set camera properties
        this.cam = this.cameras.main
        this.cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cam.centerOn(this.p1.x, this.p1.y)
        
        // set physics bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels)

        // set physics colliders
        this.physics.add.collider(this.p1, collisionLayer)

        // define cursor key input
        cursors = this.input.keyboard.createCursorKeys()

        // enable scene switcher / reload keys
        this.swap = this.input.keyboard.addKey('S')
        this.reload = this.input.keyboard.addKey('R')

        // debug text
        this.debug = this.add.bitmapText(16, h-48, 'gem', '', 12)
        this.debug.setScrollFactor(0) 

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>SnapScroll.js</strong>: Move w/ arrows. S for next scene, R to Restart scene'
    }

    update() {
        // check player against camera bounds (in case we need to scroll)
        this.checkCamBounds(this.p1, this.cam)

        // player movement
        this.playerDirection = new Phaser.Math.Vector2()

        if(cursors.left.isDown) {
            this.playerDirection.x = -1
        } 
        if(cursors.right.isDown) {
            this.playerDirection.x = 1
        } 
        if(cursors.up.isDown) {
            this.playerDirection.y = -1
        } 
        if(cursors.down.isDown) {
            this.playerDirection.y = 1
        }

        this.playerDirection.normalize()
        this.p1.setVelocity(this.VEL * this.playerDirection.x, this.VEL * this.playerDirection.y)

        // scene switching / restart
        if(Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.scene.restart()
        }
        if(Phaser.Input.Keyboard.JustDown(this.swap)) {
            this.scene.start("slideshowScene")
        }

        // debug text for camera testing
        // this.debug.text = `CAMSCROLLX:${this.cam.scrollX.toFixed(2)}, CAMSCROLLY:${this.cam.scrollY.toFixed(2)}\nPX:${this.p1.x.toFixed(2)}, PY:${this.p1.y.toFixed(2)}`
    }

    // check passed obj against passed camera bounds to scroll camera
    // assumes object origin is 0.5
    // also relies upon player tile & physics world collisions to keep player inside world
    checkCamBounds(obj, cam) {
        if(obj.x + obj.width/2 > cam.width + cam.scrollX) {
            cam.setScroll(cam.scrollX + cam.width, cam.scrollY) // move camera
            obj.x = cam.scrollX + obj.width/2                   // move player
        } else if(obj.x - obj.width/2 < cam.scrollX) {
            cam.setScroll(cam.scrollX - cam.width, cam.scrollY)
            obj.x = cam.scrollX + w - obj.width/2
        } else if(obj.y + obj.height/2 > cam.height + cam.scrollY) {
            cam.setScroll(cam.scrollX, cam.scrollY + cam.height)
            obj.y = cam.scrollY + obj.height/2
        } else if(obj.y - obj.height/2 < cam.scrollY) {
            cam.setScroll(cam.scrollX, cam.scrollY - cam.height)
            obj.y = cam.scrollY + cam.height - obj.height/2
        }
    }
}