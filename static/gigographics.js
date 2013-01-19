window.onload = function() {

    // Autocompletion for artists
    $("#artist").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "http://api.songkick.com/api/3.0/search/artists.json?apikey=hackday&query=" + request.term + "&jsoncallback=?",
                dataType: "jsonp",
                success: function(data) {
                    var artists = data.resultsPage.results.artist;
                    response($.map(artists, function(artist) {
                        return {
                            label: artist.displayName,
                            id: artist.id
                        }
                    }));
                }
            });
        },
        minLength: 3,
        select: function(event, ui) {
            var artist_id = ui.item.id;
            // TODO: Do stuff here with the id
        }
    });
          
    $.gigographics= new Array();

    /*
     Basic Setup
     */
    var latLng = new google.maps.LatLng(59.32893,18.06491);

    var myOptions = {
        panControl: false,
        zoomControl: true,
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
