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

    _active = true,
    _powerupType: 1,
    _effectMode: null,

    ctor: function(arg) {

        this._super(arg.textureName);
        this._effectMode = arg.effectMode;
        this._powerupType = arg.type;

    },
    destroy: function() {

        this.visible = false;
        this._active = false;

    },
    collideRect: function(x, y) {

        var w = this.width,
            h = this.height;
        return cc.rect(x - w / 2, y - h / 4, w, h / 2 + 20);
    }


});



PowerUp.getOrCreatePowerUp = function(arg) {

    var selChild = null;

    for (var j = 0; j < YD.CONTAINER.POWERUP; j++) {

        selChild = YD.CONTAINER.POWERUP[j];

        if (selChild._active == false && selChild.enemyType == arg.type) {

            selChild._active = true;

            selChild._effectMode = arg.effectMode;

            selChild.visible = true;

            return selChild;

        }

    }


};