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
    _bestLabel: null,
    _scoreLabel: null,
    _highScoreLabel: null,
    _currentScoreLabel: null,
    _gameover: null,
    _tapToContinueLabel: null,
    _highScore: null,
    _fingerActions: null,

    //timers
    _timer: null,
    _timerEasterEggs: null,

    _isThrowingEasterEggs: null,
    _isPouringEasterEggs: null,

    _easterEggs: null,

    ctor: function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init: function() {
        // super init
        this._super();

        //update()
        this._timer = 0;
        this._timerEasterEggs = 0;
        this._isPouringEasterEggs = true;
        this.scheduleUpdate();

        if ('touches' in sys.capabilities) {
            this.setTouchMode(cc.TOUCH_ALL_AT_ONCE);
            this.setTouchEnabled(true);
        }

        //game bridge
        this._fingerActions = new fingerActions.FingerActions();
        this._fingerActions.showAds("bottom");
        this._fingerActions.pushSceneName("score scene");

        //add background image
        var background = '';
        if (s_isHighScore) {
            background = s_high_score_background_png;
        } else {
            var dice = getRandomInt(0, 3);
            switch (dice) {
                case 0:
                    background = s_score_easter_1_png;
                    break;
                case 1:
                    background = s_score_background_2_png;
                    break;
                case 2:
                    background = s_score_background_3_png;
                    break;
                default:
                    background = s_score_easter_2_png;
            }
        }

        this._background = cc.Sprite.create(background);
        this._background.setScale(FULLSCREEN_SCALE_FACTOR);
        this._background.setAnchorPoint(cc.p(0, 0));
        this._background.setPosition(cc.p(0, 0));
        this.addChild(this._background, 2);
        this._background.setVisible(true);

        //screen size
        this._screenSize = cc.Director.getInstance().getWinSize();

        this._highScore = sys.localStorage.getItem('highScore');
        //add score on banner
        this._menuHolder = cc.LayerColor.create(cc.c4b(0, 0, 0, 150), this._screenSize.width - 85 * SCALE_FACTOR, this._screenSize.height - 120 * SCALE_FACTOR);
        this._menuHolder.setPosition(cc.p(40 * SCALE_FACTOR, 70 * SCALE_FACTOR));
        this.addChild(this._menuHolder, 3);
        // create and initialize a label
        this._highScoreLabel = cc.LabelTTF.create(this._highScore, s_marker_felt_ttf, 20 * SCALE_FACTOR);
        // position the label on the center of the screen
        this._highScoreLabel.setPosition(cc.p(this._screenSize.width / 2 + 50 * SCALE_FACTOR, this._screenSize.height - 140 * SCALE_FACTOR));
        // add the label as a child to this layer
        this.addChild(this._highScoreLabel, 5);

        // create and initialize a label
        this._currentScoreLabel = cc.LabelTTF.create(s_currentScore, s_marker_felt_ttf, 20 * SCALE_FACTOR);
        // position the label on the center of the screen
        this._currentScoreLabel.setPosition(cc.p(this._screenSize.width / 2 + 50 * SCALE_FACTOR, this._screenSize.height - 180 * SCALE_FACTOR));
        // add the label as a child to this layer
        this.addChild(this._currentScoreLabel, 5);

        // create and initialize game over label
        this._gameover = cc.LabelTTF.create("GAME OVER", s_marker_felt_ttf, 28 * SCALE_FACTOR);
        if (s_isHighScore) {
            this.popTextOnScreen("High Score!", "up");

        } else {

        }
        this._gameover.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 95 * SCALE_FACTOR));
        this.addChild(this._gameover, 5);

        // best score label
        this._bestLabel = cc.LabelTTF.create("Best", s_marker_felt_ttf, 20 * SCALE_FACTOR);
        this._bestLabel.setPosition(cc.p(this._screenSize.width / 2 - 40 * SCALE_FACTOR, this._screenSize.height - 140 * SCALE_FACTOR));
        this.addChild(this._bestLabel, 5);
        this._scoreLabel = cc.LabelTTF.create("Score", s_marker_felt_ttf, 20 * SCALE_FACTOR);
        this._scoreLabel.setPosition(cc.p(this._screenSize.width / 2 - 40 * SCALE_FACTOR, this._screenSize.height - 180 * SCALE_FACTOR));
        this.addChild(this._scoreLabel, 5);

        // tap to continue
        this._tapToContinueLabel = cc.LabelTTF.create("TAP TO CONTINUE", s_marker_felt_ttf, 20 * SCALE_FACTOR);
        this._tapToContinueLabel.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 305 * SCALE_FACTOR));
        this.addChild(this._tapToContinueLabel, 5);
        var fadein_tap = cc.FadeIn.create(1.0);
        var fadeout_tap = cc.FadeOut.create(1.0);
        var sequence = cc.RepeatForever.create(cc.Sequence.create(fadein_tap, fadeout_tap));

        this._tapToContinueLabel.runAction(sequence);

        //leaderboard
        var leaderboardButton = cc.MenuItemImage.create(s_leaderboard_png, s_leaderboard_png, this.showLeaderboard, this);
        var leaderboardMenu = cc.Menu.create(leaderboardButton);
        leaderboardMenu.setPosition(cc.p(this._screenSize.width / 2, this._screenSize.height - 245 * SCALE_FACTOR));
        this.addChild(leaderboardMenu, 5);

        //easter eggs
        this._easterEggs = [];
        for (i = 0; i < MAX_EASTER_EGGS; i++) {
            var easterEgg = cc.Sprite.createWithSpriteFrameName("easter_egg_" + (i % 10 + 1).toString() + ".png");
            this.addChild(easterEgg, 1000);
            easterEgg.setVisible(false);
            this._easterEggs.push(easterEgg);
        }
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

    update: function(delta) {
        if (this._isPouringEasterEggs) {
            this._timer += delta;
            this._timerEasterEggs += delta;
            if (this._timerEasterEggs > 0.1 && s_isHighScore) {
                this.pourEasterEgg();
                this._timerEasterEggs = 0;
            }

            if (this._timer > 2) {
                this._isPouringEasterEggs = false;
            }
        }
    },

    pourEasterEgg: function() {
        var that = this;
        this._easterEggs.some(function(easterEgg) {
            if (!easterEgg.isVisible()) {
                easterEgg.setVisible(true);
                var easterEggSpawnPositionX = getRandomArbitrary(0, that._screenSize.width);
                easterEgg.setScale(DECORATION_SCALE_FACTOR);
                easterEgg.setPosition(cc.p(easterEggSpawnPositionX, that._screenSize.height));

                var callfunc = cc.CallFunc.create(function() {
                    easterEgg.setVisible(false);
                });
                var pour = cc.MoveBy.create(1, cc.p(0, -that._screenSize.height));
                var flowWithCallfunc = cc.Sequence.create(pour, callfunc);
                easterEgg.runAction(flowWithCallfunc);

                return true;
            }
        });
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

    popTextOnScreen: function(word, direction) {

        var spawnPositionX, spawnPositionY;
        var destinationX, destinationY;

        var wordOnScreen = cc.LabelTTF.create(word, s_feastof_flesh_BB_ttf, 50 * SCALE_FACTOR);

        switch (direction) {

            case 'down':
                {

                    spawnPositionX = this._screenSize.width / 2;
                    spawnPositionY = this._screenSize.height + 20 * SCALE_FACTOR;
                    destinationX = this._screenSize.width / 2;
                    destinationY = -30 * SCALE_FACTOR;
                    wordOnScreen.setColor(cc.c3b(255, 110, 0));

                }
                break;

            case 'up':
                {

                    spawnPositionX = this._screenSize.width / 2;
                    spawnPositionY = -30 * SCALE_FACTOR;
                    destinationX = this._screenSize.width / 2;
                    destinationY = this._screenSize.height + 20 * SCALE_FACTOR;
                    wordOnScreen.setColor(cc.c3b(0, 153, 255));
                }
        }

        wordOnScreen.setPosition(cc.p(spawnPositionX, spawnPositionY));

        this.addChild(wordOnScreen, 1000);

        var flow = cc.MoveTo.create(1, cc.p(this._screenSize.width / 2, this._screenSize.height / 2 + 180 * SCALE_FACTOR));

        var flowAway = cc.MoveTo.create(1, cc.p(destinationX, destinationY));

        var callfunc = cc.CallFunc.create(function() {

            wordOnScreen.setVisible(false);

        }.bind(this));

        var flowWithCallfunc = cc.Sequence.create(flow, cc.DelayTime.create(2), flowAway, callfunc);
        wordOnScreen.runAction(flowWithCallfunc);
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