/** Heads Up Display (HUD) */
var HUDHealth = me.HUD_Item.extend(
{
    init: function()
    {
        this.parent(0, 0);

        this.healthPercent = 1.0;
        this.iconCount = 5;
        this.value = 1;
        
        var image = me.loader.getImage('hud_health');
        this.icon = new me.SpriteObject(0, 0, image, 32, 32);
    },

    update: function()
    {
        this.parent(this);
        return true;
    },

    draw: function(context)
    {
        // Get the number of icons to show
        var iconsToShow = this._getIconsLeft();
        if(iconsToShow < 1 && this.value > 0.001)
            iconsToShow = 1;

        // Draw the number of icons required
        for(var i = 0; i < iconsToShow; i++)
        {
            // Update the position of the icon to stay on the screen
            this.icon.pos.x = me.game.viewport.pos.x + (i * 37);
            this.icon.pos.y = me.game.viewport.pos.y;

            // Draw the icon
            this.icon.draw(context);
        }
    },

    _getIconsLeft: function()
    {
        // Clamp the percentage
        var percentage = this.value;
        percentage = Math.max(0.0, percentage);
        percentage = Math.min(1.0, percentage);

        return percentage * this.iconCount;
    }
});
