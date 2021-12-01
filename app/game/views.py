from flask import request, jsonify, redirect, render_template, json
from . import game
from ..statistics.views import upload_resuls_after_game

@game.route('/game_summary', methods=['GET','POST'])
def summary():
    if request.method == "POST" and request.get_json():
        data = request.get_json()
        upload_resuls_after_game(data['player'], data['shots'], data['points'])
        upload_resuls_after_game(data['second_player'], data['second_shots'], data['second_points'])
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    return redirect('/game')

@game.route('/game', methods=['POST', 'GET'])
def game():
    return render_template('game.html')