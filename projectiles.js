//Base projectile object
var Projectile = me.ObjectEntity.extend({
    init: function(x, y, settings, aim)
    {
        this.parent(x, y, settings);

        this.collidable = true;
        //this.updateColRect(0, 32, 0, 32);

        this.gravity = 0;
            
        this.aim = aim;
        this.damage = 100;
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
            var absorbed = true;
            //Let the collided objects decide if they absord the bullet
            if (typeof(res.obj.onHit) == 'function')
                absorbed = res.obj.onHit(this);
            
            if(absorbed || res.obj.name == 'bullet')
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
    
        this.parent(this);
        return true;
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
            image: "OBJ_TILESET",
            spriteheight: 1,
            spritewidth: 1
        };
        this.parent(x, y, settings, aim);

        this.setVelocity(15,15);
    },
    
    draw: function(context)
    {
        var adjusted = new me.Vector2d(this.pos.x - me.game.viewport.pos.x, 
                           this.pos.y - me.game.viewport.pos.y)
        var tracer = getPoint(adjusted, this.aim, -12);
        
        //console.log(adjusted.x, adjusted.y);
        //me.game.remove(this);
        
        //Create drawing gradient
        var grad = context.createLinearGradient(tracer.x, tracer.y, adjusted.x, adjusted.y);
        grad.addColorStop(1, "white");
        grad.addColorStop(0, "rgba(255, 255, 0, 1)");
        context.strokeStyle = grad;
        
        context.beginPath();
        context.moveTo(adjusted.x, adjusted.y);
        context.lineTo(tracer.x, tracer.y);
        context.stroke();
    }
});

var Soda = Projectile.extend({
    init: function(x, y, aim)
    {
        var settings = {
            name: "soda",
            image: "EFFECTS_TILESET",
            spriteheight: 32,
            spritewidth: 32
        };
        this.parent(x, y, settings, aim);

        this.addAnimation('flip', [11, 12]);
        this.setCurrentAnimation('flip');

        this.updateColRect(8, 16, 8, 16);

        this.setVelocity(0.2, 0.2);
    },

    /*update: function()
    {
        this.updateMovement();
        this.parent(this);
        return true;
    }*/
});

//Math stuff
function getPoint(pos, angle, dist)
{
    //Stolen math code
    //    var xDistance = Math.abs(this.pos.x - this.source.x);
    //    var yDistance = Math.abs(this.pos.y - this.source.y);
    //    var distanceAB  = Math.sqrt(Math.pow(xDistance, 2) + 
    //                              Math.pow(yDistance, 2));
    

    var distanceAC = dist;
    var deltaXAC    = distanceAC * Math.cos(angle);
    var deltaYAC    = distanceAC * Math.sin(angle);

    var xC          = pos.x + deltaXAC;
    var yC          = pos.y + deltaYAC;

    return new me.Vector2d(xC, yC);
}
