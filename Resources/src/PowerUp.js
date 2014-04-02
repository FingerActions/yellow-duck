//////////////////////////////////////////////////////////////////////
//FINGERACTIONS GAMES PROPRIETARY INFORMATION
//
// This software is supplied under the terms of a license agreement or
// non-disclosure agreement with FINGERACTIONS Games and may not
// be copied or disclosed except in accordance with the terms of that
// agreement.
//
//      Copyright (c) 2014 FINGERACTIONS GAMES
//      All Rights Reserved.
//
//
/////////////////////////////////////////////////////////////////////


var PowerUp = cc.Sprite.extend({

    active: true,
    powerupType: 1,
    effectMode: null,
    zOrder: 1000,
    _emitter: null,
    ctor: function(arg) {

        this._super();
        this.effectMode = arg.effectMode;
        this.powerupType = arg.type;
        this.initWithSpriteFrameName(arg.textureName);
        //this.shine();

    },
    destroy: function() {

        this.setVisible(false);
        this.active = false;
        this.stopAllActions();

    },

    shine: function() {


        //particle test

        this._emitter = cc.ParticleSystem.createWithTotalParticles(50);

        this.addChild(this._emitter, 100001);
        this._emitter.setTexture(cc.TextureCache.getInstance().addImage(s_stars1));

        // duration
        this._emitter.setDuration(cc.PARTICLE_DURATION_INFINITY);

        // radius mode
        this._emitter.setEmitterMode(cc.PARTICLE_MODE_RADIUS);

        // radius mode: start and end radius in pixels
        this._emitter.setStartRadius(0);
        this._emitter.setStartRadiusVar(0);
        this._emitter.setEndRadius(160);
        this._emitter.setEndRadiusVar(0);

        // radius mode: degrees per second
        this._emitter.setRotatePerSecond(180);
        this._emitter.setRotatePerSecondVar(0);


        // angle
        this._emitter.setAngle(90);
        this._emitter.setAngleVar(0);

        // emitter position
        var size = director.getWinSize();
        this._emitter.setPosition(size.width / 2, size.height / 2);
        this._emitter.setPosVar(cc.p(0, 0));

        // life of particles
        this._emitter.setLife(5);
        this._emitter.setLifeVar(0);

        // spin of particles
        this._emitter.setStartSpin(0);
        this._emitter.setStartSpinVar(0);
        this._emitter.setEndSpin(0);
        this._emitter.setEndSpinVar(0);

        // color of particles
        var startColor = cc.c4f(0.5, 0.5, 0.5, 1.0);
        this._emitter.setStartColor(startColor);

        var startColorVar = cc.c4f(0.5, 0.5, 0.5, 1.0);
        this._emitter.setStartColorVar(startColorVar);

        var endColor = cc.c4f(0.1, 0.1, 0.1, 0.2);
        this._emitter.setEndColor(endColor);

        var endColorVar = cc.c4f(0.1, 0.1, 0.1, 0.2);
        this._emitter.setEndColorVar(endColorVar);

        // size, in pixels
        this._emitter.setStartSize(32);
        this._emitter.setStartSizeVar(0);
        this._emitter.setEndSize(cc.PARTICLE_START_SIZE_EQUAL_TO_END_SIZE);

        // emits per second
        this._emitter.setEmissionRate(this._emitter.getTotalParticles() / this._emitter.getLife());

        // additive
        this._emitter.setBlendAdditive(false);
        this._emitter.setPosition(90, 90);

    },

    collideRect: function(x, y) {

        var w = this.width,
            h = this.height;
        return cc.rect(x - w / 2, y - h / 4, w, h / 2 + 20);
    }


});

PowerUp.getOrCreatePowerUp = function(arg) {

    var selChild = null;
    for (var j = 0; j < YD.CONTAINER.POWERUP.length; j++) {
        selChild = YD.CONTAINER.POWERUP[j];
        if (selChild.active == false && selChild.powerupType == arg.type) {
            selChild.active = true;
            selChild.effectMode = arg.effectMode;
            selChild.visible = true;
            return selChild;
        }

    }

};

PowerUp.create = function(arg) {

    var powerup = new PowerUp(arg);
    g_sharedGameLayer.addPowerup(powerup, powerup.zOrder, YD.UNIT_TAG.POWERUP);
    YD.CONTAINER.POWERUP.push(powerup);

    return powerup;

};

PowerUp.preSet = function() {

    var powerup = null;
    for (var i = 0; i < PowerUpType.length; i++) {
        powerup = PowerUp.create(PowerUpType[i]);
        powerup.visible = false;
        powerup.active = false;
    }
};