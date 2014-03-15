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


var PlayLayer = cc.Layer.extend({
    _duckSpriteSheet: null,
    _flyingAction: null,
    _duck: null,
    _background: null,
    _walls: null,
    _screenSize: null,
    _timer: null,
    _duckVelocity: null,
    _score: null,
    _scoreLabel: null,
    _scoreTimer: null,
    _passedFirstWall: null,
    _bubbleTimer: null,
    _bubbles: null,
    _gameover: null,
    _seashells: null,
    _seashellTimer: null,
    _isDuckJumping: null,
    _fingerActions: null,

    //sound
    audioEngin: null,
    POP_EFFECT_FILE: 'res/pop.mp3',
    DROWNED_EFFECT_FILE: 'res/drowned.mp3',
    JUMP_EFFECT_FILE: 'res/jump_sound.mp3',

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function() {
        //super init first
        this._super();

        //update()
        this._timer = 0;
        this.scheduleUpdate();

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

        //add background image (river)
        //added weather
        this.getWeather();

        //duck is not falling
        this._isDuckJumping = false;

        //add duck sprite sheet
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_duckflyplist);
        this._duckSpriteSheet = cc.SpriteBatchNode.create(s_duckfly);
        this.addChild(this._duckSpriteSheet, 1000);
        var animFrames = [];
        for (var i = 1; i < 4; i++) {
            var str = "ducksmall0" + i + ".png";
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = cc.Animation.create(animFrames, 0.3);
        this._flyingAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this._duck = cc.Sprite.createWithSpriteFrameName("ducksmall01.png");
        this._duck.setPosition(cc.p(65, this._screenSize.height / 2));
        this._duck.runAction(this._flyingAction);
        this._duckSpriteSheet.addChild(this._duck);


        this._duckVelocity = 0;

        //walls
        this._walls = [];
        for (var i = 0; i < MAX_NUM_WALLS; i++) {
            var wall = cc.Sprite.create('res/wall.png');
            this.addChild(wall, 500);
            wall.setVisible(false);
            this._walls.push(wall);
        }

        //sea shells
        this._seashells = [];
        for (var i = 1; i < MAX_SEA_SHEELS; i++) {
            var seashell = cc.Sprite.createWithSpriteFrameName(i + ".png");
            this.addChild(seashell);
            seashell.setVisible(false);
            this._seashells.push(seashell);

        }

        //score
        this._score = 0;
        this._scoreLabel = cc.LabelTTF.create(this._score, "Marker Felt", 33);
        this._scoreLabel.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 100));
        this.addChild(this._scoreLabel, 500);

        //effects
        this._bubbleTimer = 0;
        this.spawnMermaid();

        //init bubbles
        this._bubbles = [];
        for (i = 0; i < MAX_NUM_BUBBLES; i++) {
            var bubble = cc.Sprite.create('res/bubble.png');
            this.addChild(bubble);
            bubble.setVisible(false);
            this._bubbles.push(bubble);
        }

        this._passedFirstWall = false;
        this._gameover = false;

        return true;
    },

    spawnBubble: function() {
        var that = this;
        this._bubbles.some(function(bubble) {
            if (!bubble.isVisible()) {
                bubble.setVisible(true);
                bubble.setScale(0.1);
                var bubbleSpawnPositionY = Math.floor(Math.random() * that._screenSize.height);

                bubble.setPosition(cc.p(400, bubbleSpawnPositionY));

                var callfunc = cc.CallFunc.create(function() {
                    bubble.setVisible(false);
                });
                var flow = cc.MoveTo.create(Math.floor(Math.random() * 5) + 5, cc.p(-(bubble.getContentSize().width / 2), (Math.floor(Math.random() * that._screenSize.height))));
                var flowWithCallfunc = cc.Sequence.create(flow, callfunc);

                bubble.runAction(flowWithCallfunc);
                return true;
            }
        })
    },

    spawnMermaid: function() {
        var mermaid = cc.Sprite.create("res/mermaid.png");
        mermaid.setScale(0.5);
        var contentSize = mermaid.getContentSize();
        mermaid.setPosition(cc.p(this._screenSize.width + contentSize.width / 2, this._screenSize.height / 2));
        this.addChild(mermaid, 0);
        var flow = cc.MoveTo.create(20, cc.p(-contentSize.width / 2, this._screenSize.height / 2));
        var callfunc = cc.CallFunc.create(function() {
            bubble.setVisible(false);
        });
        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        mermaid.runAction(flowWithCallfunc);
    },

    onTouchesBegan: function(touches, event) {
        if (this._gameover) {
            return;
        }
        audioEngin.playEffect(this.JUMP_EFFECT_FILE);
        this._duckVelocity = JUMP_VELOCITY;
        var swimActionKind = Math.floor(Math.random() * 5);
        var duckRotate;
        if (swimActionKind == 0) {
            duckRotate = cc.RotateBy.create(0.5, -400);
        } else {
            duckRotate = cc.RotateTo.create(0.1, -25);
        }
        this._duck.runAction(duckRotate);
        this._isDuckJumping = true;
    },

    spawnSeaShells: function() {
        var that = this;
        var shellInvisible = false;
        var seashell;

        while (!shellInvisible) {
            var randomNumber = Math.floor(Math.random() * 6);
            var randomRotation = Math.floor(Math.random() * 180);
            if (!this._seashells[randomNumber].isVisible()) {
                this._seashells[randomNumber].setVisible(true);
                this._seashells[randomNumber].setScale(0.3);
                this._seashells[randomNumber].setRotation(randomRotation);
                this._seashells[randomNumber].setPosition(cc.p(this._screenSize.width, 5 + randomNumber * 2));
                var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-this._screenSize.width, 5 + randomNumber * 2));

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
        this._timer += delta;
        this._scoreTimer += delta;
        this._seashellTimer += delta;

        if (this._timer > WALL_GAP_TIME) {
            this.createWall();
            this._timer = 0;
        }
        if (this._seashellTimer > 1) {
            this.spawnSeaShells();
            this._seashellTimer = 0;
        }

        this._bubbleTimer += delta;
        if (this._bubbleTimer > 1.25) {
            this.spawnBubble();
            this._bubbleTimer = 0;
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
        if (this._passedFirstWall && this._scoreTimer > WALL_GAP_TIME) {
            this._score++;
            this._scoreTimer = 0;
        }
        if (!this._passedFirstWall && this._scoreTimer > WALL_GAP_TIME / 2 + WALL_APPEAR_TIME) {
            this._passedFirstWall = true;
            this._score++;
            this._scoreTimer = 0;
        }
    },
    turnDuckBack: function() {
        var turnbackAction = cc.RotateTo.create(0.1, 0);
        this._duck.runAction(turnbackAction);
        this._isDuckJumping = false;
    },

    createWall: function() {
        //get invisible walls
        var thisWalls = [];
        for (var i = 0; i < this._walls.length; i++) {
            if (!this._walls[i].isVisible()) {
                this._walls[i].setVisible(true);
                thisWalls.push(this._walls[i]);
            }
            if (thisWalls.length == 2) {
                break;
            }
        }
        var wallWidth = thisWalls[0].getContentSize().width;
        var dice = Math.floor(Math.random() * 20);
        thisWalls[1].setRotation(180);
        thisWalls[0].setPosition(cc.p(this._screenSize.width, this._screenSize.height + 130));
        var flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-this._screenSize.width - (wallWidth / 2), 0));
        var spawn = cc.MoveBy.create(0.5, cc.p(0, WALL_HEIGHT[dice]));

        var callfunc = cc.CallFunc.create(function() {
            thisWalls[0].setVisible(false);
            thisWalls[1].setVisible(false);
        });

        var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
        thisWalls[0].runAction(spawn);
        thisWalls[0].runAction(flowWithCallfunc);

        thisWalls[1].setPosition(cc.p(this._screenSize.width, -130));
        flow = cc.MoveBy.create(WALL_APPEAR_TIME, cc.p(-this._screenSize.width - (wallWidth / 2), 0));
        spawn = cc.MoveBy.create(0.5, cc.p(0, WALL_HEIGHT[dice] + WALL_GAP));

        thisWalls[1].runAction(flow);
        thisWalls[1].runAction(spawn);
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
            this._fingerActions.pushEventName("Action", "Die", "Drowned");
            this.gameOverDrowned();
        }
    },

    gameOverHitWall: function() {
        var that = this;
        var shrinkAction = cc.ScaleTo.create(0.4, 0.3);
        var rotateAction = cc.RotateBy.create(1.5, 700);
        var floatAction = cc.BezierBy.create(2, [cc.p(0, 0), cc.p(-120, 100), cc.p(100, 300)]);

        var callfunc = cc.CallFunc.create(function() {
            that.die();
        });

        var floatDie = cc.Sequence.create(floatAction, callfunc);
        this._duck.runAction(floatDie);

        var shrinkRotateDie = cc.Sequence.create(shrinkAction, rotateAction);
        this._duck.runAction(shrinkRotateDie);
    },

    getWeather: function() {
        if (s_weather == 0) {
            //bg
            this._background = cc.Sprite.create("res/background-dark.png");
            this._background.setAnchorPoint(cc.p(0, 0));
            this._background.setPosition(cc.p(0, 0));
            this.addChild(this._background, 0);
            //rain
            var emitter = cc.ParticleRain.create();
            this._background.addChild(emitter, 10);
            emitter.setLife(4);
            emitter.setTexture(cc.TextureCache.getInstance().addImage("res/particle-fire.png"));
            if (emitter.setShapeType)
                emitter.setShapeType(cc.PARTICLE_BALL_SHAPE);
        } else {
            //bg
            this._background = cc.Sprite.create("res/background.png");
            this._background.setAnchorPoint(cc.p(0, 0));
            this._background.setPosition(cc.p(0, 0));
            this.addChild(this._background, 0);

        }
    },

    gameOverDrowned: function() {
        var that = this;
        audioEngin.playEffect(this.DROWNED_EFFECT_FILE);
        var enoughBubble = false;
        this._bubbles.some(function(bubble) {
            if (!bubble.isVisible()) {
                bubble.setVisible(true);
                bubble.setScale(0.05);
                var size = bubble.getContentSize();
                bubble.setPosition(cc.p(65, -size.height));
                var flow = cc.MoveTo.create(Math.floor(Math.random() * 2) + 1, cc.p(Math.floor(Math.random() * 20) + 50, that._screenSize.height));

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

    isObjTouched: function(firstObj, secondObj) {
        var firstObjSize = firstObj.getContentSize();
        var firstObjPos = firstObj.getPosition();
        var firstCollideRect = cc.rect(firstObjPos.x - firstObjSize.width / 2, firstObjPos.y - firstObjSize.height / 2, firstObjSize.width, firstObjSize.height);

        //below normally used as Wall, make object little bit smaller to maker game easier
        var secondObjSize = secondObj.getContentSize();
        var secondObjPos = secondObj.getPosition();
        var secondCollideRect = cc.rect(secondObjPos.x - secondObjSize.width / 2, secondObjPos.y - secondObjSize.height / 2, secondObjSize.width - 5, secondObjSize.height - 5);

        if (cc.rectIntersectsRect(firstCollideRect, secondCollideRect)) {
            audioEngin.playEffect(this.POP_EFFECT_FILE);
            return true;
        }
    },


    die: function() {
        this.updateScore();
        var scene = cc.Scene.create();
        var layer = new ScoreScene();
        scene.addChild(layer);
        director.pushScene(cc.TransitionFade.create(0.1, scene));
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
});

var PlayScene = cc.Scene.extend({
    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Scene);
    },

    onEnter: function() {
        this._super();
        audioEngin = cc.AudioEngine.getInstance();
        var layer = new PlayLayer();
        this.addChild(layer);
        layer.init();
    }
});