
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
        _scorebanner:null,
        _bestscore_label:null,
        _currentscore_label:null,
        _bestscore:null,
        _currentscore:null,
        _gameover:null,
        _tapcontinue:null,
                                
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

        //create score banner
        this._scorebanner = cc.LayerColor.create(cc.c4b(0,0,0,0),250,300);
        this._scorebanner.setPosition(cc.p(30,80));
        this.addChild(this._scorebanner,3);
        var fadein = cc.FadeTo.create(1.0,150);
        this._scorebanner.runAction(fadein);
                                 
        //add score on banner
        // create and initialize a label
        this._bestscore = cc.LabelTTF.create(BEST_SCORE, "Marker Felt", 25);
        // position the label on the center of the screen
        this._bestscore.setPosition(cc.p(this.size.width / 2 + 50, this.size.height - 200));
        // add the label as a child to this layer
        this.addChild(this._bestscore, 5);
        
        // create and initialize a label
        this._currentscore = cc.LabelTTF.create(CURRENT_SCORE, "Marker Felt", 25);
        // position the label on the center of the screen
        this._currentscore.setPosition(cc.p(this.size.width / 2 + 50, this.size.height - 250));
        // add the label as a child to this layer
        this.addChild(this._currentscore, 5);
                                 
                                 
        //add score on banner
        // create and initialize a label
        this._gameover = cc.LabelTTF.create("GAME OVER", "Marker Felt", 36);
        // position the label on the center of the screen
        this._gameover.setPosition(cc.p(this.size.width / 2 , this.size.height - 130));
        // add the label as a child to this layer
        this.addChild(this._gameover, 5);
        this._bestscore_label = cc.LabelTTF.create("Best", "Marker Felt", 25);
        // position the label on the center of the screen
        this._bestscore_label.setPosition(cc.p(this.size.width / 2 - 50, this.size.height - 200));
        // add the label as a child to this layer
        this.addChild(this._bestscore_label, 5);
        
        // create and initialize a label
        this._currentscore_label = cc.LabelTTF.create("Score", "Marker Felt", 25);
        // position the label on the center of the screen
        this._currentscore_label.setPosition(cc.p(this.size.width / 2 - 50, this.size.height - 250));
        // add the label as a child to this layer
        this.addChild(this._currentscore_label, 5);
                                 
        this._tapcontinue = cc.LabelTTF.create("TAP TO CONTINUE", "Marker Felt", 28);
        // position the label on the center of the screen
        this._tapcontinue.setPosition(cc.p(this.size.width / 2, this.size.height - 350));
        // add the label as a child to this layer
        this.addChild(this._tapcontinue, 5);

        var fadein_tap = cc.FadeIn.create(1.0);
        var fadeout_tap = cc.FadeOut.create(1.0);
        var sequence = cc.RepeatForever.create(cc.Sequence.create(fadein_tap,fadeout_tap));
                                 
        this._tapcontinue.runAction(sequence);
                                 
                                 
                         
        cc.log("BEST"+BEST_SCORE);
        cc.log("SCORE"+CURRENT_SCORE);
            
               
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