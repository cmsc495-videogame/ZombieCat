/*
Team Zombie Cat
Dead Cat Game Engine

Author: William Kendall
 */

!function ($w, Utils, GraphicsManager, KeyboardManager, dcObject, dcLayer) {
    var _GraphicsManager = null;
    var _KeyboardManager = null;
    var _engine;
    var _map = null;
    var mapLayer = null;

    function DeadCat(mapFile) {
        _engine = this;
        _KeyboardManager = new KeyboardManager();
        _engine.Utils = new Utils();

        //TODO: test that the map was downloaded, or if an error (this is done by editing utils.js to return the error)
        _engine.Utils.loadJSON(mapFile, mapLoaded);
    }


    function mapLoaded(rMap) {
        _map = rMap;

        mapLayer = new dcLayer();

        console.log(_map); //for debugging reasons
        //TODO: create objects, load tilesets
        _GraphicsManager = new GraphicsManager(_map);

        //create object array
        _objects = [];

        //load layers
        for (var lay = 0; lay < _map.layers.length; lay++) {
            var layer = _map.layers[lay];
            if (layer.type == "tilelayer") {
                var posX = 0;
                var posY = 0;
                for (var layerY = 0; layerY < layer.height; layerY++) {
                    for (var layerX = 0; layerX < layer.width; layerX++) {
                        if (layer.data[layerY * layer.width + layerX] === 0) {
                            posX += _map.tilewidth;
                            continue; //gid of 0 is nothing
                        }
                        var newTile = new dcObject();
                        newTile.x = posX;
                        newTile.y = posY;
                        newTile.width = _map.tilewidth;
                        newTile.height = _map.tileheight;
                        newTile.gid = layer.data[layerY * layer.width + layerX];
                        mapLayer.addChild(newTile);

                        posX += _map.tilewidth;
                    }
                    posY += _map.tileheight;
                    posX = 0;
                }
            }
        }

        _GraphicsManager.ticker = update;

    }

    //TODO: this is a temp example
    var offx = 0;
    var offy = 0;
    var gml = false;
    var mapSprite = null;

    function update(delta) {
        if (_GraphicsManager.resourcesLoaded === false) {
            return;
        }
        if (gml === false) {
            _GraphicsManager.bindTextures(mapLayer);
            mapSprite = _GraphicsManager.spriteFromLayer(mapLayer);
            _GraphicsManager.addChild(mapSprite);
            gml = true;
        }

        var mvDelta = delta * 5;
        var moveX = 0;
        var moveY = 0;

        if (_KeyboardManager.keysPressed[87] == true)
            moveY += mvDelta;
        if (_KeyboardManager.keysPressed[83] == true)
            moveY -= mvDelta;
        if (_KeyboardManager.keysPressed[65] == true)
            moveX += mvDelta;
        if (_KeyboardManager.keysPressed[68] == true)
            moveX -= mvDelta;

        if (moveX != 0 && moveY != 0) {
            moveX = moveX / 1.5;
            moveY = moveY / 1.5;
        }
        mapSprite.y += moveY;
        mapSprite.x += moveX;

        //_GraphicsManager.update(_objects, offx, offy);
    }

    $w.DeadCat = DeadCat;

}(this, Utils, _DeadCat_GraphicsManager, _DeadCat_KeyboardManager, _DeadCat_Object, _DeadCat_Layer);