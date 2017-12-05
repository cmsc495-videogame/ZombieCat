/*
Team Zombie Cat
Dead Cat Game Engine - Game Objects

Author: William Kendall
*/

!function ($w, PIXI) {
    Layer.prototype = Object.create(PIXI.Container.prototype);
    Layer.prototype.constructor = Layer;

    Layer.prototype.texture = null;
    Layer.prototype.staticLayerChildren = null;

    Layer.prototype.name = "";
    Layer.prototype.properties = null;//loads from Tiled JSON file

    var _self = null;

    function Layer() {
        PIXI.Container.call(this);
        _self = this;
        this.staticLayerChildren = [];

        this.properties = {};
        this.properties.static = false;
        this.properties.gui = false;


    }




    $w._DeadCat_Layer = Layer;
}(this, PIXI);


!function ($w, PIXI) {
    gObject.prototype = Object.create(PIXI.Sprite.prototype);
    gObject.prototype.constructor = gObject;

    gObject.prototype.name = "";
    gObject.prototype.gid = 0; //set gid
    gObject.prototype.gidLast = 0; //changes in gid
    gObject.prototype.properties = null;

    gObject.prototype.visible = false;

    gObject.prototype.collision = null;


    gObject.prototype.animationFrame = -1;
    gObject.prototype.animationTime = 0;

    var _self;
    function gObject() {
        PIXI.Sprite.call(this);
        _self = this;
        //constructor

        this.collision = {};
        this.collision.hasCollision = false;
        this.collision.x = 0;
        this.collision.y = 0;
        this.collision.width = 0;
        this.collision.height = 0;

    }


    $w._DeadCat_Object = gObject;
}(this, PIXI);