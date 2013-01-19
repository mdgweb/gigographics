# Gigographics - a MHD Stockholm experiment
# (c) 2013 MDG Web - http://mdg.io && http://seevl.net

from instagram.client import InstagramAPI
from songkick import Songkick

from settings import instagram_client, instagram_secret, songkick_key, max_gigs

import calendar

class Gigographics(object):

    def __init__(self, artist_id):
        self.artist_id = artist_id
        self.data = {}

    def instagraph_pictures(self, venue, timestamp, window):
        """Get Instagram pictures for a venue/location in a give timeframe"""
        
        ## Pictures
        pictures = []
        
        ## Get instagram locations around this lat/long with a name matching/including the venue name
        instagram = InstagramAPI(client_id=instagram_client, client_secret=instagram_secret)
        locations = filter(lambda x: venue['name'].lower() in x.name.lower(), instagram.location_search(lat=venue['lat'], lng=venue['lng']))
        
        ## Get pictures for each location
        for location in locations:
            ## Get Instagram pictures for local events with a window around the starting date
            min_timestamp = timestamp - window[0]*3600
            max_timestamp = timestamp + window[1]*3600
            
            recent_media = instagram.location_recent_media(location_id=location.id, min_timestamp=min_timestamp, max_timestamp=max_timestamp)[0]
            
            ## Add to pictures list with caption and user info
            for media in recent_media:
                pictures.append({
                    'thumbnail' : media.images['thumbnail'].url,
                    'standard' : media.images['standard_resolution'].url,
                    'caption' : media.caption.text if media.caption else '',
                    'user' : media.user.username,
                })
                
        return pictures

    def get_gigography(self):
        """Get SongKick gigography for an artist"""

        ## Get SongKick gigography and skip events w/o geolocation nor start_date
        songkick = Songkick(api_key=songkick_key)
        events = songkick.gigography.query(artist_id=self.artist_id, order='desc', per_page=max_gigs)

        ## Add relevant events to the object
        for event in events:

            ## Event infos
            event_id = event.id
            event_start = event.event_start.datetime
            if event_start:
                timestamp = calendar.timegm(event_start.timetuple())
            else:
                continue ## FIXME

            ## Coordinates required 
            venue_lat = event.venue.latitude
            venue_lng = event.venue.longitude
            if not(venue_lat and venue_lng):
                continue

            ## Append to dictionary
            self.data[event_id] = {
                'name' : event.display_name,
                'date' : str(event.event_start.date),
                'timestamp' : timestamp,
                'venue' : {
                    'name' : event.venue.display_name,
                    'lat' : venue_lat,
                    'lng' : venue_lng,
                    'city' : event.location.city,
                    'country' : event.venue.metro_area.country
                }
            }

    def get_pictures(self):
        """Get all pictures from artist's gigography"""

        ## For all gigs from the artist
        for event_id in self.data.keys():
            gig = self.data[event_id]
            ## Get instagram pictures taken from 2-hours-before to 4-hours-after a show for the venue name + location
            window = [2,4]
            pictures = self.instagraph_pictures(gig['venue'], gig['timestamp'], window)
            ## Keep only events with pictures
            if pictures:
                self.data[event_id].update({
                    'pictures' : pictures
                })
            else:
                del self.data[event_id]

    def go(self):
        self.get_gigography()
        self.get_pictures()