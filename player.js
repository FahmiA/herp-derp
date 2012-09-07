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

        var keyCount = 0;
        this.vel.x = 0;
        this.vel.y = 0;

        // Player movement
        if(me.input.isKeyPressed('left'))
        {
            this.vel.x -= this.accel.x * me.timer.tick;
            keyCount++;
        }else if(me.input.isKeyPressed('right')) {
            this.vel.x += this.accel.x * me.timer.tick;
            keyCount++;
        }

        if(me.input.isKeyPressed('up')) {
            this.vel.y -= this.accel.y * me.timer.tick;
            keyCount++;
        }else if(me.input.isKeyPressed('down')) {
            this.vel.y += this.accel.y * me.timer.tick;
            keyCount++;
        }

        if(keyCount == 2)
        {
            this.vel.x /= 2;
            this.vel.y /= 2;
        }

        // Notify of player movement
        this.updateMovement();

        return true;
    },
});
