/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [];


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
    },


    /** Callback when everything is loaded. */
    loaded: function ()
    {
        // Set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());

        // Start the game 
        me.state.change(me.state.PLAY);
    }

}; // jsApp

/* The in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{
    onResetEvent: function()
    {	
        // Stuff to reset on state change
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
