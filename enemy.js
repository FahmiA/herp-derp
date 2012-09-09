/** Abstract Enemy */
var Enemy = me.ObjectEntity.extend(
{
    init: function(x, y, settings, respondDist, animates)
    {
        // Hard-code these settings for convenience
        if(animates)
        {
            settings.image = 'MOB_TILESET';
            settings.spritewidth = 32;
            settings.spriteheight = 32;
        }
        this.parent(x, y, settings);
        this.collidable = true;
        
        this.health = 100;
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(0, 0);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

        this.respondDist = respondDist;
        this.target = null;
        this.aim = 0;
        this.doUpdate = false;
        
        // Set up evilness
        if(typeof(settings.evil) != 'undefined')
        {
            this.evil = settings.evil;
        }else{
            this.evil = false;
        }

        this.player = null;
    },

    update: function()
    {
        if(!this.evil)
            return false;

        if(!this.alive)
        {
            this.parent(this);
            return true;
        }

        if(this.player == null)
        {
            this.player = me.game.getEntityByName('player')[0];
        }

        this.doUpdate = false;

        // Search for the player
        if(!this.target)
        {
            if(this.pos.distance(this.player.pos) < this.respondDist)
            {
                this.target = this.player;
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
        if(obj.name == "bullet")
        {
            me.audio.play("enemy_hit");
            this.health -= obj.damage;
        }else if (obj.name == "soda")
        {
            return false;
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
	    pos.y - this.pos.y,
	    pos.x - this.pos.x);
    }
});

var ChasingEnemy = Enemy.extend(
{
    init: function(x, y, settings, respondDist, animates, speed)
    {
        this.parent(x, y, settings, respondDist, animates);
        this.speed = speed;

        this.setVelocity(speed, speed);
	this.delayNextHit = false;
    },

    update: function()
    {
        if (!this.parent())
            return;

        //Check collision with objects
        var res = me.game.collide(this);
        if (res != null)
        {   
            if (res.obj.name == "player"  && !this.delayNextHit)
	    {
                res.obj.onHit(this);
		this.delayNextHit == true;
	    }
        }
	else
	{
	    this.delayNextHit == false;
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
        this.parent(x, y, settings, settings.width * 3, true, 1);

        // Set animations
        this.addAnimation('move', [24, 25, 26]);
        this.addAnimation('stay', [24]);
        this.setCurrentAnimation('stay');
        
        this.damage = 25;
    },
});

/** Chair */
var Chair = ChasingEnemy.extend(
{
    init: function (x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 4, true, 2);

        //Chairs have less health
        this.health = 35;
        this.updateColRect(5, 22, 5, 22);

        // Set animations
        this.addAnimation('move', [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        this.addAnimation('stay', [48]);
        this.setCurrentAnimation('stay');

        this.damage = 5
    }
});

/** Computer Bomb */
var Computer = Enemy.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 2, true);

        // Set animations
        this.addAnimation('idle', [36]);
        this.addAnimation('alert', [36, 37]);
        this.setCurrentAnimation('idle');

        this.fuseMaxTicks = 120;
        this.fuseTicks = 0;

	this.damage = 80;
    },

    onProximity: function()
    {
        if(this.alive)
        {
	    if(this.fuseTicks == 0)
		me.audio.play("computer_timer");

            if(this.fuseTicks < this.fuseMaxTicks)
            {
                this.fuseTicks++;
                this.setCurrentAnimation('alert');
                this.stateChanged();
            }else{
                var settings = {
                    name: 'explosion',
                    image: 'EFFECTS_TILESET',
                    spritewidth: 32,
                    spriteheight: 32,
                };

                var maxExplosions = 9;
                var minX = this.pos.x - 32;
                var maxX = this.pos.x + 32;
                var minY = this.pos.y - 32;
                var maxY = this.pos.y + 32;
                // TODO: Give explosions a vector to follow AWAY from the computer.
                for(var i = 0; i < maxExplosions; i++)
                {
                    var x = minX + (Math.random() * (maxX - minX));
                    var y = minY + (Math.random() * (maxY - minY));
                    me.game.add(new Explosion(x, y, settings), this.z + 1);
                }
		
		if(this.distanceTo(this.target) <= 64)
		{
		    this.target.onHit(this);
		}
		
		me.audio.play("vender_explosion");
                me.game.remove(this);
                me.game.sort();

                this.alive = false;
            }
        }
    }
});

/** Vending Machine */
var Vender = Enemy.extend(
{
    init:  function(x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 2, false);

        this.fireGap = 60; // Ticks between firing
        this.tickCount = 0;
    },

    onProximity: function()
    {
        this.tickCount += me.timer.tick;
        if(this.target.top > this.bottom)
        {
            if(this.tickCount > this.fireGap)
            {
                this._shoot();
                this.tickCount = 0;
            }
        }
    },

    _shoot: function()
    {
        //Create a soda
        var soda = new Soda(
            this.pos.x,
            this.pos.y,  
            this.aim);
	me.audio.play("vender_fire");
        me.game.add(soda, this.z);
        me.game.sort();
    }
});

/** Water Cooler */
var Watercooler = Enemy.extend(
{
    init: function (x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 2, false);

        this.fireGap = 240; // Ticks between firing
        this.tickCount = 120;
    },

    onProximity: function()
    {
        this.tickCount += me.timer.tick;
        if(this.tickCount > this.fireGap)
        {
            this.tickCount = 0;

            var settings = {
                name: 'waterspill',
                image: 'EFFECTS_TILESET',
                spritewidth: 32,
                spriteheight: 32,
            };

            var maxSpills = 9;
            var minX = this.pos.x - 32;
            var maxX = this.pos.x + 32;
            var minY = this.pos.y - 32;
            var maxY = this.pos.y + 32;
            for(var x = minX; x <= maxX; x += 32)
            {
                for(var y = minY; y <= maxY; y += 32)
                {
                    me.game.add(new WaterSpill(x, y, settings), this.z + 1);
                }
            }
	    me.audio.play("watercooler_bloop");
            me.game.sort();
            
            // Forget the player exists
            this.target = null; 
        }
    }
});
