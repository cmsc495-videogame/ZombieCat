/*
Team Zombie Cat
Dead Cat Game Engine

Author: William Kendall
 */

!function ($w, Utils, GraphicsManager, KeyboardManager, LogicManager, dcObject, dcLayer) {
    var _GraphicsManager = null;
    DeadCat.prototype.KeyboardManager = null;
    DeadCat.prototype.LogicManager = null;

    var _engine;
    var _map = null;    //this is the Tiled JSON object
    var _layers = null;
    var _gidInformation = null;

    var _gameSetup = null;
    var _gameupdate = null;

    var _gameDelta = 0;

    function DeadCat(mapFile, gameSetup, gameLoop) {
        _engine = this;
        _engine.Utils = new Utils();
        _engine.KeyboardManager = new KeyboardManager();

        _layers = [];
        _gidInformation = [];


        _gameSetup = gameSetup;
        _gameupdate = gameLoop;


        //TODO: test that the map was downloaded, or if an error (this is done by editing utils.js to return the error)
        _engine.Utils.loadJSON(mapFile, mapLoaded);

    }


    function mapLoaded(rMap) {
        _map = rMap;

        console.log(_map); //for debugging reasons

        //load tilesets
        _GraphicsManager = new GraphicsManager(_map);
        for (var ts = 0; ts < _map.tilesets.length; ts++) {
            var tileset = _map.tilesets[ts];

            if (tileset.hasOwnProperty("tiles"))
                for (tile in tileset.tiles) {
                    _gidInformation[parseInt(tile) + _map.tilesets[ts].firstgid] = tileset.tiles[tile];
                    _gidInformation[parseInt(tile) + _map.tilesets[ts].firstgid].firstgid = parseInt(_map.tilesets[ts].firstgid);
                }
        }


        //load layers
        for (var lay = 0; lay < _map.layers.length; lay++) {
            var layer = _map.layers[lay];
            var newLayer = new dcLayer();
            if (layer.hasOwnProperty("properties"))
                newLayer.properties = layer.properties;
            if (layer.hasOwnProperty("name"))
                newLayer.name = layer.name;

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
                        _engine.updateObject(newTile);
                        newLayer.addChild(newTile);

                        posX += _map.tilewidth;
                    }
                    posY += _map.tileheight;
                    posX = 0;
                }

            }
            else if (layer.type == "objectgroup") {
                for (var obji = 0; obji < layer.objects.length; obji++) {
                    var obj = layer.objects[obji];
                    var newObj = new dcObject();
                    if (obj.hasOwnProperty("properties"))
                        newObj.properties = obj.properties;
                    if (obj.hasOwnProperty("name"))
                        newObj.name = obj.name;
                    newObj.visible = obj.visible;
                    newObj.x = obj.x;
                    newObj.y = obj.y - obj.height; //tiled objects are reference from their bottom edge
                    newObj.width = obj.width;
                    newObj.height = obj.height;
                    newObj.gid = obj.gid;

                    _engine.updateObject(newObj);
                    newLayer.addChild(newObj);
                }
            }

            //and new layer to layers array
            _layers.push(newLayer);
        }

        _GraphicsManager.ticker = _update;   //graphics manager maintains the frame rate, thus, the game loop

    }

    var gml = false;

    function _update(delta) {
        if (delta > 2) delta = 0.5; //Stop player from jumping from one spot to another after lag

        if (_GraphicsManager.resourcesLoaded === false) {
            //wait until resources loaded
            return;
        }
        if (gml === false) {
            //setup

            //do for each layer in layers array
            for (layer in _layers) {
                //bind all the textures to their objects
                _GraphicsManager.bindTextures(_layers[layer]);

                //build static layers ( no animation )
                if (_layers[layer].properties.static == true) {
                    //should remove the layer and add a texture for the hole layer
                    _layers[layer] = _GraphicsManager.spriteFromLayer(_layers[layer]);
                    /*
                    //newSprite.properties.static = true;
                    newSprite.layer = _layers[layer];
                    _layers[layer] =new dcLayer();
                    _layers[layer].name = oldLayer.name;
                    _layers[layer].addChild( newSprite );
                    */
                    _GraphicsManager.addChild(_layers[layer]);
                }
                else {
                    _GraphicsManager.addChild(_layers[layer]);
                }
            }

            gml = true; //game all setup
            _engine.LogicManager = new LogicManager(_layers, _GraphicsManager);
            _gameSetup();

        }

        //begin game loop
        _gameDelta = delta;
        _engine.LogicManager.update(delta);
        _gameupdate(_engine, delta);

    }


    DeadCat.prototype.updateObject = function (gObject) {
        if (gObject.gid != gObject.gidLast) {
            gObject.gidLast = gObject.gid;
            if (_gidInformation[gObject.gid]) {//collision
                if (_gidInformation[gObject.gid].hasOwnProperty("objectgroup"))
                    if (_gidInformation[gObject.gid].objectgroup.hasOwnProperty("objects")) {
                        //only use first object
                        gObject.collision.width = _gidInformation[gObject.gid].objectgroup.objects[0].width;
                        gObject.collision.height = _gidInformation[gObject.gid].objectgroup.objects[0].height;
                        gObject.collision.x = _gidInformation[gObject.gid].objectgroup.objects[0].x;
                        gObject.collision.y = _gidInformation[gObject.gid].objectgroup.objects[0].y;
                        gObject.collision.hasCollision = true;
                    }
            }
        }
        //animation or set texture
        if (_gidInformation[gObject.gid])
            if (_gidInformation[gObject.gid].hasOwnProperty("animation")) {
                gObject.animationTime += _gameDelta * 100;
                if (gObject.animationFrame == -1 || gObject.animationTime >= _gidInformation[gObject.gid].animation[gObject.animationFrame].duration) {
                    gObject.animationTime = 0;
                    gObject.animationFrame += 1;
                    if (_gidInformation[gObject.gid].animation.length === gObject.animationFrame)
                        gObject.animationFrame = 0;

                    var aniId = _gidInformation[gObject.gid].animation[gObject.animationFrame].tileid + _gidInformation[gObject.gid].firstgid;
                    _GraphicsManager.bindTexture(gObject, aniId);
                }
            }
            else {
                gObject.animationFrame = -1; //disable
                gObject.animationTime = 0;
                _GraphicsManager.bindTexture(gObject, gObject.gid);
            }



    };


    $w.DeadCat = DeadCat;

}(this, Utils, _DeadCat_GraphicsManager, _DeadCat_KeyboardManager, _DeadCat_LogicManager, _DeadCat_Object, _DeadCat_Layer);