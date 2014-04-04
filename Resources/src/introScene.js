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
    _timerSeashell: null,
    isMouseDown: false,
    _screenSize: null,
    _titleLabel: null,
    _tapSprite: null,
    _seashells: null,
    _fingerActions: null,
    _emitter: null,


    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function() {

        // super init first
        this._super();

        //update()
        this._timerSeashell = 0;
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
        this._titleLabel = cc.LabelTTF.create("Yellow Duck", "Marker Felt", 30 * SCALE_FACTOR);
        // position the label on the center of the screen
        this._titleLabel.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 100 * SCALE_FACTOR));
        // add the label as a child to this layer
        this.addChild(this._titleLabel, 5);

        this._duck = cc.Sprite.create(s_duck);
        this._duck.setPosition(cc.p(85 * SCALE_FACTOR, this._screenSize.height / 2));
        var duckWing = cc.Sprite.create(s_duck_wing);
        var wingSize = duckWing.getContentSize();
        duckWing.setPosition(cc.p(18 * SCALE_FACTOR - wingSize.width / 2 + wingSize.width * 0.75, 12 * SCALE_FACTOR - wingSize.height / 2 + wingSize.height * 0.6));
        var swimA = cc.RotateTo.create(0.5, -80);
        var swimB = cc.RotateTo.create(0.5, 20);
        var swim = cc.Sequence.create(swimA, swimB);
        duckWing.setAnchorPoint(cc.p(0.75, 0.6));
        duckWing.runAction(cc.RepeatForever.create(swim));
        this._duck.addChild(duckWing);

        var bezier = [cc.p(0, 100 * SCALE_FACTOR), cc.p(0, -100 * SCALE_FACTOR), cc.p(0, 0)];
        var sprite_action = cc.BezierBy.create(5, bezier);
        var sprite_action_2 = cc.RepeatForever.create(sprite_action);
        this._duck.runAction(sprite_action_2);
        this.addChild(this._duck, 1000);

        this._tapSprite = cc.Sprite.create(s_tap_to_start_png);
        this._tapSprite.setAnchorPoint(cc.p(0.5, 0.5));
        this._tapSprite.setPosition(cc.p((this._screenSize.width / 2) + 40 * SCALE_FACTOR, (this._screenSize.height / 2) - 40));
        this.addChild(this._tapSprite, 100);

        var happyEaster = cc.Sprite.create(s_decoration_happy_easter_png);
        happyEaster.setPosition(cc.p(this._screenSize.width / 2 + 60 * SCALE_FACTOR, this._screenSize.height / 2 - 60 * SCALE_FACTOR));
        this.addChild(happyEaster, 90);

        //sea shells
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_decoration_seashell_plist, s_decoration_seashell_png);
        this._seashells = [];
        for (i = 1; i < MAX_SEA_SHEELS; i++) {
            var seashell = cc.Sprite.createWithSpriteFrameName(i + ".png");
            this.addChild(seashell);
            seashell.setVisible(false);
            this._seashells.push(seashell);
        }

        this.generateParticleFlower();

        //easter eggs
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_decoration_easter_eggs_plist, s_decoration_easter_eggs_png);

        return true;
    },


    generateParticleFlower: function() {
        this._emitter = cc.ParticleSystem.createWithTotalParticles(50);

        this.addChild(this._emitter, 100001);
        this._emitter.setTexture(cc.TextureCache.getInstance().addImage(s_stars1));

        if (this._emitter.setShapeType)
            this._emitter.setShapeType(cc.PARTICLE_STAR_SHAPE);

        this._emitter.setDuration(-1);

        // gravity
        this._emitter.setGravity(cc.p(0, 0));

        // angle
        this._emitter.setAngle(90);
        this._emitter.setAngleVar(360);

        // speed of particles
        this._emitter.setSpeed(160);
        this._emitter.setSpeedVar(20);

        // radial
        this._emitter.setRadialAccel(-120);
        this._emitter.setRadialAccelVar(0);

        // tagential
        this._emitter.setTangentialAccel(30);
        this._emitter.setTangentialAccelVar(0);

        // emitter position
        this._emitter.setPosition(160, 240);
        this._emitter.setPosVar(cc.p(0, 0));

        // life of particles
        this._emitter.setLife(4);
        this._emitter.setLifeVar(1);

        // spin of particles
        this._emitter.setStartSpin(0);
        this._emitter.setStartSizeVar(0);
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
        this._emitter.setStartSize(80.0);
        this._emitter.setStartSizeVar(40.0);
        this._emitter.setEndSize(cc.PARTICLE_START_SIZE_EQUAL_TO_END_SIZE);

        // emits per second
        this._emitter.setEmissionRate(this._emitter.getTotalParticles() / this._emitter.getLife());

        // additive
        this._emitter.setBlendAdditive(true);
        this._emitter.setPosition(this._screenSize.width / 2 + 60 * SCALE_FACTOR, this._screenSize.height / 2 - 60 * SCALE_FACTOR);
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
                this._seashells[randomNumber].setPosition(cc.p(this._screenSize.width, (10 + randomNumber * 2) * SCALE_FACTOR));
                var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-this._screenSize.width, (4 + randomNumber * 2) * SCALE_FACTOR));

                var callfunc = cc.CallFunc.create(function() {
                    that._seashells[randomNumber].setVisible(false);
                });

                var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
                this._seashells[randomNumber].runAction(flowWithCallfunc);
                return true;
            }

            shellInvisible = true;
        }
    },

    spawnSeaweed: function() {
        var seaweed = cc.Sprite.create(s_decoration_seaweed_png);
        seaweed.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = seaweed.getContentSize();
        seaweed.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, getRandomArbitrary(0, 50 * SCALE_FACTOR)));
        this.addChild(seaweed, 0);

        var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-contentSize.width * DECORATION_SCALE_FACTOR - this._screenSize.width, 0));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(seaweed);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        seaweed.runAction(flowWithCallfunc);
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

        this._timerSeashell += delta;
        if (this._timerSeashell > 1) {
            this.spawnSeaShells();
            this._timerSeashell = 0;
        }


        if (getRandomInt(0, 400) === 0) {
            this.spawnSeaweed();
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