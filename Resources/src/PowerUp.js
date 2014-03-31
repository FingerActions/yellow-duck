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

        this.born();

    },
    destroy: function() {

        this.visible = false;
        this.active = false;

    },


    born: function() {

        switch (this.effectMode) {

            case YD.POWERUP_TYPE.HEAVY:
                {
                    cc.log("HEHEHEEHEHEHEHEHEEHEHEHEHEHE");
                    //var contentSize = addPowerup.getContentSize();

                    cc.log(winSize.height);
                    cc.log(winSize.width);
                    cc.log(this.getContentSize().width);
                    cc.log(this.getContentSize().height);
                               cc.log(SCALE_FACTOR);

                    this.setPosition(cc.p(winSize / 3 * 2, winSize.height + this.getContentSize().height / 2));

                    var jumpIn = cc.EaseBounceIn.create(cc.MoveBy.create(2, cc.p(0, -winSize.height / 3)));
                    var flow = cc.MoveBy.create(5, cc.p(-winSize.width / 3 * 2 - this.getContentSize().width / 2, 0));
                    var wait = cc.MoveBy.create(2, cc.p(0, -20 * SCALE_FACTOR));
                    var callfunc = cc.CallFunc.create(function() {
                        this.removeChild(this, true);
                    }.bind(this));
                    var flowWithCallfunc = cc.Sequence.create(jumpIn, wait, flow, callfunc);
                    this.runAction(flowWithCallfunc);
                    var bounceUp = cc.MoveBy.create(1, cc.p(0, 20 * SCALE_FACTOR));
                    var bounceDown = cc.MoveBy.create(1, cc.p(0, -20 * SCALE_FACTOR));
                    var bounce = cc.Sequence.create(bounceUp, bounceDown);
                    this.runAction(cc.RepeatForever.create(bounce));
                }
                break;
        }

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