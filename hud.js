/** Heads Up Display (HUD) */
var HUDHealth = me.HUD_Item.extend(
{
    init: function(x, y)
    {
        this.parent(x, y);

        this.icon = me.loader.getImage('donut');
    },

    draw: function(context, x, y)
    {
        context.drawImage(this.icon, this.pos.x + x, this.pos.y + y);
    }
});
