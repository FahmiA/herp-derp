/** Table */
var Table = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
        //this.collide = true;
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(1, 1);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

        // Set animations
        this.addAnimation('move', [9, 10]);
        this.addAnimation('stay', [8]);
        this.setCurrentAnimation('stay');

        if(typeof(settings.evil) != 'undefined')
        {
            this.evil = settings.evil;
        }else{
            this.evil = false;
        }

        this.target = null;
    },

    update: function()
    {
        if(this.alive)
        {
            // Search for the player
            if(this.evil && !this.target)
            {
                var player = me.game.getEntityByName('player')[0];
                if(this.pos.distance(player.pos) < this.width * 2)
                {
                    this.target = player;
                    this.setCurrentAnimation('move');
                }
            }

            // Chase the player 
            if(this.target)
            {
                this._chaseTarget();
                this.flicker(2);
            }
        }

        // Update player movement
        this.updateMovement();

        return true;
    },

    _chaseTarget: function()
    {
        // Calculate velocity based on target position
        if(this.target.bottom < this.bottom) // Above
        {
            this.vel.y -= this.accel.x * me.timer.tick;
        }else if(this.target.top > this.top) { // Below
            this.vel.y += this.accel.x * me.timer.tick;
        }
        
        if(this.target.right < this.right) { // Left
            this.vel.x -= this.accel.x * me.timer.tick;
        }else if(this.target.left > this.left) { // Right
            this.vel.x += this.accel.x * me.timer.tick;
        }
    }
});

