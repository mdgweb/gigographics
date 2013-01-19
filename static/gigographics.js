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
                }
            });
        },
        minLength: 3,
        select: function(event, ui) {
            var artist_id = ui.item.id;
            var artist_name = ui.item.label;

            // Get the concert listing + pictures from the /gigography/artist_id URI
            // Launch artist player
            deezer_artist_player(artist_name)
        }
    });
    
    var windowWidth = $(window).width();
    DZ.init({
        appId  : '111393',
        channelUrl : 'http://localhost:5000/channel',
        player : {
            container : 'player',
            cover : true,
            playlist : false,
            width : windowWidth,
            height : 80,
        }
    });

    function deezer_artist_player(artist_name) {
        DZ.api('/search/?q=' + artist_name + '&index=0&nb_items=5&output=json', function(response) {
            var tracks = $.map(response.data, function(track) { return track.id })
            DZ.player.playTracks(tracks);
        });
    }

    $.gigographics= new Array();

    /*
     Basic Setup
     */
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
        zoom: 20,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP //   ROADMAP; SATELLITE; HYBRID; TERRAIN;
    };

    $.gigographics.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    var params= {
        'title' : 'Stockholm',
        'lat' : 59.32893,
        'lng' : 18.06491,
        'content' : 'Stockholm city'
    }
    add_marker(params);

}
