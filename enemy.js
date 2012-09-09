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

        this.health = (this.evil) ? 100 : 1000;

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
            this.onDie();

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
    },

    onDie: function()
    {
        this.setCurrentAnimation('die');

        this.alive = false;
        this.collidable = false;
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

	this.bounce = 0;
    },

    update: function()
    {
        if (!this.parent() || !this.alive)
            return;

        //Check collision with objects
        var res = me.game.collide(this);
        if (res != null)
        {   
            if (res.obj.name === "player" && !this.delayNextHit)
	    {
		if (typeof(res.obj.onHit) == 'function')
                    res.obj.onHit(this);
		
		this.delayNextHit = true;
		
		//Have the enemy react
		var toss = getPoint(this.pos , this.aim, this.bounce);
		tween = new me.Tween(this.pos)
		tween.to({x: toss.x, 
			  y: toss.y},
			 500);
		tween.easing(me.Tween.Easing.Cubic.EaseOut);
		tween.start();
	    }
        }
	else
	{
	    this.delayNextHit = false;
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
    },
});


/** Table */
var Table = ChasingEnemy.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 3, true, 0.5);
	this.updateColRect(2, 28, 2, 28);

        // Set animations
        this.addAnimation('move', [32, 33]);
        this.addAnimation('stay', [144]);
        this.addAnimation('die', [132]);
        this.setCurrentAnimation('stay');

	this.bounce = -25;
        this.damage = 60; //Three donuts
    },
});

/** Chair */
var Chair = ChasingEnemy.extend(
{
    init: function (x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 4, true, 2);

        //Chairs have less health
        this.updateColRect(5, 22, 5, 22);

	this.bounce = -15;	
	this.health = (this.evil) ? 20 : 200;
	this.damage = 20; //One Donut

        // Set animations
        var aniMoveIndex = Math.floor(Math.random() * 3);
        if(aniMoveIndex == 0)
        {
            // Blue Chair
            this.addAnimation('move', [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
            this.addAnimation('stay', [48]);
            this.addAnimation('die', [123]);
        }else if(aniMoveIndex == 1) {
            // Orange Chair
            this.addAnimation('move', [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]);
            this.addAnimation('stay', [60]);
            this.addAnimation('die', [124]);
        }else{
            // Green Chair
            this.addAnimation('move', [72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83]);
            this.addAnimation('stay', [72]);
            this.addAnimation('die', [125]);
        }

        this.setCurrentAnimation('stay');
    }
});

/** Computer Bomb */
var Computer = Enemy.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 2, true);

        // Set animations
        this.addAnimation('idle', [38]);
        this.addAnimation('alert', [36, 37]);
        this.addAnimation('die', [122]);
        this.setCurrentAnimation('idle');

        this.fuseMaxTicks = 120;
        this.fuseTicks = 0;
	this.damage = 80; //Four Donuts
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
                me.game.sort();

                // TODO: This doesn't show any animation.
                this.onDie();
            }
        }
    }
});

/** Vending Machine */
var Vender = Enemy.extend(
{
    init:  function(x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 4, true);

        var aniIndex = Math.floor(Math.random() * 2);
        if(aniIndex == 0)
        {
            this.addAnimation('idle', [96]);
            this.addAnimation('die', [121]);
        }else{
            this.addAnimation('idle', [97]);
            this.addAnimation('die', [120]);
        }
        this.setCurrentAnimation('idle');

	this.health = (this.evil) ? 50 : 500;

        this.fireGap = 120; // Ticks between firing
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
    },

    onDie: function()
    {
        var settings = {
            name: 'explosion',
            image: 'EFFECTS_TILESET',
            spritewidth: 32,
            spriteheight: 32,
        };
        me.game.add(new Explosion(this.pos.x, this.pos.y, settings), this.z + 1);
        me.game.sort();

        this.parent();
    }
});

/** Water Cooler */
var Watercooler = Enemy.extend(
{
    init: function (x, y, settings)
    {
        this.parent(x, y, settings, settings.width * 2, true);

        this.addAnimation('idle', [92]);
        this.addAnimation('die', [127]);
        this.setCurrentAnimation('idle');

        this.fireGap = 240; // Ticks between firing
        this.tickCount = 120;

	this.health = (this.evil) ? 30 : 300;
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
		    if(!(x == this.pos.x && y == this.pos.y))
			me.game.add(new WaterSpill(x, y, settings), this.z + 1);
		    else
			console.log(x, y, this.pos);
		}
            }
	    me.audio.play("watercooler_bloop");
            me.game.sort();
            
            // Forget the player exists
            this.target = null; 
        }
    }
});

/** Dumb Object */
var DumObject = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
    }
});
