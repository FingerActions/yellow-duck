/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var MyLayer = cc.Layer.extend({
         
        _spriteSheet:null,
        _flyingAction:null,
        _duck: null,
        _timer: null,
        isMouseDown: false,
        helloImg: null,
        size:null,
        helloLabel: null,
        circle: null,
        sprite: null,
        river_Background: null,
        tap_sprite: null,
        _seashells:null,
        
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
        
        //add background image (river)
        this.sprite = cc.Sprite.create("res/background.png");
        this.sprite.setAnchorPoint(cc.p(0, 0));
        this.sprite.setPosition(cc.p(0, 0));
        this.addChild(this.sprite, 0);
        
        
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        this.size = cc.Director.getInstance().getWinSize();
        
        // add a "close" icon to exit the progress. it's an autorelease object
        
        /*
        var closeItem = cc.MenuItemImage.create(
                                                "res/CloseNormal.png",
                                                "res/CloseSelected.png",
                                                function () {
                                                cc.log("close button was clicked.");
                                                }, this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));
        
        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));
        */
        
        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Bath Duck", "Marker Felt", 33);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(this.size.width / 2, this.size.height - 100));
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);
        
        // add "Helloworld" splash screen"
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_duckflyplist);
        this.spritesheet = cc.SpriteBatchNode.create(s_duckfly);
        this.addChild(this.spritesheet);
        var animFrames = [];
        for(var i=1;i<4;i++)
        {
            var str = "ducksmall0" + i + ".png";
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }
                              
        var animation = cc.Animation.create(animFrames,0.3);
        this._flyingAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this._duck = cc.Sprite.createWithSpriteFrameName("ducksmall01.png");
        this._duck.setPosition(cc.p(65, this.size.height / 2));
        this._duck.runAction(this._flyingAction);
        this.spritesheet.addChild(this._duck);
                              
        this.tap_sprite = cc.Sprite.create("res/tap.png");
        this.tap_sprite.setScale(0.7);
        this.tap_sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.tap_sprite.setPosition(cc.p(195, (this.size.height/2)-40));
        this.addChild(this.tap_sprite, 0);
        
        //sea shells
        this._seashells = [];
        for(var i = 1;i<MAX_SEA_SHEELS;i++)
        {
           var seashell = cc.Sprite.createWithSpriteFrameName(i+".png");
           this.addChild(seashell);
           seashell.setVisible(false);
           this._seashells.push(seashell);
                              
        }

        //this._seashells = cc.Sprite.createWithSpriteFrameName("1.png");
      
        
        //var sprite_action = cc.Place.create(cc.p(0,300));
        //this.sprite.runAction(sprite_action);
        var bezier = [cc.p(0,100),cc.p(0,-100),cc.p(0,0)];
        var sprite_action = cc.BezierBy.create(5,bezier);
        //var sprite_fly_up = cc.MoveBy.create(2,cc.p(0,50));
        //var sprite_fly_down = cc.MoveBy.create(2,cc.p(0,-50));
        //var sequence_action = cc.Sequence.create(sprite_fly_up,sprite_fly_down);
        var sprite_action_2 = cc.RepeatForever.create(sprite_action);
        this._duck.runAction(sprite_action_2);
        
        
        /*
         var sprite_action3 = cc.RotateTo.create(2,180);
         var repeate_action = cc.Repeat.create(sprite_action3,10);
         this.sprite.runAction(repeate_action);
         */
        
        /* var sprite_action3 = cc.SkewTo.create(2,2,2);
         this.sprite.runAction(sprite_action3);
         */
        
        return true;
                              
        },
        
                              
        spawnSeaShells:function(){
        
              var that = this;
              var found_invisible = false;
              var seashell;

              while(!found_invisible)
              {
                   var rd_number = Math.floor(Math.random()*6);
                   var rd_rotation = Math.floor(Math.random()*180);
                   if(!this._seashells[rd_number].isVisible())
                   {
                       this._seashells[rd_number].setVisible(true);
                       this._seashells[rd_number].setScale(0.3);
                       this._seashells[rd_number].setRotation(rd_rotation);
                       this._seashells[rd_number].setPosition(cc.p(this.size.width,5+rd_number*2));
                       var flow = cc.MoveBy.create(WALL_APPEAR_TIME,cc.p(-that.size.width,5+rd_number*2));
                              
                       var callfunc = cc.CallFunc.create(function(){
                          that._seashells[rd_number].setVisible(false);
                          that._seashells[rd_number].setVisible(false);
                       });
                              
                       var flowWithCallfunc = cc.Sequence.create(flow, callfunc);
                       this._seashells[rd_number].runAction(flowWithCallfunc);
                       return true;
                    }

                   found_invisible = true;
              }

        },
                              
        update:function(delta){
                              
            this._timer += delta;
            if(this._timer>1)
            {
               this.spawnSeaShells();
               this._timer=0;
            }

        },
        
        onTouchesBegan: function (touches, event) {
                              
                cc.log("Single touch has occured");
                this.PlayScene();
        
        },
         
        PlayScene: function(){
         
         var scene = cc.Scene.create();
         var layer = new PlayScene();
         scene.addChild(layer);
         director.pushScene(cc.TransitionFade.create(0.1, scene));
                         
        }
    
        
});

var MyScene = cc.Scene.extend({
                              
   ctor: function () {
   this._super();
   cc.associateWithNative(this, cc.Scene);
                              
   },
   
   onEnter: function () {
             
    if(INITIALIZED_MYAPP==false)
    {
        INITIALIZED_MYAPP=true;
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
         layer.init();
    }
   }
                              
});