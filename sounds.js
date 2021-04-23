class Sounds {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.ctx = gameArea.ctx;
        this.backgroundMusic = new Audio("./sounds/DiscoConTutti.mp3");
        this.backgroundMusic.volume = 0.1;
        this.ouchSound = new Audio("./sounds/ouch.mp3");
        this.ouchSound.volume = 0.5;
        this.achievementSound = new Audio("./sounds/achievement.mp3");
        this.achievementSound.volume = 0.5;
        this.hitBossAchievement = new Audio("./sounds/hit-boss.mp3");
        this.hitBossAchievement.volume = 0.5;
        this.winSound = new Audio("./sounds/cheer.mp3");
        this.winSound.volume = 0.5;
        this.fartSound = new Audio("./sounds/fart.mp3");
        this.fartSound.volume = 0.5;
        this.galactoseSound = new Audio("./sounds/galactose.mp3");
        this.galactoseSound.volume = 0.7;
    }

    makeBackgroundMusic() {
        this.backgroundMusic.play();
    }

    makeFartSound() {
        this.fartSound.play();
    }

    makeOuchSound() {
        this.ouchSound.play();
    }

    makeAchievementSound() {
        this.achievementSound.pause();
        this.achievementSound.currentTime = 0;
        this.achievementSound.play();
    }

    makeGalactoseSound() {
        this.galactoseSound.play();
    }

    makeBossHitSound() {
        this.hitBossAchievement.play();
    }

    makeWinSound() {
        this.winSound.play();
    }
}