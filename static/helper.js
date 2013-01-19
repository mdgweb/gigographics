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

function concerts(artist_id) {
    $.ajax({
        'type': "GET",
//        'xhrFields': {
//        'withCredentials': true
//        },
//        'crossDomain': true,
        url: "http://localhost:5000/gigographics/" + artist_id,
        dataType: "json",
        success: function(data) {
           generate_map(data);
        },
        error : function(error) {
           console.log(error);
        }
    });
}

function generate_map(locations) {

    $.gigographics.markers= [];
    $.gigographics.explanations= [];

    var infowindow = new google.maps.InfoWindow();

    var marker, i= 0;

    $.each(locations, function(key, value) {

        var venue= value.venue;
           
        // Generate markers
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(venue.lat, venue.lng),
            map: $.gigographics.map
        });
        var explanation= '<div class="concert_location">' +
                        '<h4>' + venue.name + '</h4>' +
                        //'LAT: ' + locations[i][1] +
                        //'LONG: ' + locations[i][2] +
                        '<a>Link to instagram images</a>' +
                        '</div>'

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(explanation);
                infowindow.open($.gigographics.map, marker);
            }
        })(marker, i));

        $.gigographics.markers[i]= marker;
        $.gigographics.explanations[i]= explanation;

        // Generate list
        var li= $('<li>',{
            'class' : 'concert_trigger',
            'marker-index' : i
        })
        .append($('<div>',{
            'class' : 'date'
        }).text(value.date))
        /*        .append($('<div>',{
            'class' : 'city'
        }).text(value.))
        */
        .append($('<div>',{
            'class' : 'place'
        }).text(value.name));

        $('#concerts').append(li);

        i++;
    });

    $('.concert_trigger').on('click', function(event) {
        var i= $(this).attr('marker-index');
        infowindow.setContent($.gigographics.explanations[i]);
        infowindow.open($.gigographics.map, $.gigographics.markers[i]);
    });
    
}
