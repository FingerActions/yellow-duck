
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


var ScoreLayer = cc.Layer.extend({
         
        _diebackground:null,
        _timer:null,
        
        ctor: function () {
           this._super();
           cc.associateWithNative(this, cc.Layer);
        },
        
        init: function () {
        
        //////////////////////////////
        // 1. super init first
        this._super();
                              
        //update()
        this._timer = 0;
        this.scheduleUpdate();

        
        if ('touches' in sys.capabilities) {
        
        this.setTouchMode(cc.TOUCH_ALL_AT_ONCE);
        this.setTouchEnabled(true);
        
        }
        
        //add background image (die)
        this._diebackground = cc.Sprite.create("res/img/background/die_scene.png");
        this._diebackground.setAnchorPoint(cc.p(0,0));
        this._diebackground.setPosition(cc.p(0,0));
        this.addChild(this._diebackground,2);
        this._diebackground.setVisible(true);
        
        //screen size
        this._screenSize = cc.Director.getInstance().getWinSize();

        
        
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        this.size = cc.Director.getInstance().getWinSize();

               
        return true;
                              
        },
    
        onTouchesBegan: function (touches, event) {
         
            cc.log("Single touch has occured");
            this.IntroScene();
         
        },
         
        IntroScene: function(){
         
            var scene = cc.Scene.create();
            var layer = new MyScene();
            scene.addChild(layer);
            INITIALIZED_MYAPP = false;
            director.pushScene(cc.TransitionFade.create(0.1, scene));
         
        },
});

var ScoreScene = cc.Scene.extend({
                              
   ctor: function () {
   this._super();
   cc.associateWithNative(this, cc.Scene);
                              
   },
   
   onEnter: function () {
             
      this._super();
                                 cc.log("in scorescene");
      audioEngin = cc.AudioEngine.getInstance();
      var layer = new ScoreLayer();
      this.addChild(layer);
      layer.init();
                              
   }
                              
});