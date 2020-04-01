function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight * 0.96);
}

function DiamondSquare(n, terrain, roughness, topT, bottomT, leftT, rightT) {
    var dim = Math.pow(2, n) + 1;
    if(topT != null){
      for(var i = 0; i < dim; i++){
        terrain[0][i] = topT[dim-1][i];
      }
    }
    if(bottomT != null){
      for(var i = 0; i < dim; i++){
        terrain[dim-1][i] = bottomT[0][i];
      }
    }
    if(leftT != null){
      for(var i = 0; i < dim; i++){
        terrain[i][0] = leftT[i][dim-1];
      }
    }
    if(rightT != null){
      for(var i = 0; i < dim; i++){
        terrain[i][dim-1] = rightT[i][0];
      }
    }



    var numsquares = 1;
    for (var i = Math.pow(2, n); i > 1; i /= 2) {
        console.log("start steps with pace: " + i);
        //Diamond Step
        for (var j = 0; j < numsquares; j++) {
            for (var k = 0; k < numsquares; k++) {
                terrain[(i / 2) + j * i][(i / 2) + k * i] = (terrain[i * j][i * k] + terrain[i * (j + 1)][i * k] + terrain[i * j][i * (k + 1)] + terrain[i * (j + 1)][i * (k + 1)]) / 4 + rand(i * roughness);
            }
        }
        console.log("end of Diamond Step");
        //Square Step part 1
        for (var j = 0; j < numsquares + 1; j++) {
            for (var k = 0; k < numsquares; k++) {
                var r = j * i;
                var c = i / 2 + k * i;
                if (r == 0) {
                    if(topT == null){
                      terrain[r][c] = (terrain[r][c - i / 2] + terrain[r + i / 2][c] + terrain[r][c + i / 2]) / 3 + rand(i * roughness);
                    }
                }
                else if (r == Math.pow(2, n)) {
                    if(bottomT == null){
                      terrain[r][c] = (terrain[r - i / 2][c] + terrain[r][c - i / 2] + terrain[r][c + i / 2]) / 3 + rand(i * roughness);
                    }
                }
                else {
                    terrain[r][c] = (terrain[r - i / 2][c] + terrain[r][c - i / 2] + terrain[r + i / 2][c] + terrain[r][c + i / 2]) / 4 + rand(i * roughness);
                }
            }
        }
        console.log("end of Square Step");
        //Square Step part 2
        for (var j = 0; j < numsquares; j++) {
            for (var k = 0; k < numsquares + 1; k++) {
                var r = i / 2 + j * i;
                var c = k * i;
                if (c == 0) {
                    if(leftT == null){
                      terrain[r][c] = (terrain[r - i / 2][c] + terrain[r + i / 2][c] + terrain[r][c + i / 2]) / 3 + rand(i * roughness);
                    }
                }
                else if (c == Math.pow(2, n)) {
                    if(rightT == null){
                      terrain[r][c] = (terrain[r - i / 2][c] + terrain[r][c - i / 2] + terrain[r + i / 2][c]) / 3 + rand(i * roughness);
                    }
                }
                else {
                    terrain[r][c] = (terrain[r - i / 2][c] + terrain[r][c - i / 2] + terrain[r + i / 2][c] + terrain[r][c + i / 2]) / 4 + rand(i * roughness);
                }
            }
        }
        numsquares *= 2;
    }
    /*
    //DEBUG
    console.log(" ");
    console.log("Table completed, results: ");
    for (var i = 0; i < dim; i++) {
        var row = "";
        for (var z = 0; z < dim; z++) {
            row += Math.round(terrain[i][z] * 100) / 100 + " ";
        }
        console.log(row);
    }
    */

}

function getMax(array) {
    var max = -Infinity;
    for (var i = 0; i < array.length; i++) {
        var m = Math.max.apply(null, array[i]);
        if (m > max) {
            max = m;
        }
    }
    return max;
}

function getMin(array) {
    var min = Infinity;
    for (var i = 0; i < array.length; i++) {
        var m = Math.min.apply(null, array[i]);
        if (m < min) {
            min = m;
        }
    }
    return min;
}

function rotate(array2d){
    var newGrid = [];
    newGrid.length = array2d.length;
    rowLength = array2d[0].length;

    for(var i=0; i < array2d.length; i++){
      newGrid[i] = [];
    }

    for(var i=0; i< array2d.length; i++){
      for(var j=0; j< array2d.length; j++){
        var newJ = rowLength - i - 1;
        var newI = j;
        newGrid[newI][newJ] = array2d[i][j];
      }
    }

    for (var i = 0; i < newGrid.length; i++)
    {
      //console.log(newGrid[i])
    }
    return newGrid
}

function modelSphere(sphere, terrains, roughness, order){
    //var order = [4,5,1,0,2,3];
    var order =order || [0,1,3,2,4,5];
    var dim = terrains[0].length
    var index = 0;

    //right
    for (var i = 0; i < dim; i++) {
        for (var j = 0; j < dim; j++) {
            var v = sphere.vertices[index];
            var w = (new THREE.Vector3()).copy(v);
            v.add(w.normalize().multiplyScalar(terrains[order[0]][i][j]*roughness));
            index++;

        }
    }

    //left
    for (var i = 0; i < dim; i++) {
        for (var j = 0; j < dim; j++) {
          var v = sphere.vertices[index];
          var w = (new THREE.Vector3()).copy(v);
          v.add(w.normalize().multiplyScalar(terrains[order[1]][i][j]*roughness));
          index++;
        }
    }

    //up
    for (var i = 0; i < dim; i++) {
        for (var j = 1; j < dim-1; j++) {
          var v = sphere.vertices[index];
          var w = (new THREE.Vector3()).copy(v);
          v.add(w.normalize().multiplyScalar(terrains[order[2]][i][j]*roughness));
          index++;
        }
    }

    //down
    for (var i = 0; i < dim; i++) {
        for (var j = 1; j < dim-1; j++) {
          var v = sphere.vertices[index];
          var w = (new THREE.Vector3()).copy(v);
          v.add(w.normalize().multiplyScalar(terrains[order[3]][i][j]*roughness));
          index++;
        }
    }

    //forward
    for (var i = 1; i < dim-1; i++) {
        for (var j = 1; j < dim-1; j++) {
          var v = sphere.vertices[index];
          var w = (new THREE.Vector3()).copy(v);
          v.add(w.normalize().multiplyScalar(terrains[order[4]][i][j]*roughness));
          index++;
        }
    }

    //backward
    for (var i = 1; i < dim-1; i++) {
        for (var j = 1; j < dim-1; j++) {
          var v = sphere.vertices[index];
          var w = (new THREE.Vector3()).copy(v);
          v.add(w.normalize().multiplyScalar(terrains[order[5]][i][j]*roughness));
          index++;
        }
    }
}

function CubeTerrain(n, roughness){
    //init sides
    var dim = Math.pow(2, n) + 1;
    var terrains = [];
    for (var k = 0; k< 6; k++){
      terrains[k]=[];
      for (var i = 0; i < dim; i++) {
          terrains[k][i] = [];
          for (var j = 0; j < dim; j++) {
              terrains[k][i][j] = 0;
          }
      }
      terrains[k][0][0] = rand(20);
      terrains[k][dim - 1][dim - 1] = rand(20);
      terrains[k][dim - 1][0] = rand(20);
      terrains[k][0][dim - 1] = rand(20);
    }

    //down
    DiamondSquare(n, terrains[0], roughness)
    //up
    DiamondSquare(n, terrains[1], roughness)
    //forward
    DiamondSquare(n, terrains[2], roughness, terrains[1], terrains[0], null, null)
    //backward
    DiamondSquare(n, terrains[3], roughness, rotate(rotate(terrains[1])), rotate(rotate(terrains[0])), null, null)
    //right
    DiamondSquare(n, terrains[4], roughness, rotate(terrains[1]), rotate(rotate(rotate(terrains[0]))), terrains[2], terrains[3])
    //left
    DiamondSquare(n, terrains[5], roughness, rotate(rotate(rotate(terrains[1]))), rotate(terrains[0]), terrains[3], terrains[2])

    normalize(terrains);


   return terrains;
}

function normalize(terrains){
var dim = terrains[0].length;
var range = - Infinity;
for(var k = 0; k< terrains.length; k++){
    var max = Math.abs(getMax(terrains[k]));
    var min = Math.abs(getMin(terrains[k]));
    var r = max > min ? max : min;
    if (r > range){ range = r}
}
for(var k = 0; k< terrains.length; k++){
    for (var i = 0; i < dim; i++) {
        for (var j = 0; j < dim; j++) {
            terrains[k][i][j] /=range;
        }
    }
}

}

function rand(step) {
    var randomValue = (Math.random() - 0.5) * step;
    return randomValue;
}

function deg2rad (deg) {
    return Math.PI / 180 * deg;
}

function getCoords(x, y) {
    theta   = deg2rad(x / 512 * 360 - 180);
    phi     = deg2rad(y / 256 * 180 - 90);
    rho = 0.2;
    _x = rho * Math.cos(phi) * Math.cos(theta);
    _y = rho * Math.cos(phi) * Math.sin(theta);
    _z = rho * Math.sin(phi);                        // z is 'up'
    return [_x, _y, _z];
}

function fbm(octaves) {
    var	noise = Noise.perlin3D;
    return function (x, y, z, t) {
        frequency = 1;
        amplitude = 1;
        persistence = 0.7;
        lacunarity = 6;
        var total = 0;
        for(var i = 0; i < octaves; i++) {
            total += noise (x * frequency, y * frequency, z * frequency, t * frequency) * amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        return total;
    }
}

function Elevation(vertX, vertY, vertZ) {
    distance = Math.sqrt(Math.pow(vertX, 2) + Math.pow(vertY, 2) + Math.pow(vertZ, 2));
    return distance;
}

function generateTerrain(){

    var n = 6;
    var raughness = 0.8;
    var geometry = new THREE.BoxGeometry (1, 1, 1, 64, 64, 64);

    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
        var vertex = geometry.vertices[ i ];
        vertex.normalize().multiplyScalar( 5 );
    }

    var terrains = CubeTerrain(n, raughness);
    modelSphere(geometry, terrains, raughness, [4,5,1,0,2,3]);
    geometry.normalsNeedUpdate = true;
    return geometry;
}

function assignVertexColors(geometry, shallowDeep, desertGrass, grassMountain, mountainSnow, deepColor, desertColor, grassColor, mountainColor, snowColor){
    var faceIndices = [ 'a', 'b', 'c' ];

    for ( var i = 0; i < geometry.faces.length; i ++ ) {
        var face = geometry.faces[ i ];

        for(var j = 0; j < 3; j++){
            var vertID = face[faceIndices[j]];
            var vertex = geometry.vertices[vertID];
            var elevation = Elevation(vertex.x, vertex.y, vertex.z);
            if (elevation <= shallowDeep){
                var color = new THREE.Color( deepColor );
                face.vertexColors[ j ] = (color);
            }
            else if(elevation <= desertGrass){
                var color = new THREE.Color( desertColor );
                face.vertexColors[ j ] = (color);
            }
            else if(elevation <= grassMountain){
                var color = new THREE.Color( grassColor );
                face.vertexColors[ j ] = (color);
            }
            else if(elevation <= mountainSnow){
                var color = new THREE.Color( mountainColor );
                face.vertexColors[ j ] = (color);
            }
            else{
                var color = new THREE.Color( snowColor );
                face.vertexColors[ j ] = (color);
            }
            if(elevation > highestPeak) {
                highestPeak = elevation;
            }
            if(elevation < lowestValley) {
                lowestValley = elevation;
            }
        }
    }
    terrain.geometry.elementsNeedUpdate = true;
    terrain.geometry.colorsNeedUpdate = true;
    //terrain.material.needsUpdate = true;
}

function terrainMaterial(geometry, shallowDeep, desertGrass, grassMountain, mountainSnow, deepColor, desertColor, grassColor, mountainColor, snowColor){
    var gradientMaterial = new THREE.MeshLambertMaterial({vertexColors : THREE.VertexColors});


    highestPeak = 0;
    lowestValley = 25;

    var faceIndices = [ 'a', 'b', 'c' ];

    for ( var i = 0; i < geometry.faces.length; i ++ ) {
        var face = geometry.faces[ i ];

        for(var j = 0; j < 3; j++){
            var vertID = face[faceIndices[j]];
            var vertex = geometry.vertices[vertID];
            var elevation = Elevation(vertex.x, vertex.y, vertex.z);
            if (elevation <= shallowDeep){
                var color = new THREE.Color( deepColor );
                face.vertexColors[ j ] = (color);
            }
            else if(elevation <= desertGrass){
                var color = new THREE.Color( desertColor );
                face.vertexColors[ j ] = color;
            }
            else if(elevation <= grassMountain){
                var color = new THREE.Color( grassColor );
                face.vertexColors[ j ] = color;
            }
            else if(elevation <= mountainSnow){
                var color = new THREE.Color( mountainColor );
                face.vertexColors[ j ] = color;
            }
            else{
                var color = new THREE.Color( snowColor );
                face.vertexColors[ j ] = color;
            }
            if(elevation > highestPeak) {
                highestPeak = elevation;
            }
            if(elevation < lowestValley) {
                lowestValley = elevation;
            }
        }
    }
    //assignVertexColors(geometry, desertGrass, grassMountain, mountainSnow, desertColor, grassColor, mountainColor, snowColor)

    return gradientMaterial;
}

function makeDefaultTerrain(){
    var shallowDeep = 5;
    var desertGrass = 5.22;
    var grassMountain = 5.3;
    var mountainSnow = 5.4;
    var deepColor = 0x000080;
    var desertColor = 0xf4d03f;
    var grassColor = 0x00cc00;
    var mountainColor = 0x505050;
    var snowColor = 0xffffff;
    defaultTerrain = new makeTerrain(shallowDeep, desertGrass, grassMountain, mountainSnow, deepColor, desertColor, grassColor, mountainColor, snowColor);
    return defaultTerrain;
}

function makeTerrain(shallowDeep, desertGrass, grassMountain, mountainSnow, deepColor, desertColor, grassColor, mountainColor, snowColor){

    var geometry = new generateTerrain();
    var material = new terrainMaterial(geometry, shallowDeep, desertGrass, grassMountain, mountainSnow, deepColor, desertColor, grassColor, mountainColor, snowColor);
    var sphere = new THREE.Mesh(geometry, material);
    geometry.computeVertexNormals();
    return sphere;
}

function formData(){
    if(confirm("Generate new terrain? (this will delete any cities currently on planet)")){
        seed = document.getElementById("seed").value;
        console.log(seed)
        if(seed == ''){
            seed = randomSeed();
        }
        text2.innerHTML = seed;
        var rng = Math.seedrandom(seed.toString());
        newTerrain = makeTerrain(parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color);
        planet.remove(terrain);
        terrain = newTerrain;
        planet.add(terrain);
    }
}

function randomHexColor(){
    randomColor = '0x' + Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}

function randomSeed(){
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var stringLength = 30;
	var randomstring = '';
	for (var i = 0; i < stringLength; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / (window.innerHeight * 0.96) ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(dots);
    if(intersects.length > 0){
        intersects[0].object.material.color = new THREE.Color(0xff0000);
    }
    else{
        for(i = 0; i < dots.length; i++){
            dots[i].material.color = new THREE.Color(0x000000)
        }
    }
}

function onDocumentMouseDown( event ) {
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(terrain.children);

    switch ( event.button ) {
        case 0: // left
        if(intersects.length > 0){
            if(confirm("Go to " + intersects[0].object.name + "?")){
                console.log("clicked link");
            }
        }
        break;
        case 1: // middle
        break;
        case 2: // right
        if(intersects.length > 0){
            if(confirm("Delete "+ intersects[0].object.name + "?")){
                dotPosition = dots.map(function(d) { return d.id; }).indexOf(intersects[0].object.id);
                terrain.remove(dots[dotPosition]);
                var replaceDot = dots.indexOf(intersects[0].object.id);
                if(~replaceDot){
                    dots[replaceDot] = 0;
                }
            }
        }
        else{
            terrain.elementsNeedUpdate = true;
            var intersect = raycaster.intersectObject(terrain);
            if (intersect.length > 0){
                if(confirm("Place a city here?")){
                    var cityName = prompt("Give your city a name", "St. Louis");
                    if(cityName != null && cityName != ""){
                        var dot = new THREE.Sprite(dotMaterial);
                        dot.name = cityName;
                        worldDotPosition = terrain.geometry.vertices[terrain.geometry.faces[intersect[0].faceIndex].a];
                        dot.position.x = worldDotPosition.x;
                        dot.position.y = worldDotPosition.y;
                        dot.position.z = worldDotPosition.z;
                        if(dot.position.x >= 0){
                            dot.position.x += 0.03;
                        }
                        else{
                            dot.position.x -= 0.03;
                        }
                        if(dot.position.y >= 0){
                            dot.position.y += 0.03;
                        }
                        else{
                            dot.position.y -= 0.03;
                        }
                        if(dot.position.z >= 0){
                            dot.position.z += 0.03;
                        }
                        else{
                            dot.position.z -= 0.03;
                        }
                        dot.scale.x = dot.scale.y = 0.1;
                        dots.push(dot);
                        console.log(dots);
                        terrain.add(dot);
                        terrain.elementsNeedUpdate = true;
                        console.log(dot.position.x);
                        console.log(dot.position.y);
                        console.log(dot.position.z);

                    }
                }
            }
        }
    }
}

function setTerrainDefaults(){
    parameters.terrain_size = 1;
    parameters.shallow_deep = 5;
    parameters.desert_grass = 5.22;
    parameters.grass_mountain = 5.3;
    parameters.mountain_snow = 5.4;
    parameters.deep_color = 0x000080;
    parameters.desert_color = 0xf4d03f;
    parameters.grass_color = 0x00cc00;
    parameters.mountain_color = 0x505050;
    parameters.snow_color = 0xffffff;
    terrain.scale.set(parameters.terrain_size, parameters.terrain_size, parameters.terrain_size);
    assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color);
}

function setWaterDefaults(){
    parameters.water_level = 5.2;
    parameters.water_color = 0x00ffff;
    parameters.water_opacity = 0.9;
    waterSphere.scale.set(parameters.water_level, parameters.water_level, parameters.water_level);
    waterSphere.material.color.setHex(parameters.water_color);
    waterSphere.material.opacity = parameters.water_opacity;
}

function setAtmosphereDefaults(){
    parameters.sky_level = highestPeak + 0.05;
    parameters.sky_color = 0xffffff;
    parameters.sky_opacity = 0.1;
    skySphere.scale.set(parameters.sky_level, parameters.sky_level, parameters.sky_level);
    skySphere.material.color.setHex(parameters.sky_color);
    skySphere.material.opacity = parameters.sky_opacity;
}

function setLightDefaults(){
    parameters.sun_on = true;
    parameters.sunlight_color = 0xffffff;
    parameters.ambient_color = 0x0a0a0a;
    ToggleSun();
    sunLight.color.setHex(parameters.sunlight_color);
    ambientLight.color.setHex(parameters.ambient_color);
}

function adjustWaterLevels(){
    parameters.shallow_deep = parameters.water_level + deepDiff;
    parameters.desert_grass = parameters.water_level + sandDiff;
    parameters.grass_mountain = parameters.water_level + grassDiff;
    parameters.mountain_snow = parameters.water_level + mountainDiff;
    assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)
}

function randomTerrainColor(){
    parameters.deep_color = parseInt(randomHexColor());
    parameters.desert_color = parseInt(randomHexColor());
    parameters.grass_color = parseInt(randomHexColor());
    parameters.mountain_color = parseInt(randomHexColor());
    parameters.snow_color = parseInt(randomHexColor());
    assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color);
}

function randomWaterColor(){
    parameters.water_color = parseInt(randomHexColor());
    waterSphere.material.color.setHex(parameters.water_color);
}

function randomSkyColor(){
    parameters.sky_color = parseInt(randomHexColor());
    skySphere.material.color.setHex(parameters.sky_color);
}

function randomLightColor(){
    parameters.sunlight_color = parseInt(randomHexColor());
    parameters.ambient_color = parseInt(randomHexColor());
    sunLight.color.setHex(parameters.sunlight_color);
    ambientLight.color.setHex(parameters.ambient_color);
}

function ToggleSun(){
    if(parameters.sun_on == true){
        scene.add(sunLight);
    }
    else{
        scene.remove(sunLight);
    }
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth * 1, window.innerHeight * 0.96);
renderer.domElement.id = "canvas";
document.body.appendChild(renderer.domElement);

var canvas = document.getElementById("canvas");

//fps counter for testing
//javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

var controls = new THREE.OrbitControls(camera, renderer.domElement);
/* controls.autoRotate = true;
controls.autoRotateSpeed = 1.0; */

var dotMap = new THREE.TextureLoader().load('textures/sprite.png');
var dotMaterial = new THREE.SpriteMaterial( {map: dotMap, color: 0x000000, depthWrite: false});
var dots = [];
var deepDiff = -0.2;
var sandDiff = 0.02;
var grassDiff = 0.1;
var mountainDiff = 0.2;

var seed = randomSeed();
Math.seedrandom(seed);

var terrain = makeDefaultTerrain();
var waterGeometry = new THREE.SphereGeometry(1, 32, 32);
var waterMaterial = new THREE.MeshLambertMaterial({color:0x00ffff, opacity: 0.9, transparent:true});
var waterSphere = new THREE.Mesh(waterGeometry,waterMaterial);
waterSphere.scale.set(5.2, 5.2, 5.2);

var skyGeometry = new THREE.SphereGeometry(1, 32, 32);
var skyMaterial = new THREE.MeshLambertMaterial({color:0xffffff, transparent:true, opacity: 0.1, depthWrite: false});
var skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
skySphere.scale.set(highestPeak + 0.05, highestPeak + 0.05, highestPeak + 0.05);

var text2 = document.createElement('div');
text2.innerHTML = seed;

text2.style.position = 'fixed';
text2.style.zIndex = 1;
text2.style.backgroundColor = "blue";
text2.style.bottom = 10 + 'px';
text2.style.left = 0 + 'px';
document.body.appendChild(text2);

var planet = new THREE.Object3D();
var radCounter = 0;

planet.add(terrain);
planet.add(waterSphere);
scene.add(planet);
scene.add(skySphere);

camera.position.z = 15;

var ambientLight = new THREE.AmbientLight( 0x0a0a0a );
scene.add(ambientLight);
var sunLight = new THREE.PointLight(0Xffffff, 1.2);
sunLight.position.set(300, 60, 70);
scene.add(sunLight);

var sunGeometry = new THREE.SphereGeometry(10, 32, 32);
var sunMaterial = new THREE.MeshBasicMaterial({color:0xffff00});
var sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(300, 60, 70);
scene.add(sun);

var gui = new dat.GUI({  });

var guiContainer = document.getElementById("gui-container");
guiContainer.append(gui.domElement);
canvas.append(guiContainer.domElement);

guiContainer.style.zIndex = 3;
var newMaterial = terrain.material;

var parameters = {
    terrain_size: 1,
    shallow_deep: 5,
    desert_grass: 5.22,
    grass_mountain: 5.3,
    mountain_snow: 5.4,
    deep_color: 0x000080,
    desert_color: 0xf4d03f,
    grass_color: 0x00cc00,
    mountain_color: 0x505050,
    snow_color: 0xffffff,
    //terrain_opacity: 1,
    water_level: 5.2,
    water_color: 0X00ffff,
    water_opacity: 0.9,
    water_elevation: true,
    sky_level: highestPeak + 0.05,
    sky_color: 0Xffffff,
    sky_opacity: 0.1,
    sun_on: true,
    sunlight_color: 0xffffff,
    ambient_color: 0x0a0a0a,
    terrain_default:function (){
        setTerrainDefaults();
    },
    water_default:function (){
        setWaterDefaults();
    },
    sky_default:function (){
        setAtmosphereDefaults();
    },
    light_default:function (){
        setLightDefaults();
    },
    default: function (){
        setAtmosphereDefaults();
        setTerrainDefaults();
        setWaterDefaults();
        setLightDefaults();
    },
    terrain_random: function(){
        randomTerrainColor();
    },
    water_random: function(){
        randomWaterColor();
    },
    sky_random: function(){
        randomSkyColor();
    },
    light_random: function(){
        randomLightColor();
    },
    random: function (){
        randomTerrainColor();
        randomWaterColor();
        randomSkyColor();
        randomLightColor();
    },
    auto_rotation: true
};


terrainFolder = gui.addFolder('Terrain Controls');
waterFolder = gui.addFolder('Water Controls');
skyFolder = gui.addFolder('Atmosphere Controls');
lightingFolder = gui.addFolder('Lighting Controls');
defaultsFolder = gui.addFolder('Reset Defaults');
randomFolder = gui.addFolder('Randomize Colors');

terrainFolder.add(parameters, 'terrain_size', 0, 2).name('Terrain Size').onChange(function(value){terrain.scale.set(parameters.terrain_size, parameters.terrain_size, parameters.terrain_size);}).listen();
terrainFolder.add(parameters, 'shallow_deep', lowestValley, highestPeak + 0.1).name('Shallow/Deep Water Line')
    .onChange(function(value){
        deepDiff = parameters.shallow_deep - parameters.water_level;
        assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)
    }).listen();
terrainFolder.add(parameters, 'desert_grass', lowestValley, highestPeak + 0.1).name('Desert/Grass Line')
    .onChange(function(value){
        sandDiff = parameters.desert_grass - parameters.water_level;
        assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)
    }).listen();
terrainFolder.add(parameters, 'grass_mountain', lowestValley, highestPeak + 0.1).name('Grass/Mountain Line')
    .onChange(function(value){
        grassDiff = parameters.grass_mountain - parameters.water_level;
        assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)
    }).listen();
terrainFolder.add(parameters, 'mountain_snow', lowestValley, highestPeak + 0.1).name('Mountain/Snow Line')
    .onChange(function(value){
        mountainDiff = parameters.mountain_snow - parameters.water_level;
        assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)
    }).listen();
terrainFolder.addColor(parameters, 'deep_color').name('Deep Water Color').onChange(function(value){assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)}).listen();
terrainFolder.addColor(parameters, 'desert_color').name('Desert Color').onChange(function(value){assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)}).listen();
terrainFolder.addColor(parameters, 'grass_color').name('Grass Color').onChange(function(value){assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)}).listen();
terrainFolder.addColor(parameters, 'mountain_color').name('Mountain Color').onChange(function(value){assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)}).listen();
terrainFolder.addColor(parameters, 'snow_color').name('Snow Color').onChange(function(value){assignVertexColors(terrain.geometry, parameters.shallow_deep, parameters.desert_grass, parameters.grass_mountain, parameters.mountain_snow, parameters.deep_color, parameters.desert_color, parameters.grass_color, parameters.mountain_color, parameters.snow_color)}).listen();
//terrainFolder.add(parameters, 'terrain_opacity', 0, 1).name('Terrain Opacity').onChange(function(value){terrain.material.opacity = parameters.terrain_opacity});

waterFolder.add(parameters, 'water_level', lowestValley, highestPeak).name('Water Level')
    .onChange(function(value){
        waterSphere.scale.set(parameters.water_level, parameters.water_level, parameters.water_level);
        if(parameters.water_elevation == true){adjustWaterLevels();}
    }).listen();
waterFolder.addColor(parameters, 'water_color').name('Water Color').onChange(function(value){waterSphere.material.color.setHex(parameters.water_color)}).listen();
waterFolder.add(parameters, 'water_opacity', 0, 1).name('Water Opacity').onChange(function(value){waterSphere.material.opacity = parameters.water_opacity}).listen();
waterFolder.add(parameters, 'water_elevation').name('Water Elevation')
    .onChange(function(value){
        deepDiff = parameters.shallow_deep - parameters.water_level;
        sandDiff = parameters.desert_grass - parameters.water_level;
        grassDiff = parameters.grass_mountain - parameters.water_level;
        mountainDiff = parameters.mountain_snow - parameters.water_level;
    });

skyFolder.add(parameters, 'sky_level', lowestValley, highestPeak + 1).name('Amosphere Level').onChange(function(value){skySphere.scale.set(parameters.sky_level, parameters.sky_level, parameters.sky_level)}).listen();
skyFolder.addColor(parameters, 'sky_color').name('Sky Color').onChange(function(value){skySphere.material.color.setHex(parameters.sky_color)}).listen();
skyFolder.add(parameters, 'sky_opacity', 0, 1).name('Sky Opacity').onChange(function(value){skySphere.material.opacity = parameters.sky_opacity}).listen();

lightingFolder.add(parameters, 'sun_on').name('Toggle Sunlight').onChange(function(value){ToggleSun()}).listen();
lightingFolder.addColor(parameters, 'sunlight_color').name('Sunlight Color').onChange(function(value){sunLight.color.setHex(parameters.sunlight_color)}).listen();
lightingFolder.addColor(parameters, 'ambient_color').name('Ambient Light Color').onChange(function(value){ambientLight.color.setHex(parameters.ambient_color)}).listen();

defaultsFolder.add(parameters, 'terrain_default').name('Reset Terrain Defaults');
defaultsFolder.add(parameters, 'water_default').name('Reset Water Defaults');
defaultsFolder.add(parameters, 'sky_default').name('Reset Sky Defaults');
defaultsFolder.add(parameters, 'light_default').name('Reset Lighting Defaults');
defaultsFolder.add(parameters, 'default').name('Reset All Defaults');

randomFolder.add(parameters, 'terrain_random').name('Randomize Terrain Colors');
randomFolder.add(parameters, 'water_random').name('Randomize Water Color');
randomFolder.add(parameters, 'sky_random').name('Randomize Atmosphere Color');
randomFolder.add(parameters, 'light_random').name('Randomize Lighting Colors')
randomFolder.add(parameters, 'random').name('Randomize All Colors');

gui.add(parameters, 'auto_rotation').name('Auto-Rotate Camera');

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'mousedown', onDocumentMouseDown, false );
window.addEventListener( 'mousemove', onMouseMove, false );

function animate() {
    requestAnimationFrame(animate);
    if (parameters.auto_rotation == true){
        planet.rotation.y += 0.003;
        controls.update();
    }
    renderer.render(scene, camera);
}
animate();
