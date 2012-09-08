/** Player */
var Player = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
        this.collidable = true;

	this.anchorPoint = new me.Vector2d(this.width/2, this.height/2);
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

	this.aim = 0;

	//Bind keys
        me.input.bindKey(me.input.KEY.LEFT, 'left');
        me.input.bindKey(me.input.KEY.RIGHT, 'right');
        me.input.bindKey(me.input.KEY.UP, 'up');
        me.input.bindKey(me.input.KEY.DOWN, 'down');
	
	//Bind WASD too
	me.input.bindKey(me.input.KEY.A, 'left');
        me.input.bindKey(me.input.KEY.D, 'right');
        me.input.bindKey(me.input.KEY.W, 'up');
        me.input.bindKey(me.input.KEY.S, 'down');


	me.input.bindKey(me.input.KEY.SPACE, 'shoot', true);
	me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);

        // Set animations
        this.addAnimation('moveUp', [4, 5]);
        this.addAnimation('moveDown', [6, 7]);
        this.addAnimation('moveLeft', [2, 3]);
        this.addAnimation('moveRight', [0, 1]);
        this.setCurrentAnimation('moveRight');

        // Adjust the bounding box
	this.updateColRect(5, 22, 5, 22);

        // Set the display to follow our position on both axis
	me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },

    update: function()
    {
	//Check if player is still alive
        if(!this.alive)
        {
            this.parent(this);
            return true;
        }

	//Check player controls
        this._steer();

        // Update animation if necessary
        var moved = false;
        if (this.vel.x != 0 || this.vel.y != 0)
        {
            // Update object animation
            this.parent(this);
            moved = true;
        }

	//Player shooting
	if(me.input.isKeyPressed('shoot'))
	{
	    this._fireWeapon();    
	}
                
        return moved;
    },

    onHit: function(obj)
    {
	if(obj.name != "bullet")
	{
	    console.log("Thwack");
	    //Loose health
	    //TODO SOUND
	}
    },

    _steer: function()
    {
        var moveX = 0;
        var moveY = 0;
        var speedX = this.accel.x * me.timer.tick;
        var speedY = this.accel.y * me.timer.tick;

        // Player movement
        if(me.input.isKeyPressed('left'))
        {
            moveX = -speedX;
            this.setCurrentAnimation('moveLeft');
        }else if(me.input.isKeyPressed('right')) {
            moveX = speedX;
            this.setCurrentAnimation('moveRight');
        }

        if(me.input.isKeyPressed('up')) {
            moveY = -speedY;
            this.setCurrentAnimation('moveUp');
        }else if(me.input.isKeyPressed('down')) {
            moveY = speedY;
            this.setCurrentAnimation('moveDown');
        }
	
	//Ensure travel speed is constant
	var dist = Math.sqrt(Math.pow(moveX, 2) + Math.pow(moveY, 2));
	
	if (moveX != 0)
	    this.vel.x += moveX/dist;
	else
	    this.vel.x = 0;

	if (moveY != 0)
	    this.vel.y += moveY/dist;
	else
	    this.vel.y = 0;

	// Notify of player movement
        this.updateMovement();
	
	//Update the aim towards the screen
	this._updateAim(me.input.mouse.pos);

        return true;
    },

    _updateAim: function(pos)
    {
	//Do math to convert player position and mouse pos
	this.aim = Math.atan2(pos.y - this.pos.y, pos.x - this.pos.x);
    },
    
    _fireWeapon: function()
    {
	//Fire mah lazer
	console.log("Pew!Pew!");

	//TODO SOUND
	
	//Create a bullet
	var bullet = new Bullet(this.pos.x, this.pos.y, this.aim);
	me.game.add(bullet, this.z);
	me.game.sort();
    }
});
