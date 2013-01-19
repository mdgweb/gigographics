window.onload = function() {

    $.gigographics= new Array();

    /*
     Basic Setup
     */
    var latLng = new google.maps.LatLng(59.32893,18.06491);

    var myOptions = {
/*        panControl: false,
        zoomControl: true,
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
