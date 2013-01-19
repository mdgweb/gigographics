/***************************************
 * MARKER
 ***************************************/

/*
//for custom image
var image = 'yourflag.png';
icon: image

//for animation marker drop
animation: google.maps.Animation.DROP


function add_marker(params) {
    var markerlatlng = new google.maps.LatLng(params.lat, params.lng);

    var marker = new google.maps.Marker({
        position: markerlatlng,
        title: params.title
    });

    marker.setMap($.gigographics.map);

    var explanation= '<div class="concert_location">' +
                            '<h4>' + params.title + '</h4>' +
                            params.content +
                    '</div>'
    
    myInfoWindowOptions = {
        content: explanation,
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
*/	

function add_markers(locations) {

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: $.gigographics.map
        });
        var explanation= '<div class="concert_location">' +
                        '<h4>' + locations[i][0] + '</h4>' +
                        'LAT: ' + locations[i][1] +
                        'LONG: ' + locations[i][2] +
                        '</div>'
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(explanation);
                infowindow.open($.gigographics.map, marker);
            }
        })(marker, i));
    }
}
