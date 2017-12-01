/*
Team Zombie Cat
Dead Cat Game Engine - Game Logic

Author: William Kendall
*/

!function ($w, dcLayer, dcObject) {

    var _GraphicsManager; //needed to get the width and height of the screen (centering sprites and what not)

    var _layers = null;
    var _mapX = 0;
    var _mapY = 0;

    var _self = null;

    function LogicManager(layers, GraphicsManager) {
        _layers = layers;
        _GraphicsManager = GraphicsManager;
        this.setMapX(0);
        this.setMapY(0);
        _self = this;
    }

    LogicManager.prototype.getMapX = function () {
        return _mapX;
    };
    LogicManager.prototype.getMapY = function () {
        return _mapY;
    };
    LogicManager.prototype.setMapX = function (x) {
        _mapX = x;
        for (layer in _layers) {
            _layers[layer].x = x;
        }
    };
    LogicManager.prototype.setMapY = function (y) {
        _mapY = y;
        for (layer in _layers) {
            _layers[layer].y = y;
        }
    };

    LogicManager.prototype.getWidth = function () {
        return _GraphicsManager.getWidth();
    };
    LogicManager.prototype.getHeight = function () {
        return _GraphicsManager.getHeight();
    };


    LogicManager.prototype.getObjectByNameInLayer = function (layer, name) {
        for (childObj in layer.children) {
            if (layer.children[childObj].name == name)
                return layer.children[childObj];
        }
        return null;
    };

    LogicManager.prototype.getObjectsByNameInLayer = function (layer, name) {
        var objects = [];
        for (childObj in layer.children) {
            if (layer.children[childObj].name == name)
                objects.push( layer.children[childObj] );
        }
        return objects;
    };

    LogicManager.prototype.getLayerByName = function (name) {
        for (layer in _layers) {
            if (_layers[layer].name == name)
                return _layers[layer];
        }
        return null;
    };


    LogicManager.prototype.centerObject = function (object) {
        var movex = (_GraphicsManager.getWidth() - object.width) / 2;
        var movey = (_GraphicsManager.getHeight() - object.height) / 2;
        _self.setMapY(movey - object.y);
        _self.setMapX(movex - object.x);
    };

    LogicManager.prototype.update = function (delta) {
        //update x,y of static layers
    };

    LogicManager.prototype.moveToObject = function (object1, object2, amount) {
        //lerp is not constant, but does make for a cool effect
        //object1.x =  (1 - amount) * object1.x + amount * object2.x;
        //object1.y =  (1 - amount) * object1.y + amount * object2.y;

        //object1.position += (object2.position - object1.position).normalized * amount;

        //vector movement
        var sx = (object2.x+object2.collision.x+(object2.collision.width/2)) - (object1.x+object1.collision.x+(object1.collision.width/2));
        var sy = (object2.y+object2.collision.y+(object2.collision.height/2)) - (object1.y+object1.collision.y+(object1.collision.height/2));

        //distance
        var distance = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));

        if( distance === 0)
            return;

        //normal vector
        var inv = 1 / distance;
        sx *= inv;
        sy *= inv;

        object1.x += sx * amount;
        object1.y += sy * amount;
    }

    LogicManager.prototype.moveToObjectX = function (object1, object2, amount) {
        //lerp is not constant, but does make for a cool effect
        //object1.x =  (1 - amount) * object1.x + amount * object2.x;
        //object1.y =  (1 - amount) * object1.y + amount * object2.y;

        //object1.position += (object2.position - object1.position).normalized * amount;

        //vector movement
        //var sx = (object2.x+(object2.width/2)) - (object1.x+(object1.width/2));
        //var sy = (object2.y+(object2.height/2)) - (object1.y+(object1.height/2));
        var sx = (object2.x+object2.collision.x+(object2.collision.width/2)) - (object1.x+object1.collision.x+(object1.collision.width/2));
        var sy = (object2.y+object2.collision.y+(object2.collision.height/2)) - (object1.y+object1.collision.y+(object1.collision.height/2));


        //distance
        var distance = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));

        if( distance === 0)
            return;

        var inv = 1 / distance;
        sx *= inv;

        object1.x += sx * amount;
    }

    LogicManager.prototype.moveToObjectY = function (object1, object2, amount) {
        //lerp is not constant, but does make for a cool effect
        //object1.x =  (1 - amount) * object1.x + amount * object2.x;
        //object1.y =  (1 - amount) * object1.y + amount * object2.y;

        //object1.position += (object2.position - object1.position).normalized * amount;

        //vector movement
        var sx = (object2.x+object2.collision.x+(object2.collision.width/2)) - (object1.x+object1.collision.x+(object1.collision.width/2));
        var sy = (object2.y+object2.collision.y+(object2.collision.height/2)) - (object1.y+object1.collision.y+(object1.collision.height/2));

        //distance
        var distance = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));

        if( distance === 0)
            return;

        //normal vector
        var inv = 1 / distance;
        sy *= inv;

        object1.y += sy * amount;
    }




    LogicManager.prototype.hitTest = function (object1, object2) {
        //hit test between two objects
        //this is slow
        return (object1.x + object1.collision.x) + object1.collision.width > (object2.x + object2.collision.x) &&
            (object1.x + object1.collision.x) < (object2.x + object2.collision.x) + object2.collision.width &&
            (object1.y + object1.collision.y ) + object1.collision.height > (object2.y + object2.collision.y) &&
            (object1.y + object1.collision.y ) < (object2.y + object2.collision.y) + object2.collision.height;
    };

    LogicManager.prototype.hitTestLayer = function (obj, layer) {
        //hit test between an object and a layer
        var objs = [];
        if (layer.properties.static == true)
            for (tile in layer.staticLayerChildren) {
                if (layer.staticLayerChildren[tile].collision.hasCollision) {
                    //not sure if this makes hittest any faster
                    //a gpu would be great at this
                    if (Math.sqrt(Math.pow(layer.staticLayerChildren[tile].x - obj.x, 2) + Math.pow(layer.staticLayerChildren[tile].y - obj.y, 2)) < (obj.width+layer.staticLayerChildren[tile].width) +( obj.height + layer.staticLayerChildren[tile].height) * 1.5);
                        if ((obj.x + obj.collision.x) + obj.collision.width > (layer.staticLayerChildren[tile].x + layer.staticLayerChildren[tile].collision.x) &&
                            (obj.x + obj.collision.x) < (layer.staticLayerChildren[tile].x + layer.staticLayerChildren[tile].collision.x) + layer.staticLayerChildren[tile].collision.width &&
                            (obj.y + obj.collision.y ) + obj.collision.height > (layer.staticLayerChildren[tile].y + layer.staticLayerChildren[tile].collision.y) &&
                            (obj.y + obj.collision.y ) < (layer.staticLayerChildren[tile].y + layer.staticLayerChildren[tile].collision.y) + layer.staticLayerChildren[tile].collision.height == true) {
//                        if (_self.hitTest(obj, layer.staticLayerChildren[tile]) == true) {
                            //console.log(layer.staticLayerChildren[tile].collision);
                            return true;
                        }
                }
            }
        return false;
    };

    $w._DeadCat_LogicManager = LogicManager;
}(this, _DeadCat_Layer, _DeadCat_Object);