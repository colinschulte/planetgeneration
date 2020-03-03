/*  var side = 256;

var amount = side*side;

var data = new Uint8Array(amount*4);
var bump = new Uint8Array(amount*4);
var noise = fbm(8);
var time = 0;

var scale = d3.interpolateRgb("#381b0a", '#c9ba8a');

for (var y = 0; y < side*4; y++) {
    for (var x = 0; x < side; x++) {
        index = (x + y * side);
        xyz   = getCoords(x, y);
        n = noise(xyz[0], xyz[1], xyz[2], time);
        n = Math.abs(Math.cos(y/64 + noise(xyz[0], xyz[1], xyz[2], time)));
        col = d3.color(d3.interpolateRainbow(n));
        data[index    ] = col.r; // n * 220;
        data[index + 1] = col.g; // n * 180;
        data[index + 2] = col.b; // * 160;
        data[index + 3] = 255;
        bump[index    ] = n * 255; // n * 220;
        bump[index + 1] = n * 255; // n * 180;
        bump[index + 2] = n * 255; // * 160;
        bump[index + 3] = 255;
    }
}

var materialArray = [];
for (var i = 0; i < 6; ++i){
    var dataTexture = new THREE.DataTexture(data, side, side, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.EquirectangularReflectionMapping);
    
    dataTexture.unpackAlignment = 1;
    dataTexture.needsUpdate = true;
    
    var bumpMap = new THREE.DataTexture(bump, side, side, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.EquirectangularReflectionMapping);
    
    bumpMap.unpackAlignment = 1;
    bumpMap.needsUpdate = true;
    
    var sphereMaterial = new THREE.MeshLambertMaterial( { color:0x00cc00, bumpMap: bumpMap, map:dataTexture});
    materialArray.push(sphereMaterial);
}    */