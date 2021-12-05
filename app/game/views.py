from flask import request, jsonify, redirect, render_template, json, flash, session
from sqlalchemy import true, false

from . import game
from ..statistics.views import upload_resuls_after_game
from .. import db
from ..models import Game, User
from flask_login import current_user, login_required
from wtforms import SubmitField, StringField, PasswordField
from wtforms.validators import DataRequired
from flask_wtf import FlaskForm


@game.route('/game_summary', methods=['GET', 'POST'])
def summary():
    '''
    Endpoint który przyjmuje dane po rozgrywce i przekazuje je do bazy danych
    '''
    if request.method == "POST" and request.get_json():
        data = request.get_json()
        upload_resuls_after_game(data['player'], "true", data['shots'], data['points'])
        upload_resuls_after_game(data['second_player'], "false", data['second_shots'], data['second_points'])
        add_game(data)
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    return redirect('/game')


@login_required
@game.route('/game', methods=['POST', 'GET'])
def play():
    return render_template('game.html')


def add_game(gameData):
    game = Game(
        player1=gameData['player'],
        player2=gameData['second_player'],
        player1_ships=str(gameData['ships']),
        player2_ships=str(gameData['second_ships']),
        player1_shots=str(gameData['shot_list']),
        player2_shots=str(gameData['second_shot_list']),
    )
    db.session.add(game)
    db.session.commit()


@game.route('/pregame', methods=['POST', 'GET'])
def pregame():
    return render_template('pregame.html')


class LogoutForm(FlaskForm):
    logout = SubmitField('Wyloguj się')


class LoginForm(FlaskForm):
    username = StringField('Wprowadź swój nick:', validators=[DataRequired(message='Pole nie może być puste')])
    password = PasswordField('Wprowadź hasło:', validators=[DataRequired(message='Pole nie może być puste')])
    submit = SubmitField('Zaloguj się')


@login_required
@game.route('/game/pvp', methods=['POST', 'GET'])
def pvp():
    form = LoginForm()
    form2 = LogoutForm()
    player2 = None
    if form2.validate_on_submit() and form2.logout.data:
        session.pop('Second Player', None)
        print(form2.logout.data)
    elif session.get('Second Player'):
        player2 = User.query.filter_by(username=session.get('Second Player')).first()
    elif form.validate_on_submit():
        player2 = User.query.filter_by(username=form.username.data).first()
        if player2 and player2.verify_password(form.password.data) and player2.username != current_user.username:
            session['Second Player'] = player2.username
            flash(f'Poprawnie zalogowano użytkownika o nicku {player2.username}!')
        else:
            player2 = None
    return render_template('pvp.html', form=form, form2=form2, player2=player2)
