/*
Team Zombie Cat
Dead Cat Game Engine - Graphics (PIXI)

Author: William Kendall
*/

!function ($w, PIXI, dcObject, dcLayer) {
    var _self = null; //this reference
    var _application = null; //pixi application
    var _map; //reference to the json map
    var _textures = []; //textures

    GraphicsManager.prototype.resourcesLoaded = false;

    function GraphicsManager(map) {
        //TODO: make setup functions non-static by taking in the setup options

        _self = this;
        _map = map;


        //Test browser surface
        var pixiSurfaceType = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            pixiSurfaceType = "Canvas";
        }
        PIXI.utils.sayHello(pixiSurfaceType);

        //setup the pixi renderer
        var renderingOptions = {
            transparent: false,
            backgroundColor: '0x000000',
            antialias: false,
            resolution: $w.devicePixelRatio
        };

        _application = new PIXI.Application(800, 600, renderingOptions);
        $w.document.getElementById('display').appendChild(_application.view);
        //todo: check this function
        _application.ticker.speed = .5; //30 fps? maybe?

        //fullscreen
        //_application.renderer.view.style.width = 800;
        //_application.renderer.view.style.height = 600;
        var ratio = Math.min($w.innerWidth/800, $w.innerHeight/600);
        _application.renderer.resize(Math.ceil(800 * ratio), Math.ceil(600 * ratio));
        _application.stage.scale.x = _application.stage.scale.y = ratio;
        $w.addEventListener("resize", function() {
            var ratio = Math.min($w.innerWidth/800, $w.innerHeight/600);
            _application.renderer.resize(Math.ceil(800 * ratio), Math.ceil(600 * ratio));
            _application.stage.scale.x = _application.stage.scale.y = ratio;
        });


        //load image(s)
        var imagesLocation = "maps/"; //TODO: fix static assets location
        for (var ts = 0; ts < _map.tilesets.length; ts++) {
            //loader: resource name, resource location
            PIXI.loader.add(_map.tilesets[ts].image, imagesLocation + _map.tilesets[ts].image);
        }
        PIXI.loader.load(imagesLoaded);
    }

    function imagesLoaded() {
        //PIXI callback from loading images
        //this function takes the images and slices them into a "gid" indexed array

        //build textures array. gid indexed
        for (var ts = 0; ts < _map.tilesets.length; ts++) {
            var tileset = _map.tilesets[ts];
            var gid = tileset.firstgid;
            var width = tileset.columns ;
            var height = (tileset.tilecount / tileset.columns);
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    _textures[gid] = new PIXI.Texture(PIXI.loader.resources[tileset.image].texture,
                        new PIXI.Rectangle(x * tileset.tilewidth, y * tileset.tileheight, tileset.tilewidth, tileset.tileheight));
                    //_textures[gid].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; //prevents texture bleeding
                    gid++;
                }
            }
        }


        _self.resourcesLoaded = true;
        _application.ticker.add(_self.ticker);
        //_application()
    }

    GraphicsManager.prototype.bindTextures = function (layer) {
        //set the texture of all sprites in a layer
        for (var i = 0; i < layer.children.length; i++) {
            var obj = layer.children[i];
            if (obj.gid != 0 && obj.visible == true) {
                obj.texture = _textures[obj.gid];
            }
        }
    };

    GraphicsManager.prototype.bindTexture = function (gObject, gid) {
        if (gid != 0 && gObject.visible == true)
            gObject.texture = _textures[gid];
    };

    GraphicsManager.prototype.spriteFromLayer = function (layer) {
        //returns a layer with one sprite from a layer of many sprites

        //slow
        //this function takes a container and makes a sprite from it.
        //rendering is MUCH faster using only one texture
        //also solves texture bleeding
        var layerBounds = layer.getBounds();
        var brt = new PIXI.BaseRenderTexture(layerBounds.x + layerBounds.width, layerBounds.y + layerBounds.height);
        var rt = new PIXI.RenderTexture(brt);
        _application.renderer.render(layer, rt);
        var sprite = new dcObject();
        sprite.texture = rt;
        while (layer.children[0]) {
            layer.staticLayerChildren.push(layer.children[0]);
            layer.removeChild(layer.children[0]);
        }
        layer.addChild(sprite);
        return layer;
    };

    GraphicsManager.prototype.getWidth = function () {
        //returns the virtual width
       return _application.renderer.width / _application.stage.scale.x;
    };
    GraphicsManager.prototype.getHeight = function () {
        //returns the virtual height
        return _application.renderer.height / _application.stage.scale.y;
    };

    GraphicsManager.prototype.addChild = function (child) {
        _application.stage.addChild(child);
    };
/*
    GraphicsManager.prototype.removeChild = function (child) {
        _application.stage.removeChild(child);
    };
*/
    GraphicsManager.prototype.ticker = function (delta) {
        console.log("GE ticker");
    };

    GraphicsManager.prototype.destroy= function () {
        //PIXI.destroy();

        for(var key in _textures) {
            _textures[key].destroy();
            _textures[key] = null;
        }
        _textures = [];
        _map = null;

        for( var key in PIXI.loader.resources)
        {
            PIXI.loader.resources[key].texture.destroy();
        }
        PIXI.loader.resources = [];
        $w.document.getElementById('display').removeChild(_application.view);
        _application.stage.destroy(true);
        _application.destroy(false);
        _application = null;
        while(PIXI.utils.TextureCache.length > 0)
        {
            PIXI.utils.TextureCache[0].destroy(true);
            PIXI.utils.TextureCache.remove(0);
        }


    }


    $w._DeadCat_GraphicsManager = GraphicsManager;
}(this, PIXI, _DeadCat_Object, _DeadCat_Layer);