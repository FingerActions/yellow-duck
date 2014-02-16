var PlayLayer = cc.Layer.extend({
    _duck: null,
    _background: null,
    _river: null,
    _waves: null,
    _walls: null,
    _screenSize: null,
    _timer: null,
    _duckVelocity: null,
    _score: null,
    _scoreLabel:null,

    //sound
    audioEngin: null,
    //SPLASH_EFFECT_FILE: 'res/water_splash.mp3',
    POP_EFFECT_FILE: 'res/pop.wav',

    //const
    GRAVITY: 0.3,
    JUMP_VELOCITY: 7,

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
        this.spawnMermaid();

        return true;
    },

    spawnWave: function(){
        var wave = cc.Sprite.create("res/bubble.png");
        wave.setScale(0.1);
        var waveSpawnPositionY = Math.floor(Math.random() * this._screenSize.height);
        //var waveSpawnPositionX = Math.floor(Math.random() * this._screenSize.width);

        wave.setPosition(cc.p(400, waveSpawnPositionY));
        this.addChild(wave);

        var flow = cc.MoveTo.create(Math.floor(Math.random() * 5) + 5, cc.p(0, (Math.floor(Math.random() * this._screenSize.height))));
        wave.runAction(flow);
        this._waves.push(wave);
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
        this._duckVelocity = this.JUMP_VELOCITY;
    },

    update: function(delta){
        this._timer += delta;
        if(this._timer > 2){
            this.createWall();
            this.spawnWave();
            this._timer = 0;
        }
        
        var duckPrePosition = this._duck.getPosition();
        if(duckPrePosition.y > this._screenSize.height){
            this._duckVelocity = 0;
        }
        this._duckVelocity -= this.GRAVITY;
        this._duck.setPosition(cc.p(duckPrePosition.x, duckPrePosition.y + this._duckVelocity));
        this.checkGameOver();

        this._scoreLabel.setString(this._score);
        this._score++;
    },

    createWall: function(){
        
        var wallTop = cc.Sprite.create("res/n-wall-up.png");
        wallTop.setAnchorPoint(cc.p(0.5, 0.5));
        wallTop.setPosition(cc.p(this._screenSize.width, this._screenSize.height+130));
        this.addChild(wallTop, 0);
        
        var top_wall_Width = wallTop.getContentSize().width;

        var wallBottom = cc.Sprite.create("res/n-wall-down.png");
        wallBottom.setAnchorPoint(cc.p(0.5, 0.5));
        wallBottom.setPosition(cc.p(this._screenSize.width, -130));
        this.addChild(wallBottom, 0);
    
         var bottom_wall_Width = wallBottom.getContentSize().width

        var topFlow = cc.MoveBy.create(5, cc.p(-this._screenSize.width - (top_wall_Width/2), 0));
        wallTop.runAction(topFlow);

        var bottomFlow = cc.MoveBy.create(5, cc.p(-this._screenSize.width - (bottom_wall_Width/2), 0));
        wallBottom.runAction(bottomFlow);

        //random spawning position
        var topSpawn, bottomSpawn;
        var dice = Math.floor(Math.random() * 7);

        if(dice === 0){
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, -100));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, 50));
        }

        else if(dice === 1){
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, - 160));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, -10));
        }

        else if(dice === 2){
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, -40));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, 110));
        }
                                
       else if(dice === 3){
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, -20));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, 130));
       }
       
       else if(dice === 4){
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, -60));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, 90));
       }
       
       else if(dice === 5){
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, -200));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, -50));
       }
       
       else {
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, -180));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, -30));
       }
        
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
        var scene = cc.Scene.create();
        var layer = new MyScene();
        scene.addChild(layer);
        director.popScene();
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