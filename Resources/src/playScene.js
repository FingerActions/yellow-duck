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


var g_sharedGameLayer;


var PlayLayer = cc.Layer.extend({
    _flyingAction: null,
    _duck: null,
    _duckWing: null,
    _background: null,
    _walls: null,
    _screenSize: null,
    _duckVelocity: null,
    _score: null,
    _scoreLabel: null,
    _passedFirstWall: null,
    _bubbleSpawnFrequency: null,
    _bubbles: null,
    _fish: null,
    _leafs: null,
    _seashells: null,
    _easterEggs: null,
    _isDuckJumping: null,
    _fingerActions: null,
    _powerUpBatch: null,

    //timers
    _timer: null,
    _timerScore: null,
    _timerWall: null,
    _timerKnockWall: null,
    _timerBubble: null,
    _timerFish: null,
    _timerLeaf: null,
    _timerEasterEggs: null,
    _timerSeashell: null,
    _timerPowerUp: null,
    _timerThrowingEasterEggs: null,

    _isSpawningFish: null,
    _isSpawningBubbles: null,
    _isSpawningLeafs: null,
    _isThrowingEasterEggs: null,

    _isGameOver: null,

    //powerUps
    _emitter: null,

    _isBig: false,
    _isHeavy: false,
    _isSmall: null,
    _isOppositGravity: null,
    _isInvincible: null,
    _hasPowerUpEffect: null,
    _hasPowerUpOnScreen: null,
    _currentMode: null,
    _heavyGravity: null,

    //sound
    audioEngin: null,

    //powerUp
    _powerUp: null,

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function() {
        //super init first
        this._super();

        //update()
        this._timerWall = 0;
        this.scheduleUpdate();

        this._hasPowerUpOnScreen = false;
        this._hasPowerUpEffect = false;

        //touch
        if ('touches' in sys.capabilities) {
            this.setTouchMode(cc.TOUCH_ALL_AT_ONCE);
            this.setTouchEnabled(true);
        }

        //create _fingerActions Manager instance
        this._fingerActions = new fingerActions.FingerActions();
        this._fingerActions.showAdAtTop();
        this._fingerActions.pushSceneName("play scene");

        //screen size
        this._screenSize = cc.Director.getInstance().getWinSize();
        this.getWeather();

        //duck is not falling
        this._isDuckJumping = false;
        this._duck = cc.Sprite.create(s_duck);
        this._duck.setPosition(cc.p(85 * SCALE_FACTOR, this._screenSize.height / 2));
        this._duckWing = cc.Sprite.create(s_duck_wing);
        var wingSize = this._duckWing.getContentSize();
        this._duckWing.setPosition(cc.p(18 * SCALE_FACTOR - wingSize.width / 2 + wingSize.width * 0.75, 12 * SCALE_FACTOR - wingSize.height / 2 + wingSize.height * 0.6));
        this._duckWing.setAnchorPoint(cc.p(0.75, 0.6));

        this._duck.addChild(this._duckWing);

        this._duckVelocity = JUMP_VELOCITY;
        this.addChild(this._duck, 1000);

        //walls
        this._walls = [];
        for (i = 0; i < MAX_NUM_WALLS; i++) {
            var wall = cc.Sprite.create(s_wall);
            this.addChild(wall, 400);
            wall.setVisible(false);
            this._walls.push(wall);
        }

        //score
        this._score = 0;
        this._scoreLabel = cc.LabelTTF.create(this._score, "Marker Felt", 33 * SCALE_FACTOR);

        if (s_weather === 0) {
            this._scoreLabel.setFontFillColor(cc.c4b(243, 174, 142, 255));
        } else {
            this._scoreLabel.setFontFillColor(cc.c4b(213, 113, 113, 100));
        }

        this._scoreLabel.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 100 * SCALE_FACTOR));
        this.addChild(this._scoreLabel, 500);

        //decorations
        this._timer = 0;
        this._timerBubble = 0;
        this._timerFish = 0;
        this._timerLeaf = 0;
        this._timerEasterEggs = 0;
        this._timerThrowingEasterEggs = 0;

        _bubbleSpawnFrequency = 0;
        this._hasHugeDecoration = false;
        this.spawnRandomDecoration();

        //init bubbles
        this._bubbles = [];
        for (i = 0; i < MAX_NUM_BUBBLES; i++) {
            var bubble = cc.Sprite.create(s_decoration_bubble_png);
            this.addChild(bubble, 1);
            bubble.setVisible(false);
            this._bubbles.push(bubble);
        }

        //fish
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_decoration_fish_plist, s_decoration_fish_png);
        this._fish = [];
        for (i = 0; i < MAX_NUM_FISH; i++) {
            var fish = cc.Sprite.createWithSpriteFrameName("fish_" + (i % 2 + 1).toString() + ".png");
            this.addChild(fish, 1);
            fish.setVisible(false);
            this._fish.push(fish);
        }

        //leafs
        this._leafs = [];
        for (i = 0; i < MAX_NUM_LEAFS; i++) {
            var leaf = cc.Sprite.create(s_decoration_leaf_png);
            this.addChild(leaf, 1);
            leaf.setVisible(false);
            leaf.setAnchorPoint(0.2, 0.2);
            this._leafs.push(leaf);
        }

        //sea shells
        this._seashells = [];
        for (i = 1; i < MAX_SEA_SHEELS + 1; i++) {
            var seashell = cc.Sprite.createWithSpriteFrameName(i + ".png");
            this.addChild(seashell, 0);
            seashell.setVisible(false);
            this._seashells.push(seashell);
        }

        //easter eggs
        this._easterEggs = [];
        for (i = 0; i < MAX_EASTER_EGGS; i++) {
            var easterEgg = cc.Sprite.createWithSpriteFrameName("easter_egg_" + (i % 10 + 1).toString() + ".png");
            this.addChild(easterEgg);
            easterEgg.setVisible(false);
            this._easterEggs.push(easterEgg);
        }

        this._passedFirstWall = false;
        this._isGameOver = false;

        //init local storage if not found
        if (!sys.localStorage.getItem('highScore')) {
            sys.localStorage.setItem('highScore', 0);
        }

        //reset global values
        YD.CONTAINER.POWERUP = [];

        this._heavyGravity = GRAVITY;
        this._isSmall = false;
        this._isInvincible = false;
        this._isOppositGravity = false;

        //TransparentBatch
        var powerUp = cc.TextureCache.getInstance().addImage(s_powerup_png);
        this._powerUpBatch = cc.SpriteBatchNode.createWithTexture(powerUp);
        this.addChild(this._powerUpBatch, 1000);
        g_sharedGameLayer = this;
        //pre set
        PowerUp.preSet();

        return true;
    },

    //power up
    addPowerUpToGame: function(powerUpType) {
        this._powerUp = PowerUp.getOrCreatePowerUp(PowerUpType[powerUpType]);
        this.runRandomPowerUpAnimation(this._powerUp.effectMode);
    },

    runRandomPowerUpAnimation: function(effectMode) {
        var contentSize = this._powerUp.getContentSize();
        this._powerUp.setPosition(cc.p(this._screenSize.width / 3 * 2, this._screenSize.height + contentSize.height / 2));
        var jumpIn = cc.EaseBounceIn.create(cc.MoveBy.create(2, cc.p(0, -this._screenSize.height / 3)));
        var flow = cc.MoveBy.create(5, cc.p(-this._screenSize.width / 3 * 2 - contentSize.width / 2, 0));

        var callfunc = cc.CallFunc.create(function() {
            this._powerUp.destroy();
            this._hasPowerUpOnScreen = false;
        }.bind(this));

        var flowWithCallfunc = cc.Sequence.create(jumpIn, flow, callfunc);
        this._powerUp.runAction(flowWithCallfunc);
        var bounceUp = cc.MoveBy.create(1, cc.p(0, 20 * SCALE_FACTOR));
        var bounceDown = cc.MoveBy.create(1, cc.p(0, -20 * SCALE_FACTOR));
        var bounce = cc.Sequence.create(bounceUp, bounceDown);
        this._powerUp.runAction(cc.RepeatForever.create(bounce));
    },

    duckTouchedPowerUpEffect: function() {
        this._currentMode = this._powerUp.effectMode;
        this._hasPowerUpOnScreen = false;
        this._powerUp.destroy();
        this.performPowerUpEffect();
    },

    performPowerUpEffect: function() {
        this._isInvincible = true;
        var blink = cc.Blink.create(BLINK_DURATION, BLINK_TIMES);
        switch (this._currentMode) {
            case YD.POWERUP_TYPE.BIG:
                {
                    var callfunc = cc.CallFunc.create(function() {
                        var deamonTexture = cc.TextureCache.getInstance().addImage(s_duck_deamon_png);
                        this._duck.setTexture(deamonTexture);
                        this._duckWing.setVisible(false);
                        this._isHeavy = true;
                    }.bind(this));
                    var grow = cc.ScaleBy.create(GROW_DURATION, 3);
                    var blinkGrowWithCallfunc = cc.Sequence.create(blink, callfunc, grow);
                    this._duck.runAction(blinkGrowWithCallfunc);

                    var moveForward = cc.MoveTo.create(3, cc.p(this._screenSize.width / 2 - this._duck.getContentSize().width / 2, this._screenSize.height / 2));
                    this._duck.runAction(moveForward);

                    this._isBig = true;
                    this._hasPowerUpEffect = true;
                    this.popTextOnScreen("Heavy!");
                }
                break;

            case YD.POWERUP_TYPE.SMALL:
                {
                    this._duck.runAction(blink);

                    var callfunc = cc.CallFunc.create(function() {
                        this._isInvincible = false;
                    }.bind(this));
                    var shrink = cc.ScaleBy.create(2, 0.2);
                    var shrinkWithCallfunc = cc.Sequence.create(shrink, callfunc);
                    this._duck.runAction(shrinkWithCallfunc);

                    this._isSmall = true;
                    this._hasPowerUpEffect = true;
                    this._duckVelocity = 0;
                    this.popTextOnScreen("Light!");
                }
                break;
            case YD.POWERUP_TYPE.OPPOSIT_GRAVITY:
                {
                    var callfunc = cc.CallFunc.create(function() {
                        this._isInvincible = false;
                    }.bind(this));
                    var blinkWithCallfunc = cc.Sequence.create(blink, callfunc);
                    this._duck.runAction(blinkWithCallfunc);

                    this._isOppositGravity = true;
                    this._hasPowerUpEffect = true;
                    this._duckVelocity = 0;
                    this.popTextOnScreen("Opposit gravity!");
                }
                break;
        }
    },

    popTextOnScreen: function(word) {
        var wordOnScreen = cc.LabelTTF.create(word, "Marker Felt", 50 * SCALE_FACTOR);

        wordOnScreen.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height + 20 * SCALE_FACTOR));

        this.addChild(wordOnScreen, 1000);

        var flow = cc.MoveTo.create(1, cc.p(this._screenSize.width / 2, this._screenSize.height / 2));

        var flowAway = cc.MoveTo.create(1, cc.p(this._screenSize.width / 2, -20 * SCALE_FACTOR));

        var callfunc = cc.CallFunc.create(function() {

            this.wordOnScreen.setVisible(false);

        }.bind(this));

        var flowWithCallfunc = cc.Sequence.create(flow, cc.DelayTime.create(2), flowAway, callfunc);
        wordOnScreen.runAction(flowWithCallfunc);
    },

    removeEffect: function() {
        this._heavyGravity = GRAVITY;
        var scaleBack = cc.ScaleTo.create(2, 1);
        var callfunc = cc.CallFunc.create(function() {
            this._isBig = false;
            this._isHeavy = false;
            this._isSmall = false;
            this._isOppositGravity = false;
            this._hasPowerUpEffect = false;
            this._currentMode = null;
            this._isInvincible = false;

            this._duckWing.setVisible(true);
            var duckTexture = cc.TextureCache.getInstance().addImage(s_duck);
            this._duck.setTexture(duckTexture);
        }.bind(this));

        var scaleBackWithCallfunc = cc.Sequence.create(scaleBack, callfunc);
        this._duck.runAction(scaleBackWithCallfunc);

        var moveBack = cc.MoveTo.create(1, cc.p(85 * SCALE_FACTOR, this._screenSize.height / 2));
        this._duck.runAction(moveBack);
    },

    getWeather: function() {
        var backgroundTop = s_play_background_top_png;
        var backgroundBottom = s_play_background_bottom_png;

        if (s_weather === 0) {
            //rain
            backgroundTop = s_play_background_dark_top_png;
            backgroundBottom = s_play_background_dark_bottom_png;
            var emitter = cc.ParticleRain.create();
            this.addChild(emitter, 0);
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

    spawnBubble: function() {
        var that = this;
        this._bubbles.some(function(bubble) {
            if (!bubble.isVisible()) {
                bubble.setVisible(true);
                var bubbleSpawnPositionY = getRandomArbitrary(0, that._screenSize.height);
                var randomScale = getRandomArbitrary(1, DECORATION_SCALE_FACTOR);
                bubble.setScale(randomScale);
                bubble.setPosition(cc.p(that._screenSize.width, bubbleSpawnPositionY));

                var callfunc = cc.CallFunc.create(function() {
                    bubble.setVisible(false);
                });
                var flow = cc.MoveTo.create(getRandomArbitrary(5, 10), cc.p(-(bubble.getContentSize().width / 2 * DECORATION_SCALE_FACTOR), getRandomArbitrary(0, that._screenSize.height)));
                var flowWithCallfunc = cc.Sequence.create(flow, callfunc);

                bubble.runAction(flowWithCallfunc);
                return true;
            }
        });
    },

    spawnFish: function() {
        var that = this;
        var fishInvisible = false;
        var fish;
        var distanceParam = getRandomInt(1, 3);
        var direction = getRandomInt(0, 5);

        while (!fishInvisible) {
            var randomNumber = getRandomInt(0, MAX_NUM_FISH - 1);
            fish = this._fish[randomNumber];
            if (!fish.isVisible()) {
                fish.setVisible(true);

                this.reorderChild(fish, distanceParam);
                fish.setScale(DECORATION_SCALE_FACTOR / 3 * distanceParam);

                positionY = getRandomArbitrary(100 * SCALE_FACTOR, this._screenSize.height - 100 * SCALE_FACTOR);
                fish.setPosition(cc.p(this._screenSize.width, positionY));
                var flow = cc.MoveBy.create(1 / distanceParam * 10, cc.p(-this._screenSize.width, 0));
                if (direction === 0) {
                    fish.setRotationY(180);
                    flow = cc.MoveBy.create(1 / distanceParam * 10 + 20, cc.p(-this._screenSize.width, 0));
                }
                var callfunc = cc.CallFunc.create(function() {
                    fish.setVisible(false);
                });

                var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
                fish.runAction(flowWithCallfunc);
                return true;
            }

            fishInvisible = true;
        }
    },

    spawnLeaf: function() {
        var that = this;
        this._leafs.some(function(leaf) {
            if (!leaf.isVisible()) {
                leaf.setVisible(true);
                var leafSpawnPositionX = getRandomArbitrary(that._screenSize.width / 2, that._screenSize.width);
                var randomScale = getRandomArbitrary(1.5, DECORATION_SCALE_FACTOR);
                leaf.setScale(randomScale);
                leaf.setPosition(cc.p(leafSpawnPositionX, that._screenSize.height));

                var callfunc = cc.CallFunc.create(function() {
                    leaf.setVisible(false);
                });
                leafSpawnPositionX = getRandomArbitrary(0, that._screenSize.width / 3);
                var flow = cc.MoveTo.create(getRandomArbitrary(8, 10), cc.p(leafSpawnPositionX, 0));
                var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
                leaf.runAction(flowWithCallfunc);

                var driftFrom = cc.RotateBy.create(getRandomArbitrary(0.6, 0.9), getRandomArbitrary(25, 65));
                var driftTo = cc.RotateBy.create(getRandomArbitrary(0.6, 0.9), getRandomArbitrary(-35, -75));
                var drift = cc.Sequence.create(driftFrom, driftTo);
                leaf.runAction(cc.RepeatForever.create(drift));
                return true;
            }
        });
    },

    throwEasterEgg: function() {
        var that = this;
        var distanceParam = getRandomInt(1, 3);
        this._easterEggs.some(function(easterEgg) {
            if (!easterEgg.isVisible()) {
                easterEgg.setVisible(true);
                var easterEggSpawnPositionX = getRandomArbitrary(0, that._screenSize.width);

                that.reorderChild(easterEgg, distanceParam);
                easterEgg.setScale(DECORATION_SCALE_FACTOR / 3 * distanceParam);
                easterEgg.setPosition(cc.p(easterEggSpawnPositionX, 0));

                var callfunc = cc.CallFunc.create(function() {
                    easterEgg.setVisible(false);
                });
                var jump = cc.JumpBy.create(1.5, cc.p(-50 * distanceParam * SCALE_FACTOR, 0), 50 * SCALE_FACTOR * distanceParam, 1);
                var flowWithCallfunc = cc.Sequence.create(jump, callfunc);
                easterEgg.runAction(flowWithCallfunc);

                var dice = getRandomInt(0, 1);
                var degree;
                if (dice === 1) {
                    degree = 360;
                } else {
                    degree = -360;
                }

                var rotate = cc.EaseInOut.create(cc.RotateBy.create(1.5, degree), 3);
                easterEgg.runAction(rotate);
                return true;
            }
        });
    },

    spawnMermaid: function() {
        var mermaid = cc.Sprite.create(s_decoration_mermaid_png);
        mermaid.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = mermaid.getContentSize();
        mermaid.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2));
        this.addChild(mermaid, 0);
        var flow = cc.MoveTo.create(20, cc.p(-contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(mermaid);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        mermaid.runAction(flowWithCallfunc);
    },

    spawnSnowman: function() {
        var snowman = cc.Sprite.create(s_decoration_snowman_png);
        snowman.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = snowman.getContentSize();
        snowman.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2));
        this.addChild(snowman, 0);
        var flow = cc.MoveTo.create(20, cc.p(-contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(snowman);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        snowman.runAction(flowWithCallfunc);
    },

    spawnCrab: function() {
        var crab = cc.Sprite.create(s_decoration_crab_png);
        crab.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = crab.getContentSize();
        crab.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2 - 190 * SCALE_FACTOR));
        this.addChild(crab, 0);

        var bounceUp = cc.MoveBy.create(0.5, cc.p(0, 80 * SCALE_FACTOR));
        var bounceDown = cc.MoveBy.create(0.5, cc.p(0, -80 * SCALE_FACTOR));
        var bounce = cc.Sequence.create(bounceUp, bounceDown);
        crab.runAction(cc.RepeatForever.create(bounce));

        var flow = cc.MoveTo.create(10, cc.p(-contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2 - 190 * SCALE_FACTOR));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(crab);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        crab.runAction(flowWithCallfunc);
    },

    spawnUnicorn: function() {
        var unicorn = cc.Sprite.create(s_decoration_unicorn_png);
        unicorn.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = unicorn.getContentSize();
        unicorn.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2));
        this.addChild(unicorn, 0);

        var flow = cc.MoveTo.create(20, cc.p(-contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(unicorn);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        unicorn.runAction(flowWithCallfunc);
    },

    spawnPirateShip: function() {
        var pirateShip = cc.Sprite.create(s_decoration_pirate_ship_png);
        pirateShip.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = pirateShip.getContentSize();
        pirateShip.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2 - 190 * SCALE_FACTOR));
        this.addChild(pirateShip, 0);

        var flow = cc.MoveTo.create(15, cc.p(-contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2 - 150 * SCALE_FACTOR));

        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(pirateShip, true);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        pirateShip.runAction(flowWithCallfunc);
        var rotate = cc.RotateBy.create(3, 360);
        pirateShip.runAction(cc.RepeatForever.create(rotate));

        var bounceUp = cc.MoveBy.create(2, cc.p(0, 30 * SCALE_FACTOR));
        var bounceDown = cc.MoveBy.create(2, cc.p(0, -30 * SCALE_FACTOR));
        var bounce = cc.Sequence.create(cc.EaseInOut.create(bounceUp, 3), cc.EaseInOut.create(bounceDown, 3));
        pirateShip.runAction(cc.RepeatForever.create(bounce));
    },

    spawnPirate: function() {
        var pirate = cc.Sprite.create(s_decoration_pirate_png);
        pirate.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = pirate.getContentSize();
        pirate.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2 - 140 * SCALE_FACTOR));
        this.addChild(pirate, 0);

        var flow = cc.MoveTo.create(6.5, cc.p(this._screenSize.width / 2, this._screenSize.height / 2 - 140 * SCALE_FACTOR));
        var disappear = cc.SkewBy.create(4, 0, -90);

        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(pirate, true);
        }.bind(this));

        var shining = cc.Sprite.create(s_decoration_shining_png);
        shining.setScale(DECORATION_SCALE_FACTOR);
        shining.setPosition(cc.p(60, 150));
        shining.setVisible(false);

        var shineAction = cc.CallFunc.create(function() {
            shining.setVisible(true);
            var fadeIn = cc.FadeIn.create(1);
            var rotate = cc.RotateBy.create(2, 360);
            var fadeOut = cc.FadeOut.create(0.6);
            var shine = cc.Sequence.create(fadeIn, cc.DelayTime.create(1), rotate, fadeOut);
            shining.runAction(shine);
        });

        pirate.addChild(shining);

        var flowWithCallfunc = cc.Sequence.create(flow, cc.DelayTime.create(1), shineAction, cc.DelayTime.create(6), cc.EaseOut.create(disappear, 3.0), callfunc);
        pirate.runAction(flowWithCallfunc);
    },

    spawnOctopus: function() {
        var octopus = cc.Sprite.create(s_decoration_optopus_png);
        octopus.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = octopus.getContentSize();
        octopus.setPosition(cc.p(this._screenSize.width / 3 * 2, this._screenSize.height + contentSize.height / 2));
        this.addChild(octopus, 0);

        var jumpIn = cc.EaseBounceIn.create(cc.MoveBy.create(2, cc.p(0, -this._screenSize.height / 3)));
        var flow = cc.MoveBy.create(5, cc.p(-this._screenSize.width / 3 * 2 - contentSize.width / 2, 0));
        var wait = cc.MoveBy.create(2, cc.p(0, -10 * SCALE_FACTOR));
        var wait2 = cc.MoveBy.create(5, cc.p(0, -10 * SCALE_FACTOR));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(octopus, true);
        }.bind(this));

        var spitAction = cc.CallFunc.create(function() {
            var spit = cc.Sprite.create(s_decoration_spit_png);
            spit.setScale(DECORATION_SCALE_FACTOR / 5);
            spit.setPosition(cc.p(this._screenSize.width / 3 * 2, this._screenSize.height + contentSize.height / 2 - this._screenSize.height / 3));
            this.addChild(spit, 400);
            var spitMove = cc.ScaleTo.create(2, DECORATION_SCALE_FACTOR);
            var spitDisappear = cc.FadeOut.create(2);
            var spitCallfunc = cc.CallFunc.create(function() {
                this.removeChild(spit, true);
            }.bind(this));
            spit.runAction(cc.Sequence.create(spitMove, cc.DelayTime.create(2), spitDisappear, spitCallfunc));
        }.bind(this));

        var flowWithCallfunc = cc.Sequence.create(jumpIn, wait, spitAction, wait2, flow, callfunc);
        octopus.runAction(flowWithCallfunc);

        var bounceUp = cc.MoveBy.create(1, cc.p(0, 20 * SCALE_FACTOR));
        var bounceDown = cc.MoveBy.create(1, cc.p(0, -20 * SCALE_FACTOR));
        var bounce = cc.Sequence.create(bounceUp, bounceDown);
        octopus.runAction(cc.RepeatForever.create(bounce));
    },

    spawnEasterBunny: function() {
        var easterBunny = cc.Sprite.create(s_decoration_easter_bunny_png);
        easterBunny.setScale(DECORATION_SCALE_FACTOR);
        var contentSize = easterBunny.getContentSize();
        easterBunny.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, 150 * SCALE_FACTOR));
        this.addChild(easterBunny, 0);
        var flow = cc.MoveTo.create(20, cc.p(-contentSize.width / 2 * DECORATION_SCALE_FACTOR, 150 * SCALE_FACTOR));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(easterBunny);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        easterBunny.runAction(flowWithCallfunc);
    },

    spawnRandomDecoration: function() {
        var randomDecorationArray = [];
        randomDecorationArray.push(this.spawnMermaid.bind(this));
        randomDecorationArray.push(this.spawnUnicorn.bind(this));
        randomDecorationArray.push(this.spawnOctopus.bind(this));
        randomDecorationArray.push(this.spawnCrab.bind(this));
        randomDecorationArray.push(this.spawnEasterBunny.bind(this));

        var randomNumber = getRandomInt(0, randomDecorationArray.length - 1);
        randomDecorationArray[randomNumber]();
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
        seaweed.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, getRandomArbitrary(0, 40 * SCALE_FACTOR)));
        this.addChild(seaweed, 0);

        var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-contentSize.width * DECORATION_SCALE_FACTOR - this._screenSize.width, 0));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(seaweed);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        seaweed.runAction(flowWithCallfunc);
    },

    spawnTreasure: function() {
        var treasure = cc.Sprite.create(s_decoration_treasure_png);
        treasure.setScale(getRandomArbitrary(1, DECORATION_SCALE_FACTOR));
        var contentSize = treasure.getContentSize();
        treasure.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, getRandomArbitrary(0, this._screenSize.height - 200 * SCALE_FACTOR)));
        this.addChild(treasure, 0);

        var flow = cc.MoveBy.create(20, cc.p(-contentSize.width * DECORATION_SCALE_FACTOR - this._screenSize.width, 0));
        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(treasure);
        }.bind(this));
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        treasure.runAction(flowWithCallfunc);
    },

    update: function(delta) {
        this._timer += delta;
        this._timerWall += delta;
        this._timerScore += delta;
        this._timerSeashell += delta;
        this._timerEasterEggs += delta;
        this._timerKnockWall += delta;

        var fpsFactor = DESIGN_FPS * delta;

        //decorations
        if (this._timerSeashell > 1) {
            this.spawnSeaShells();
            this._timerSeashell = 0;
        }

        if (this._isSpawningBubbles) {
            this._timerBubble += delta;
            if (this._timerBubble > this._bubbleSpawnFrequency) {
                this.spawnBubble();
                this._timerBubble = 0;
                this._bubbleSpawnFrequency = getRandomArbitrary(1.5, 5);
            }
        }

        if (this._isSpawningFish) {
            this._timerFish += delta;
            if (this._timerFish > 0.2) {
                this.spawnFish();
                this._timerFish = 0;
            }
        }

        if (this._isSpawningLeafs) {
            this._timerLeaf += delta;
            if (this._timerLeaf > 1.8) {
                this.spawnLeaf();
                this._timerLeaf = 0;
            }
        }

        if (getRandomInt(0, 1000 / fpsFactor) === 0) {
            this._isThrowingEasterEggs = true;
            this._timerThrowingEasterEggs = 0;
        }

        if (this._isThrowingEasterEggs) {
            this._timerEasterEggs += delta;
            this._timerThrowingEasterEggs += delta;
            if (this._timerEasterEggs > 0.04) {
                this.throwEasterEgg();
                this._timerEasterEggs = 0;
            }
            if (this._timerThrowingEasterEggs > 2) {
                this._isThrowingEasterEggs = false;
            }
        }

        if (this._timerWall > WALL_GAP_TIME) {
            this.createWall();
            this._timerWall = 0;
        }

        var gravity;

        if (this._isSmall) {
            gravity = 0;
        } else if (this._isHeavy) {
            if (this._heavyGravity < GRAVITY * 3) {
                this._heavyGravity += 2 * GRAVITY / GROW_DURATION * delta;
            }
            gravity = this._heavyGravity;
        } else if (this._isOppositGravity) {
            gravity = -GRAVITY;
        } else {
            gravity = GRAVITY;
        }

        this._duckVelocity -= gravity * fpsFactor;

        if (this._duckVelocity < 0 && this._isDuckJumping) {
            this.turnDuckBack();
        }

        //duck position
        var duckPrePosition = this._duck.getPosition();
        if (duckPrePosition.y > this._screenSize.height - 50 * SCALE_FACTOR) {
            this._duckVelocity = -10;
        }
        this._duck.setPosition(cc.p(duckPrePosition.x, duckPrePosition.y + this._duckVelocity * fpsFactor));

        //treasure
        if (getRandomInt(0, 200000 / fpsFactor) === 0) {
            this.spawnTreasure();
        }

        //seaweed
        if (getRandomInt(0, 400 / fpsFactor) === 0) {
            this.spawnSeaweed();
        }

        this.checkGameOver();
        this.checkDuckTouchedPowerUp();
        this._scoreLabel.setString(this._score);

        //update score based on time gap
        if (this._passedFirstWall && this._timerScore > WALL_GAP_TIME) {
            if (++this._score % 12 === 0) {
                this.spawnRandomDecoration();
            }
            if (this._score % 9 === 0) {
                var dice = getRandomInt(0, 2);
                if (dice === 0) {
                    this._isSpawningFish = true;
                    this._isSpawningBubbles = false;
                    this._isSpawningLeafs = false;
                } else if (dice === 1) {
                    this._isSpawningFish = false;
                    this._isSpawningBubbles = true;
                    this._isSpawningLeafs = false;
                } else if (dice === 2) {
                    this._isSpawningFish = false;
                    this._isSpawningBubbles = false;
                    this._isSpawningLeafs = true;
                } else {
                    this._isSpawningFish = false;
                    this._isSpawningBubbles = false;
                    this._isSpawningLeafs = false;
                }
            }
            this._timerScore = 0;
        }
        if (!this._passedFirstWall && this._timerScore > WALL_GAP_TIME / 2 + WALL_APPEAR_TIME) {
            this._passedFirstWall = true;
            this._score++;
            this._timerScore = 0;
        }

        //powerup
        if (getRandomInt(0, 40 / fpsFactor) === 0 && !this._hasPowerUpOnScreen && !this._hasPowerUpEffect) {
            dice = getRandomInt(0, 2);
            this.addPowerUpToGame(dice);
            this._hasPowerUpOnScreen = true;
        }

        if (this._hasPowerUpEffect === true) {
            this._timerPowerUp += delta;

            if (this._timerPowerUp > 15.0) {
                this.removeEffect();
                this._timerPowerUp = 0;
            }
        }
    },

    turnDuckBack: function() {
        var turnbackAction = cc.RotateTo.create(0.1, 0);
        this._duck.runAction(turnbackAction);
        this._isDuckJumping = false;
    },

    updateScore: function() {
        s_currentScore = this._score;
        if (this._score > sys.localStorage.getItem('highScore')) {
            sys.localStorage.setItem('highScore', this._score);
            s_isHighScore = true;

            //Game Bridge Class
            this._fingerActions = new fingerActions.FingerActions();
            this._fingerActions.pushScore(this._score, "YellowDuck");
        }
    },

    createWall: function() {
        //get invisible walls
        var thisWalls = [];
        for (var i = 0; i < this._walls.length; i++) {
            if (!this._walls[i].isVisible()) {
                this._walls[i].setVisible(true);
                thisWalls.push(this._walls[i]);
            }
            if (thisWalls.length === 2) {
                break;
            }
        }

        var wallWidth = thisWalls[0].getContentSize().width;
        var wallHeight = thisWalls[0].getContentSize().height;

        thisWalls[1].setRotation(180);
        thisWalls[1].isTop = false;
        thisWalls[0].setPosition(cc.p(this._screenSize.width + wallWidth / 2, this._screenSize.height + wallHeight / 2));
        thisWalls[0].isTop = true;
        var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-this._screenSize.width - wallWidth, 0));
        flow.setTag(0);
        var wallTopHeight = getRandomArbitrary(50, 300);
        var spawn = cc.MoveBy.create(0.5, cc.p(0, -wallTopHeight * SCALE_FACTOR));

        var callfunc = cc.CallFunc.create(function() {
            thisWalls[0].setVisible(false);
            thisWalls[1].setVisible(false);
        });

        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        thisWalls[0].runAction(spawn);
        thisWalls[0].runAction(flowWithCallfunc);

        thisWalls[1].setPosition(cc.p(this._screenSize.width + wallWidth / 2, -wallHeight / 2));

        flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-this._screenSize.width - wallWidth, 0));
        flow.setTag(0);
        wallGap = getRandomArbitrary(WALL_MIN_GAP, WALL_MAX_GAP);
        spawn = cc.MoveBy.create(0.5, cc.p(0, this._screenSize.height - wallTopHeight * SCALE_FACTOR - wallGap));
        thisWalls[1].runAction(flow);
        thisWalls[1].runAction(spawn);
    },

    knockDownWall: function(wall) {
        wall.stopActionByTag(0);
        var randomY;
        if (wall.isTop) {
            randomY = getRandomArbitrary(this._screenSize.height / 3 * 2, this._screenSize.height);
        } else {
            randomY = getRandomArbitrary(0, this._screenSize.height / 3);
        }
        var width = wall.getContentSize().width;
        var moveForward = cc.MoveTo.create(0.5, cc.p(this._screenSize.width + width, randomY));
        var callfunc = cc.CallFunc.create(function() {
            wall.setVisible(false);
        });
        var moveForwardWidthCallfunc = cc.Sequence.create(moveForward, callfunc);
        moveForwardWidthCallfunc.setTag(1);

        wall.runAction(moveForwardWidthCallfunc);
    },

    onTouchesBegan: function(touches, event) {
        if (this._isGameOver) {
            return;
        }

        if (this._isBig) {
            audioEngin.playEffect(s_jump_slow_effect);
        } else {
            audioEngin.playEffect(s_jump_effect);
        }
        if (this._isOppositGravity) {
            this._duckVelocity = -JUMP_VELOCITY;
        } else if (this._isSmall) {
            var touchPositionY = touches[0].getLocation().y;
            cc.log(touchPositionY);
            if (touchPositionY < this._screenSize.height / 2) {
                if (this._duckVelocity > 0) {
                    this._duckVelocity = 0;
                }
                this._duckVelocity -= 10;
            } else {
                if (this._duckVelocity < 0) {
                    this._duckVelocity = 0;
                }
                this._duckVelocity += 10;
            }
        } else {
            this._duckVelocity = JUMP_VELOCITY;
        }
        var duckRotate;
        if (getRandomInt(0, 14) === 0) {
            duckRotate = cc.RotateBy.create(0.5, -400);
        } else {
            duckRotate = cc.RotateTo.create(0.1, -25);
        }
        this._duck.runAction(duckRotate);
        this._isDuckJumping = true;

        //swim animation
        var swimA = cc.RotateTo.create(0.2, 20);
        var swimB = cc.RotateTo.create(0.2, -80);
        var swim = cc.Sequence.create(swimA, swimB);
        this._duckWing.runAction(swim);
    },

    checkDuckTouchedPowerUp: function() {
        if (this._powerUp !== null && this._powerUp.active) {
            if (this.isObjTouched(this._duck, this._powerUp)) {
                this.duckTouchedPowerUpEffect();
            }
        }
    },

    checkGameOver: function() {
        if (this._duck.getPosition().y < -this._duck.getContentSize().width) {
            this.gameOver(false);
        }
        var walls = this._walls;

        for (var i = 0; i < walls.length; i++) {
            if (this.isObjTouched(this._duck, this._walls[i])) {
                if (this._isInvincible) {
                    if (this._timerKnockWall > 0.5) {
                        this.knockDownWall(this._walls[i]);
                        this._timerKnockWall = 0;
                    }
                } else {
                    this.gameOver(true);
                }
            }
        }
    },

    gameOver: function(hitWall) {
        this.unscheduleUpdate();
        this._fingerActions = new fingerActions.FingerActions();
        this._isGameOver = true;
        if (hitWall) {
            this.gameOverHitWall();
            this._fingerActions.pushEventName("Action", "Die", "Hit Wall");
        } else {
            this.gameOverDrowned();
            this._fingerActions.pushEventName("Action", "Die", "Drowned");
        }
    },

    gameOverHitWall: function() {
        var that = this;
        var shrinkAction = cc.ScaleTo.create(0.4, 0.3);
        var rotateAction = cc.RotateBy.create(1.5, 700);
        var floatAction = cc.BezierBy.create(2, [cc.p(0, 0), cc.p(-600, 500), cc.p(500, 1500)]);

        var callfunc = cc.CallFunc.create(function() {
            that.die();
        });

        var floatDie = cc.Sequence.create(floatAction, callfunc);
        this._duck.runAction(floatDie);

        var shrinkRotateDie = cc.Sequence.create(shrinkAction, rotateAction);
        this._duck.runAction(shrinkRotateDie);
    },

    gameOverDrowned: function() {
        var that = this;
        audioEngin.playEffect(s_drowned_effect);
        var enoughBubble = false;
        this._bubbles.some(function(bubble) {
            if (!bubble.isVisible()) {
                bubble.setVisible(true);
                var size = bubble.getContentSize();
                bubble.setPosition(cc.p(325, -size.height));
                bubble.setScale(0.35);
                var flow = cc.MoveTo.create(getRandomArbitrary(1, 2.5), cc.p(getRandomArbitrary(30 * SCALE_FACTOR, 100 * SCALE_FACTOR), that._screenSize.height));

                var callfunc = cc.CallFunc.create(function() {
                    that.die();
                });
                var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
                bubble.runAction(flowWithCallfunc);
                enoughBubble = true;
                return true;
            }
        });
        if (!enoughBubble) {
            this.die();
        }
    },

    die: function() {
        this.updateScore();
        var scene = cc.Scene.create();
        var layer = new ScoreScene();
        scene.addChild(layer);
        director.pushScene(cc.TransitionFade.create(0.1, scene));
    },


    isObjTouched: function(firstObj, secondObj) {
        var firstObjSize = firstObj.getContentSize();
        var firstObjPos = firstObj.getPosition();
        var firstCollideRect = cc.rect(firstObjPos.x - firstObjSize.width / 2, firstObjPos.y - firstObjSize.height / 2, firstObjSize.width, firstObjSize.height);

        //below normally used as Wall, make object little bit smaller to maker game easier
        var secondObjSize = secondObj.getContentSize();
        var secondObjPos = secondObj.getPosition();
        var secondCollideRect = cc.rect(secondObjPos.x - secondObjSize.width / 2, secondObjPos.y - secondObjSize.height / 2, secondObjSize.width - 5, secondObjSize.height - 5);

        if (cc.rectIntersectsRect(firstCollideRect, secondCollideRect)) {
            if (secondObj == this._powerUp) {
                audioEngin.playEffect(s_poped_effect);
            } else {
                audioEngin.playEffect(s_poped_effect);
            }
            return true;
        }
    },
});

PlayLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = PlayLayer.create();
    scene.addChild(layer, 1);
    return scene;
};


PlayLayer.prototype.addPowerUp = function(powerUp, z, tag) {
    this._powerUpBatch.addChild(powerUp, z, tag);
};

var PlayScene = cc.Scene.extend({
    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Scene);
    },

    onEnter: function() {
        this._super();
        audioEngin = cc.AudioEngine.getInstance();

        s_isHighScore = false;
        var layer = new PlayLayer();
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
});