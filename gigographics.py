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

    def instagram_pictures(self, venue, timestamp, window, distance):
        """Get Instagram pictures for a venue/location in a give timeframe"""
        
        ## Get instagram pictures taken nearby the venue in a time window around the start date
        instagram = InstagramAPI(client_id=instagram_client, client_secret=instagram_secret)
        min_timestamp = timestamp - window[0]*3600
        max_timestamp = timestamp + window[1]*3600

        try:
            media = instagram.media_search(lat=venue['lat'], lng=venue['lng'], min_timestamp=min_timestamp, max_timestamp=max_timestamp, distance=distance)
        
            ## Filter to get maching only pics in a location thates match the venue name
            media = filter(lambda x: venue['name'].lower() in x.location.name.lower(), media)

            ## Return pictures
            return map(lambda media: {
                'thumbnail' : media.images['thumbnail'].url,
                'standard' : media.images['standard_resolution'].url,
                'caption' : media.caption.text if media.caption else '',
                'user' : media.user.username,
            }, media)

        ## Instagram API errors
        except:
            return []


    def get_gigography(self):
        """Get SongKick gigography for an artist"""

        ## Get SongKick gigography and skip events w/o geolocation nor start_date
        songkick = Songkick(api_key=songkick_key)
        for event in songkick.gigography.query(artist_id=self.artist_id, order='desc', per_page=max_gigs):

            ## Coordinates required 
            venue_lat = event.venue.latitude
            venue_lng = event.venue.longitude
            if not(venue_lat and venue_lng):
                continue

            ## Event infos
            event_id = event.id
            event_start = event.event_start.datetime
            if event_start:
                timestamp = calendar.timegm(event_start.timetuple())
            else:
                continue ## FIXME

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
            window = [1,3]
            distance = 0.01
            self.data[event_id].update({
                'pictures' : self.instagram_pictures(gig['venue'], gig['timestamp'], window, distance)
            })

    def go(self):
        self.get_gigography()
        self.get_pictures()