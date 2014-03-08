var duck = cc.Sprite.extend({
    speed: 220,
    bulletSpeed: MW.BULLET_SPEED.SHIP,
    HP: 5,
    bulletTypeValue: 1,
    bulletPowerValue: 1,
    throwBombing: false,
    canBeAttack: true,
    isThrowingBomb: false,
    zOrder: 3000,
    maxBulletPowerValue: 4,
    appearPosition: cc.p(160, 60),
    _hurtColorLife: 0,
    active: true,
    bornSprite: null,
    CD_GRAVITY_SPEED: 300,
    ctor: function() {
        this._super();

        //init life
        this.initWithSpriteFrameName("res/ducksmall.png");
        this.setTag(this.zOrder);
        this.setPosition(this.appearPosition);

        // set frame
        var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrame("res/ducksmall.png");
        var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("res/ducksmall.png");

        var animFrames = [];
        animFrames.push(frame0);
        animFrames.push(frame1);

        // ship animate
        var animation = cc.Animation.create(animFrames, 0.1);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
        this.schedule(this.shoot, 1 / 6);

    },
    update: function(dt) {

    },

});