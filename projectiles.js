//Base projectile object
var Projectile = me.ObjectEntity.extend({
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


/*
 * Extended projectile types
 */
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
	
	//Create drawing gradient
	var grad = context.createLinearGradient(xC, yC, this.pos.x, this.pos.y);
	grad.addColorStop(0, "white");
	grad.addColorStop(1, "rgba(255, 255, 0, 0.25)");
	context.strokeStyle = grad;
	
	context.beginPath();
	context.moveTo(this.pos.x, this.pos.y);
	context.lineTo(xC, yC);
	context.stroke();
    }
});

var Soda = Projectile.extend({
    init: function(x, y, aim){
	var settings = {
	    name: "bullet",
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
	this.parent(x, y, settings, aim);
    }
});