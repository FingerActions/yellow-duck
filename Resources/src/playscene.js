
//////////////////////////////////////////////////////////////////////
//TIANMAO GAMES PROPRIETARY INFORMATION
//
// This software is supplied under the terms of a license agreement or
// nondisclosure agreement with TIANMAO Games and may not
// be copied or disclosed except in accordance with the terms of that
// agreement.
//
//      Copyright (c) 2014 TIANMAO GAMES
//      All Rights Reserved.
//
//
/////////////////////////////////////////////////////////////////////


var PlayLayer = cc.Layer.extend({
    _duck: null,
    _background: null,
    _river: null,
    _walls: null,
    _screenSize: null,
    _timer: null,
    _duckVelocity: null,
    _score: null,
    _scoreLabel:null,
    _waves: null,
    _scoreTimer:null,
    _passFirstWall:false,
    _waveTimer: null,

    //sound
    audioEngin: null,
    //SPLASH_EFFECT_FILE: 'res/water_splash.mp3',
    POP_EFFECT_FILE: 'res/pop.wav',

    ctor: function () {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function () {
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

        //add background image (river)
        this._river = cc.Sprite.create("res/RiverBackground-static.png");
        this._river.setAnchorPoint(cc.p(0, 0));
        this._river.setPosition(cc.p(0, 0));
        this.addChild(this._river);

        //screen size
        this._screenSize = cc.Director.getInstance().getWinSize();

        //duck
        this._duck = cc.Sprite.create("res/ducksmall.png");
        this._duck.setAnchorPoint(cc.p(0.5, 0.5));
        this._duck.setPosition(cc.p(65, this._screenSize.height / 2));
        this.addChild(this._duck, 1000);
        this._duckVelocity = 0;

        //walls
        this._walls = [];

        //score
        this._score = 0;
        this._scoreLabel = cc.LabelTTF.create(this._score, "Marker Felt", 33);
        this._scoreLabel.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 100));
        this.addChild(this._scoreLabel, 500);

        //effects
        this._waves = [];
        this._waveTimer = 0;
        //this.spawnMermaid();

        return true;
    },

    spawnWave: function(){
        var wave = cc.Sprite.create("res/wave.png");
        var waveRect = wave.getContentSize();
        wave.setScale(1);
        wave.setAnchorPoint(0, 0);
        
        wave.setPosition(cc.p(-this._screenSize.width, this._screenSize.height));
        this.addChild(wave, 0);

        var flow = cc.MoveTo.create(2.5, cc.p(0, -waveRect.height));
        wave.runAction(flow);

        this._waves.push(wave);
    },

    spawnBubble: function(){
        /*var wave = cc.Sprite.create("res/wave.png");
        wave.setScale(1);
        var waveSpawnPositionY = Math.floor(Math.random() * this._screenSize.height);
        //var waveSpawnPositionX = Math.floor(Math.random() * this._screenSize.width);

        wave.setPosition(cc.p(400, waveSpawnPositionY));
        this.addChild(wave);

        var flow = cc.MoveTo.create(Math.floor(Math.random() * 5) + 5, cc.p(0, (Math.floor(Math.random() * this._screenSize.height))));
        wave.runAction(flow);*/
    },

    spawnMermaid: function(){
        var mermaid = cc.Sprite.create("res/mermaid.png");
        mermaid.setScale(0.7);
        mermaid.setPosition(cc.p(500, 200));
        this.addChild(mermaid, 0);
        var flow = cc.MoveTo.create(20, cc.p(0, 200));
        mermaid.runAction(flow);
    },

    onTouchesBegan: function (touches, event){
        this._duckVelocity = JUMP_VELOCITY;
    },

    update: function(delta){
        this._timer += delta;
        this._scoreTimer += delta;
        if(this._timer > 2){
            this.createWall();
            this._timer = 0;
        }

        this._waveTimer += delta;
        if(this._waveTimer > 1.25){
            this.spawnWave();
            this._waveTimer = 0;
        }
      
        var duckPrePosition = this._duck.getPosition();
        if(duckPrePosition.y > this._screenSize.height){
            this._duckVelocity = 0;
        }
        if(this._duckVelocity > 0){
            this._duckVelocity -= GRAVITY;
        }
        else{
            this._duckVelocity = -5;
        }

        //this._waves.forEach(function(wave){
        //    wave.setPosition(cc.p(wave.getPosition().x, wave.getPosition().y + this._duckVelocity));
        //});

        this._duck.setPosition(cc.p(duckPrePosition.x, duckPrePosition.y + this._duckVelocity));
        this.checkGameOver();
        this._scoreLabel.setString(this._score);
        
        //update score based on time gap
        if(!this._passFirstWall && this._scoreTimer > 6)
        {
           this._score++;
           this._passFirstWall = true;
           this._scoreTimer-=6;
        }
        if(this._passFirstWall && this._scoreTimer > 2)
        {
             this._score++;
             this._scoreTimer -=2;
        }
    },

    createWall: function(){
        var wallTop = cc.Sprite.create("res/n-wall-up.png");
        wallTop.setAnchorPoint(cc.p(0.5, 0.5));
        wallTop.setPosition(cc.p(this._screenSize.width, this._screenSize.height+130));

        this.addChild(wallTop, 2);

        var top_wall_Width = wallTop.getContentSize().width;

        var wallBottom = cc.Sprite.create("res/n-wall-down.png");
        wallBottom.setAnchorPoint(cc.p(0.5, 0.5));
        wallBottom.setPosition(cc.p(this._screenSize.width, -130));

        this.addChild(wallBottom, 2);

        var bottom_wall_Width = wallBottom.getContentSize().width

        var topFlow = cc.MoveBy.create(5, cc.p(-this._screenSize.width - (top_wall_Width/2), 0));
        wallTop.runAction(topFlow);

        var bottomFlow = cc.MoveBy.create(5, cc.p(-this._screenSize.width - (bottom_wall_Width/2), 0));
        wallBottom.runAction(bottomFlow);

        //random spawning position
        var topSpawn, bottomSpawn;
        var dice = Math.floor(Math.random() * 20);
                                
        topSpawn = cc.MoveBy.create(0.5, cc.p(0, WALL_HEIGHT[dice]));
        bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, WALL_HEIGHT[dice]+WALL_GAP));
        
        wallTop.runAction(topSpawn);
        wallBottom.runAction(bottomSpawn);

        this._walls.push(wallTop);
        this._walls.push(wallBottom);
    },

    checkGameOver: function(){
        if(this._duck.getPosition().y < 0){
            this.gameOver();
        }
        var walls = this._walls;
        for(var i = 0; i < walls.length; i++){
            if(this.isObjTouched(this._duck, this._walls[i])){
                this.gameOver();
            }
        }
    },

    gameOver: function(){
        this.unscheduleUpdate();
        var shrinkAction = cc.ScaleTo.create(0.4, 0.3);
        var rotateAction = cc.RotateBy.create(1.5, 700);
        var floatAction = cc.BezierBy.create(2, [cc.p(0,0), cc.p(-120,100), cc.p(100,300)]);

        var callfunc = cc.CallFunc.create(function(){
            var scene = cc.Scene.create();
            var layer = new MyScene();
            scene.addChild(layer);
            director.popScene();
        });


        var floatDie = cc.Sequence.create(floatAction, callfunc);
        this._duck.runAction(floatDie);

        var shrinkRotateDie = cc.Sequence.create(shrinkAction, rotateAction);
        this._duck.runAction(shrinkRotateDie);

    },

    isObjTouched :function(firstObj, secondObj){
        var firstObjSize = firstObj.getContentSize();
        var firstObjPos = firstObj.getPosition();
        var firstCollideRect = cc.rect(firstObjPos.x - firstObjSize.width / 2, firstObjPos.y - firstObjSize.height / 2, firstObjSize.width, firstObjSize.height);

        var secondObjSize = secondObj.getContentSize();
        var secondObjPos = secondObj.getPosition();
        var secondCollideRect = cc.rect(secondObjPos.x - secondObjSize.width / 2, secondObjPos.y - secondObjSize.height / 2, secondObjSize.width, secondObjSize.height);

        if(cc.rectIntersectsRect(firstCollideRect, secondCollideRect)){
            audioEngin.playEffect(this.POP_EFFECT_FILE);
            return true;
        }
    }
});

var PlayScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.associateWithNative(this, cc.Scene);                       
    },

    onEnter: function () {
        this._super();
        audioEngin = cc.AudioEngine.getInstance();
        var layer = new PlayLayer();
        this.addChild(layer);
        layer.init();
    }
});