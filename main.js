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
    // Object tileset
    name: 'OBJ_TILESET',
    type: 'image',
    src: 'data/art/OBJ_TILESET.png'
}, {
    // Turf tileset
    name: 'TURF_TILESET',
    type: 'image',
    src: 'data/art/TURF_TILESET.png'
}, {
    // Mob tileset
    name: 'MOB_TILESET',
    type: 'image',
    src: 'data/art/MOB_TILESET.png'
}, {
    // Effects tileset
    name: 'EFFECTS_TILESET',
    type: 'image',
    src: 'data/art/EFFECTS_TILESET.png'
}, {
    // Colliders tileset
    name: 'COLLIDERS',
    type: 'image',
    src: 'data/art/COLLIDERS.png'
}, {
    // Level 1
    name: 'area01',
    type: 'tmx',
    src: 'data/aniTest.tmx'
    //src: 'data/testlevel.tmx'
}, {
    //Title screen image
    name: "title_screen",
    type: "image",
    src:  "data/art/title.png"
}
];


var jsApp        = 
{        
    /** Initialize the jsApp */
    onload: function()
    {
        // Init the video
        if (!me.video.init('jsapp', 448, 448, false, 1.0))
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
	//Set presenting screen
//	me.state.set(me.state.PRESENTS, new CreditScreen());
	
        //Set title screen state
        me.state.set(me.state.TITLE, new TitleScreen());

        // Set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());

	//Set end game screen
//	me.state.set(me.state.END, new EndScreen());

	//Set death screen
//	me.state.set (me.state.DEATH, new DeathScreen());
	
        // Add entities
        me.entityPool.add('player', Player);
        me.entityPool.add('table', Table);
        me.entityPool.add('computer', Computer);
        me.entityPool.add('chair', Chair);
        me.entityPool.add('chairchair', Chair);
        me.entityPool.add('vender', Vender);
        me.entityPool.add('watercooler', Watercooler);
        me.entityPool.add('health', Health);

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

	    //me.video.scale(me.video.getScreenFrameBuffer(), 0.5);
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

var CreditScreen = me.ScreenObject.extend(
{
    onResetEvent: function()
    {        
    
    },


    /** Action to perform when game is finished (state change) */
    onDestroyEvent: function()
    {
        
    }
});


var EndScreen = me.ScreenObject.extend(
{
    onResetEvent: function()
    {        
	
    },
    
    
    /** Action to perform when game is finished (state change) */
    onDestroyEvent: function()
    {
        
    }
});


var DeathScreen = me.ScreenObject.extend(
{
    onResetEvent: function()
    {        
     
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
