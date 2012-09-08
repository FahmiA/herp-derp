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
    },

    update: function()
    {
        this.updateMovement();
        this.parent(this);
        return true;
    }

});
