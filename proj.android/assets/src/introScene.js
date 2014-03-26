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


var IntroLayer = cc.Layer.extend({
    _duck: null,
    _timer: null,
    isMouseDown: false,
    _screenSize: null,
    _titleLabel: null,
    _tapSprite: null,
    _seashells: null,
    _fingerActions: null,

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function() {

        // super init first
        this._super();

        //update()
        this._timer = 0;
        this.scheduleUpdate();

        if ('touches' in sys.capabilities) {

            this.setTouchMode(cc.TOUCH_ALL_AT_ONCE);
            this.setTouchEnabled(true);
        }

        //init _fingerActions
        this._fingerActions = new fingerActions.FingerActions();
        this._fingerActions.showAdAtTop();
        this._fingerActions.pushSceneName("Intro scene");

        // screen size
        this._screenSize = cc.Director.getInstance().getWinSize();

        //added weather
        this.randomWeather();

        // add a label shows "Yellow Duck"
        // create and initialize a label
        this._titleLabel = cc.LabelTTF.create("Yellow Duck", "Marker Felt", 33);
        // position the label on the center of the screen
        this._titleLabel.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 100));
        // add the label as a child to this layer
        this.addChild(this._titleLabel, 5);

        this._duck = cc.Sprite.create(s_duck);
        this._duck.setPosition(cc.p(65 * SCALE_FACTOR, this._screenSize.height / 2));

        var bezier = [cc.p(0, 100 * SCALE_FACTOR), cc.p(0, -100 * SCALE_FACTOR), cc.p(0, 0)];
        var sprite_action = cc.BezierBy.create(5, bezier);
        var sprite_action_2 = cc.RepeatForever.create(sprite_action);
        this._duck.runAction(sprite_action_2);
        this.addChild(this._duck);

        this._tapSprite = cc.Sprite.create(s_tap_to_start_png);
        this._tapSprite.setAnchorPoint(cc.p(0.5, 0.5));
        this._tapSprite.setPosition(cc.p(195, (this._screenSize.height / 2) - 40));
        this.addChild(this._tapSprite, 0);

        //sea shells
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_decoration_seashell_plist, s_decoration_seashell_png);
        this._seashells = [];
        for (i = 1; i < MAX_SEA_SHEELS; i++) {
            var seashell = cc.Sprite.createWithSpriteFrameName(i + ".png");
            this.addChild(seashell);
            seashell.setVisible(false);
            this._seashells.push(seashell);
        }

        return true;
    },


    spawnSeaShells: function() {
        var that = this;
        var found_invisible = false;
        var seashell;

        while (!found_invisible) {
            var randomNumber = Math.floor(Math.random() * 6);
            var randomRotation = Math.floor(Math.random() * 180);
            if (!this._seashells[randomNumber].isVisible()) {
                this._seashells[randomNumber].setVisible(true);
                this._seashells[randomNumber].setRotation(randomRotation);
                this._seashells[randomNumber].setPosition(cc.p(this._screenSize.width, 5 + randomNumber * 2));
                var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-that._screenSize.width, 5 + randomNumber * 2));

                var callfunc = cc.CallFunc.create(function() {
                    that._seashells[randomNumber].setVisible(false);
                    that._seashells[randomNumber].setVisible(false);
                });

                var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
                this._seashells[randomNumber].runAction(flowWithCallfunc);
                return true;
            }
            found_invisible = true;
        }
    },

    randomWeather: function() {
        var randomNumber = Math.floor(Math.random() * 5);
        var sprite;

        //bg
        sprite = cc.Sprite.create(s_play_background_top_png);
        sprite.setScale(2);
        sprite.setAnchorPoint(cc.p(0, 0));
        sprite.setPosition(cc.p(0, this._screenSize.height - sprite.getContentSize().height));
        this.addChild(sprite, 0);

        sprite = cc.Sprite.create(s_play_background_bottom_png);
        sprite.setScale(2);
        sprite.setAnchorPoint(cc.p(0, 0));
        sprite.setPosition(cc.p(0, 0));
        this.addChild(sprite, 0);

        if (randomNumber === 0) {
            //rain
            var emitter = cc.ParticleRain.create();
            sprite.addChild(emitter, 10);
            emitter.setLife(4);
            emitter.setTexture(cc.TextureCache.getInstance().addImage(s_decoration_particle_fire_png));
            if (emitter.setShapeType)
                emitter.setShapeType(cc.PARTICLE_BALL_SHAPE);
            s_weather = 0;
        } else {
            s_weather = 1;
        }
    },

    update: function(delta) {
        this._timer += delta;
        if (this._timer > 1) {
            this.spawnSeaShells();
            this._timer = 0;
        }
    },

    onTouchesBegan: function(touches, event) {
        this.gotoPlayScene();
    },

    gotoPlayScene: function() {
        var scene = cc.Scene.create();
        var layer = new PlayScene();
        scene.addChild(layer);
        director.pushScene(cc.TransitionFade.create(0.1, scene));
    }
});

var IntroScene = cc.Scene.extend({
    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Scene);
    },

    onEnter: function() {
        if (s_gameStarted === false) {
            s_gameStarted = true;
            this._super();
            var layer = new IntroLayer();
            this.addChild(layer);
            layer.init();
        }
    }
});