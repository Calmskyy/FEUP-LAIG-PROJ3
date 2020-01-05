var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filenames, scene) {
        this.loadedOk = null;

        this.pieceSelections = [false, false, false, false, false, false, false, false];
        this.tilePositions = [];
        this.positionsLoaded = false;
        this.updatePiecePositions = [false, false, false, false, false, false, false, false];
        this.piecePositions = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;
        this.filenames = filenames;

        this.nodes = [];
        this.idRoot = [];                   // The id of the root elements.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.themes = [];

        this.content = [];
        this.ambient = [];
        this.background = [];
        this.referenceLength;
        this.cameras = [];
        this.lights = [];
        this.textures = [];
        this.materials = [];
        this.transformations = [];
        this.animations = [];
        this.primitives = [];
        this.components = [];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        var i = 0;
        var sceneThemes = [];
        for (var key in filenames) {
            if (filenames.hasOwnProperty(key)) {
                var filename = filenames[key];
                this.reader.open('scenes/' + filename, this);
                this.content[key] = [];
                this.themes[i] = { name: key, XML: null };
                sceneThemes[i] = key;
                i++;
            }
        }
        this.scene.saveThemes(sceneThemes);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);
        for (let j = 0; j < this.themes.length; j++) {
            if (this.themes[j].XML == null) {
                this.themes[j].XML = this.content[this.themes[j].name];
                this.scene.addGraph(this.themes[j]);
            }
        }

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        if (this.scene.sceneInited == false)
            this.scene.initializeScene();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;
        var returnValue;
        var contentKey;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((returnValue = this.parseScene(nodes[index])) == "no root defined for scene")
                return returnValue;
            else
                contentKey = returnValue;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }

        this.content[contentKey]["length"] = this.referenceLength;
        this.content[contentKey]["ambient"] = this.ambient;
        this.content[contentKey]["background"] = this.background;
        this.content[contentKey]["cameras"] = this.cameras;
        this.content[contentKey]["lights"] = this.lights;
        this.content[contentKey]["textures"] = this.textures;
        this.content[contentKey]["materials"] = this.materials;
        this.content[contentKey]["transformations"] = this.transformations;
        this.content[contentKey]["animations"] = this.animations;
        this.content[contentKey]["primitives"] = this.primitives;
        this.content[contentKey]["components"] = this.components;
        this.referenceLength = null;
        this.ambient = [];
        this.background = [];
        this.cameras = [];
        this.lights = [];
        this.textures = [];
        this.materials = [];
        this.transformations = [];
        this.animations = [];
        this.primitives = [];
        this.components = [];
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        var contentKey = "no root defined for scene";
        for (var key in this.filenames) {
            var tempstr = key + '_root';
            if (root == tempstr) {
                this.idRoot[key] = root;
                contentKey = key;
                break;
            }
        }

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return contentKey;
    }

    /**
     * Parses the <view> block.
     * @param {view block element} viewNode
     */
    parsePerspectiveView(viewNode) {
        const id = this.reader.getString(viewNode, "id");
        const near = this.reader.getFloat(viewNode, "near");
        const far = this.reader.getFloat(viewNode, "far");
        const angle = this.reader.getFloat(viewNode, "angle") * DEGREE_TO_RAD;

        const fromCoords = this.parseCoordinates3D(viewNode.children[0]);
        const toCoords = this.parseCoordinates3D(viewNode.children[1]);

        const cam = {
            type: "perspective",
            id,
            near,
            far,
            angle,
            fromCoords,
            toCoords
        }

        // Checks for repeated IDs.
        if (this.cameras[id] != null)
            return "ID must be unique for each view (conflict: ID = " + id + ")";

        this.cameras[id] = cam;
    }

    /**
     * Parses the <view> block.
     * @param {view block element} viewNode
     */
    parseOrthoView(viewNode) {
        const id = this.reader.getString(viewNode, "id");
        const near = this.reader.getFloat(viewNode, "near");
        const far = this.reader.getFloat(viewNode, "far");
        const left = this.reader.getFloat(viewNode, "left");
        const right = this.reader.getFloat(viewNode, "right");
        const top = this.reader.getFloat(viewNode, "top");
        const bottom = this.reader.getFloat(viewNode, "bottom");

        const fromCoords = this.parseCoordinates3D(viewNode.children[0]);
        const toCoords = this.parseCoordinates3D(viewNode.children[1]);
        var upCoords;
        if (viewNode.children.length > 2) {
            upCoords = this.parseCoordinates3D(viewNode.children[2]);
        }
        else
            upCoords = [0, 1, 0];

        const cam = {
            type: "ortho",
            id,
            near,
            far,
            left,
            right,
            top,
            bottom,
            fromCoords,
            toCoords,
            upCoords
        }

        // Checks for repeated IDs.
        if (this.cameras[id] != null)
            return "ID must be unique for each view (conflict: ID = " + id + ")";

        this.cameras[id] = cam;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.reader.getString(viewsNode, "default");

        const views = viewsNode.children;

        for (let i = 0; i < views.length; i++) {
            if (views[i].nodeName == "perspective") {
                this.parsePerspectiveView(views[i]);
            }
            else if (views[i].nodeName == "ortho") {
                this.parseOrthoView(views[i]);
            }
        }

        this.log("Parsed Views");
        return null;
    }


    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");
        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 0;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            let attenuation = [];
            let attenuationIndex = nodeNames.indexOf("attenuation");
            if (attenuationIndex != -1) {
                attenuation = this.parseAttenuation(grandChildren[attenuationIndex], "light attenuation for ID" + lightId);
            }

            if (attenuation[0] == 0 && attenuation[1] == 0 && attenuation[2] == 0) {
                this.onXMLMinorError("light attenuation values undefined for ID = " + lightId);
                //using default attenuation
                attenuation[0] = 1;
                attenuation[1] = 0;
                attenuation[2] = 0;
            }


            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle') * DEGREE_TO_RAD;
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }


            global["attenuation"] = attenuation;
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <texture> block. 
     * @param {textures block element} textureNode
     */
    createTexture(textureNode) {

        const id = this.reader.getString(textureNode, 'id');
        const file = this.reader.getString(textureNode, 'file');

        // Checks for repeated IDs.
        if (this.textures[id] != null)
            return "ID must be unique for each texture (conflict: ID = " + id + ")";

        this.textures[id] = file;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        const textures = texturesNode.children;

        for (let i = 0; i < textures.length; i++) {
            this.createTexture(textures[i]);
        }

        this.log("Parsed Textures");
        return null;
    }



    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Continue here
            const emission = this.parseColor(children[i].children[0], "emission");
            const ambient = this.parseColor(children[i].children[1], "ambient");
            const diffuse = this.parseColor(children[i].children[2], "diffuse");
            const specular = this.parseColor(children[i].children[3], "specular");

            //create material
            let material = new CGFappearance(this.scene);
            material.setEmission(emission[0], emission[1], emission[2], emission[3]);
            material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            material.setSpecular(specular[0], specular[1], specular[2], specular[3]);

            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
        return null;
    }

    getAnimationTransformations(transformations, animationID, translates, rotates, scales) {

        for (var j = 0; j < transformations.length; j++) {
            switch (transformations[j].nodeName) {
                case 'translate':
                    translates.push(this.parseCoordinates3D(transformations[j], "translate transformation for ID " + animationID));
                    if (!Array.isArray(translates))
                        return translates;
                    break;
                case 'scale':
                    scales.push(this.parseCoordinates3D(transformations[j], "scale transformation for ID " + animationID));
                    if (!Array.isArray(scales))
                        return scales;
                    break;
                case 'rotate':
                    var angle_x = this.reader.getFloat(transformations[j], 'angle_x') * DEGREE_TO_RAD;
                    if (!(angle_x != null && !isNaN(angle_x)))
                        this.onXMLMinorError("Unable to parse angle_x from transformation");

                    var angle_y = this.reader.getFloat(transformations[j], 'angle_y') * DEGREE_TO_RAD;
                    if (!(angle_y != null && !isNaN(angle_y)))
                        this.onXMLMinorError("Unable to parse angle_y from transformation");

                    var angle_z = this.reader.getFloat(transformations[j], 'angle_z') * DEGREE_TO_RAD;
                    if (!(angle_z != null && !isNaN(angle_z)))
                        this.onXMLMinorError("Unable to parse angle_z from transformation");

                    var angles = [angle_x, angle_y, angle_z];
                    rotates.push(angles);
                    break;
            }
        }
    }

    calcTransfMatrix(transformations, transformationID) {
        var transfMatrix = mat4.create();

        for (var j = 0; j < transformations.length; j++) {
            switch (transformations[j].nodeName) {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(transformations[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'scale':
                    var coordinates = this.parseCoordinates3D(transformations[j], "scale transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'rotate':
                    var axis = this.reader.getString(transformations[j], 'axis');
                    if (axis == null)
                        this.onXMLMinorError("Unable to parse axis from transformation");

                    var angle = this.reader.getFloat(transformations[j], 'angle') * DEGREE_TO_RAD;
                    if (!(angle != null && !isNaN(angle)))
                        this.onXMLMinorError("Unable to parse axis from transformation");

                    switch (axis) {
                        case "x":
                            transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle)
                            break;
                        case "y":
                            transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle);
                            break;
                        case "z":
                            transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle);
                            break;
                    }
                    break;
            }
        }
        return transfMatrix;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            this.transformations[transformationID] = this.calcTransfMatrix(grandChildren, transformationID);
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        var grandChildren = [];
        var grandGrandChildren = [];
        var instants = [];

        for (var i = 0; i < children.length; i++) {
            instants = [];
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationId] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

            grandChildren = children[i].children;
            var translates = [];
            var rotates = [];
            var scales = [];

            if (grandChildren.length < 1)
                return "There must be at least one key frame per animation";

            for (var j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                    continue;
                }

                // Get id of the current animation.
                var instant = this.reader.getFloat(grandChildren[j], 'instant');
                if (instant == null)
                    return "no instant defined for keyframe";

                grandGrandChildren = grandChildren[j].children;

                this.getAnimationTransformations(grandGrandChildren, animationId, translates, rotates, scales);

                instants.push(instant);
            }

            var keyFrameAnimation = new KeyFrameAnimation(instants, translates, rotates, scales);
            this.animations[animationId] = keyFrameAnimation;
        }
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;
        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'plane' && grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'cylinder2')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, plane, patch or cylinder2)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                let triangle = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                this.primitives[primitiveId] = triangle;
            }
            else if (primitiveType == 'sphere') {
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                let sphere = new MySphere(this.scene, radius, slices, stacks);
                this.primitives[primitiveId] = sphere;
            }
            else if (primitiveType == 'torus') {
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                let torus = new MyTorus(this.scene, inner, outer, slices, loops);
                this.primitives[primitiveId] = torus;
            }
            else if (primitiveType == 'cylinder') {
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                let cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);
                this.primitives[primitiveId] = cylinder;
            }
            else if (primitiveType == 'cylinder2') {
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                let cylinder2 = new MyNurbsCylinder(this.scene, base, top, height, slices, stacks);
                this.primitives[primitiveId] = cylinder2;
            }
            else if (primitiveType == 'plane') {
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                let plane = new MyPlane(this.scene, npartsU, npartsV);
                this.primitives[primitiveId] = plane;
            }
            else if (primitiveType == 'patch') {
                var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
                if (!(npointsU != null && !isNaN(npointsU)))
                    return "unable to parse npointsU of the primitive coordinates for ID = " + primitiveId;

                var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
                if (!(npointsV != null && !isNaN(npointsV)))
                    return "unable to parse npointsV of the primitive coordinates for ID = " + primitiveId;

                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                var grandgrandChildren = grandChildren[0].children;
                var controlPointsU = new Array(npointsU);
                for (var u = 0; u < npointsU; u++) {
                    var controlPointsV = new Array(npointsV);
                    for (var v = 0; v < npointsV; v++) {
                        if (grandgrandChildren[v].nodeName != 'controlpoint')
                            return "tag <controlpoint> in patch is missing for ID = " + primitiveId;
                        var x = this.reader.getFloat(grandgrandChildren[u * npointsV + v], 'x');
                        if (!(x != null && !isNaN(x)))
                            return "unable to parse x of the primitive coordinates for ID = " + primitiveId;

                        var y = this.reader.getFloat(grandgrandChildren[u * npointsV + v], 'y');
                        if (!(y != null && !isNaN(y)))
                            return "unable to parse y of the primitive coordinates for ID = " + primitiveId;

                        var z = this.reader.getFloat(grandgrandChildren[u * npointsV + v], 'z');
                        if (!(z != null && !isNaN(z)))
                            return "unable to parse z of the primitive coordinates for ID = " + primitiveId;

                        var points = [x, y, z, 1];
                        controlPointsV[v] = points;
                    }
                    controlPointsU[u] = controlPointsV;
                }

                let patch = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPointsU);
                this.primitives[primitiveId] = patch;
            }
        }

        this.log("Parsed primitives");
        return null;
    }


    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            var componentTransform = mat4.create();
            var componentMaterials = [];
            var componentTexture = [];
            var componentAnimation = "noAnimation";
            var animationChecked = 0;

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var animationIndex = nodeNames.indexOf("animationref");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations
            if (transformationIndex == -1)
                return "tag <transformation> in component missing";
            else {
                if (transformationIndex != 0)
                    this.onXMLMinorError("tag <transformation> in component out of order " + transformationIndex);

                grandgrandChildren = grandChildren[transformationIndex].children;

                if (grandgrandChildren[transformationIndex] != null) {
                    if (grandgrandChildren[transformationIndex].nodeName == "transformationref") {
                        // Get id of the component transformation.
                        var transformationID = this.reader.getString(grandgrandChildren[transformationIndex], 'id');
                        if (transformationID == null)
                            return "no ID defined for transformation on component";

                        componentTransform = this.transformations[transformationID];
                    }
                    else {
                        componentTransform = this.calcTransfMatrix(grandgrandChildren, transformationID);
                    }
                }
            }

            // Animations
            if (animationIndex != -1) {
                if (animationIndex != 1)
                    this.onXMLMinorError("tag <animationref> in component out of order " + animationIndex);

                // Get id of the component animation.
                var animationID = this.reader.getString(grandChildren[animationIndex], 'id');
                if (animationID == null)
                    return "no ID defined for animation on component";

                componentAnimation = this.animations[animationID];
                animationChecked = 1;
            }

            // Materials

            if (materialsIndex == -1)
                return "tag <materials> in component missing";
            else {
                if (materialsIndex != (1 + animationChecked))
                    this.onXMLMinorError("tag <materials> in component out of order " + materialsIndex);

                grandgrandChildren = grandChildren[materialsIndex].children;

                for (var j = 0; j < grandgrandChildren.length; j++) {
                    if (grandgrandChildren[j].nodeName != "material") {
                        this.onXMLMinorError("unknown tag <" + grandgrandChildren[j].nodeName + ">");
                        continue;
                    }

                    // Get id of the component material.
                    var materialID = this.reader.getString(grandgrandChildren[j], 'id');
                    if (materialID == null)
                        return "no ID defined for material on component";

                    if (materialID == "inherit")
                        componentMaterials[j] = "inherit";
                    else
                        componentMaterials[j] = this.materials[materialID];
                }

            }

            // Texture
            if (textureIndex == -1)
                return "tag <texture> in component missing";
            else {
                if (textureIndex != (2 + animationChecked))
                    this.onXMLMinorError("tag <texture> in component out of order " + textureIndex);

                // Get id of the component texture.
                var textureID = this.reader.getString(grandChildren[textureIndex], 'id');
                if (textureID == null)
                    return "no ID defined for texture on component";

                if (textureID == "none")
                    componentTexture[0] = "none";
                else if (textureID == "inherit")
                    componentTexture[0] = "inherit";
                else {
                    componentTexture[0] = new CGFtexture(this.scene, this.textures[textureID]);

                    var length_s = this.reader.getString(grandChildren[textureIndex], 'length_s');
                    if (length_s == null)
                        this.onXMLMinorError("no length_s defined for texture on component, assuming default 1");

                    var length_t = this.reader.getString(grandChildren[textureIndex], 'length_t');
                    if (length_t == null)
                        this.onXMLMinorError("no length_s defined for texture on component, assuming default 1");

                    if (length_s == null)
                        componentTexture[1] = 1;
                    else
                        componentTexture[1] = length_s;
                    if (length_t == null)
                        componentTexture[2] = 1;
                    else
                        componentTexture[2] = length_t;
                }
            }

            // Children
            if (childrenIndex == -1)
                return "tag <children> in component missing";
            else {
                if (childrenIndex != (3 + animationChecked))
                    this.onXMLMinorError("tag <children> in component out of order " + childrenIndex);

                grandgrandChildren = grandChildren[childrenIndex].children;

                var componentChildren = [];
                for (var j = 0; j < grandgrandChildren.length; j++) {
                    if (grandgrandChildren[j].nodeName != "primitiveref" && grandgrandChildren[j].nodeName != "componentref") {
                        this.onXMLMinorError("unknown tag <" + grandgrandChildren[j].nodeName + ">");
                        continue;
                    }

                    // Get id of the component children.
                    var childrenID = this.reader.getString(grandgrandChildren[j], 'id');
                    if (childrenID == null)
                        return "no ID defined for children on component";

                    componentChildren[j] = childrenID;
                }

            }

            var componentDetails = [];
            componentDetails["transformations"] = componentTransform;
            componentDetails["materials"] = componentMaterials;
            componentDetails["texture"] = componentTexture;
            componentDetails["children"] = componentChildren;
            componentDetails["animation"] = componentAnimation;
            this.components[componentID] = componentDetails;
        }
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Parse the attenuation components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseAttenuation(node, messageError) {
        var attenuation = [];

        // constant
        var constant = this.reader.getFloat(node, 'constant');
        if (!(constant != null && !isNaN(constant) && constant >= 0 && constant <= 1))
            return "unable to parse constant component of the " + messageError;

        // linear
        var linear = this.reader.getFloat(node, 'linear');
        if (!(linear != null && !isNaN(linear) && linear >= 0 && linear <= 1))
            return "unable to parse linear component of the " + messageError;

        // quadratic
        var quadratic = this.reader.getFloat(node, 'quadratic');
        if (!(quadratic != null && !isNaN(quadratic) && quadratic >= 0 && quadratic <= 1))
            return "unable to parse quadratic component of the " + messageError;


        attenuation.push(...[constant, linear, quadratic]);

        return attenuation;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Generate animation from a given piece to a given board spot.
     * @param pieceID The piece that is being moved.
     * @param tileID The tile that the piece is going to be moved to.
     * @param theme Theme currently in use.
     */
    generateAnimation(pieceID, tileID, theme) {
        var tileLocation = this.tilePositions[tileID - 1];
        var pieceLocation = this.piecePositions[pieceID + 24];
        var translation = [];
        translation[0] = 5 / pieceLocation[5];
        translation[1] = (tileLocation[1] - pieceLocation[1] + 0.35) / pieceLocation[4];
        translation[2] = (tileLocation[2] - pieceLocation[2] - 0.35) / pieceLocation[3];
        var pieceAnimation = new PieceAnimation(translation);
        this.themes[theme].XML.components['piece' + pieceID]["animation"] = pieceAnimation;
        this.themes[theme].XML.animations['movement' + pieceID] = pieceAnimation;
        return pieceAnimation;
    }

    /** 
     * Repositions all the pieces back to their starting position.
     * @param theme Theme currently in use.
     */
    repositionPieces(theme) {
        for (var j = 1; j < 9; j++) {
            this.themes[theme].XML.components['piece' + j]["animation"] = "noAnimation";
            delete this.themes[theme].XML.animations['movement' + j];
            this.themes[theme].XML.components['piece' + j]["transformations"][13] = 1;
            this.themes[theme].XML.components['piece' + j]["transformations"][14] = 0.05;
            this.piecePositions[j - 1] = [0, 0];
            this.updatePiecePositions[j - 1] = true;
            if (j <= 4)
                this.themes[theme].XML.components['piece' + j]["transformations"][12] = j;
            else
                this.themes[theme].XML.components['piece' + j]["transformations"][12] = j - 4;
        }
    }

    /** 
     * Gets the three translation and scaling values from a transformation matrix.
     * @param matrix Transformation matrix to get the values from
     */
    obtainTranslationScalingValues(matrix) {
        var values = [matrix[12], matrix[13], matrix[14], matrix[2], matrix[5], matrix[8]];
        return values;
    }


    /**
     * Parses the Graph correspondent to the scene.
     * @param XML Specific XML being used.
     * @param nodeID ID of the node being currently parsed.
     * @param matrix Transformation matrix that was passed by the parent node.
     * @param material Material that was passed by the parent node.
     * @param texture Texture that was passed by the parent node.
     * @param length_s - Scale factor of the texture in the s direction passed by the parent node.
     * @param length_t - Scale factor of the texture in the t direction	passed by the parent node.
     */
    processNode(XML, nodeID, matrix, material, texture, length_s, length_t) {
        //if is component
        if (XML.primitives[nodeID] === undefined) {
            var newMatrix = mat4.create();
            newMatrix = mat4.multiply(newMatrix, matrix, XML.components[nodeID]["transformations"]);
            var children = XML.components[nodeID]["children"];

            if (XML.components[nodeID]["animation"] != "noAnimation")
                newMatrix = mat4.multiply(newMatrix, newMatrix, XML.components[nodeID]["animation"].apply());

            var materials = XML.components[nodeID]["materials"];
            var currentMaterial;
            var piecestr = nodeID.substring(0, 5);
            var piecestr2 = nodeID.substring(5);
            if (this.positionsLoaded == false) {
                var tilestr = nodeID.substring(0, 4);
                var tilestr2 = nodeID.substring(4);
                if (piecestr == "piece") {
                    this.piecePositions[parseInt(piecestr2) + 24] = this.obtainTranslationScalingValues(newMatrix);
                }
                else if (tilestr == "tile") {
                    this.tilePositions[parseInt(tilestr2) - 1] = this.obtainTranslationScalingValues(newMatrix);
                }
            }
            if (piecestr == "piece") {
                if (this.updatePiecePositions[parseInt(piecestr2) - 1] == true) {
                    if (XML.components[nodeID]["animation"] != "noAnimation") {
                        var translation = XML.components[nodeID]["animation"].getFinalTranslation();
                        XML.components[nodeID]["transformations"][12] += translation[0] * XML.components[nodeID]["transformations"][0];
                        XML.components[nodeID]["transformations"][13] += translation[1] * XML.components[nodeID]["transformations"][5];
                        XML.components[nodeID]["transformations"][14] += translation[2] * XML.components[nodeID]["transformations"][10];
                        XML.components[nodeID]["animation"] = "noAnimation";
                    }
                    this.piecePositions[parseInt(piecestr2) + 24] = this.obtainTranslationScalingValues(newMatrix);
                    this.updatePiecePositions[parseInt(piecestr2) - 1] = false;
                }
                if (this.pieceSelections[parseInt(piecestr2) - 1] == true)
                    currentMaterial = materials[1];
                else
                    currentMaterial = materials[0];
            }
            else {
                var currentMaterial = materials[0];
                if (currentMaterial == "inherit")
                    currentMaterial = material;
            }

            var textureDetails = XML.components[nodeID]["texture"];
            var currentTexture = textureDetails[0];
            var current_length_s = 0;
            var current_length_t = 0;
            if (currentTexture != "none" && currentTexture != "inherit") {
                current_length_s = textureDetails[1];
                current_length_t = textureDetails[2];
            }
            else if (currentTexture == "inherit") {
                currentTexture = texture;
                current_length_s = length_s;
                current_length_t = length_t;
            }

            for (var i = 0; i < children.length; i++) {
                this.scene.pushMatrix();

                this.processNode(XML, children[i], newMatrix, currentMaterial, currentTexture, current_length_s, current_length_t);

                this.scene.popMatrix();
            }
        }
        //if is primitive
        else {
            var tempstr = nodeID.substring(0, 5);
            var tilestr = nodeID.substring(0, 4);
            if (tempstr == "piece") {
                this.scene.registerForPick(this.pickIndex++, XML.primitives[nodeID]);
            }
            else if (tilestr == "tile") {
                this.scene.registerForPick(this.pickIndex++, XML.primitives[nodeID]);
            }
            this.scene.multMatrix(matrix);
            if (texture == "none")
                material.setTexture(null);
            else {
                material.setTexture(texture);
                XML.primitives[nodeID].updateTexCoords(length_s, length_t);
            }
            material.apply();
            XML.primitives[nodeID].display();
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.pickIndex = 1;
        var index = this.scene.selectedTheme;
        var rootTexture = this.themes[index].XML.components[this.idRoot[this.themes[index].name]]["texture"];
        var rootMaterial = this.themes[index].XML.components[this.idRoot[this.themes[index].name]]["materials"][0];
        this.processNode(this.themes[index].XML, this.idRoot[this.themes[index].name], mat4.create(), rootMaterial, rootTexture);
        this.positionsLoaded = true;
    }
}