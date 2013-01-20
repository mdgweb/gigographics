window.onload = function() {

    // Autocompletion for artists
    $("#artist").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "http://api.songkick.com/api/3.0/search/artists.json?apikey=hackday&query=" + request.term + "&jsoncallback=?",
                dataType: "jsonp",
                success: function(data) {
                    var artists = data.resultsPage.results.artist;
                    if (artists != undefined) {
                        response($.map(artists, function(artist) {
                            return {
                                label: artist.displayName,
                                id: artist.id
                            }
                        }));
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        },
        minLength: 3,
        select: function(event, ui) {
            var artist_id = ui.item.id;
            var artist_name = ui.item.label;
            concerts(artist_id, artist_name);
        }
    });
    
    // Setup Deezer player
    set_deezer_player()

    // Prepare map
    var latLng = new google.maps.LatLng(59.32893,18.06491);

    var myOptions = {
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        draggable: true,
        disableDoubleClickZoom: true,     //disable zooming
        scrollwheel: true,
        zoom: 4,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP //   ROADMAP; SATELLITE; HYBRID; TERRAIN;
    };

    // Prepare global elements
    $.gigographics = {
        'map' : new google.maps.Map(document.getElementById("map_canvas"), myOptions),
        'markers' : [],
        'content' : [],
    }
}

// Deezer player setup
function set_deezer_player() {
    DZ.init({
        appId  : '111393',
        channelUrl : 'http://localhost:5000/channel',
        player : {
            container : 'player',
            cover : true,
            playlist : false,
            width : $(window).width(),
            height : 80,
        }
    });
}

// Play query in Deezer player
function deezer_play(query) {
    DZ.api('/search/?q=' + query + '&index=0&nb_items=5&output=json', function(response) {
        var tracks = $.map(response.data, function(track) { return track.id })
        if(tracks.length) {
            DZ.player.playTracks(tracks);
        }
    });
}

// Play track (artist name + track name) in Deezer player
function deezer_play_track(artist_name, track_name) {
    return deezer_play(artist_name + '+' + track_name);
}

// Play arstist (top tracks) in Deezer player
function deezer_play_artist(artist_name) {
    return deezer_play(artist_name);
}

