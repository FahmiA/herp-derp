/** Player */
var Player = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
        this.collide = true;
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

        // Adjust the bounding box
		this.updateColRect(5, 22, 5, 22);

        // Set the display to follow our position on both axis
	    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },

    update: function()
    {
        if(!this.alive)
        {
            this.parent(this);
            return true;
        }

        this._steer();

        return true;
    },

    _steer: function()
    {
        var moveX = 0;
        var moveY = 0;
        var speedX = this.accel.x * me.timer.tick;
        var speedY = this.accel.y * me.timer.tick;

        // Player movement
        if(me.input.isKeyPressed('left'))
        {
            moveX = -speedX;
        }else if(me.input.isKeyPressed('right')) {
            moveX = speedX;
        }

        if(me.input.isKeyPressed('up')) {
            moveY = -speedY;
        }else if(me.input.isKeyPressed('down')) {
            moveY = speedY;
        }

        var dist = Math.sqrt(Math.pow(moveX, 2) + Math.pow(moveY, 2));

        if(moveX != 0)
            this.vel.x += moveX / dist;
        else
            this.vel.x = 0;

        if(moveY != 0)
            this.vel.y += moveY / dist;
        else
            this.vel.y = 0;

        // Notify of player movement
        this.updateMovement();
    }
});
