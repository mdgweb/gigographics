# Gigographics - a MHD Stockholm experiment
# (c) 2013 MDG Web - http://mdg.io && http://seevl.net

import musicbrainzngs

class Search(object):

    def __init__(self, query):
        self.query = query
        musicbrainzngs.set_useragent("mdg.io", "0.1", "http://mdg.io")

    def go(self):
        query = self.query.lower() + '*'
        return {
            'results' : map(lambda artist: {
                'id'  : artist['id'],
                'name' : artist['sort-name']
            }, musicbrainzngs.search_artists(query.encode('utf-8'), limit=10).get('artist-list', []))
        }
