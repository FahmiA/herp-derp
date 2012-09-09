/** Heads Up Display (HUD) */
var HUDHealth = me.HUD_Item.extend(
{
    init: function(x, y)
    {
        this.parent(x, y);


        this.icons = [];
        this.iconCount = 5;

        var image = me.loader.getImage('hud_health');
        for(var i = 0; i < this.iconCount; i++)
        {
            // 37 = sprite width (32) + gap (5)
            var newIcon = new me.SpriteObject(x + (i * 37), y, image, 32, 32);
            this.icons.push(newIcon);
        }
    },

    draw: function(context, x, y)
    {
        for(var i = 0; i < this.iconCount; i++)
        {
            this.icons[i].draw(context);
        }
    }
});
