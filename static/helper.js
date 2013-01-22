/************************************************
* (c) 2012 MDG Web limited - All rights reserved
************************************************/

/***************************************
 * MARKER
 ***************************************/

function hide_helper() {
    $('#helper').hide();
    $('footer').show();
    $('header').show();
    $('#concerts').show();
}

function concerts(artist_id, artist_name) {
    
    var artist_name = artist_name || '';
    
    // Clear data
    clear();
    
    // Play artist
    deezer_play_artist(artist_name);
    
    // Hide helper and show header + footer
    hide_helper()

    // Show concerts section
    $('#concerts h1').text(artist_name);
    // Get concert data
    $.ajax({
        'type': "GET",
        url: "/data/" + artist_id,
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

    // Artist name if not already there
    if($('#concerts h1').text() == '') {
        $('#concerts h1').text(locations['artist']['name']);
    }

    // Clear list
    $('#concerts > ul').html('');
    
    var infowindow = new google.maps.InfoWindow();

    var marker, i= 0;

    locations= sortObj(locations);

    $.each(locations, function(key, value) {
        
        console.log(venue.lat);
        console.log(venue.long);
        if(!(venue.lat && venue.lng)) {
            continue;
        }

        // Create setlist
        var songs = value.songs;
        var setlist = '';
        if(songs != undefined) {
            setlist = '<ol>';
            $.each(songs, function(index, song) {
                setlist += '<li><a href="#" class="play_song" data-song_title="' + song['title'] + '" data-artist_name="' + song['artist']['name'] + '">' + song['title'] + '</a></li>'
            });
            setlist += '</ol>'
        }

        var venue= value.venue;
           
        // Generate markers
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(venue.lat, venue.lng),
            map: $.gigographics.map
        });
        var content = '' +
            '<div class="concert_location">' +
                '<h4>' + value.name + '</h4>' +
                setlist +
            '</div>'

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(content);
                infowindow.open($.gigographics.map, marker);
                var latLng = marker.getPosition(); // returns LatLng object
                var offset= ($(document).width() - 800) / 2;
                offsetCenter(latLng, offset, 0);
                instagram(value.pictures, i);
            }
        })(marker, i));

        $.gigographics.markers[i] = marker;
        $.gigographics.content[i] = content;

        // Generate list
        var li= $('<li>',{
            'class' : 'concert_trigger',
            'marker-index' : i,
            'marker-id' : key
        })
        .append($('<div>',{
            'class' : 'date'
        }).text(value.date))
        .append($('<div>',{
            'class' : 'place'
        }).text(value.name));

        // Hide loading elements and show values
        $('#concerts > #loading').hide();
        $('#concerts > ul').append(li);
        
        i++;
    });

    $.gigographics.map.panTo($.gigographics.markers[0].getPosition());

    $(document).on("click", "a.play_song", function(e) {
        var song = $(this).attr('data-song_title');
        var artist = $(this).attr('data-artist_name');
        return deezer_play_track(song, artist);
    });
    
    $('.concert_trigger').on('click', function(event) {
        var i = $(this).attr('marker-index');
        infowindow.setContent($.gigographics.content[i]);
        infowindow.open($.gigographics.map, $.gigographics.markers[i]);
        var latLng = $.gigographics.markers[i].getPosition(); // returns LatLng object
        var offset= ($(document).width() - 800) / 2;
        offsetCenter(latLng, offset, 0);
        instagram(locations[$(this).attr('marker-id')].pictures);
    });

}

function instagram(data) {
    $('#instagram').html('');
    if(data) {
        $('#instagram').show("slide", { direction: "left" }, 1000);
        $('#instagram').append($('<div>', {id : 'galleria'}))
        $.each(data, function(key, value) {
            var li= $('<img />', {
                'src' : value.standard
            });
            $('#instagram > #galleria').append(li);
        });
        $('#galleria').galleria({
            width: 400,
            height: 450
        });
    } else {
        $('#instagram').hide("slide", { direction: "left" }, 1000);
    }
}

function offsetCenter(latlng,offsetx,offsety) {

    var scale = Math.pow(2, $.gigographics.map.getZoom());
    var nw = new google.maps.LatLng(
        $.gigographics.map.getBounds().getNorthEast().lat(),
        $.gigographics.map.getBounds().getSouthWest().lng()
    );

    var worldCoordinateCenter = $.gigographics.map.getProjection().fromLatLngToPoint(latlng);
    var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

    var worldCoordinateNewCenter = new google.maps.Point(
        worldCoordinateCenter.x - pixelOffset.x,
        worldCoordinateCenter.y + pixelOffset.y
    );

    var newCenter = $.gigographics.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

    $.gigographics.map.panTo(newCenter);

}

function clear() {
    $('#instagram').empty();
    $('#instagram').hide("slide", { direction: "left" }, 1000);
    $('#concerts > ul').empty();
    for (var i=0; i < $.gigographics.markers.length; i++) {
        $.gigographics.markers[i].setMap(null);
    }
    $.gigographics.markers.length = 0;
    $('#concerts > #loading').show();
}

function sortObj(arr){
    // Setup Arrays
    var sortedKeys = new Array();
    var sortedObj = {};
    // Separate keys and sort them
    for (var i in arr){
        sortedKeys.push(i);
    }
    sortedKeys.sort();
    sortedKeys.reverse();
    // Reconstruct sorted obj based on keys
    for (var i in sortedKeys){
        sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
    }
    return sortedObj;
}

