import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('background', 'assets/maps/map1.png');
        this.load.image('player', 'assets/players/player.png');
        this.load.image('monster', 'assets/monsters/monster.png');
        this.load.image('bullet', 'assets/bullets/bullet.png');
        this.load.audio('shoot', 'assets/sounds/shoot.mp3');
        this.load.audio('hit', 'assets/sounds/hit.mp3');
    }

    create() {
        this.add.image(400, 300, 'background');
        
        this.players = [
            this.createPlayer(100, 300, 'Aditya', 'MP40'),
            this.createPlayer(300, 300, 'Ranveer', 'P90'),
            this.createPlayer(500, 300, 'Devraj', 'VSS')
        ];

        this.monsters = this.physics.add.group();
        this.bullets = this.physics.add.group();
        this.spawnMonsters();

        this.shootSound = this.sound.add('shoot');
        this.hitSound = this.sound.add('hit');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', this.shootBullet, this);
    }

    createPlayer(x, y, name, weapon) {
        let player = this.physics.add.sprite(x, y, 'player');
        player.setCollideWorldBounds(true);
        player.name = name;
        player.weapon = weapon;
        player.health = 100;
        player.rank = 1;
        player.exp = 0;
        return player;
    }

    spawnMonsters() {
        for (let i = 0; i < 5; i++) {
            let monster = this.physics.add.sprite(Phaser.Math.Between(200, 600), Phaser.Math.Between(100, 500), 'monster');
            monster.health = 50;
            this.monsters.add(monster);
        }
    }

    shootBullet() {
        this.players.forEach(player => {
            let bullet = this.bullets.create(player.x, player.y, 'bullet');
            bullet.setVelocityX(300);
            this.shootSound.play();
        });
    }

    update() {
        this.players.forEach(player => {
            if (this.cursors.left.isDown) {
                player.setVelocityX(-160);
            } else if (this.cursors.right.isDown) {
                player.setVelocityX(160);
            } else {
                player.setVelocityX(0);
            }
        });

        this.physics.overlap(this.bullets, this.monsters, this.hitMonster, null, this);
    }

    hitMonster(bullet, monster) {
        monster.health -= 25;
        bullet.destroy();
        this.hitSound.play();
        if (monster.health <= 0) {
            monster.destroy();
            this.updatePlayerRank();
        }
    }

    updatePlayerRank() {
        this.players.forEach(player => {
            player.exp += 10;
            if (player.exp >= 50) {
                player.rank += 1;
                player.exp = 0;
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: MainScene
};

const game = new Phaser.Game(config);
