// Nathan Altice
// Created: 4/26/20 (Phaser CE)
// Updated: 1/13/24 (Phaser 3.70)
// Scrolling Styles
// Phaser 3 scrolling style demos of "snap" scrolling (eg, Adventure) and "slideshow" scrolling (eg, Legend of Zelda)

// CODE ARMOR
'use strict'

// define game object
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    zoom: 2,
    width: 320,
    height: 320,
    scene: [ SnapScroll, SlideshowScroll ]
}

const game = new Phaser.Game(config)

// global
const centerX = game.config.width / 2
const centerY = game.config.height / 2
const w = game.config.width
const h = game.config.height
let cursors = null