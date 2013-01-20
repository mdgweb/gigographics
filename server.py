# Gigographics - a MHD Stockholm experiment
# (c) 2013 MDG Web - http://mdg.io && http://seevl.net

from flask import Flask, jsonify, render_template, abort
from settings import songkick_key

from gigographics import Gigographics
from search import Search

## Flask APP
app = Flask(__name__)

## Main page
@app.route('/')
def home():
    return render_template('index.html', songkick_key = songkick_key)

## Search/autocomplete
@app.route('/search/<query>')
def search(query):
    return jsonify(Search(query).go())

## Deezer channel file
@app.route('/channel')
def channel():
    return render_template('channel.html')

## Gigographics data
@app.route('/data/<artist_id>')
def gigographics(artist_id):
    g = Gigographics(artist_id)
    return jsonify(g.go())

if __name__ == '__main__':
    app.debug = True
    app.run()
    