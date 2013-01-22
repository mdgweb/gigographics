# Gigographics - a MHD Stockholm experiment
# (c) 2013 MDG Web - http://mdg.io && http://seevl.net

import urllib2
from json import loads
import calendar

from settings import instagram_client, instagram_secret, songkick_key, max_gigs

from instagram.client import InstagramAPI
from instagram.bind import InstagramClientError, InstagramAPIError
from songkick import Songkick

class Gigographics(object):

    def __init__(self, mbz_id):
        self.mbz_id = mbz_id
        self.data = {}
        
    def instagram_pictures(self, venue, timestamp, window, distance, retry=True):
        """Get Instagram pictures for a venue/location in a give timeframe"""
        
        ## Get instagram pictures taken nearby the venue in a time window around the start date
        instagram = InstagramAPI(client_id=instagram_client, client_secret=instagram_secret)
        min_timestamp = timestamp - window[0]*3600
        max_timestamp = timestamp + window[1]*3600

        ## Retry to intercept the random "Oops, an error occurred" answer and other API errors - retry only once
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

        ## Instagram API errors (retry only once)
        except InstagramAPIError as e:
            if e.status_code == '400' and retry:
                return self.instagram_pictures(venue, timestamp, window, distance, retry=False)
        except InstagramClientError as e:
            return self.instagram_pictures(venue, timestamp, window, distance, retry=False)

    def add_pictures(self):
        """Get all pictures from artist's gigography"""
        for event_id in self.data.keys():
            gig = self.data[event_id]
            ## Get instagram pictures taken from 2-hours-before to 4-hours-after a show for the venue name + location
            window = [1,3]
            distance = 0.01
            pictures = self.instagram_pictures(gig['venue'], gig['timestamp'], window, distance)
            ## Add pictures if anything available
            if pictures:
                self.data[event_id].update({
                    'pictures' : pictures
                })

    def add_setlists(self):
        """Get setlist.fm setlists for an artists, mapped to the last concerts"""
        url = "http://api.setlist.fm/rest/0.1/artist/%s/setlists.json" %(self.mbz_id)
        json = loads(urllib2.urlopen(urllib2.Request(url)).read())
        ## Get setlists/concerts for the artist
        for setlist in json['setlists']['setlist']:
            ## Get sets for each setlist/concert
            sets = setlist.get('sets')
            if sets:                
                ## Get event date and change formatting to with exiting event IDs
                event_date = setlist['@eventDate']
                event_id = "%s-%s-%s" %(event_date[-4:], event_date[3:5], event_date[0:2])
                ## Get songs from all sets
                songs = [{
                    'artist' : {
                        'name' : song['cover']['@name'] if song.get('cover') else setlist['artist']['@name'],
                        'mbz_id' : song['cover']['@mbid'] if song.get('cover') else self.mbz_id
                    },
                    'cover' : 1 if song.get('cover') else 0,
                    'title' : song['@name']
                    } for song_set in filter(lambda song: type(song) == dict, sets['set']) for song in song_set['song']]
                ## Add songs to existing data
                if songs and self.data.get(event_id):
                    self.data[event_id].update({
                        'songs' : songs
                    })
                    self.data[event_id].update({
                        'lastfm_id' : setlist.get('@lastFmEventId'),
                        'setlist_id' : setlist.get('@id')
                    })

    def get_gigography(self):
        """Get SongKick gigography for an artist"""

        ## Get SongKick gigography and skip events w/o geolocation nor start_date
        songkick = Songkick(api_key=songkick_key)
        for event in songkick.gigography.query(musicbrainz_id=self.mbz_id, order='desc', per_page=max_gigs):
            
            ## Coordinates required 
            venue_lat = event.venue.latitude
            venue_lng = event.venue.longitude
            if not(venue_lat and venue_lng):
                continue

            ## Event infos
            event_id = str(event.event_start.date) ## Do not use event_id, easier to map with setlist.fm data
            event_start = event.event_start.datetime
            if event_start:
                timestamp = calendar.timegm(event_start.timetuple())
            else:
                continue ## FIXME

            ## Append to dictionary

            self.data[event_id] = {
                'name' : event.display_name,
                'songkick_id' : event.id,
                'date' : str(event.event_start.date),
                'timestamp' : timestamp,
                'venue' : {
                    'songkick_id' : event.venue.id,
                    'name' : event.venue.display_name,
                    'lat' : venue_lat,
                    'lng' : venue_lng,
                    'city' : event.location.city,
                    'country' : event.venue.metro_area.country
                }
            }

    def go(self):
        self.get_gigography()
        self.add_setlists()
        self.add_pictures()
        return self.data