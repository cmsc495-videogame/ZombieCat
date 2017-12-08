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
            if (!_layers[layer].properties.gui)
                _layers[layer].x = x;
        }
    };
    LogicManager.prototype.setMapY = function (y) {
        _mapY = y;
        for (layer in _layers) {
            if (!_layers[layer].properties.gui)
                _layers[layer].y = y;
        }
    };

    LogicManager.prototype.getWidth = function () {
        return _GraphicsManager.getWidth();
    };
    LogicManager.prototype.getHeight = function () {
        return _GraphicsManager.getHeight();
    };

    LogicManager.prototype.addGraphicsLayer = function (child) {
        _GraphicsManager.addChild(child);
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
                objects.push(layer.children[childObj]);
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


    LogicManager.prototype.positionAbsolute = function (obj, location) {
        //moves an object or layer to a position relative to the view window
        if (location == "center") {
            var movex = (_GraphicsManager.getWidth() - obj.width) / 2;
            var movey = (_GraphicsManager.getHeight() - obj.height) / 2;
            obj.x = movex;
            obj.y = movey;
            return;
        }
        if (location == "top-left") {
            obj.x = 0;
            obj.y = 0;
            return;
        }

    }

    LogicManager.prototype.centerObject = function (object) {
        //moves the map so that the object is at the center of the screen

        var movex = (_GraphicsManager.getWidth() - object.width) / 2;
        var movey = (_GraphicsManager.getHeight() - object.height) / 2;
        _self.setMapY(movey - object.y);
        _self.setMapX(movex - object.x);
    };

    LogicManager.prototype.update = function (delta) {
        //update x,y of static layers
    };

    LogicManager.prototype.moveToObject = function (object1, object2, amount) {
        //moves and object to another object

        //lerp is not constant, but does make for a cool effect
        //object1.x =  (1 - amount) * object1.x + amount * object2.x;
        //object1.y =  (1 - amount) * object1.y + amount * object2.y;

        //object1.position += (object2.position - object1.position).normalized * amount;

        //vector movement
        var sx = (object2.x + object2.collision.x + (object2.collision.width / 2)) - (object1.x + object1.collision.x + (object1.collision.width / 2));
        var sy = (object2.y + object2.collision.y + (object2.collision.height / 2)) - (object1.y + object1.collision.y + (object1.collision.height / 2));

        //distance
        var distance = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));

        if (distance === 0)
            return;

        //normal vector
        var inv = 1 / distance;
        sx *= inv;
        sy *= inv;

        object1.x += sx * amount;
        object1.y += sy * amount;
    }

    LogicManager.prototype.moveToObjectX = function (object1, object2, amount) {
        //moves and object to another object in horizontal direction


        //lerp is not constant, but does make for a cool effect
        //object1.x =  (1 - amount) * object1.x + amount * object2.x;
        //object1.y =  (1 - amount) * object1.y + amount * object2.y;

        //object1.position += (object2.position - object1.position).normalized * amount;

        //vector movement
        //var sx = (object2.x+(object2.width/2)) - (object1.x+(object1.width/2));
        //var sy = (object2.y+(object2.height/2)) - (object1.y+(object1.height/2));
        var sx = (object2.x + object2.collision.x + (object2.collision.width / 2)) - (object1.x + object1.collision.x + (object1.collision.width / 2));
        var sy = (object2.y + object2.collision.y + (object2.collision.height / 2)) - (object1.y + object1.collision.y + (object1.collision.height / 2));


        //distance
        var distance = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));

        if (distance === 0)
            return;

        var inv = 1 / distance;
        sx *= inv;

        object1.x += sx * amount;
    }

    LogicManager.prototype.moveToObjectY = function (object1, object2, amount) {
        //moves and object to another object in vertical direction

        //lerp is not constant, but does make for a cool effect
        //object1.x =  (1 - amount) * object1.x + amount * object2.x;
        //object1.y =  (1 - amount) * object1.y + amount * object2.y;

        //object1.position += (object2.position - object1.position).normalized * amount;

        //vector movement
        var sx = (object2.x + object2.collision.x + (object2.collision.width / 2)) - (object1.x + object1.collision.x + (object1.collision.width / 2));
        var sy = (object2.y + object2.collision.y + (object2.collision.height / 2)) - (object1.y + object1.collision.y + (object1.collision.height / 2));

        //distance
        var distance = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));

        if (distance === 0)
            return;

        //normal vector
        var inv = 1 / distance;
        sy *= inv;

        object1.y += sy * amount;
    }


    LogicManager.prototype.distance = function (object1, object2) {
        return Math.sqrt(Math.pow((object2.x + object2.collision.x + (object2.collision.width / 2)) - (object1.x + object1.collision.x + (object1.collision.width / 2)), 2) + Math.pow((object2.y + object2.collision.y + (object2.collision.height / 2)) - (object1.y + object1.collision.y + (object1.collision.height / 2)), 2))
    }

    //Returns angle between objects in degrees
    LogicManager.prototype.angle = function (object1, object2) {
        return Math.atan2((object2.x - object1.x), (object1.y - object2.y)) * 180 / Math.PI;
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
        if (layer.properties.static == true) {
            for (tile in layer.staticLayerChildren) {
                if (layer.staticLayerChildren[tile].collision.hasCollision) {
                    //not sure if this makes hittest any faster
                    //a gpu would be great at this
                    if (Math.sqrt(Math.pow(layer.staticLayerChildren[tile].x - obj.x, 2) + Math.pow(layer.staticLayerChildren[tile].y - obj.y, 2)) < (obj.width + layer.staticLayerChildren[tile].width) + ( obj.height + layer.staticLayerChildren[tile].height) * 1.5) ;
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
        }
        else {
            for (tile in layer.children) {
                if (layer.children[tile].collision.hasCollision) {
                    //not sure if this makes hittest any faster
                    //a gpu would be great at this
                    if (Math.sqrt(Math.pow(layer.children[tile].x - obj.x, 2) + Math.pow(layer.children[tile].y - obj.y, 2)) < (obj.width + layer.children[tile].width) + ( obj.height + layer.children[tile].height) * 1.5) ;
                    if ((obj.x + obj.collision.x) + obj.collision.width > (layer.children[tile].x + layer.children[tile].collision.x) &&
                        (obj.x + obj.collision.x) < (layer.children[tile].x + layer.children[tile].collision.x) + layer.children[tile].collision.width &&
                        (obj.y + obj.collision.y ) + obj.collision.height > (layer.children[tile].y + layer.children[tile].collision.y) &&
                        (obj.y + obj.collision.y ) < (layer.children[tile].y + layer.children[tile].collision.y) + layer.children[tile].collision.height == true) {
//                        if (_self.hitTest(obj, layer.children[tile]) == true) {
                        //console.log(layer.children[tile].collision);
                        return true;
                    }
                }
            }
        }
        return false;
    };

    LogicManager.prototype.yZOrder = function (layer) {
        layer.children.sort(function (a, b) {
            if (a.height + a.y > b.height + b.y) return 1;
            if (a.height + a.y < b.height + b.y) return -1;
            return 0;
        });
    };


    LogicManager.prototype.fitObjectToScreen = function (obj) {
        obj.x = 0;
        obj.y = 0;
        obj.width = _GraphicsManager.getWidth();
        obj.height = _GraphicsManager.getHeight();
    }

    LogicManager.prototype.lineOfSight = function(obj1, obj2, collisionLayer)
    {
        if(!obj1.collisionCenter)
            obj1.collisionCenter = {};
        obj1.collisionCenter.x =obj1.x + (obj1.collision.width/2)+obj1.collision.x;
        obj1.collisionCenter.y =obj1.y + (obj1.collision.height/2)+obj1.collision.y;
        if(!obj2.collisionCenter)
            obj2.collisionCenter = {};
        obj2.collisionCenter.x =obj2.x + (obj2.collision.width/2)+obj2.collision.x;
        obj2.collisionCenter.y =obj2.y + (obj2.collision.height/2)+obj2.collision.y;

        var x = 0.0;
        var x1 = 0.0;
        var x2 = 0.0;
        var y1 = 0.0;
        var y2 = 0.0;
        if (collisionLayer.properties.static == true) {
            for (tile in collisionLayer.staticLayerChildren) {
                if (collisionLayer.staticLayerChildren[tile].collision.hasCollision) {
                    x1 = (collisionLayer.staticLayerChildren[tile].x + collisionLayer.staticLayerChildren[tile].collision.x);
                    x2 = (collisionLayer.staticLayerChildren[tile].x + collisionLayer.staticLayerChildren[tile].collision.x +  collisionLayer.staticLayerChildren[tile].collision.width);
                    y1 = (collisionLayer.staticLayerChildren[tile].y + collisionLayer.staticLayerChildren[tile].collision.y);
                    y2 = (collisionLayer.staticLayerChildren[tile].y + collisionLayer.staticLayerChildren[tile].collision.y +  collisionLayer.staticLayerChildren[tile].collision.height);

                    if(lineIntersection(obj1.collisionCenter.x,obj1.collisionCenter.y, obj2.collisionCenter.x, obj2.collisionCenter.y, x1,y1,x2,y2))
                        return false;
                    if(lineIntersection(obj1.collisionCenter.x,obj1.collisionCenter.y, obj2.collisionCenter.x, obj2.collisionCenter.y, x1,y2,x2,y1))
                        return false;
                }
            }
        }
        else
        {
            for (tile in collisionLayer.children) {
                if (collisionLayer.children[tile].collision.hasCollision) {
                    x1 = (collisionLayer.children[tile].x + collisionLayer.children[tile].collision.x);
                    x2 = (collisionLayer.children[tile].x + collisionLayer.children[tile].collision.x +  collisionLayer.children[tile].collision.width);
                    y1 = (collisionLayer.children[tile].y + collisionLayer.children[tile].collision.y);
                    y2 = (collisionLayer.children[tile].y + collisionLayer.children[tile].collision.y +  collisionLayer.children[tile].collision.height);

                    if(lineIntersection(obj1.collisionCenter.x,obj1.collisionCenter.y, obj2.collisionCenter.x, obj2.collisionCenter.y, x1,y1,x2,y2))
                        return false;
                    if(lineIntersection(obj1.collisionCenter.x,obj1.collisionCenter.y, obj2.collisionCenter.x, obj2.collisionCenter.y, x1,y2,x2,y1))
                        return false;
                }
            }
        }
        return true;
    }

    function lineIntersection(x1,y1,x2,y2,x3,y3,x4,y4)
    {
        var rx = (x2-x1);
        var ry = (y2-y1);
        var sx = (x4-x3);
        var sy = (y4-y3);
        var t = cross2D(x3-x1,y3-y1,sx,sy) / cross2D(rx,ry,sx,sy);
        var u = cross2D(x3-x1,y3-y1,rx,ry) / cross2D(rx,ry,sx,sy);
       if(t >= 0 && t <= 1 && u >=0 && u <=1)
           return true;
       else
           return false;
    }

    function cross2D(x1,y1,x2,y2)
    {
        //2d cross product = A*B = A.x*B.y - A.y*B.x
        return ((x1*y2)-(y1*x2));
    }


    $w._DeadCat_LogicManager = LogicManager;
}(this, _DeadCat_Layer, _DeadCat_Object);