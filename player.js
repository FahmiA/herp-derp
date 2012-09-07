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

        var horzMovement = 1;
        var vertMovement = 0;

        // Player movement
        if(me.input.isKeyPressed('left'))
        {
            this.vel.x -= this.accel.x * me.timer.tick;
            this.vel.y = 0;
        }else if(me.input.isKeyPressed('right')) {
            this.vel.x += this.accel.x * me.timer.tick;
            this.vel.y = 0;
        }else if(me.input.isKeyPressed('up')) {
            this.vel.y -= this.accel.y * me.timer.tick;
            this.vel.x = 0;
        }else if(me.input.isKeyPressed('down')) {
            this.vel.y += this.accel.y * me.timer.tick;
            this.vel.x = 0;
        }else{
            this.vel.x = 0;
            this.vel.y = 0;
        }

        //this.vel.x = Math.cos(Math.PI/2 * horzMovement) * this.accel.x * me.timer.tick;
        //this.vel.y = Math.sin(Math.Pi/2 * vertMovement) * this.accel.x * me.timer.tick;

        // Notify of player movement
        this.updateMovement();

        return true;
    },
});
