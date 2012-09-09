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
    // HUD health icon
    name: 'hud_health',
    type: 'image',
    src: 'data/ui/HP.png'
}, {
    // Level 1
    name: 'area01',
    type: 'tmx',
    //src: 'data/aniTest.tmx'
    src: 'data/floor1.tmx'
}, {
    //Presents screen image
    name: "presents_screen",
    type: "image",
    src:  "data/art/title2.png"
}, {
    //Title screen image
    name: "title_screen",
    type: "image",
    src:  "data/art/title.png"
}, {
    //Game over screen image
    name: "gameover_screen",
    type: "image",
    src:  "data/art/gameover.png"
}, {
    //Victory screen image
    name: "victory_screen",
    type: "image",
    src:  "data/art/victoryscreen.png"
}, {
    //Level 1 screen image
    name: "level_screen",
    type: "image",
    src:  "data/art/levelstartscreen.png"
},{
    name: "computer_timer", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "elevator", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "enemy_hit", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "heal", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "pistol", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "player_hit", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "powerup", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "table_step", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "vender_explosion", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "vender_fire", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "watercooler_bloop", type: "audio", src: "data/sfx/", channel: 1
}, {
    name: "intro", type: "audio", src: "data/sfx/mus/", channel: 2
}, {
    name: "main", type: "audio", src: "data/sfx/mus/", channel: 2
}
];

var windowSize = 448;

var jsApp = 
{        
    /** Initialize the jsApp */
    onload: function()
    {
        // Init the video
        if (!me.video.init('jsapp', windowSize, windowSize, false, 1.0))
        {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }

        // Initialize the background audio
        me.audio.init("ogg");

        // Set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // Set all resources to be loaded
        me.loader.preload(g_resources);

        // Load everything & display a loading screen
        me.state.change(me.state.LOADING);

        //me.debug.renderHitBox = true;
    },


    /** Callback when everything is loaded. */
    loaded: function ()
    {	
        // Set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());

	//Set end game screen
	me.state.set(me.state.SCORE, new VictoryScreen());

	//Set death screen
	me.state.set(me.state.GAMEOVER, new DeathScreen());
	
	//Set title screen state
   	me.state.set(me.state.MENU, new TitleScreen());


        // Add entities
        me.entityPool.add('player', Player);
        me.entityPool.add('table', Table);
        me.entityPool.add('computer', Computer);
        me.entityPool.add('chair', Chair);
        me.entityPool.add('chairchair', Chair);
        me.entityPool.add('vender', Vender);
        me.entityPool.add('watercooler', Watercooler);
        me.entityPool.add('health', Health);

        me.entityPool.add('paperbin', DumObject);
        me.entityPool.add('d', DumObject);

        // Start the game 
        me.state.change(me.state.MENU);
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
	    
	    this.screen = 0;

	    me.audio.playTrack("intro");
        },
        
        onResetEvent: function()
        {
            this.background = me.loader.getImage("presents_screen");
            
            //Bind enter key
            me.input.bindKey(me.input.KEY.ENTER, "enter", true);
            me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);
        },
        
        update: function()
        {
            //Check if enter has been pressed
            if (me.input.isKeyPressed('enter'))
            {
		if(this.screen == 0)
		    this.background = me.loader.getImage("title_screen");
		else if(this.screen == 1)
		    this.background = me.loader.getImage("level_screen");
		else
                    me.state.change(me.state.PLAY);

		this.screen++;
            }
            return true;
        },

        draw : function(context)
        {
            context.drawImage(this.background, 0,0); 
        },

        onDestroyEvent: function()
        {
            //Destroy the audio
	    me.audio.stopTrack();

	    this.screen = 0;

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


        me.game.addHUD(0, 0, windowSize, 32);
        me.game.HUD.addItem('hudHealth', new HUDHealth(me.game.viewport.pos.x,
                                                      me.game.viewport.pos.y));

        // Make sure everything is in the right order
        me.game.sort();

	    me.audio.playTrack("main");
    },


    /** Action to perform when game is finished (state change) */
    onDestroyEvent: function()
    {
        me.game.disableHUD();
	    me.audio.stopTrack();
    }
});

var VictoryScreen = me.ScreenObject.extend(
{
    init: function()
        {
            this.parent(true);
            this.background = null;
        },
        
        onResetEvent: function()
        {
            this.background = me.loader.getImage("victory_screen");
            
            //Bind enter key
            me.input.bindKey(me.input.KEY.ENTER, "enter", true);
            me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);
        },
        
        update: function()
        {
            //Check if enter has been pressed
            if (me.input.isKeyPressed('enter'))
            {
                me.state.change(me.state.MENU);
            }
            return true;
        },

        draw : function(context)
        {
            context.drawImage(this.background, 0,0); 
        },

        onDestroyEvent: function()
        {
            //Unbind enter key
            me.input.unbindKey(me.input.KEY.ENTER);
            me.input.unbindMouse(me.input.mouse.LEFT);
        }
});


var DeathScreen = me.ScreenObject.extend(
    {
	init: function()
        {
            this.parent(true);
            this.deathground = null;
        },
        
        onResetEvent: function()
        {
            this.deathground = me.loader.getImage("gameover_screen");
            
            //Bind enter key
            me.input.bindKey(me.input.KEY.ENTER, "enter", true);
            me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);
        },
        
        update: function()
        {
            //Check if enter has been pressed
            if (me.input.isKeyPressed('enter'))
            {
                me.state.change(me.state.MENU);
            }
            return true;
        },

        draw : function(context)
        {
            context.drawImage(this.deathground, 0,0); 
        },

        onDestroyEvent: function()
        {
            //Unbind enter key
            me.input.unbindKey(me.input.KEY.ENTER);
            me.input.unbindMouse(me.input.mouse.LEFT);
        }
});

//bootstrap :)
window.onReady(function() 
{
    jsApp.onload();
});
