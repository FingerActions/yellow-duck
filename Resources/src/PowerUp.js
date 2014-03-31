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
    ctor: function(arg) {

        this._super();
        this.effectMode = arg.effectMode;
        this.powerupType = arg.type;
        this.initWithSpriteFrameName(arg.textureName);

    },
    destroy: function() {

        this.visible = false;
        this.active = false;

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