
var names = []
var n = 0;
var width  = window.innerWidth,
    height = window.innerHeight;


async function getData() {
  response = await fetch('data/Memory.json');
  data = await response.json();


  console.log(data.lat[0]);
  console.log(data.lat.length);
  console.log(data.lon.length);
  console.log(data.Name.length);
  
  var names = [];
  for (i = 0; i < data.lat.length; i++) {

    if (names.includes(data.Name[i])===false) {

      names.push(data.Name[i])

      addMarker(data.lat[i], data.lon[i], data.Name[i]);


    }
  }
}

function getAllIndexes(arr, val) {
  var indexes = [], i = -1;
  while ((i = arr.indexOf(val, i+1)) != -1){
      indexes.push(i);
  }
  return indexes;
}

// creat scene and camera
var scene = new THREE.Scene();

// set the camera
var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
camera.position.z = 3.5;


// Create the renderer
const div = document.querySelector('#labels');
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var domEvents = new THREEx.DomEvents(camera, renderer.domElement)



// add light
ambiantLight = new THREE.AmbientLight(0x404040);
ambiantLight.intensity = 5;
scene.add(ambiantLight);



var light = new THREE.SpotLight( 0xffffff );;
light.position.set(150,1500,2500);
light.castShadow = true;
light.intensity = 0.2;
scene.add(light);



earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.995, 32, 32),
    new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture('assets/images/2_no_clouds_16k.jpg'),
      bumpMap: THREE.ImageUtils.loadTexture('assets/images/earth_elevation.jpg'),
      bumpScale:   0.005,
      specularMap: THREE.ImageUtils.loadTexture('assets/images/earth_specular_2048.jpg'),
      specular: new THREE.Color('grey')      })
);

console.log(earth.position.z)

Atmos = new THREE.Mesh(
    new THREE.SphereGeometry(0.999, 32, 32),
    new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture('assets/images/fair_clouds_8k.jpg'),
      transparent: true,
      opacity: 0.4
    })
);


star = new THREE.Mesh(
    new THREE.SphereGeometry(90, 64, 64), 
    new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture('assets/images/star-field.png'), 
      side: THREE.BackSide
    })
);


scene.add(earth);
scene.add(Atmos);
scene.add(star);


getData();

var controls = new THREE.TrackballControls(camera);

render();

window.addEventListener( 'resize', function(){

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}, false );


function render() {

  var width = window.innerWidth;
  var height = window.innerHeight;

  var needResize = width !== window.innerWidth || height !== window.innerHeight;
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
    controls.update();

    
    // 
    // Atmos.rotation.y += 0.0005;  
    requestAnimationFrame(render);
    renderer.render(scene, camera);

  
}


/*
function drawCurve(curve, color)
{
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices = curve.getPoints(100);
	lineGeometry.computeLineDistances();
	var lineMaterial = new THREE.LineBasicMaterial();
	lineMaterial.color = (typeof(color) === "undefined") ? new THREE.Color(0xFF0000) : new THREE.Color(color);
  var line = new THREE.Line( lineGeometry, lineMaterial );
  scene.add(line)
}
*/

function convertLatLonToVec3(lat,lon)
{
	lat =  lat * Math.PI / 180.0;
	lon =  -lon * Math.PI / 180.0;
	return new THREE.Vector3( 
		Math.cos(lat) * Math.cos(lon), 
		Math.sin(lat), 
		Math.cos(lat) * Math.sin(lon) );
}


// create image div
var img_div = document.createElement('img');
img_div.style.display = 'Block';
img_div.style.marginLeft = 'auto';
img_div.style.marginRight = 'auto';
img_div.style.maxWidth = '80%';
img_div.style.maxHeight = '99%';


// Create div to contain the name of the place

var place_div = document.createElement('div');
place_div.style.left = '5%';
place_div.style.top = '80%';
place_div.style.color ='white';
place_div.style.position = 'absolute';


let placeText = document.createElement('p');

let placeDate = document.createElement('p');

place_div.appendChild(placeText);
place_div.appendChild(placeDate);


// close div
var img_close = document.createElement('div');
img_close.style.left = '3%';
img_close.style.top = '3%';
img_close.style.color ='white';
img_close.style.textAlign = 'left';
img_close.style.position = 'absolute';
img_close.style.cursor = 'pointer';
img_close.style.fontFamily = 'Helvetica';
img_close.style.fontWeight = 'bold';
img_close.style.fontSize = '12px';
img_close.style.backgroundColor = 'red';
img_close.style.textAlign = 'center';
img_close.style.width = '15px';
img_close.style.height = '15px';



img_close.addEventListener('click', function(){


  controls.enabled = true;
  document.body.removeChild(img_box);

  n = 0;
  if(img_box.contains(img_prevDiv)) {
    img_box.removeChild(img_prevDiv);
  }

  if(img_box.contains(img_nextDiv)) {
    img_box.removeChild(img_nextDiv);
  }
  
  img_close.style.color = 'white';
  img_close.style.backgroundColor = 'red';


  labels.appendChild(addMemory);
  labels.appendChild(seeMemory);
  

})

img_close.addEventListener('mouseover', function(){

  img_close.style.color = 'red';
  img_close.style.backgroundColor = 'black';

})

img_close.addEventListener('mouseout', function(){

  img_close.style.color = 'white';
  img_close.style.backgroundColor = 'red';

})


var img_closeText = document.createTextNode('X');
img_close.appendChild(img_closeText);



var img_nextDiv = document.createElement('div');
img_nextDiv.style.position = 'absolute';
img_nextDiv.style.top = '45%';
img_nextDiv.style.left = '95%';
img_nextDiv.style.fontSize = '25px';
img_nextDiv.style.color = 'white';
img_nextDiv.style.cursor = 'pointer';
var img_next = document.createTextNode('>')
img_nextDiv.appendChild(img_next);

img_nextDiv.addEventListener('click', function() {


  n += 1;


  if (n>0 && img_box.contains(img_prevDiv)===false) {
    img_box.appendChild(img_prevDiv);
  }

  console.log(indexes.length)
  img_div.src = 'assets/images_perso/' + data.Img_ref[indexes[n]];
  placeDate.textContent = data.Date[indexes[n]];
  console.log(n)
  if (n===(indexes.length -1)) {

    img_box.removeChild(img_nextDiv);
  }

  

})

var img_prevDiv = document.createElement('div');
img_prevDiv.style.position = 'absolute';
img_prevDiv.style.top = '45%';
img_prevDiv.style.left = '5%';
img_prevDiv.style.fontSize = '25px';
img_prevDiv.style.color = 'white';
img_prevDiv.style.cursor = 'pointer';
var img_prev = document.createTextNode('<')
img_prevDiv.appendChild(img_prev);

img_prevDiv.addEventListener('click', function() {


  n = n-1;

  console.log(n)
  img_div.src = 'assets/images_perso/' + data.Img_ref[indexes[n]];
  placeDate.textContent = data.Date[indexes[n]]


  if (n===0 && img_box.contains(img_prevDiv)===true) {
    img_box.removeChild(img_prevDiv);
  }
  
  if (n ===(indexes.length - 2) && img_box.contains(img_nextDiv)===false) {
    img_box.appendChild(img_nextDiv)
  }


})




var img_box = document.createElement('div');
img_box.style.position = 'fixed';
img_box.style.left = '0';
img_box.style.right = '0';
img_box.style.bottom = '0';
img_box.style.top = '0';
img_box.style.textAlign = 'center';
img_box.style.verticalAlign = 'middle';
img_box.style.backgroundColor = 'grey';

var img_box2 = document.createElement('div');
img_box2.style.display = 'flex';
img_box2.style.justifyContent = 'center';
img_box2.style.alignItems = 'center';
img_box2.style.height = '100%';


img_box2.appendChild(img_div);
img_box.appendChild(img_box2);
img_box.appendChild(place_div);
img_box.appendChild(img_close);



let seeMemoryBox = document.createElement('div');
seeMemoryBox.style.width = '400px';
seeMemoryBox.style.height = '500px';
seeMemoryBox.style.marginTop = '15%';
seeMemoryBox.style.marginLeft = '5%';
seeMemoryBox.style.backgroundColor = 'hsla(0, 0%, 50%, 0.7)';
seeMemoryBox.style.textAlign = 'center';
seeMemoryBox.style.position = 'absolute';
seeMemoryBox.style.zIndex = '5';
seeMemoryBox.style.overflow = 'hidden';
seeMemoryBox.style.overflow = 'scroll';








function addMarker(lat, lon, name)
{
  
    names.push(name);


    var marker = new THREE.Mesh( new THREE.SphereGeometry(0.005, 8, 4), new THREE.MeshLambertMaterial({
      color: 'white',
      emissive: 0x2a2a2a,
      emissiveIntensity: 1000000,
      side: THREE.DoubleSide
  }))
    lat =  lat * Math.PI / 180.0;
    lon =  -lon * Math.PI / 180.0;
    marker.position.x = Math.cos(lat) * Math.cos(lon)
    marker.position.y =	Math.sin(lat)
    marker.position.z =	Math.cos(lat) * Math.sin(lon)
    const elem = document.createElement('div');
    elem.textContent = names[names.length-1];
    console.log(marker.position);
    elem.style.color = 'white';
    elem.style.position = 'absolute';
    elem.style.backgroundColor = 'hsla(0,0%,50%,0.5)';
    elem.style.cursor = 'pointer';
    elem.style.zIndex = '3';

    const elem2 = document.createElement('div');
    elem2.textContent = names[names.length-1];
    console.log(marker.position);
    elem2.style.color = 'white';
    elem2.style.cursor = 'pointer';
    elem2.style.marginTop = '5%';
    elem2.style.zIndex = '3';
    elem2.style.position = 'relative';

    elem2.addEventListener('click', function(){
      
      controls.enabled = false;

      let n = 0;

      indexes = getAllIndexes(data.Name, elem.textContent)

      img_div.src = 'assets/images_perso/' + data.Img_ref[indexes[n]];
      console.log(indexes)
      placeText.textContent = data.Name[indexes[n]];
      placeDate.textContent = data.Date[indexes[n]]
      document.body.appendChild(img_box);
      console.log(data.Img_ref[indexes]);
      console.log('I clicked');


      if (indexes.length>1) {
        img_box.appendChild(img_nextDiv);
      }
      if (labels.contains(seeMemoryBox)) {
        labels.removeChild(seeMemoryBox);
      }
      if (labels.contains(close)) {
        labels.removeChild(close);
      }
      if (labels.contains(seeMemory)) {
        labels.removeChild(seeMemory);
      }
      if (labels.contains(addMemoryBox)) {
        labels.removeChild(addMemoryBox);
      }
      if (labels.contains(addMemory)) {
        labels.removeChild(addMemory);
      }

      
    })


    seeMemoryBox.appendChild(elem2);
    
  
    elem.addEventListener('click', function(){
      
      controls.enabled = false;

      let n = 0;

      indexes = getAllIndexes(data.Name, elem.textContent)

      img_div.src = 'assets/images_perso/' + data.Img_ref[indexes[n]];
      
      placeText.textContent = data.Name[indexes[n]];
      placeDate.textContent = data.Date[indexes[n]]
      document.body.appendChild(img_box);


      if (indexes.length>1) {
        img_box.appendChild(img_nextDiv);
      }

      div.removeChild(elem);

      if (labels.contains(seeMemoryBox)) {
        labels.removeChild(seeMemoryBox);
      }
      if (labels.contains(close)) {
        labels.removeChild(close);
      }
      if (labels.contains(seeMemory)) {
        labels.removeChild(seeMemory);
      }
      if (labels.contains(addMemoryBox)) {
        labels.removeChild(addMemoryBox);
      }
      if (labels.contains(addMemory)) {
        labels.removeChild(addMemory);
      }

      
    })

    
    domEvents.addEventListener(marker, 'mouseover', function(event) {
      
      var tempV = new THREE.Vector3();
      marker.updateWorldMatrix(true, false);
      marker.getWorldPosition(tempV);

      tempV.project(camera);


      const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
      const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
      
      console.log(x);

      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

      

      div.appendChild(elem);
      
    }, false);

    domEvents.addEventListener(marker, 'mouseout', function(event) {
      if(div.contains(elem)) {
        div.removeChild(elem);
      }
      
    })
    
    /*
    
    const elem = document.createElement('div');
    elem.textContent = name;
    tempV.position = convertLatLonToVec3(lat,lon).multiplyScalar(radius);
    const x = (marker.position.x *  .5 + .5) * canvas.clientWidth;
    const y = (marker.position.Y * -.5 + .5) * canvas.clientHeight;
    elem.style.color = 'white';
    
    elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    div.appendChild(elem);
    */

    scene.add(marker);



    
  
}



/*
function createSphereArc(P,Q)
{
	var sphereArc = new THREE.Curve();
	sphereArc.getPoint = greatCircleFunction(P,Q);
	return sphereArc;
}

function greatCircleFunction(P, Q)
{
	var angle = P.angleTo(Q);
	return function(t)
	{
	    var X = new THREE.Vector3().addVectors(
			P.clone().multiplyScalar(Math.sin( (1 - t) * angle )), 
			Q.clone().multiplyScalar(Math.sin(      t  * angle )))
			.divideScalar( Math.sin(angle) );
	    return X;
	};
}
*/




////////// Add the onclick for addMemory


///get elements for the current html
var container = document.getElementById('constainer');
var labels = document.getElementById('labels');


// labels style
labels.style.width = '100%';



// Define page title
var title = document.createElement('div');

var titleText = document.createTextNode('Memory Box');
title.appendChild(titleText);
title.style.color = 'white';
title.style.width = '100%';
title.style.fontSize = '30px';
title.style.fontWeight = '400';
title.style.height = '5%';
title.style.marginTop = '2.5%';
title.style.position = 'absolute';
title.style.textAlign = 'center';
labels.appendChild(title);


// Define add picture box

var addMemory = document.createElement('div');
var addMemoryText = document.createTextNode('Add Memory');
addMemory.appendChild(addMemoryText);
addMemory.style.color = 'white';
addMemory.style.width = '100%';
addMemory.style.height = '100%';
addMemory.style.marginLeft = '5%';
addMemory.style.marginTop = '15%';
addMemory.style.cursor = 'pointer';
addMemory.style.position = 'absolute';


labels.appendChild(addMemory);

// Define see picture box
var seeMemory = document.createElement('div');
var seeMemoryText = document.createTextNode('See Memories');
seeMemory.appendChild(seeMemoryText);
seeMemory.style.color = 'white';
seeMemory.style.marginLeft = '5%';
seeMemory.style.marginTop = '20%';
seeMemory.style.cursor = 'pointer';
seeMemory.style.position = 'absolute';
labels.appendChild(seeMemory);

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let addMemoryBox = document.createElement('div');
addMemoryBox.style.width = '20%';
addMemoryBox.style.marginTop = '15%';
addMemoryBox.style.marginLeft = '5%';
addMemoryBox.style.backgroundColor = 'hsla(0, 0%, 50%, 0.7)';
addMemoryBox.style.textAlign = 'center';
addMemoryBox.style.position = 'absolute';
addMemoryBox.style.zIndex = '5';


// Define the boxes
let locationDiv = document.createElement('div');
let longitudeDiv = document.createElement('div');
let latitudeDiv = document.createElement('div');
let dateDiv = document.createElement('div');
let imageDiv = document.createElement('div');

// Define the text
let locationText = document.createTextNode('Location');
let longitudeText = document.createTextNode('Longitude');
let latitudeText = document.createTextNode('Latitude');
let dateText = document.createTextNode('Date');
let imageText = document.createTextNode('Add Picture');

// append the text
locationDiv.appendChild(locationText);
longitudeDiv.appendChild(longitudeText);
latitudeDiv.appendChild(latitudeText);
dateDiv.appendChild(dateText);
imageDiv.appendChild(imageText);

// Style location

locationDiv.style.marginTop = '10%';
locationDiv.style.textAlign = 'center';
locationDiv.style.zIndex = '6';
locationDiv.style.fontWeight = '400';
locationDiv.style.color = 'white';

var localInput = document.createElement('input');
localInput.setAttribute('type', "text");

localInput.style.margin = '10px';
localInput.style.zIndex = '10';

locationDiv.appendChild(localInput);
addMemoryBox.appendChild(locationDiv);

// style lattitude
latitudeDiv.style.marginTop = '10%';
latitudeDiv.style.textAlign = 'center';
latitudeDiv.style.zIndex = '6';
latitudeDiv.style.fontWeight = '400';
latitudeDiv.style.color = 'white';

var latitudeInput = document.createElement('input');
latitudeInput.setAttribute('type', "text");

latitudeInput.style.margin = '10px';
latitudeInput.style.zIndex = '10';


latitudeDiv.appendChild(latitudeInput);

addMemoryBox.appendChild(latitudeDiv);

// style longitude
longitudeDiv.style.marginTop = '10%';
longitudeDiv.style.textAlign = 'center';
longitudeDiv.style.zIndex = '6';
longitudeDiv.style.fontWeight = '400';
longitudeDiv.style.color = 'white';

var longitudeInput = document.createElement('input');
longitudeInput.setAttribute('type', "text");

longitudeInput.style.margin = '10px';
longitudeInput.style.zIndex = '10';


longitudeDiv.appendChild(longitudeInput);

addMemoryBox.appendChild(longitudeDiv);


// style date
dateDiv.style.marginTop = '10%';
dateDiv.style.textAlign = 'center';
dateDiv.style.zIndex = '6';
dateDiv.style.fontWeight = '400';
dateDiv.style.color = 'white';

var dateInput = document.createElement('input');
dateInput.setAttribute('type', "text");

dateInput.style.margin = '10px';
dateInput.style.zIndex = '10';


dateDiv.appendChild(dateInput);

addMemoryBox.appendChild(dateDiv)

// style image
imageDiv.style.marginTop = '10%';
imageDiv.style.textAlign = 'center';
imageDiv.style.zIndex = '6';
imageDiv.style.fontWeight = '400';
imageDiv.style.color = 'white';

var imageInput = document.createElement('input');
imageInput.setAttribute('type', "file");

imageInput.style.margin = '10px';
imageInput.style.zIndex = '10';


imageDiv.appendChild(imageInput);


addMemoryBox.appendChild(imageDiv);

/// Small squre to close the window

let close = document.createElement('div');
close.style.width = '10px';
close.style.height = '10px';
close.style.backgroundColor = 'red';
close.style.marginTop = '16%';
close.style.marginLeft = '6%';
close.style.position = 'absolute';
close.style.zIndex = '10';
close.style.cursor = 'pointer';




// Save button

let saveDiv = document.createElement('div');
let saveText = document.createTextNode('Save');
saveDiv.appendChild(saveText);

saveDiv.style.marginTop = '10%';
saveDiv.style.marginBottom = '2%';
saveDiv.style.marginLeft = '75%';
saveDiv.style.zIndex = '10';
saveDiv.style.backgroundColor = 'black';
saveDiv.style.color = 'white';
saveDiv.style.textAlign = 'center';
saveDiv.style.position = 'relative';
saveDiv.style.cursor = 'pointer';

saveDiv.addEventListener('click', function() {

  let file = imageInput.files[0];
  console.log(file);
  console.log(__dirname);

  labels.appendChild(addMemory);
  labels.appendChild(seeMemory);
  labels.removeChild(close);
  labels.removeChild(addMemoryBox);

  let data2 = {
    Name: [],
    lat: [],
    lon: [],
    Img_ref: [],
    Date: []
  };  
  if(data.Name.length > 0) {
    data2.Name = data.Name;
    data2.lat = data.lat;
    data2.lon = data.lon;
    data2.Img_ref = data.Img_ref;
    data2.Date = data.Date;
  }
  

  
  console.log(data2);
  console.log(localInput.value);

  data2.Name.push(localInput.value);
  data2.lat.push(parseInt(latitudeInput.value));
  data2.lon.push(parseInt(longitudeInput.value));
  data2.Date.push(dateInput.value);
  data2.Img_ref.push(file.name);
  
  let toJSON = JSON.stringify(data2);
  filePathData = path.join(__dirname, '/data/Memory.json');
  fs.writeFile(filePathData, toJSON, function (err) {
    console.log(err);
  });

  var imageType = /image.*/;

  
  if (file.type.match(imageType)) {
    var reader = new FileReader();

    reader.onload = function(e) {

      var img = new Image();
      img.src = reader.result;


      img.onload = function() {
        var c = document.createElement("CANVAS");
        var ctx = c.getContext("2d");
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;

        ctx.drawImage(img, 0, 0, this.width, this.height);
        let dataURL = c.toDataURL();
        console.log(dataURL);

        filePath = path.join(__dirname, '/assets/images_perso/', file.name);
        console.log(filePath);
        let base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(filePath, base64Data, 'base64', function (err) {
          console.log(err);
        });
      }

      
    }

    reader.readAsDataURL(file); 
    window.location.reload();
  } else {
    fileDisplayArea.innerHTML = "File not supported!"
  }
  
  
  return false;
  
})


addMemoryBox.appendChild(saveDiv);


seeMemory.addEventListener( 'click', function() {

  controls.enabled = false;
  labels.removeChild(addMemory);
  labels.removeChild(seeMemory);
  labels.appendChild(close);
  labels.appendChild(seeMemoryBox);
})





close.addEventListener('click', function() {

  controls.enabled = true;

  labels.appendChild(addMemory);
  labels.appendChild(seeMemory);
  labels.removeChild(close);

  if (labels.contains(addMemoryBox)) {
    labels.removeChild(addMemoryBox);
  }
  
  if (labels.contains(seeMemoryBox)) {
    labels.removeChild(seeMemoryBox);
  }

  close.style.color = 'white';
  close.style.backgroundColor = 'red';
  


})


addMemory.addEventListener('click', function() {

  controls.enabled = false;
  labels.removeChild(addMemory);
  labels.removeChild(seeMemory);
  labels.appendChild(close);
  labels.appendChild(addMemoryBox);

});





console.log(window.innerHeight)


/*

Here we want to diplay the support when we will click on add memory

*/



// define background

/*

/// Add title

var titleBox = document.createElement('div');
var titleBoxText = document.createTextNode('Add New Memory');
titleBox.appendChild(titleBoxText);
titleBox.style.left = '0';
titleBox.style.top = '15%';
titleBox.style.color = 'white';
titleBox.style.width = '100%';
titleBox.style.textAlign = 'center';
titleBox.style.position = 'absolute';


document.body.appendChild(titleBox);


// first localisation box

var localisation = document.createElement('div');
localisation.style.color = 'white';
localisation.style.top = '30%';
localisation.style.left = '0';
localisation.style.width = '100%';
localisation.style.position = 'absolute';
localisation.style.textAlign = 'center';

var localisationText = document.createTextNode('Location ');

var localInput = document.createElement('input');
localInput.setAttribute('type', "text");

localisation.appendChild(localisationText);
localisation.appendChild(localInput);

document.body.appendChild(localisation);


/// for the lattitude
var latBox = document.createElement('div');
latBox.style.top = '40%';
latBox.style.left = '0';
latBox.style.width = '100%';
latBox.style.position = 'absolute';
latBox.style.textAlign = 'center';
latBox.style.color = 'white';

var latText = document.createTextNode('Longitude ');

var latInput = document.createElement('input');
latInput.setAttribute('type', "text");

latBox.appendChild(latText);
latBox.appendChild(latInput);

document.body.appendChild(latBox);


/// for the longitude
var lonBox = document.createElement('div');
lonBox.style.top = '40%';
lonBox.style.left = '0';
lonBox.style.width = '100%';
lonBox.style.position = 'absolute';
lonBox.style.textAlign = 'center';
lonBox.style.color = 'white';

var lonText = document.createTextNode('Longitude ');

var lonInput = document.createElement('input');
lonInput.setAttribute('type', "text");

lonBox.appendChild(lonText);
lonBox.appendChild(lonInput);

document.body.appendChild(lonBox);


/// for the longitude
var latBox = document.createElement('div');
latBox.style.top = '50%';
latBox.style.left = '0';
latBox.style.width = '100%';
latBox.style.position = 'absolute';
latBox.style.textAlign = 'center';
latBox.style.color = 'white';

var latText = document.createTextNode('Latitude ');

var latInput = document.createElement('input');
latInput.setAttribute('type', "text");

latBox.appendChild(latText);
latBox.appendChild(latInput);

document.body.appendChild(latBox);



// Add textbox for date 

var dateDiv = document.createElement('div');
dateDiv.style.color = 'white';
dateDiv.style.top = '60%';
dateDiv.style.left = '0';
dateDiv.style.width = '100%';
dateDiv.style.position = 'absolute';
dateDiv.style.textAlign = 'center';

var dateText = document.createTextNode('Date ');

var dateInput = document.createElement('input');
dateInput.setAttribute('type', "date");
dateInput.setAttribute('size', "20");

dateDiv.appendChild(dateText);
dateDiv.appendChild(dateInput);


document.body.appendChild(dateDiv);


// add image function
var imgDiv = document.createElement('div');
imgDiv.style.top = '70%';
imgDiv.style.color = 'white';
imgDiv.style.left = '0';
imgDiv.style.width = '100%';
imgDiv.style.position = 'absolute';
imgDiv.style.textAlign = 'center';

var imgText = document.createTextNode('Add images ');

var imgInput = document.createElement('input');
imgInput.setAttribute('type', "file");
imgInput.setAttribute('size', "20");
imgInput.setAttribute('multiple', "multiple");

imgDiv.appendChild(imgText);
imgDiv.appendChild(imgInput);

document.body.appendChild(imgDiv);




var cancelDiv = document.createElement('div');

cancelDiv.style.left = '10%';
cancelDiv.style.bottom = '5%';
cancelDiv.style.width = '20%';
cancelDiv.style.color = 'white';
cancelDiv.style.position = 'absolute';
cancelDiv.style.textAlign = 'center';
cancelDiv.style.cursor = 'pointer';

var cancelText = document.createTextNode("Cancel");
cancelDiv.appendChild(cancelText);
cancelDiv.addEventListener('click', function() {
    window.close('AddMemory.html');
});


document.body.appendChild(cancelDiv);

/// button for next step
var nextStepDiv = document.createElement('div');
nextStepDiv.style.left = '40%';
nextStepDiv.style.bottom = '5%';
nextStepDiv.style.width = '20%';
nextStepDiv.style.color = 'white';
nextStepDiv.style.position = 'absolute';
nextStepDiv.style.textAlign = 'center';
nextStepDiv.style.cursor = 'pointer';

var nextStepText = document.createTextNode('Next Step');
nextStepDiv.appendChild(nextStepText);


document.body.appendChild(nextStepDiv);



// button for saving 

var saveDiv = document.createElement('div');
saveDiv.style.left = '70%';
saveDiv.style.bottom = '5%';
saveDiv.style.width = '20%';
saveDiv.style.color = 'white';
saveDiv.style.position = 'absolute';
saveDiv.style.textAlign = 'center';
saveDiv.style.cursor = 'pointer';

var saveText = document.createTextNode('Save');
saveDiv.appendChild(saveText);

saveDiv.addEventListener('click', function(){


    console.log(dateInput.value);
    if (dateInput.value.length === 0) {
        var dateWarning = document.createElement('div');
        dateWarning.style.width = '100%';
        dateWarning.style.top = '65%';
        dateWarning.style.color = 'red';
        dateWarning.style.textAlign = 'center';
        dateWarning.style.position = 'absolute';
        dateWarning.style.fontSize = '10px';

        var dateWarningtext = document.createTextNode('There is no valid date, please add one!');
        dateWarning.appendChild(dateWarningtext);

        document.body.appendChild(dateWarning)


    }

})

document.body.appendChild(saveDiv);




// Try to create the canvas

nextStepDiv.addEventListener('click', function() {
    var canvas = document.createElement('CANVAS');
    var context = canvas.getContext('2d');
    
    
    document.body.appendChild(canvas);

    console.log(imgInput.files)
})
*/
