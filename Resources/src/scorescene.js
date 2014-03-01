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

    _diebackground: null,
    _timer: null,
    _scorebanner: null,
    _bestscore_label: null,
    _currentscore_label: null,
    _bestscore: null,
    _currentscore: null,
    _gameover: null,
    _tapcontinue: null,
    _highScore: null,

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function() {

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
        this._diebackground.setAnchorPoint(cc.p(0, 0));
        this._diebackground.setPosition(cc.p(0, 0));
        this.addChild(this._diebackground, 2);
        this._diebackground.setVisible(true);

        //screen size
        this._screenSize = cc.Director.getInstance().getWinSize();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        this.size = cc.Director.getInstance().getWinSize();

        //create score banner
        this._scorebanner = cc.LayerColor.create(cc.c4b(0, 0, 0, 0), this.size.width - 60, this.size.height - 150);
        this._scorebanner.setPosition(cc.p(30, this.size.height / 10));
        this.addChild(this._scorebanner, 3);
        var fadein = cc.FadeTo.create(1.0, 150);
        this._scorebanner.runAction(fadein);

        this._highScore = sys.localStorage.getItem('highScore');
        //add score on banner
        // create and initialize a label
        this._bestscore = cc.LabelTTF.create(this._highScore, "Marker Felt", 25);
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
        this._gameover.setPosition(cc.p(this.size.width / 2, this.size.height - 130));
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

        this._tapcontinue = cc.LabelTTF.create("TAP TO CONTINUE", "Marker Felt", 24);
        // position the label on the center of the screen
        this._tapcontinue.setPosition(cc.p(this.size.width / 2, this.size.height - 300));
        // add the label as a child to this layer
        this.addChild(this._tapcontinue, 5);

        var fadein_tap = cc.FadeIn.create(1.0);
        var fadeout_tap = cc.FadeOut.create(1.0);
        var sequence = cc.RepeatForever.create(cc.Sequence.create(fadein_tap, fadeout_tap));

        this._tapcontinue.runAction(sequence);

        // social networks
        var twitterButton = cc.MenuItemImage.create('res/twitter.png', 'res/twitter.png', this.tweet, this);
        twitterButton.setPosition(cc.p(-50, 0));
        twitterButton.setScale(0.08);

        var facebookButton = cc.MenuItemImage.create('res/facebook.png', 'res/facebook.png', this.share, this);
        facebookButton.setPosition(cc.p(50, 0));
        facebookButton.setScale(0.08);

        var socialMenu = cc.Menu.create(twitterButton, facebookButton);
        socialMenu.setPosition(cc.p(this.size.width / 2, this.size.height - 360));
        this.addChild(socialMenu, 5);

        return true;
    },

    tweet: function() {
        // todo: change to download url
        var urlBase = 'https://twitter.com/intent/tweet?';
        var text = 'I%20got%20' + this._highScore + '%20in%20Bath%20Duck!%20Download%20at?%20to%20challenge%20me!';
        var url = urlBase + 'text=' + text;
        cc.Application.getInstance().openURL(url);
    },

    share: function() {
        // todo: change to download url
        var baseUrl = 'https://www.facebook.com/dialog/feed?';
        var app_id = '145634995501895';
        var display = 'popup';
        var name = 'Bath%20Duck';
        var caption = 'I%20got%20' + this._highScore + '%20in%20Bath%20Duck!';
        var description = 'Download%20at?%20to%20challenge%20me!';
        var link = 'https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdialogs%2F%20';
        var redirect_uri = 'https://developers.facebook.com/tools/explorer';
        var url = baseUrl + 'app_id=' + app_id + '&display=' + display + '&name=' + name + '&caption=' + caption + '&description=' + description + '&link=' + link + '&redirect_uri=' + redirect_uri;
        cc.Application.getInstance().openURL(url);
    },

    onTouchesBegan: function(touches, event) {

        cc.log("Single touch has occured");
        this.IntroScene();

    },

    IntroScene: function() {

        var scene = cc.Scene.create();
        var layer = new MyScene();
        scene.addChild(layer);
        INITIALIZED_MYAPP = false;
        director.pushScene(cc.TransitionFade.create(0.1, scene));

    },
});

var ScoreScene = cc.Scene.extend({

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Scene);
    },

    onEnter: function() {
        this._super();
        audioEngin = cc.AudioEngine.getInstance();
        var layer = new ScoreLayer();
        this.addChild(layer);
        layer.init();
    }
});