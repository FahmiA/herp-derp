/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [
{
    // Level tileset
    name: 'groundTiles',
    type: 'image',
    src: 'data/groundTiles.png'
}, {
    // Character tileset
    name: 'characterTiles',
    type: 'image',
    src: 'data/characterTiles.png'
}, {
    // Level 1
    name: 'area01',
    type: 'tmx',
    src: 'data/area01.tmx'
}, {
	name: "title_screen",
	type: "image",
	src:  "data/art/title.png"
}
];


var jsApp	= 
{	
    /** Initialize the jsApp */
    onload: function()
    {

        // Init the video
        if (!me.video.init('jsapp', 832, 832, false, 1.0))
        {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }

        // Initialize the background audio
        //me.audio.init("mp3,ogg");

        // Set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // Set all resources to be loaded
        me.loader.preload(g_resources);

        // Load everything & display a loading screen
        me.state.change(me.state.LOADING);

        me.debug.renderHitBox = true;
    },


    /** Callback when everything is loaded. */
    loaded: function ()
    {
	// Set title screen state
	me.state.set(me.state.TITLE, new TitleScreen());

        // Set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());

        // Add entities
        me.entityPool.add('player', Player);

        // Start the game 
        me.state.change(me.state.TITLE);
    }

}; // jsApp

/*
 * Game state screens
 */
var TitleScreen = me.ScreenObject.extend(
    {
	init: function()
	{
	    this.parent(true);
	    this.background = null;
	},
	
	onResetEvent: function()
	{
	    this.background = me.loader.getImage("title_screen");
	    
	    //Bind enter key
	    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
	    me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);
	},
	
	update: function()
	{
	    //Check if enter has been pressed
	    if (me.input.isKeyPressed('enter'))
	    {
		me.state.change(me.state.PLAY);
	    }
	    return true;
	},

	draw : function(context)
	{
	    context.drawImage(this.background, 0,0);	
	},

	onDestroyEvent: function()
	{
	    //Destroy the image

	    //Unbind enter key
	    me.input.unbindKey(me.input.KEY.ENTER);
	    me.input.unbindMouse(me.input.mouse.LEFT);
	}
    });

/* The in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{
    onResetEvent: function()
    {	
        // Load a level
        me.levelDirector.loadLevel('area01');

        // Make sure everything is in the right order
        me.game.sort();
    },


    /** Action to perform when game is finished (state change) */
    onDestroyEvent: function()
    {
	
    }
});


//bootstrap :)
window.onReady(function() 
{
    jsApp.onload();
});
