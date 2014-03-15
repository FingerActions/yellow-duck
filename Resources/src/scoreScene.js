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


var ScoreLayer = cc.Layer.extend({

    _background: null,
    _timer: null,
    _bestLabel: null,
    _scoreLabel: null,
    _highScoreLabel: null,
    _currentScoreLabel: null,
    _gameover: null,
    _tapToContinueLabel: null,
    _highScore: null,
    _GameBridage: null,

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function() {
        // super init
        this._super();

        //update()
        this._timer = 0;
        this.scheduleUpdate();

        if ('touches' in sys.capabilities) {
            this.setTouchMode(cc.TOUCH_ALL_AT_ONCE);
            this.setTouchEnabled(true);
        }

        //game bridge
        this._GameBridage = new ls.GameCenterBridge();
        this._GameBridage.showAddAtBottom();
        this._GameBridage.pushscenename("score scene");

        //add background image (die)
        this._background = cc.Sprite.create("res/img/background/die_scene.png");
        this._background.setAnchorPoint(cc.p(0, 0));
        this._background.setPosition(cc.p(0, 0));
        this.addChild(this._background, 2);
        this._background.setVisible(true);

        //screen size
        this._screenSize = cc.Director.getInstance().getWinSize();

        // get screen size
        this.size = cc.Director.getInstance().getWinSize();

        this._highScore = sys.localStorage.getItem('highScore');
        //add score on banner
        // create and initialize a label
        this._highScoreLabel = cc.LabelTTF.create(this._highScore, "Marker Felt", 25);
        // position the label on the center of the screen
        this._highScoreLabel.setPosition(cc.p(this.size.width / 2 + 50, this.size.height - 180));
        // add the label as a child to this layer
        this.addChild(this._highScoreLabel, 5);

        // create and initialize a label
        this._currentScoreLabel = cc.LabelTTF.create(s_currentScore, "Marker Felt", 25);
        // position the label on the center of the screen
        this._currentScoreLabel.setPosition(cc.p(this.size.width / 2 + 50, this.size.height - 230));
        // add the label as a child to this layer
        this.addChild(this._currentScoreLabel, 5);

        // create and initialize game over label
        this._gameover = cc.LabelTTF.create("GAME OVER", "Marker Felt", 36);
        this._gameover.setPosition(cc.p(this.size.width / 2, this.size.height - 130));
        this.addChild(this._gameover, 5);

        // best score label
        this._bestLabel = cc.LabelTTF.create("Best", "Marker Felt", 25);
        this._bestLabel.setPosition(cc.p(this.size.width / 2 - 50, this.size.height - 180));
        this.addChild(this._bestLabel, 5);
        this._scoreLabel = cc.LabelTTF.create("Score", "Marker Felt", 25);
        this._scoreLabel.setPosition(cc.p(this.size.width / 2 - 50, this.size.height - 230));
        this.addChild(this._scoreLabel, 5);

        // tap to continue
        this._tapToContinueLabel = cc.LabelTTF.create("TAP TO CONTINUE", "Marker Felt", 24);
        this._tapToContinueLabel.setPosition(cc.p(this.size.width / 2, this.size.height - 300));
        this.addChild(this._tapToContinueLabel, 5);
        var fadein_tap = cc.FadeIn.create(1.0);
        var fadeout_tap = cc.FadeOut.create(1.0);
        var sequence = cc.RepeatForever.create(cc.Sequence.create(fadein_tap, fadeout_tap));

        this._tapToContinueLabel.runAction(sequence);

        // social networks
        // var twitterButton = cc.MenuItemImage.create('res/twitter.png', 'res/twitter.png', this.tweet, this);
        //twitterButton.setPosition(cc.p(-50, 0));
        // twitterButton.setScale(0.08);

        //var facebookButton = cc.MenuItemImage.create('res/facebook.png', 'res/facebook.png', this.share, this);
        // facebookButton.setPosition(cc.p(50, 0));
        // facebookButton.setScale(0.08);

        //leaderboard
        var leaderboardButton = cc.MenuItemImage.create('res/leaderboard.png', 'res/leaderboard.png', this.leaderboard, this);
        leaderboardButton.setPosition(cc.p(0, -50));
        leaderboardButton.setScale(0.5);

        var socialMenu = cc.Menu.create(leaderboardButton);
        socialMenu.setPosition(cc.p(this.size.width / 2, this.size.height - 300));
        this.addChild(socialMenu, 5);

        return true;
    },

    tweet: function() {
        // todo: change to download url
        var urlBase = 'https://twitter.com/intent/tweet?';
        var text = 'I%20got%20' + this._highScore + '%20in%20Bath%20Duck!%20Download%20at?%20to%20challenge%20me!';
        var url = urlBase + 'text=' + text;
        cc.Application.getInstance().openURL(url);
        this._GameBridage = new ls.GameCenterBridge();
        this._GameBridage.pusheventname("Menu", "click", "tweet");
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
        this._GameBridage = new ls.GameCenterBridge();
        this._GameBridage.pusheventname("Menu", "click", "facebook");
    },

    leaderboard: function() {
        //Game Bridge Class
        //push highScore everytime, in case player has a high localscore but didn't connect to internet
        this._GameBridage = new ls.GameCenterBridge();
        this._GameBridage.pushscore(this._highScore, "YellowDuck");
        this._GameBridage.showleaderboard();
        this._GameBridage.pusheventname("Menu", "click", "leaderboard");
    },

    onTouchesBegan: function(touches, event) {
        cc.log('gotoIntroScene');
        this.gotoIntroScene();
    },

    gotoIntroScene: function() {
        var scene = cc.Scene.create();
        var layer = new IntroScene();
        scene.addChild(layer);
        s_gameStarted = false;
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