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
        YD.SCREEN_SIZE = this._screenSize;
        //added weather
        this.getWeather();

        // add a label shows "Yellow Duck"
        // create and initialize a label
        this._titleLabel = cc.LabelTTF.create("Yellow Duck", "Marker Felt", 33 * SCALE_FACTOR);
        // position the label on the center of the screen
        this._titleLabel.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 100 * SCALE_FACTOR));
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
        this._tapSprite.setPosition(cc.p((this._screenSize.width / 2) + 35 * SCALE_FACTOR, (this._screenSize.height / 2) - 40));
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
        var shellInvisible = false;
        var seashell;

        while (!shellInvisible) {
            var randomNumber = getRandomInt(0, 5);
            var randomRotation = getRandomArbitrary(0, 180);
            if (!this._seashells[randomNumber].isVisible()) {
                this._seashells[randomNumber].setVisible(true);
                this._seashells[randomNumber].setScale(DECORATION_SCALE_FACTOR);
                this._seashells[randomNumber].setRotation(randomRotation);
                this._seashells[randomNumber].setPosition(cc.p(this._screenSize.width, (5 + randomNumber * 2) * SCALE_FACTOR));
                var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-this._screenSize.width, (5 + randomNumber * 2) * SCALE_FACTOR));

                var callfunc = cc.CallFunc.create(function() {
                    that._seashells[randomNumber].setVisible(false);
                    that._seashells[randomNumber].setVisible(false);
                });

                var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
                this._seashells[randomNumber].runAction(flowWithCallfunc);
                return true;
            }

            shellInvisible = true;
        }
    },

    getWeather: function() {
        var backgroundTop = s_play_background_top_png;
        var backgroundBottom = s_play_background_bottom_png;

        if (s_weather === 0) {
            //rain
            backgroundTop = s_play_background_dark_top_png;
            backgroundBottom = s_play_background_dark_bottom_png;
            var emitter = cc.ParticleRain.create();
            this.addChild(emitter, 10);
            emitter.setLife(4);
            emitter.setScale(DECORATION_SCALE_FACTOR);
            emitter.setTexture(cc.TextureCache.getInstance().addImage(s_decoration_particle_fire_png));
            if (emitter.setShapeType) {
                emitter.setShapeType(cc.PARTICLE_BALL_SHAPE);
            }
        }

        this._background = cc.Sprite.create(backgroundTop);
        this._background.setScale(DECORATION_SCALE_FACTOR);
        this._background.setAnchorPoint(cc.p(0, 0));
        this._background.setPosition(cc.p(0, this._screenSize.height - this._background.getContentSize().height));
        this.addChild(this._background, 0);

        this._background = cc.Sprite.create(backgroundBottom);
        this._background.setScale(DECORATION_SCALE_FACTOR);
        this._background.setAnchorPoint(cc.p(0, 0));
        this._background.setPosition(cc.p(0, 0));
        this.addChild(this._background, 0);
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

            //set random weather
            var randomNumber = getRandomInt(0, 4);
            if (randomNumber === 0) {
                s_weather = 0;
            } else {
                s_weather = 1;
            }

            var layer = new IntroLayer();
            this.addChild(layer, 10);

            var backgroundLayer;
            if (s_weather === 0) {
                backgroundLayer = cc.LayerColor.create(cc.c4b(15, 89, 116, 255));
            } else {
                backgroundLayer = cc.LayerColor.create(cc.c4b(142, 216, 243, 255));
            }
            this.addChild(backgroundLayer, 1);

            layer.init();
        }
    }
});