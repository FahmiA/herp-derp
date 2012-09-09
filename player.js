/** Player */
var Player = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
	    this.map = new me.Vector2d(settings.x, settings.y);
        this.collidable = true;
        this.type = 'player';

	//Hacky fix stuff
        this.anchorPoint = new me.Vector2d(this.width/2, this.height/2);
	//this.toss = new me.Vector2d(0,0);
	this.slow = new me.Vector2d(1, 1);
        
        // Set the default horizontal & vertical speed (accel vector)
        //this.setVelocity(1.5, 1.5); //Set at end of update now
        this.gravity = 0; // 0 as this is a top-down, not a platformer

        this.aim = 0;
        this.doUpdate = true;

        //Health
        this.health = 100;

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
        this.addAnimation('lookUpLeft', [4, 5]);
        this.addAnimation('lookUpRight', [2, 3]);
        this.addAnimation('lookLeft', [6, 7]);
        this.addAnimation('lookRight', [0, 1]);
        this.addAnimation('lookDownLeft', [8, 9]);
        this.addAnimation('lookDownRight', [10, 11]);
        this.addAnimation('die', [128]);
        this.setCurrentAnimation('lookRight');

        // Adjust the bounding box
        this.updateColRect(5, 22, 5, 22);

        // Set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        me.game.viewport.setDeadzone(0,0);

        this.gunPos = this.pos;
    },

    update: function()
    {
        this.doUpdate = false;

        //Check if player is still alive
        if(!this.alive)
        {
            this.parent(this);
            return true;
        }
	
	//Check keyboard movement
	this._steer();

        // Update animation if necessary
        if (this.vel.x != 0 || this.vel.y != 0)
        {
            // Update object animation
            this.parent(this);
            this.doUpdate = true;
        }

        //Player shooting
        if(me.input.isKeyPressed('shoot'))
        {
            this._fireWeapon();    
        this.gunPos = this.pos;
        }

	//Make sure the player moves at the correct speed
	this.setVelocity(1.5, 1.5);
                
        return this.doUpdate;
    },

    onHit: function(obj)
    {
	if(!this.alive)
	    return true;
	
	if(obj.name === "health")
	{
	    this._doHealth(obj.healthPoints);
	}
	else if(obj.name === "waterspill")
	{
	    this.setVelocity(0.5, 0.5);
	}
	else if(obj.name === "bullet")
	{
	    return false;
	}
	else if(obj.name === "soda")
	{
	    this._doDamage(obj.damage);
	    return true;
	}
	else
	{
	    this._doDamage(obj.damage);
	}

	/*
	switch (obj.name)
	{
	case "soda":
	    //TODO SOUND
	    this._doDamage(obj.damage);
	    return true;
	case "chair":
	    //TODO SOUND
	    this._doDamage(obj.damage);
	    break;
	case "table":
	    //TODO SOUND
	    this._doDamage(obj.damage);
	    break;
	case "computer":
	    //TODO SOUND
	    this._doDamage(obj.damage);
	    break;
	case "waterspill":
	    this.setVelocity(0.5, 0.5);
	    break
        case "health":
            //TODO SOUND
            this._doHealth(obj.healthPoints);
            break;
	default:
	    return false;
	}
	*/
    },

    _steer: function()
    {
        var moveX = 0;
        var moveY = 0;
        var speedX = this.accel.x * me.timer.tick;
        var speedY = this.accel.y * me.timer.tick;

        // Player movement
        if(me.input.isKeyPressed('left')) {
            moveX = -speedX;
        }else if(me.input.isKeyPressed('right')) {
            moveX = speedX;
        }

        if(me.input.isKeyPressed('up')) {
            moveY = -speedY;
        }else if(me.input.isKeyPressed('down')) {
            moveY = speedY;
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
    },

    _updateAim: function(pos)
    {
        //Do math to convert player position and mouse pos
        this.aim = Math.atan2(
            pos.y - this.pos.y - this.anchorPoint.y + me.game.viewport.pos.y,
            pos.x - this.pos.x - this.anchorPoint.x + me.game.viewport.pos.x);
        var aim = this.aim;
        var PI = Math.PI;

        var pos = new me.Vector2d(this.pos.x, this.pos.y + 12);
        if((aim <= 0 && aim > -PI / 4) || (aim >= 0 && aim < PI / 4)) {
            this.setCurrentAnimation('lookRight');
            this.doUpdate = true;
            this.gunPos = new me.Vector2d(pos.x + 16, pos.y - 8);
        }else if(aim <= -PI / 4 && aim > -PI / 2) {
            this.setCurrentAnimation('lookUpRight');
            this.doUpdate = true;
            this.gunPos = new me.Vector2d(pos.x + 8, pos.y - 10);
        }else if(aim <= -PI / 2 && aim > -(3 * PI) / 4) {
            this.setCurrentAnimation('lookUpLeft');
            this.doUpdate = true;
            this.gunPos = new me.Vector2d(pos.x - 8, pos.y - 10);
        }else if((aim <= -(3 * PI) / 4 && aim > -PI) || (aim < PI && aim > (3 * PI) / 4)) {
            this.setCurrentAnimation('lookLeft');
            this.doUpdate = true;
            this.gunPos = new me.Vector2d(pos.x - 16, pos.y - 8);
        }else if(aim <= (3 * PI) / 4 && aim > PI / 2) {
            this.setCurrentAnimation('lookDownLeft');
            this.doUpdate = true;
            this.gunPos = new me.Vector2d(pos.x - 8, pos.y);
        }else{
            this.setCurrentAnimation('lookDownRight');
            this.doUpdate = true;
            this.gunPos = new me.Vector2d(pos.x + 8, pos.y);
        }
    },
    
    _fireWeapon: function()
    {
        //Fire mah lazer
        me.audio.play("pistol");

        //Create a bullet
        var bullet = new Bullet(
            this.pos.x + this.anchorPoint.x,
            this.pos.y + this.anchorPoint.y,  
            this.aim);
        me.game.add(bullet, this.z);

        //Create the gun flash
        me.game.add(new GunFlash(this.gunPos.x, this.gunPos.y), this.z + 1);
        me.game.sort();
    },

    _doDamage: function(damage)
    {
	me.audio.play("player_hit");
        this.health -= damage;
	
	    this.flicker(30);

	/*
        if(this.health <= 0)
        {
            this.setCurrentAnimation('die');
            this.alive = false;
	    setTimeout(function(){me.state.change(me.state.GAMEOVER)}, 2000)
        }
	*/

        //me.game.HUD.setItemValue('hudHealth', this.health / 100.0);
    },

    _doHealth: function(health)
    {
	me.audio.play("heal");
        this.health += health;

        //me.game.HUD.setItemValue('hudHealth', this.health / 100.0);
    }
});
