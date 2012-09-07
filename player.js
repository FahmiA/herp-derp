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

        // Set animations
        this.addAnimation('moveUp', [4, 5]);
        this.addAnimation('moveDown', [6, 7]);
        this.addAnimation('moveLeft', [2, 3]);
        this.addAnimation('moveRight', [0, 1]);
        this.setCurrentAnimation('moveRight');

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

        // Update animation if necessary
        var moved = false;
        if (this.vel.x != 0 || this.vel.y != 0)
        {
            // Update object animation
            this.parent(this);
            moved = true;
        }
                
        return moved;
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
            this.setCurrentAnimation('moveLeft');
        }else if(me.input.isKeyPressed('right')) {
            moveX = speedX;
            this.setCurrentAnimation('moveRight');
        }

        if(me.input.isKeyPressed('up')) {
            moveY = -speedY;
            this.setCurrentAnimation('moveUp');
        }else if(me.input.isKeyPressed('down')) {
            moveY = speedY;
            this.setCurrentAnimation('moveDown');
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

        // Update player movement
        this.updateMovement();
    }
});
