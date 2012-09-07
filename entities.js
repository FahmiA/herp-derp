var bullet = me.ObjectEntity.extend(
    {
	init: function(x, y, heading)
	{
	    this.parent(x, y, {
		name: "bullet",
		x: 0,
		y: 0,
		z: 2,
		width: 1,
		height: 1,
		gid: null,
		isPolygon: false,
		image: "bulletTile",
		spriteheight: 32,
		spritewidth: 32
	    });

	    this.collide = true;
	    
	    this.setVelocity(3,3);
	    this.gravity = 0;
	    
	    this.aim = heading;
	},

	update: function()
	{   
	    //Move along path
	    //this.vel.x = 5;
	    //this.vel.y = 5;
	},

	onCollision: function(res, obj)
	{
	    console.debug(res);
	    console.debug(obj);
	    console.log("BOOM!");
	}
    });