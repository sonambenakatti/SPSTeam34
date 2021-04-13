
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//Global Variables
var map;
var directionsService;
var directionsRenderer;
var markers=[];
let objectDict = {};
let likedCities = {};
let htmlLikedCitiesString = "";
function initMap(){
    //Map options
    var options = {
        zoom: 11,
        center: {lat: 51.5074,lng: -0.1278}
    }
    //new map
    map = new google.maps.Map(document.getElementById('map'), options);
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}


class Destination{
    constructor(name, info, position, image, timeSpent, htmlCode){
        this.name = name;
        this.info = info;
        this.position = position;
        this.image = image;
        this.time = timeSpent;
        this.htmlCode = htmlCode;
    }
    get getName(){
        return this.name;
    }
    get getInfo(){
        return this.info;
    }
    get getImage(){
        return this.image;
    }
    get getTime(){
        return this.timeSpent;
    }
    get get_HTML(){
        return this.htmlCode;
    }
    get getPosition(){
        return this.position;
    }
    addMarker(){
        this.marker = new google.maps.Marker({
            position: this.position,
            map: map,
            title: this.name
        });
        // This sets up the info window if we click on a marker. We can put html in conent.
        this.infoWindow = new google.maps.InfoWindow({
            content: this.name,
        });
        // If we click on the marker, it will open the info window.
        this.marker.addListener('click', ()=>{
            this.infoWindow.open(map, this.marker);
            let object_id = String(this.name);
            let theElement = document.getElementById(object_id);
            theElement.scrollIntoView();
        })
        markers.push(this.marker);
    }   
}

function showOnMap(selected){
    let objToShow = objectDict[selected];
    objToShow.infoWindow.open(map, objToShow.marker);
}

//Missing parameters of first display position on the map, depending on the city
function lndDay1(city){
    
    $.ajax({
    url: 'csvFiles/'+city+' - Sheet1.csv',
    dataType: 'text',
    }).done(successFunction);

function successFunction(data) 
{
    let allHTMLString = "";
    var allRows = data.split(/\r?\n|\r/);
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
        var rowCells = allRows[singleRow].split(',');
        let myConstructor = [];
        let counter = 0;
        let siteCard = "";
        let dict = {};
        for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
            counter++;
            if(counter == 3){
                dict["lat"] = parseFloat(rowCells[rowCell]);
            }
            else if(counter == 4){
                dict["lng"] = parseFloat(rowCells[rowCell]);
                myConstructor.push(dict);
            }
            else{
                myConstructor.push(rowCells[rowCell]);
            }
        }  
        siteCard += '<div class="schedule-card" id="';
        siteCard += myConstructor[0];
        siteCard += '"><div class="schedule-info"><h1 class="site-name">'; 
        siteCard += myConstructor[0]; 
        siteCard += '</h1><div class="left-info"><div class="hour">'; 
        siteCard += myConstructor[4];
        siteCard += '</div></div></div><img src="'
        siteCard += myConstructor[3]; 
        siteCard += '" class="site-img"/><div class="desc">'; 
        siteCard += myConstructor[1];
        siteCard += '</div><button type="button" class="btn" id="btn-'
        siteCard += myConstructor[0];
        siteCard += '"onclick="showOnMap(\''
        siteCard += myConstructor[0];
        siteCard += '\');\">Show on map</button><button type=\"button\" onclick=\"liked(\'';
        siteCard += myConstructor[0];
        siteCard += '\',\'text';
        siteCard += singleRow;
        siteCard += '\',\'hrt';
        siteCard += singleRow;
        siteCard += '\'); appendSafedCitiesHTML(\''
        siteCard += myConstructor[0];
        siteCard += '\');" class="fav" id="';
        siteCard += myConstructor[0];
        siteCard += '"><div class="text" id="text';
        siteCard += singleRow;
        siteCard += '">Like</div><div class="heart" id="hrt'; //here
        siteCard += singleRow;
        siteCard += '"></div></button><div class="unlikedMessage" id="unliked'
        siteCard += myConstructor[0];
        siteCard += '\"></div></div></div>';
        myConstructor.push(siteCard);
        allHTMLString += siteCard;
        let newDest = new Destination(myConstructor[0], myConstructor[1], myConstructor[2], myConstructor[3],myConstructor[4], myConstructor[5]);
        newDest.addMarker();
        objectDict[String(myConstructor[0])] = newDest;
        const displayImgs = document.getElementById('right');
        displayImgs.innerHTML = allHTMLString;
    }
}
}
function liked(lkd, theTxt, hrt){

    let lkdId = String(lkd);
    let txtId = String(theTxt);
    let hrtId = String(hrt);
    document.getElementById(lkdId).style.backgroundColor = "#c4a35a";
    document.getElementById(txtId).style.color = "#e5e5dc";
    let change2Lkd = document.getElementById(txtId);
    change2Lkd.innerHTML = 'Liked';
    document.getElementById(hrtId).style.backgroundPosition = "right";
    document.getElementById(hrtId).style.animation = "animate .8s steps(28) 1";
    document.getElementById(hrtId).style.color = "#000";
}
function appendSafedCitiesHTML(lkdId){
    if(likedCities[lkdId]==undefined){
        likedCities[lkdId] = objectDict[lkdId];
    }
    else{
        delete likedCities[lkdId];
        unlike(objectDict[lkdId].name)

    }
}

function unlike(lkdId){
    let counter = 0;
    let theNumber;
    for(let place in objectDict){
        if(lkdId==objectDict[place].name){
            theNumber = counter;
            break;
        }
        counter++;
    }
    let txtId = "text";
    txtId += theNumber;
    let hrtId = "hrt";
    hrtId += theNumber;
    document.getElementById(lkdId).style.backgroundColor = "#26485c";
    document.getElementById(txtId).style.color = "#26485c";
    let change2Lkd = document.getElementById(txtId);
    change2Lkd.innerHTML = 'Like';
    document.getElementById(hrtId).style.backgroundPosition = "left";
    document.getElementById(hrtId).style.transform = "transform: translate(0px, -25%)";
    document.getElementById(hrtId).style.color = "#a0a0a0";
    let alert = "You have unliked this place. To refresh your liked places selection click the \"Show only liked places\" button.";
    let theId = "unliked";
    theId += lkdId;
    document.getElementById(theId).innerHTML = alert;
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}    

function changeCity(city){
    document.getElementById('right').innerHTML = "";
    setMapOnAll(null);
    markers=[];
    likedCities = {};
    htmlLikedCitiesString = "";
    objectDict = {};
    lndDay1(city);    
}


function MoveMap(props){
    map.setCenter(props.coords);
    map.setZoom(props.zoom);
}

function showLikedPlaces(){
    setMapOnAll(null);
    markers=[];
    let counter = 0;
    let likedHTML = "";
    for(let place in objectDict){
        if(place in likedCities){
            let placeObj = objectDict[place];
            placeObj.addMarker();
            console.log(placeObj.htmlCode);
            //likedHTML += objectDict[place].htmlCode;
            likedHTML += placeObj.htmlCode;
        }
    }
    if(likedHTML == ""){ 
        document.getElementById('right').innerHTML = "No liked places yet";
    }
    else{
        document.getElementById('right').innerHTML = likedHTML;
    }
    for(let lkdPlace in likedCities){
        let hrt = "hrt";
        hrt += String(counter);
        let txt = "text"
        txt += String(counter);
        console.log(objectDict[lkdPlace].name);
        liked(objectDict[lkdPlace].name, txt, hrt);
        counter++;
    }
    Directions();    
}

function returnToAllPlaces(){
    setMapOnAll(null);
    markers=[];
    let completeHTML = ""
    let counter = 0;
    for(let place in objectDict){
        completeHTML += objectDict[place].htmlCode;
        objectDict[place].addMarker();
    }
    document.getElementById('right').innerHTML = completeHTML;
    for(let lkdPlace in likedCities){

        let hrt = "hrt";
        hrt += String(counter);
        let txt = "text"
        txt += String(counter);

        liked(objectDict[lkdPlace].name, txt, hrt);
        counter++;
    }
}


function Directions(){
    let waypts = [];
    for(let lkdPlace in likedCities){
        waypts.push({
            location: likedCities[lkdPlace].getPosition,
            stopover: true,
        });
    }

    if(waypts.length > 1){
        var start = waypts.shift().location;
        var finish = waypts.pop().location;

        var request = {
            origin: start,
            destination: finish,
            travelMode: 'DRIVING',
            waypoints: waypts,
            optimizeWaypoints: true,
        }
        directionsService.route(request, function(result, status) {
            if (status == 'OK') {
                directionsRenderer.setDirections(result);
            }else{
                console.log("this did not work because of " + status);
            }
        });
    }
}


