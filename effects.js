/** Explosion Effect */
var Explosion = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
        this.collidable = true;
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(0, 0);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

        // Set animations
        this.addAnimation('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.setCurrentAnimation('explode', function() {
            me.game.remove(this);
        });

        // Accessed by player
        this.damage = 50;
    },
});

/** Gun flash effect */
var GunFlash = me.ObjectEntity.extend(
{
    init: function(x, y)
    {
        var settings = {
            image: 'EFFECTS_TILESET',
            spritewidth: 32,
            spriteheight: 32
        }
        this.parent(x, y, settings);
        this.collidable = false;

        // Set animations
        this.addAnimation('flash', [10]);
        this.setCurrentAnimation('flash');

        this.tickCount = 5;
    },

    update: function()
    {
        this.tickCount--;

        if(this.tickCount <= 0)
        {
            me.game.remove(this);
        }

        this.parent(this);
        return true;
    }
});

/** Watter Spill  Effect */
var WaterSpill = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
        this.collidable = true;
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(0, 0);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

        // Set animations
        this.addAnimation('spill', [16, 17, 18]);
        this.animationspeed = 60;
        this.setCurrentAnimation('spill', function() {
            me.game.remove(this);
        });

        // Accessed by player
        this.damage = 5;
    },

    update: function()
    {
        this.parent();

        var res = me.game.collide(this);
        if(res != null)
        {
            if(res.obj.name == 'player')
            {
                res.obj.onHit(this);
            }
        }

        this.parent(this);
        this.updateMovement();
        return true;
    }
});
