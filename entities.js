var Projectile = me.ObjectEntity.extend(
    {
	init: function(x, y, heading)
	{
	    var settings = {
		name: "bullet",
		x: 0,
		y: 0,
		z: 2,
		width: 32,
		height: 32,
		gid: null,
		isPolygon: false,
		image: "OBJ_TILESET",
		spriteheight: 32,
		spritewidth: 32
	    };
	    this.parent(x, y, settings);

	    this.collidable = true;
	    
	    this.setVelocity(2,2);
	    this.gravity = 0;
	    
	    this.aim = heading;
	},

	update: function()
	{   
	    console.log("Firing...");
	    //Move along path
	    this.vel.x += this.accel.x * me.timer.tick;
	    this.vel.y -= this.accel.y * me.timer.tick;

	    // Notify of projectile movement
            this.updateMovement();

	    //Check Collision
	    var res = me.game.collide(this);
	    if (res != null)
	    {
		console.debug(res.obj.name);
		if(res.obj.name != "player")
		{
		    console.log("BOOM");
		    me.game.remove(this);
		}
	    }
	}
    });