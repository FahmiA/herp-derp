/** Health */
var Health = me.CollectableEntity.extend(
{
    init: function(x, y, settings)
    {
        this.parent(x, y, settings);
        this.gravity = 0;

        this.healthPoints = 20;
    },

    update: function()
    {
        var res = me.game.collide(this);
        if(res && res.obj.type == 'player')
        {
            res.obj.onHit(this);
            me.game.remove(this);
        }

        return false;
    },
});
