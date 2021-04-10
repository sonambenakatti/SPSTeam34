
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
var map;
var markers=[];
function initMap(){
    //Map options
    var options = {
        zoom: 9,
        center: {lat: 51.5074,lng: -0.1278}
    }
    //new map
    map = new google.maps.Map(document.getElementById('map'), options);
}
function addDestination(){
    let BigBen = new Destination("Big Ben", "Famous landmark that represents London", {lat: 51.5007, lng: -0.1246}, "image")
    BigBen.addMarker();
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
            //this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        })
        markers.push(this.marker);
    }   
}
let objectDict = {};
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
        siteCard += '">Show on map</button><button type="button" onclick="liked(\'';//onclick trigger the object's infoWindow.open(map, this.marker)
        siteCard += myConstructor[0];
        siteCard += '\',\'text';
        siteCard += singleRow;
        siteCard += '\',\'hrt';
        siteCard += singleRow;
        siteCard += '\')" class="fav" id="'; //Here we can add the other function
        siteCard += myConstructor[0];
        siteCard += '"><div class="text" id="text';
        siteCard += singleRow;
        siteCard += '">Like</div><div class="heart" id="hrt';
        siteCard += singleRow;
        siteCard += '"></div></button></div></div>';
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
      console.log(lkdId)
      let txtId = String(theTxt);
      let hrtId = String(hrt);
      document.getElementById(lkdId).style.backgroundColor = "#c4a35a";
      document.getElementById(txtId).style.color = "#e5e5dc";
      let change2Lkd = document.getElementById(txtId);
      change2Lkd.innerHTML = 'Liked';
      document.getElementById(hrtId).style.backgroundPosition = "right";
      document.getElementById(hrtId).style.animation = "animate .8s steps(28) 1";
      document.getElementById(hrtId).style.color = "#000";
      console.log(objectDict);
      let destObject = objectDict[lkdId];
      destObject.addMarker();
      const displayRight = shedule.html.getElementById('schedule-right');
      console.log(displayRight);
      let writeHTML = destObject.htmlCode;
      displayRight.innerHTML = writeHTML;
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
    lndDay1(city);    
}



