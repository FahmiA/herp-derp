/** Abstract Enemy */
var Enemy = me.ObjectEntity.extend(
{
    init: function(x, y, settings, respondDist)
    {
        this.parent(x, y, settings);
        this.collidable = true;

	this.health = 100;
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(0, 0);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

        // Set up evilness
        if(typeof(settings.evil) != 'undefined')
        {
            this.evil = settings.evil;
        }else{
            this.evil = false;
        }

        this.target = null;
	this.aim = 0;
        this.doUpdate = false;
    },

    update: function()
    {
        if(!this.alive)
        {
            this.parent(this);
            return true;
        }

        this.doUpdate = false;

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
	{
	    this._updateAim(this.target.pos);
            this.onProximity();
	}

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
	{
	    this.health -= obj.damage;
	}

	if (this.health <= 0)
	    me.game.remove(this);

	return true; //Absorb bullet
    },

    stateChanged: function()
    {
        this.doUpdate = true;
    },
    
    _updateAim: function(pos)
    {
        //Do math to convert player and enemy position
        this.aim = Math.atan2(
	    pos.y - this.pos.y - this.anchorPoint.y + me.game.viewport.pos.y,
	    pos.x - this.pos.x - this.anchorPoint.x + me.game.viewport.pos.x);
	console.log(this.aim);
    }
});

var ChasingEnemy = Enemy.extend(
{
    init: function(x, y, settings, respondDist, speed)
    {
        this.parent(x, y, settings, respondDist);
        this.speed = speed;

        this.setVelocity(speed, speed);
    },

     update: function()
    {
	this.parent();
	
	//Check collision with objects
        var res = me.game.collide(this);
        if (res != null)
        {   
            if (res.obj.name == "player")
		res.obj.onHit(this);
        }
    },

    onProximity: function()
    {
        // Chase the player 
        this._chaseTarget();
    },

    _chaseTarget: function()
    {
        // Calculate velocity based on target position
        if(this.target.bottom < this.bottom) // Above
        {
            this.vel.y -= this.accel.x * me.timer.tick;
            this.stateChanged();
            this.setCurrentAnimation('move');
        }else if(this.target.top > this.top) { // Below
            this.vel.y += this.accel.x * me.timer.tick;
            this.stateChanged();
            this.setCurrentAnimation('move');
        }
        
        if(this.target.right < this.right) { // Left
            this.vel.x -= this.accel.x * me.timer.tick;
            this.stateChanged();
            this.setCurrentAnimation('move');
        }else if(this.target.left > this.left) { // Right
            this.vel.x += this.accel.x * me.timer.tick;
            this.stateChanged();
            this.setCurrentAnimation('move');
        }

        if(!this.doUpdate)
        {
            this.setCurrentAnimation('move');
        }
    }
});


/** Table */
var Table = ChasingEnemy.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 3, 1);

        // Set animations
        this.addAnimation('move', [9, 10]);
        this.addAnimation('stay', [8]);
        this.setCurrentAnimation('move');

	this.damage = 25;
    },
});

/** Chair */
var Chair = ChasingEnemy.extend(
{
    init: function (x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 4, 2);

	//Chairs have less health
	this.health = 35;
	this.updateColRect(5, 22, 5, 22);

        // Set animations
        this.addAnimation('move', [29, 30, 31, 32, 43, 44, 45, 46, 47, 48, 49, 50]);
        this.addAnimation('stay', [29]);
        this.setCurrentAnimation('move');

	this.damage = 5
    }
});

/** Computer Bomb */
var Computer = Enemy.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 2);

        // Set animations
        this.addAnimation('idle', [27, 28]);
        this.addAnimation('alert', [27, 28]);
        this.setCurrentAnimation('alert', 'alert');
    },

    onProximity: function()
    {
	this.setCurrentAnimation('alert');
        console.debug('Boom!');
	me.game.remove(this);
    }
});
