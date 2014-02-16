var INITIALIZED_PLAYSCENE = false;

var PlayLayer = cc.Layer.extend({
    _duck: null,
    _background: null,
    _river: null,
    _waves: null,
    _walls: null,
    _screenSize: null,
    _timer: null,
    _duckVelocity: null,

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
        this.addChild(this._duck);
        this._duckVelocity = 0;

        //waves
        this._waves = [];

        //walls
        this._walls = [];
        return true;
    },

    spawnWave: function(){
        var wave = cc.Sprite.create("res/wave.png");

        var waveSpawnPositionY = Math.floor(Math.random() * this._screenSize.height);
        wave.setPosition(cc.p(400, waveSpawnPositionY));
        this.addChild(wave);

        var flow = cc.MoveBy.create(10, cc.p(-500, -600));
        wave.runAction(flow);
        this._waves.push(wave);
    },

    onTouchesBegan: function (touches, event){
        this._duckVelocity = 10;
    },

    update: function(delta){
        this._timer += delta;
        if(this._timer > 1){
            this.createWall();
            this.spawnWave();
            this._timer = 0;
        }
        
        var duckPrePosition = this._duck.getPosition();
        this._duck.setPosition(cc.p(duckPrePosition.x, duckPrePosition.y + this._duckVelocity));
        this._duckVelocity -= 0.5;
    },

    createWall: function(){
        var wallTop = cc.Sprite.create("res/wall-up.png");
        wallTop.setAnchorPoint(cc.p(0.5, 0.5));
        wallTop.setPosition(cc.p(this._screenSize.width, this._screenSize.height));
        this.addChild(wallTop, 0);

        var wallBottom = cc.Sprite.create("res/wall-down.png");
        wallBottom.setAnchorPoint(cc.p(0.5, 0.5));
        wallBottom.setPosition(cc.p(this._screenSize.width, 0));
        this.addChild(wallBottom, 0);

        var topFlow = cc.MoveBy.create(5, cc.p(-this._screenSize.width, 0));
        wallTop.runAction(topFlow);

        var bottomFlow = cc.MoveBy.create(5, cc.p(-this._screenSize.width, 0));
        wallBottom.runAction(bottomFlow);

        //random spawning position
        var topSpawn, bottomSpawn;
        var dice = Math.floor(Math.random() * 3);

        if(dice === 0){
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, -100));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, 50));
        }

        else if(dice === 1){
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, - 160));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, -10));
        }

        else{
            topSpawn = cc.MoveBy.create(0.5, cc.p(0, -40));
            bottomSpawn = cc.MoveBy.create(0.5, cc.p(0, 110));
        }
        
        wallTop.runAction(topSpawn);
        wallBottom.runAction(bottomSpawn);

        this._walls.push(wallTop);
        this._walls.push(wallBottom);
    },

    gameOver: function(){

    }
});

var PlayScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.associateWithNative(this, cc.Scene);                       
    },

    onEnter: function () {
        if(INITIALIZED_PLAYSCENE==false){
            INITIALIZED_PLAYSCENE = true;
            this._super();
            var layer = new PlayLayer();
            this.addChild(layer);
            layer.init();
        }
    }
});