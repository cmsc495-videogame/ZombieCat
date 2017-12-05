/*
Team Zombie Cat
Dead Cat Game Engine

Author: William Kendall
 */

!function ($w, Utils, GraphicsManager, KeyboardManager, LogicManager, dcObject, dcLayer) {
    var _GraphicsManager = null;
    DeadCat.prototype.KeyboardManager = null;
    DeadCat.prototype.LogicManager = null;

    var _engine; //this reference
    var _map = null;    //this is the Tiled JSON object
    var _layers = null; //layers made of game layers loaded from the json
    var _gidInformation = null; //Gid of each tile (gid's are a tiled thing)

    var _gameSetup = null; //setup callback
    var _gameupdate = null; //update callback

    var _gameDelta = 0; //time delta for game update loops

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

    function getTilesetInformation(gid)
    {
        for (var ts = 0; ts < _map.tilesets.length; ts++) {
            if( _map.tilesets[ts].firstgid <= gid && (_map.tilesets[ts].tilecount + _map.tilesets[ts].firstgid) > gid )
            {
                return _map.tilesets[ts];
            }
        }
        throw new Error("Tile set not found for gid: " + gid);
    }

    function mapLoaded(rMap) {
        _map = rMap;

        console.log(_map); //for debugging reasons

        //load tilesets
        _GraphicsManager = new GraphicsManager(_map);
        for (var ts = 0; ts < _map.tilesets.length; ts++) {
            var tileset = _map.tilesets[ts];

            if (tileset.hasOwnProperty("tiles"))
                for (var tile in tileset.tiles) {
                    _gidInformation[parseInt(tile) + _map.tilesets[ts].firstgid] = tileset.tiles[tile];
                    _gidInformation[parseInt(tile) + _map.tilesets[ts].firstgid].firstgid = parseInt(_map.tilesets[ts].firstgid);
                }
        }


        //load layers
        var zIndex = 0; //zOrder of layer
        for (var lay = 0; lay < _map.layers.length; lay++) {
            var layer = _map.layers[lay];
            var newLayer = new dcLayer();
            newLayer.zIndex  = zIndex;
            if (layer.hasOwnProperty("properties"))
                newLayer.properties =  _engine.Utils.extend(newLayer.properties, layer.properties) ;
            if (layer.hasOwnProperty("name"))
                newLayer.name = layer.name;
                newLayer.visible = layer.visible;

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
                        newTile.gid = layer.data[layerY * layer.width + layerX];
                        var tileTileset = getTilesetInformation(newTile.gid);

                        newTile.x = posX;
                        newTile.y = posY;
                        if(tileTileset.tileheight > _map.tileheight)
                            newTile.y -= tileTileset.tileheight - _map.tileheight; // really not sure about position of larger than tile objects
                        newTile.width = tileTileset.tilewidth;//_map.tilewidth;
                        newTile.height = tileTileset.tileheight;//_map.tileheight;
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
                        newObj.properties =  _engine.Utils.extend(newObj.properties, obj.properties) ;
                    if (obj.hasOwnProperty("name"))
                        newObj.name = obj.name;
                    newObj.gid = obj.gid;
                    var objTileset = getTilesetInformation(newObj.gid);
                    newObj.visible = obj.visible;
                    newObj.x = obj.x;
                    //tiled documentation says the registration is offset by the image height
                    newObj.y = obj.y -obj.height;//- objTileset.tileheight; //tiled objects are reference from their bottom edge
                    newObj.width = obj.width; //objTileset.tilewidth;
                    newObj.height = obj.height;//objTileset.tileheight;
                    _engine.updateObject(newObj);
                    newLayer.addChild(newObj);
                }
            }

            //add new layer to layers array
            _layers.push(newLayer);
            zIndex ++;
        }

        _GraphicsManager.ticker = _update;   //graphics manager maintains the frame rate, thus, the game loop

    }

    var gml = false; //engine is setup flag

    function _update(delta) {
        if (delta > 2) delta = 0.5; //Stop player from jumping from one spot to another after lag

        if (_GraphicsManager.resourcesLoaded === false) {
            //wait until resources loaded
            return;
        }

        if (gml === false) {
            //setup
            //do for each layer in layers array
            for (var layer in _layers) {
                //bind all the textures to their objects
                _GraphicsManager.bindTextures(_layers[layer]);

                //build static layers ( no animation )
                if (_layers[layer].properties.static == true) {
                    //should remove the layer and add a texture for the hole layer
                    _layers[layer] = _GraphicsManager.spriteFromLayer(_layers[layer]);
                }

                _GraphicsManager.addChild(_layers[layer]);
            }

            //resort layers by zIndex
            _layers.sort(function(a,b){
               if(a.zIndex > b.zIndex) return -1;
               if(a.zIndex < b.zIndex) return 1;
               return 0;
            });

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
                gObject.animationTime += _gameDelta * 50;
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
//                _GraphicsManager.bindTexture(gObject, gObject.gid); //uncomment to return to original gid
            }

        DeadCat.prototype.setLoop = function (loop)
        {
            _gameupdate = loop;
        }

    };


    $w.DeadCat = DeadCat;

}(this, Utils, _DeadCat_GraphicsManager, _DeadCat_KeyboardManager, _DeadCat_LogicManager, _DeadCat_Object, _DeadCat_Layer);