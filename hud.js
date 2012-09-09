/** Heads Up Display (HUD) */
var HUDHealth = me.HUD_Item.extend(
{
    init: function(x, y)
    {
        this.parent(x, y);


        this.healthPercent = 1.0;
        this.icons = [];
        this.iconCount = 5;
        this.value = 1
        
        var image = me.loader.getImage('hud_health');
        for(var i = 0; i < this.iconCount; i++)
        {
            // 37 = sprite width (32) + gap (5)
            var newIcon = new me.SpriteObject(x + (i * 37), y, image, 32, 32);
            this.icons.push(newIcon);
        }
    },

    update: function()
    {
        this.parent(this);
        return true;
    },

    draw: function(context)
    {
        var iconsToShow = this._getIconsLeft();
        if(iconsToShow < 1 && this.value > 0)
            iconsToShow = 1;
        for(var i = 0; i < iconsToShow; i++)
        {
            this.icons[i].draw(context);
        }
    },

    _getIconsLeft: function()
    {
        // Clamp the percentage
        var percentage = this.value;
        percentage = Math.max(0.0, percentage);
        percentage = Math.min(1.0, percentage);

        console.log("Printing ", percentage * this.iconCount);
        return percentage * this.iconCount;
    }
});
