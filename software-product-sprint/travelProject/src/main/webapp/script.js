
var map;
function initMap(){
    //Map options
    var options = {
        zoom: 9,
        center: {lat: 51.5074,lng: -0.1278}
    }
    //new map
    map = new google.maps.Map(document.getElementById('map'), options);
}

// This function is used specifically to show Big Ben on the map
function addDestination(){
    let BigBen = new Destination("Big Ben", "Famous landmark that represents London", {lat: 51.5007, lng: -0.1246}, "image")
    BigBen.addMarker();
}

class Destination{
    constructor(name, info, position, image){
        this.name = name;
        this.info = info;
        this.position = position;
        this.image = image;
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
        })
    }   
}