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
    _menuHolder: null,
    _timer: null,
    _bestLabel: null,
    _scoreLabel: null,
    _highScoreLabel: null,
    _currentScoreLabel: null,
    _gameover: null,
    _tapToContinueLabel: null,
    _highScore: null,
    _fingerActions: null,

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
        this._fingerActions = new fingerActions.FingerActions();
        this._fingerActions.showAdAtBottom();
        this._fingerActions.pushSceneName("score scene");

        //add background image (die)
        this._background = cc.Sprite.create(s_score_background_png);
        this._background.setScale(FULLSCREEN_SCALE_FACTOR);
        this._background.setAnchorPoint(cc.p(0, 0));
        this._background.setPosition(cc.p(0, 0));
        this.addChild(this._background, 2);
        this._background.setVisible(true);

        //screen size
        this._screenSize = cc.Director.getInstance().getWinSize();

        this._highScore = sys.localStorage.getItem('highScore');
        //add score on banner
        this._menuHolder = cc.LayerColor.create(cc.c4b(0, 0, 0, 150), this._screenSize.width - 80 * SCALE_FACTOR, this._screenSize.height - 120 * SCALE_FACTOR);
        this._menuHolder.setPosition(cc.p(40 * SCALE_FACTOR, 70 * SCALE_FACTOR));
        this.addChild(this._menuHolder, 3);
        // create and initialize a label
        this._highScoreLabel = cc.LabelTTF.create(this._highScore, "Marker Felt", 25 * SCALE_FACTOR);
        // position the label on the center of the screen
        this._highScoreLabel.setPosition(cc.p(this._screenSize.width / 2 + 50 * SCALE_FACTOR, this._screenSize.height - 180 * SCALE_FACTOR));
        // add the label as a child to this layer
        this.addChild(this._highScoreLabel, 5);

        // create and initialize a label
        this._currentScoreLabel = cc.LabelTTF.create(s_currentScore, "Marker Felt", 25 * SCALE_FACTOR);
        // position the label on the center of the screen
        this._currentScoreLabel.setPosition(cc.p(this._screenSize.width / 2 + 50 * SCALE_FACTOR, this._screenSize.height - 230 * SCALE_FACTOR));
        // add the label as a child to this layer
        this.addChild(this._currentScoreLabel, 5);

        // create and initialize game over label
        this._gameover = cc.LabelTTF.create("GAME OVER", "Marker Felt", 36 * SCALE_FACTOR);
        this._gameover.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 120 * SCALE_FACTOR));
        this.addChild(this._gameover, 5);

        // best score label
        this._bestLabel = cc.LabelTTF.create("Best", "Marker Felt", 25 * SCALE_FACTOR);
        this._bestLabel.setPosition(cc.p(this._screenSize.width / 2 - 40 * SCALE_FACTOR, this._screenSize.height - 180 * SCALE_FACTOR));
        this.addChild(this._bestLabel, 5);
        this._scoreLabel = cc.LabelTTF.create("Score", "Marker Felt", 25 * SCALE_FACTOR);
        this._scoreLabel.setPosition(cc.p(this._screenSize.width / 2 - 40 * SCALE_FACTOR, this._screenSize.height - 230 * SCALE_FACTOR));
        this.addChild(this._scoreLabel, 5);

        // tap to continue
        this._tapToContinueLabel = cc.LabelTTF.create("TAP TO CONTINUE", "Marker Felt", 24 * SCALE_FACTOR);
        this._tapToContinueLabel.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 380 * SCALE_FACTOR));
        this.addChild(this._tapToContinueLabel, 5);
        var fadein_tap = cc.FadeIn.create(1.0);
        var fadeout_tap = cc.FadeOut.create(1.0);
        var sequence = cc.RepeatForever.create(cc.Sequence.create(fadein_tap, fadeout_tap));

        this._tapToContinueLabel.runAction(sequence);

        //leaderboard
        var leaderboardButton = cc.MenuItemImage.create(s_leaderboard_png, s_leaderboard_png, this.showLeaderboard, this);
        var leaderboardMenu = cc.Menu.create(leaderboardButton);
        leaderboardMenu.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 310 * SCALE_FACTOR));
        this.addChild(leaderboardMenu, 5);

        return true;
    },

    showLeaderboard: function() {
        cc.log('js showLeaderboard');
        //push highScore everytime, in case player has a high localscore but didn't connect to internet
        this._fingerActions = new fingerActions.FingerActions();
        this._fingerActions.pushScore(this._highScore, "YellowDuck");
        this._fingerActions.showLeaderboard();
        this._fingerActions.pushEventName("Menu", "click", "leaderboard");
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