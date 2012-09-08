/** Player */
var Player = me.ObjectEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
        this.collidable = true;
        
        // Set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);
        this.gravity = 0; // 0 as this is a top-down, not a platformer

	this.aim = 0;

	//Bind keys
        me.input.bindKey(me.input.KEY.LEFT, 'left');
        me.input.bindKey(me.input.KEY.RIGHT, 'right');
        me.input.bindKey(me.input.KEY.UP, 'up');
        me.input.bindKey(me.input.KEY.DOWN, 'down');

	me.input.bindKey(me.input.KEY.SPACE, 'shoot', true);
	me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);

        // Adjust the bounding box
	this.updateColRect(5, 22, 5, 22);

        // Set the display to follow our position on both axis
	me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },

    update: function()
    {
        if(!this.alive)
        {
            this.parent(this);
            return true;
        }

        var horzMovement = 1;
        var vertMovement = 0;

        // Player movement
        if(me.input.isKeyPressed('left'))
        {
            this.vel.x -= this.accel.x * me.timer.tick;
            this.vel.y = 0;
        }else if(me.input.isKeyPressed('right')) {
            this.vel.x += this.accel.x * me.timer.tick;
            this.vel.y = 0;
        }else if(me.input.isKeyPressed('up')) {
            this.vel.y -= this.accel.y * me.timer.tick;
            this.vel.x = 0;
        }else if(me.input.isKeyPressed('down')) {
            this.vel.y += this.accel.y * me.timer.tick;
            this.vel.x = 0;
        }else{
            this.vel.x = 0;
            this.vel.y = 0;
        }

	// Notify of player movement
        this.updateMovement();

	//Player shooting
	if(me.input.isKeyPressed('shoot'))
	{
	    this.fireWeapon();    
	}
	
	//Update the aim towards the screen
	this.updateAim(me.input.mouse.pos);

        //this.vel.x = Math.cos(Math.PI/2 * horzMovement) * this.accel.x * me.timer.tick;
        //this.vel.y = Math.sin(Math.Pi/2 * vertMovement) * this.accel.x * me.timer.tick;

        return true;
    },

    onCollision: function(res, obj)
    {
	//console.log("Thwack");
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

    updateAim: function(pos)
    {
	//Do math to convert player position and mouse pos
	this.aim = Math.atan2(pos.y - this.pos.y, pos.x - this.pos.x);
    },
    
    fireWeapon: function()
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
