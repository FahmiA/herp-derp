/** Abstract Enemy */
var Enemy = me.ObjectEntity.extend(
{
    init: function(x, y, settings, speed, respondDist)
    {
        this.parent(x, y, settings);
        this.collidable = true;
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(speed, speed);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

        // Set up evilness
        if(typeof(settings.evil) != 'undefined')
        {
            this.evil = settings.evil;
        }else{
            this.evil = false;
        }

        this.target = null;
        this.doUpdate = false;
    },

    update: function()
    {
        if(!this.alive)
        {
            this.parent(this);
            return true;
        }

        this.doUpdate = true;

        // Search for the player
        if(this.evil && !this.target)
        {
            var player = me.game.getEntityByName('player')[0];
            if(this.pos.distance(player.pos) < this.width * 2)
            {
                this.target = player;
            }
        }

        if(this.target)
            this.onProximity();

        // Update player movement
        this.updateMovement();

        // Update animation if necessary
        if (this.doUpdate)
        {
            // Update object animation
            this.parent(this);
        }
                
        return this.doUpdate;
    },

    onHit: function(obj)
    {
        console.log("Crack");
        if(obj.name == "bullet")
            return true;
    },

    stateChanged: function()
    {
        this.doUpdate = true;
    }
});


/** Table */
var Table = Enemy.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings, 1, settings.width * 3);

        // Set animations
        this.addAnimation('move', [9, 10]);
        this.addAnimation('stay', [8]);
        this.setCurrentAnimation('move');
    },

    onProximity: function()
    {
        // Chase the player 
        if(this.target)
        {
            this._chaseTarget();
        }
    },

    _chaseTarget: function()
    {
        // Calculate velocity based on target position
        if(this.target.bottom < this.bottom) // Above
        {
            this.vel.y -= this.accel.x * me.timer.tick;
            this.stateChanged();
        }else if(this.target.top > this.top) { // Below
            this.vel.y += this.accel.x * me.timer.tick;
            this.stateChanged();
        }
        
        if(this.target.right < this.right) { // Left
            this.vel.x -= this.accel.x * me.timer.tick;
            this.stateChanged();
        }else if(this.target.left > this.left) { // Right
            this.vel.x += this.accel.x * me.timer.tick;
            this.stateChanged();
        }
    }
});
