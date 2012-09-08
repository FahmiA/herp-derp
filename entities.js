var Projectile = me.ObjectEntity.extend({
	/*
	 * Spawns a projectile
	 * X - X position of the projectile
	 * Y - Y position of the projectile
	 * aim - The heading of the projectile in radians
	 */
    init: function(x, y, settings, aim)
    {
        this.parent(x, y, settings);

        this.collidable = true;
        this.updateColRect(0, 1, 0, 1);

        this.setVelocity(15,15);
        this.gravity = 0;
            
        this.aim = aim;
    },

        update: function()
        {   
            //Move along path
            this.vel.x = this.accel.x * me.timer.tick * Math.cos(this.aim);
            this.vel.y = this.accel.y * me.timer.tick * Math.sin(this.aim);

            //Check collision with objects
            var res = me.game.collide(this);
            if (res != null)
            {   
                var absorbed = false;
                
                //Let the collided objects decide if they absord the bullet
                if (typeof(res.obj.onHit) == "function")
                    absorbed = res.obj.onHit(this);

                if(absorbed)
                    me.game.remove(this);
            }

            //Update movement and check collision with the world
            wrld = this.updateMovement();
            if(wrld.x != 0 || wrld.y != 0)
            {
                console.log("Thunk");
                //TODO SOUND Wall hit
                me.game.remove(this);
            }
        }
});

var Bullet = Projectile.extend({
    init: function(x, y, aim)  {
        this.source = new me.Vector2d(x, y);
        
        var settings = {
            name: "bullet",
            x: x,
            y: y,
            z: 2,
            width:  1,
            height: 1,
            gid: null,
            isPolygon: false,
            image: "OBJ_TILESET",
            spriteheight: 1,
            spritewidth: 1
        };
        this.parent(x, y, settings, aim);
    },
    
    draw: function(context) {
	//Stolen math code
	var xDistance = Math.abs(this.pos.x - this.source.x);
	var yDistance = Math.abs(this.pos.y - this.source.y);
	var distanceAB  = Math.sqrt(Math.pow(xDistance, 2) + 
                                    Math.pow(yDistance, 2));
	var distanceAC = 24;
        var deltaXAC    = distanceAC * Math.cos(this.aim);
        var deltaYAC    = distanceAC * Math.sin(this.aim);

	var xC          = this.pos.x + deltaXAC;
	var yC          = this.pos.y + deltaYAC;
	

	context.beginPath();
	context.moveTo(this.pos.x, this.pos.y);
	context.lineTo(xC, yC);
	context.stroke();
    }
});

/*
var Soda = Projectile.extend({(x, y, aim) {
    var settings = {
	name: "soda",
	x: x,
	y: y,
	z: 2,
	width: 1,
	height: 1,
	gid: null,
	isPolygon: false,
	image: "OBJ_TILESET",
	spriteheight: 1,
	spritewidth: 1
    };
    Projectile.call(this, x, y, settings, aim);
}

Soda.prototype = new Projectile;

Soda.prototype.draw = function() {
};
*/