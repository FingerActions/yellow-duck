var INITIALIZED_PLAYSCENE = false;

var PlayLayer = cc.Layer.extend({
    _duck: null,
    _background: null,
    _river: null,
    _wave: null,
    _wallTop: null,
    _wallBottom: null,
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

        this._duck = cc.Sprite.create("res/ducksmall.png");
        this._duck.setAnchorPoint(cc.p(0.5, 0.5));
        this._duck.setPosition(cc.p(65, this._screenSize.height / 2));
        this.addChild(this._duck);
        this._duckVelocity = 0;

        //wave
        this._wave = [];
        return true;
    },

    spawnWave: function(){
        this._wave[this._wave.length] = cc.Sprite.create("res/wave.png");

        var waveSpawnPositionY = Math.floor(Math.random() * this._screenSize.height);
        this._wave[this._wave.length - 1].setPosition(cc.p(400, waveSpawnPositionY));
        this.addChild(this._wave[this._wave.length - 1]);

        var flow = cc.MoveBy.create(10, cc.p(-500, -600));
        this._wave[this._wave.length - 1].runAction(flow);
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
        this._wallTop = cc.Sprite.create("res/wall-up.png");
        this._wallTop.setAnchorPoint(cc.p(0.5, 0.5));
        this._wallTop.setPosition(cc.p(350, this._screenSize.height - 50));
        this.addChild(this._wallTop, 0);

        this._wallBottom = cc.Sprite.create("res/wall-down.png");
        this._wallBottom.setAnchorPoint(cc.p(0.5, 0.5));
        this._wallBottom.setPosition(cc.p(350,50));
        this.addChild(this._wallBottom, 0);

        var scroll_up = cc.MoveBy.create(2,cc.p(-200,0));
        var scroll_down = cc.MoveBy.create(2,cc.p(-200,0));

        var sprite_action = cc.RepeatForever.create(scroll_up);
        var sprite_action2 = cc.RepeatForever.create(scroll_down);
        
        this._wallTop.runAction(sprite_action);
        this._wallBottom.runAction(sprite_action2);
                     
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