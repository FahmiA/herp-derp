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

        this.doUpdate = false;

        // Search for the player
        if(!this.target)
        {
            var player = me.game.getEntityByName('player')[0];
            if(this.pos.distance(player.pos) < this.respondDist)
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
        if (!this.parent())
            return;

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
        this.addAnimation('move', [24, 25, 26]);
        this.addAnimation('stay', [24]);
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
        this.addAnimation('idle', [27]);
        this.addAnimation('alert', [27, 28]);
        this.setCurrentAnimation('idle');

        this.fuseMaxTicks = 120;
        this.fuseTicks = 0;
    },

    onProximity: function()
    {
        if(this.alive)
        {
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

                for(var row = this.pos.x - 32; row < this.pos.x + 32; row += 32)
                {
                    for(var col = this.pos.y - 32; col < this.pos.y + 32; col += 32)
                    {
                        me.game.add(new Explosion(row, col, settings), this.z + 1);
                    }
                }

                me.game.remove(this);
                me.game.sort();

                this.alive = false;
            }
        }
    }
});

/**Vending Machine*/
var Vendor = Enemy.extend(
{
    init:  function (x, y, settings){
	this.parent(x, y, settings, settings.width * 2);

        // Set animations
        this.addAnimation('idle', [27]);
        this.addAnimation('alert', [27, 28]);
        this.setCurrentAnimation('idle'),

	this.cooldown = 60;
    },
    
    onProximty: function()
    {
	
    }
});

var Watercooler = Enemy.extend(
{
    init: function (x, y, settings){
	this.parent(x, y, settings, settings.width * 2);
    },

    onPromixty: function(){
	
    }
});
