# Gigographics - a MHD Stockholm experiment
# (c) 2013 MDG Web - http://mdg.io && http://seevl.net

from flask import Flask, jsonify, render_template, abort
from settings import songkick_key

from gigographics import Gigographics

## Flask APP
app = Flask(__name__)

## Main page
@app.route('/')
def home():
    return render_template('index.html', songkick_key = songkick_key)

## Deezer channel file
@app.route('/channel')
def channel():
    return render_template('channel.html')

## Gigographics data
@app.route('/gigographics/<artist_id>')
def gigographics(artist_id):
    artist_id = 'e8374874-4178-4869-b92e-fef6bf30dc04' ## Hardcoded while we fi the autocomplete with MBZ IDs
    g = Gigographics(artist_id)
    g.go()
    return jsonify(g.data)

if __name__ == '__main__':
    app.debug = True
    app.run()
    