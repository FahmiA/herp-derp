/** Player */
var Player = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
	this.map = new me.Vector2d(settings.x, settings.y);
        this.collidable = true;
        this.type = 'player';

        this.anchorPoint = new me.Vector2d(this.width/2, this.height/2);
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(1.5, 1.5);
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
        this.setCurrentAnimation('lookRight');

        // Adjust the bounding box
        this.updateColRect(5, 22, 5, 22);

        // Set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
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

        //Check player controls
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
        }
                
        return this.doUpdate;
    },

    onHit: function(obj)
    {
	if(!this.alive)
	    return;	

	switch (obj.name)
	{
	case "soda":
	    //TODO SOUND
	    this._doDamage(obj.damage);
	    break;
	case "chair":
	    //TODO SOUND
	    this._doDamage(obj.damage);
	    break;
	case "table":
	    //TODO SOUND
	    this._doDamage(obj.damage);
	    break;
	case "explosion":
	    //TODO SOUND
	    this._doDamage(obj.damage);
	    break;
	default:
	    return;
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

        if((aim <= 0 && aim > -PI / 4) || (aim >= 0 && aim < PI / 4)) {
            this.setCurrentAnimation('lookRight');
            this.doUpdate = true;
        }else if(aim <= -PI / 4 && aim > -PI / 2) {
            this.setCurrentAnimation('lookUpRight');
            this.doUpdate = true;
        }else if(aim <= -PI / 2 && aim > -(3 * PI) / 4) {
            this.setCurrentAnimation('lookUpLeft');
            this.doUpdate = true;
        }else if((aim <= -(3 * PI) / 4 && aim > -PI) || (aim < PI && aim > (3 * PI) / 4)) {
            this.setCurrentAnimation('lookLeft');
            this.doUpdate = true;
        }else if(aim <= (3 * PI) / 4 && aim > PI / 2) {
            this.setCurrentAnimation('lookDownLeft');
            this.doUpdate = true;
        }else{
            this.setCurrentAnimation('lookDownRight');
            this.doUpdate = true;
        }
    },
    
    _fireWeapon: function()
    {
        //Fire mah lazer
        //TODO SOUND

        //Create a bullet
	var bullet = new Bullet(
	    this.pos.x + this.anchorPoint.x,
	    this.pos.y + this.anchorPoint.y,  
	    this.aim);
	me.game.add(bullet, this.z);
	me.game.sort();
    },

    _doDamage: function(damage)
    {
	console.log("You take " + damage + " damage.");
	//this.health -= damage;

	if(this.health <= 0)
	{
	    console.log("Death stalks you...")
	    this.alive = false;
	}
	
	//TODO update animations
    }
});
