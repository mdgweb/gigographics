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
            // TODO: Do stuff here with the id
        }
    });
          
    // Deezer player in iFrame w/ auto-resize
    $(window).resize(function(e) {
        var windowWidth = $(window).width();
        var w = $('#player').attr('width', windowWidth);
    });
    var windowWidth = $(window).width();
    var deezer_id = 30595446 // Get form API and update player for artist tracks
    $('footer').html('<iframe id="player" scrolling="no" frameborder="0" allowTransparency="true" src="http://www.deezer.com/en/plugins/player?autoplay=true&&amp;height=80&amp;cover=true&amp;type=playlist&amp;id=' + deezer_id + '" width="' + windowWidth + '" height="80"></iframe>');
    
    $.gigographics= new Array();

    /*
     Basic Setup
     */
    var latLng = new google.maps.LatLng(59.32893,18.06491);

    var myOptions = {
/*        panControl: false,
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
*/        zoom: 4,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP //   ROADMAP; SATELLITE; HYBRID; TERRAIN;
    };

    $.gigographics.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    var locations = [
                     ['Bondi Beach', -33.890542, 151.274856, 4],
                     ['Coogee Beach', -33.923036, 151.259052, 5],
                     ['Cronulla Beach', -34.028249, 151.157507, 3],
                     ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
                     ['Maroubra Beach', -33.950198, 151.259302, 1]
                     ];

    add_markers(locations);

/*    var params= {
        'title' : 'Spotify',
        'lat' : 59.32893,
        'lng' : 18.06491,
        'content' : 'Stockholm city'
    }
    add_marker(params);
    
    params= {
        'title' : 'Dropkick',
        'lat' : 55.8550553,
        'lng' : -4.2369184,
        'content' : 'Dropkick gig'
    }
    
    add_marker(params);
*/
}
