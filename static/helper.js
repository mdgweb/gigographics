/***************************************
 * MARKER
 ***************************************/

/*
//for custom image
var image = 'yourflag.png';
icon: image

//for animation marker drop
animation: google.maps.Animation.DROP

*/
function add_marker(params) {
    var markerlatlng = new google.maps.LatLng(params.lat, params.lng);

    var marker = new google.maps.Marker({
        position: markerlatlng,
        title: params.title
    });

    marker.setMap($.gigographics.map);

    /*
     INFO Bubble
     */

    myInfoWindowOptions = {
        content: '<div class="concert_location"><h4>' + params.title + '</h4>' + params.content + '</div>',
        maxWidth: 275
    };

    infoWindow = new google.maps.InfoWindow(myInfoWindowOptions);

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open($.gigographics.map, marker);
    });

    google.maps.event.addListener(marker, 'dragstart', function(){
        infoWindow.close();
    });

    infoWindow.open($.gigographics.map, marker);
    
}