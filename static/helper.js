/***************************************
 * MARKER
 ***************************************/

/*
//for custom image
var image = 'yourflag.png';
icon: image

//for animation marker drop
animation: google.maps.Animation.DROP    
}
*/	

function concerts(artist_id, artist_name) {
    // Hide helper
    $('#helper').hide();
    // Show concerts section
    $('#concerts h1').text(artist_name);
    $('#concerts').show();
    // Get concert data
    $.ajax({
        'type': "GET",
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

    $('#instagram').hide();

    $.gigographics.id= [];
    $.gigographics.markers= [];
    $.gigographics.explanations= [];

    // Clear list
    $('#concerts > ul').html('');
    
    var infowindow = new google.maps.InfoWindow();

    var marker, i= 0;

    $.each(locations, function(key, value) {


        // Create setlist
        var songs = value.songs;
        var setlist = '';
        if(songs != undefined) {
            setlist = '<ul>';
            $.each(songs, function(index, song) {
                setlist += '<li><a href="#" class="play_song" data-song_title="' + song['title'] + '" data-artist_name="' + song['artist']['name'] + '">' + song['title'] + '</a></li>'
            });
            setlist += '</ul>'
        }

        var venue= value.venue;
           
        // Generate markers
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(venue.lat, venue.lng),
            map: $.gigographics.map
        });
        var explanation = '' +
            '<div class="concert_location">' +
                '<h4>' + venue.name + '</h4>' +
                setlist +
            '</div>'

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(explanation);
                infowindow.open($.gigographics.map, marker);
                var latLng = marker.getPosition(); // returns LatLng object
                $.gigographics.map.setCenter(latLng); // setCenter takes a LatLng object
                instagram(value.pictures, i);
            }
        })(marker, i));

        $.gigographics.markers[i]= marker;
        $.gigographics.explanations[i]= explanation;

        // Generate list
        var li= $('<li>',{
            'class' : 'concert_trigger',
            'marker-index' : i,
            'marker-id' : key
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

        // Hide loading elements and show values
        $('#concerts > #loading').hide();
        $('#concerts > ul').append(li);
        
        i++;
    });

    $(document).on("click", "a.play_song", function(e) {
        var song = $(this).attr('data-song_title');
        var artist = $(this).attr('data-artist_name');
        return deezer_track_player(song, artist);
    });
    
    
    $('.concert_trigger').on('click', function(event) {
        infowindow.setContent($.gigographics.explanations[i]);
        infowindow.open($.gigographics.map, $.gigographics.markers[i]);
        var latLng = $.gigographics.markers[i].getPosition(); // returns LatLng object
        $.gigographics.map.setCenter(latLng); // setCenter takes a LatLng object
        instagram(locations[$(this).attr('marker-id')].pictures);
    });

}

function instagram(data) {
    $('#instagram > ul').html('');
    $('#instagram').show();
    $.each(data, function(key, value) {
        var li= $('<li>', {
            'class' : 'instagram_trigger'
        })
        .append($('<img />', {
            'src' : value.thumbnail
        }));
        $('#instagram > ul').append(li);
    });
}