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



var INITIALIZED_PLAYSCENE=false;

var SCREENSIZE = null;

var PlayLayer = cc.Layer.extend({
                              
        isMouseDown: false,
        helloImg: null,
        helloLabel: null,
        circle: null,
        sprite: null,
        river_Background: null,
        tap_sprite: null,
		riverSprite: null,
        game_status:null,
        wall_up:null,
        wall_down:null,
        
        ctor: function () {
        this._super();
        cc.associateWithNative(this, cc.Layer);
        },
        
        init: function () {
        
        //////////////////////////////
        // 1. super init first
        this._super();
        
        if ('touches' in sys.capabilities) {
        
        this.setTouchMode(cc.TOUCH_ALL_AT_ONCE);
        this.setTouchEnabled(true);
        
        }
        
        //add background image (river)
        this.sprite = cc.Sprite.create("res/RiverBackground-static.png");
        this.sprite.setAnchorPoint(cc.p(0, 0));
        this.sprite.setPosition(cc.p(0, 0));
        this.addChild(this.sprite, 0);
    
        
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();
        SCREENSIZE = size;
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
                 
		this.riverSprite = cc.Sprite.create("res/river.png");
        this.riverSprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.riverSprite.setPosition(cc.p(350,size.height/2));
        this.addChild(this.riverSprite, 0);
		
		var sprite_action = cc.MoveTo.create(10, cc.p(-100, size.height/2));
		this.riverSprite.runAction(sprite_action);
		
        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create("res/ducksmall.png");
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setPosition(cc.p(65,size.height/2));
        this.addChild(this.sprite, 0);
                           
        
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
        
        
        onTouchesBegan: function (touches, event) {
            
            this.createWall();
                                
            this.sprite.stopAllActions();
                              
            cc.log("Jump");
            var jump = cc.JumpBy.create(1, cc.p(0, 0), 100, 1);
			this.sprite.runAction(jump);
        
        },
        
         onTouchesEnded:function(touches,event){
        
         //this.sprite.stopAllActions();
         
         this.Duck_fall();
         
         
         },
         
         Duck_fall:function(){
        
         
         var action_fall = cc.MoveBy.create(1,cc.p(0,-200));
         
         var sprite_action_2 = cc.RepeatForever.create(action_fall);
         
         this.sprite.runAction(sprite_action_2);
        
         },
                                
         createWall: function(){
            
             this.wall_up = cc.Sprite.create("res/wall-up.png");
             this.wall_up.setAnchorPoint(cc.p(0.5, 0.5));
             this.wall_up.setPosition(cc.p(350,SCREENSIZE.height-50));
             this.addChild(this.wall_up, 0);
         
             this.wall_down = cc.Sprite.create("res/wall-down.png");
             this.wall_down.setAnchorPoint(cc.p(0.5, 0.5));
             this.wall_down.setPosition(cc.p(350,50));
             this.addChild(this.wall_down, 0);
              
             var scroll_up = cc.MoveBy.create(2,cc.p(-200,0));
             var scroll_down = cc.MoveBy.create(2,cc.p(-200,0));
            
                                
             var sprite_action = cc.RepeatForever.create(scroll_up);
             var sprite_action2 = cc.RepeatForever.create(scroll_down);
             //var sprite_action2 = cc.MoveBy.create(-10, 0);
             this.wall_up.runAction(sprite_action);
             this.wall_down.runAction(sprite_action2);
             //this.wall_down.runAction(sprite_action2);
         },
        
});

var PlayScene = cc.Scene.extend({
                              
   ctor: function () {
   this._super();
   cc.associateWithNative(this, cc.Scene);
                              
   },
   
   onEnter: function () {
    
    if(INITIALIZED_PLAYSCENE==false)
    {
       INITIALIZED_PLAYSCENE = true;
       this._super();
       var layer = new PlayLayer();
       this.addChild(layer);
       layer.init();
    }
                                
   }
                              
});