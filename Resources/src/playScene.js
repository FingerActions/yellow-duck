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
    _background: null,
    _walls: null,
    _screenSize: null,
    _duckVelocity: null,
    _score: null,
    _scoreLabel: null,
    _passedFirstWall: null,
    _bubbleSpawnFrequency: null,
    _bubbles: null,
    _gameover: null,
    _seashells: null,
    _isDuckJumping: null,
    _fingerActions: null,
    _powerupBatch: null,

    //timers
    _timerScore: null,
    _timerWall: null,
    _timerBubble: null,
    _timerSeashell: null,


    //powerup
    _haspowerup: null,

    //powerups
    _powerups: null,
    _emitter: null,

    //sound
    audioEngin: null,

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function() {
        //super init first
        this._super();

        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_powerup_plist, s_powerup_png);

        //update()
        this._timerWall = 0;
        this.scheduleUpdate();

        this._haspowerup = false;

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
        this._duck.setPosition(cc.p(65 * SCALE_FACTOR, this._screenSize.height / 2));
        this._duckVelocity = 0;
        this.addChild(this._duck, 1000);

        //walls
        this._walls = [];
        for (i = 0; i < MAX_NUM_WALLS; i++) {
            var wall = cc.Sprite.create(s_wall);
            this.addChild(wall, 500);
            wall.setVisible(false);
            this._walls.push(wall);
        }

        //sea shells
        this._seashells = [];
        for (i = 1; i < MAX_SEA_SHEELS; i++) {
            var seashell = cc.Sprite.createWithSpriteFrameName(i + ".png");
            this.addChild(seashell);
            seashell.setVisible(false);
            this._seashells.push(seashell);

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
        this._timerBubble = 0;
        _bubbleSpawnFrequency = 0;
        this._hasHugeDecoration = false;
        this.spawnRandomDecoration();

        //init bubbles
        this._bubbles = [];
        for (i = 0; i < MAX_NUM_BUBBLES; i++) {
            var bubble = cc.Sprite.create(s_decoration_bubble_png);
            this.addChild(bubble);
            bubble.setVisible(false);
            this._bubbles.push(bubble);
        }

        this._passedFirstWall = false;
        this._gameover = false;

        //init local storage if not found
        if (!sys.localStorage.getItem('highScore')) {
            sys.localStorage.setItem('highScore', 0);
        }


        //reset global values
        YD.CONTAINER.POWERUP = [];

        //TransparentBatch

        var powerup = cc.TextureCache.getInstance().addImage(s_powerup_png);
        this._powerupBatch = cc.SpriteBatchNode.createWithTexture(powerup);
        this.addChild(this._powerupBatch);
        g_sharedGameLayer = this;

        //pre set
        PowerUp.preSet();

        return true;
    },


    addPowerupToGame: function(powerupType) {

        var addPowerup = PowerUp.getOrCreatePowerUp(PowerUpType[powerupType]);
        var contentSize = addPowerup.getContentSize();
        switch (addPowerup.effectMode) {

            case YD.POWERUP_TYPE.HEAVY:
                {
                    addPowerup.setPosition(cc.p(this._screenSize.width / 3 * 2, this._screenSize.height + contentSize.height / 2));
                    var jumpIn = cc.EaseBounceIn.create(cc.MoveBy.create(2, cc.p(0, -this._screenSize.height / 3)));
                    var flow = cc.MoveBy.create(5, cc.p(-this._screenSize.width / 3 * 2 - contentSize.width / 2, 0));
                    var wait = cc.MoveBy.create(2, cc.p(0, -20 * SCALE_FACTOR));

                    var callfunc = cc.CallFunc.create(function() {
                        addPowerup.destroy();
                        this._haspowerup = false;
                    }.bind(this));

                    var flowWithCallfunc = cc.Sequence.create(jumpIn, wait, flow, callfunc);
                    addPowerup.runAction(flowWithCallfunc);
                    var bounceUp = cc.MoveBy.create(1, cc.p(0, 20 * SCALE_FACTOR));
                    var bounceDown = cc.MoveBy.create(1, cc.p(0, -20 * SCALE_FACTOR));
                    var bounce = cc.Sequence.create(bounceUp, bounceDown);
                    addPowerup.runAction(cc.RepeatForever.create(bounce));




                }
                break;

            case YD.POWERUP_TYPE.LIGHT:
                {
                    addPowerup.setPosition(cc.p(this._screenSize.width / 3 * 2, this._screenSize.height + contentSize.height / 2));
                    var jumpIn = cc.EaseBounceIn.create(cc.MoveBy.create(2, cc.p(0, -this._screenSize.height / 3)));
                    var flow = cc.MoveBy.create(5, cc.p(-this._screenSize.width / 3 * 2 - contentSize.width / 2, 0));
                    var wait = cc.MoveBy.create(2, cc.p(0, -20 * SCALE_FACTOR));

                    var callfunc = cc.CallFunc.create(function() {
                        addPowerup.destroy();
                        this._haspowerup = false;
                    }.bind(this));


                    var flowWithCallfunc = cc.Sequence.create(jumpIn, wait, flow, callfunc);
                    addPowerup.runAction(flowWithCallfunc);
                    var bounceUp = cc.MoveBy.create(1, cc.p(0, 20 * SCALE_FACTOR));
                    var bounceDown = cc.MoveBy.create(1, cc.p(0, -20 * SCALE_FACTOR));
                    var bounce = cc.Sequence.create(bounceUp, bounceDown);
                    addPowerup.runAction(cc.RepeatForever.create(bounce));
                }
                break;

            case YD.POWERUP_TYPE.LOSEGRAVITY:
                {
                    addPowerup.setPosition(cc.p(this._screenSize.width / 3 * 2, this._screenSize.height + contentSize.height / 2));
                    var jumpIn = cc.EaseBounceIn.create(cc.MoveBy.create(2, cc.p(0, -this._screenSize.height / 3)));
                    var flow = cc.MoveBy.create(5, cc.p(-this._screenSize.width / 3 * 2 - contentSize.width / 2, 0));
                    var wait = cc.MoveBy.create(2, cc.p(0, -20 * SCALE_FACTOR));

                    var callfunc = cc.CallFunc.create(function() {
                        addPowerup.destroy();
                        this._haspowerup = false;
                    }.bind(this));


                    var flowWithCallfunc = cc.Sequence.create(jumpIn, wait, flow, callfunc);
                    addPowerup.runAction(flowWithCallfunc);
                    var bounceUp = cc.MoveBy.create(1, cc.p(0, 20 * SCALE_FACTOR));
                    var bounceDown = cc.MoveBy.create(1, cc.p(0, -20 * SCALE_FACTOR));
                    var bounce = cc.Sequence.create(bounceUp, bounceDown);
                    addPowerup.runAction(cc.RepeatForever.create(bounce));
                }
                break;


            case YD.POWERUP_TYPE.OPPOSITGRAVITY:
                {
                    addPowerup.setPosition(cc.p(this._screenSize.width / 3 * 2, this._screenSize.height + contentSize.height / 2));
                    var jumpIn = cc.EaseBounceIn.create(cc.MoveBy.create(2, cc.p(0, -this._screenSize.height / 3)));
                    var flow = cc.MoveBy.create(5, cc.p(-this._screenSize.width / 3 * 2 - contentSize.width / 2, 0));
                    var wait = cc.MoveBy.create(2, cc.p(0, -20 * SCALE_FACTOR));

                    var callfunc = cc.CallFunc.create(function() {
                        addPowerup.destroy();
                        this._haspowerup = false;
                    }.bind(this));


                    var flowWithCallfunc = cc.Sequence.create(jumpIn, wait, flow, callfunc);
                    addPowerup.runAction(flowWithCallfunc);
                    var bounceUp = cc.MoveBy.create(1, cc.p(0, 20 * SCALE_FACTOR));
                    var bounceDown = cc.MoveBy.create(1, cc.p(0, -20 * SCALE_FACTOR));
                    var bounce = cc.Sequence.create(bounceUp, bounceDown);
                    addPowerup.runAction(cc.RepeatForever.create(bounce));
                }
                break;



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

    spawnBubble: function() {
        var that = this;
        this._bubbles.some(function(bubble) {
            if (!bubble.isVisible()) {
                bubble.setVisible(true);
                var bubbleSpawnPositionY = getRandomArbitrary(0, that._screenSize.height);
                var randomScale = getRandomArbitrary(1, 2);
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
        pirate.setPosition(cc.p(this._screenSize.width + contentSize.width / 2 * DECORATION_SCALE_FACTOR, this._screenSize.height / 2 - 160 * SCALE_FACTOR));
        this.addChild(pirate, 0);

        var flow = cc.MoveTo.create(6.5, cc.p(this._screenSize.width / 2, this._screenSize.height / 2 - 160 * SCALE_FACTOR));
        var disappear = cc.SkewBy.create(5, 0, -90);

        var callfunc = cc.CallFunc.create(function() {
            this.removeChild(pirate, true);
        }.bind(this));

        var flowWithCallfunc = cc.Sequence.create(flow, cc.EaseOut.create(disappear, 3.0), callfunc);
        pirate.runAction(flowWithCallfunc);
    },

    spawnRandomDecoration: function() {
        var randomNumber = 3;
        //getRandomInt(0, 1);
        switch (randomNumber) {
            case 0:
                this.spawnMermaid();
                break;
            case 1:
                this.spawnUnicorn();
                break;
            case 2:
                this.spawnPirateShip();
                break;
            case 3:
                this.spawnPirate();
                break;
            default:
                this.spawnCrab();
        }
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

    update: function(delta) {
        this._timerWall += delta;
        this._timerScore += delta;
        this._timerSeashell += delta;

        //decorations
        if (this._timerSeashell > 1) {
            this.spawnSeaShells();
            this._timerSeashell = 0;
            // this.addPowerupToGame(0);
        }

        this._timerBubble += delta;
        if (this._timerBubble > this._bubbleSpawnFrequency) {
            this.spawnBubble();
            this._timerBubble = 0;
            this._bubbleSpawnFrequency = getRandomArbitrary(1.5, 5);
        }

        if (this._timerWall > WALL_GAP_TIME) {
            this.createWall();
            this._timerWall = 0;
        }

        var duckPrePosition = this._duck.getPosition();
        if (duckPrePosition.y > this._screenSize.height) {
            this._duckVelocity = 0;
        }

        this._duckVelocity -= GRAVITY;

        if (this._duckVelocity < 0 && this._isDuckJumping) {
            this.turnDuckBack();
        }

        this._duck.setPosition(cc.p(duckPrePosition.x, duckPrePosition.y + this._duckVelocity));
        this.checkGameOver();
        this._scoreLabel.setString(this._score);

        //update score based on time gap
        if (this._passedFirstWall && this._timerScore > WALL_GAP_TIME) {
            if (++this._score % 12 === 0) {
                this.spawnRandomDecoration();
            }
            this._timerScore = 0;
        }
        if (!this._passedFirstWall && this._timerScore > WALL_GAP_TIME / 2 + WALL_APPEAR_TIME) {
            this._passedFirstWall = true;
            this._score++;
            this._timerScore = 0;
        }

        //powerup
        if (getRandomInt(0, 40) === 0 && !this._haspowerup) {
            var dice = getRandomInt(0, 3);
            this.addPowerupToGame(dice);
            this._haspowerup = true;
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
        thisWalls[0].setPosition(cc.p(this._screenSize.width + wallWidth / 2, this._screenSize.height + wallHeight / 2));
        var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-this._screenSize.width - wallWidth, 0));
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
        wallGap = getRandomArbitrary(WALL_MIN_GAP, WALL_MAX_GAP);
        spawn = cc.MoveBy.create(0.5, cc.p(0, this._screenSize.height - wallTopHeight * SCALE_FACTOR - wallGap));

        thisWalls[1].runAction(flow);
        thisWalls[1].runAction(spawn);
    },

    onTouchesBegan: function(touches, event) {
        if (this._gameover) {
            return;
        }
        audioEngin.playEffect(s_jump_effect);
        this._duckVelocity = JUMP_VELOCITY;
        var swimActionKind = getRandomInt(0, 9);
        var duckRotate;
        if (swimActionKind === 0) {
            duckRotate = cc.RotateBy.create(0.5, -400);
        } else {
            duckRotate = cc.RotateTo.create(0.1, -25);
        }
        this._duck.runAction(duckRotate);
        this._isDuckJumping = true;
    },

    checkGameOver: function() {
        if (this._duck.getPosition().y < -this._duck.getContentSize().width) {
            this.gameOver(false);
        }
        var walls = this._walls;
        for (var i = 0; i < walls.length; i++) {
            if (this.isObjTouched(this._duck, this._walls[i])) {
                this.gameOver(true);
            }
        }
    },

    gameOver: function(hitWall) {
        this.unscheduleUpdate();
        this._fingerActions = new fingerActions.FingerActions();
        if (hitWall) {
            this._gameover = true;
            this.gameOverHitWall();
            this._fingerActions.pushEventName("Action", "Die", "Hit Wall");
        } else {
            this._gameover = true;
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
            audioEngin.playEffect(s_poped_effect);
            return true;
        }
    },
});


PlayLayer.create = function() {

    var sg = new PlayLayer();
    if (sg && sg.init()) {

        return sg;
    }

    return null;
};

PlayLayer.scene = function() {

    var scene = cc.Scene.create();
    var layer = PlayLayer.create();
    scene.addChild(layer, 1);
    return scene;
};


PlayLayer.prototype.addPowerup = function(powerup, z, tag) {

    this._powerupBatch.addChild(powerup, z, tag);

};

var PlayScene = cc.Scene.extend({

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Scene);
    },

    onEnter: function() {
        this._super();
        audioEngin = cc.AudioEngine.getInstance();

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