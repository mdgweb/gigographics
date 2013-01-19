# Gigographics - a MHD Stockholm experiment
# (c) 2013 MDG Web - http://mdg.io && http://seevl.net

from flask import Flask, jsonify, render_template, abort

from gigographics import Gigographics

## Flask APP
app = Flask(__name__)

## Main page
@app.route('/')
def home():
    return render_template('index.html')

## Gigographics data
@app.route('/gigographics/<artist_id>')
def gigographics(artist_id):
    g = Gigographics(artist_id)
    g.go()
    return jsonify(g.data)

if __name__ == '__main__':
    app.debug = True
    app.run()
    