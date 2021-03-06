from flask import request, redirect, render_template, json, flash, session
from flask_login import current_user, login_required
from flask_wtf import FlaskForm
from sqlalchemy import desc
from wtforms import SubmitField, StringField, PasswordField
from wtforms.validators import DataRequired

from . import game
from .. import db
from ..models import Game, User
from ..statistics.views import upload_results_after_game


@game.route('/game_summary', methods=['POST'])
def summary():
    """
    Endpoint który przyjmuje dane po rozgrywce i przekazuje je do bazy danych
    """
    if request.method == "POST" and request.get_json():
        data = request.get_json()
        if data['points'] > data['second_points']:
            upload_results_after_game(data['player'], "true", data['shots'], data['points'])
            upload_results_after_game(data['second_player'], "false", data['second_shots'], data['second_points'])
        else:
            upload_results_after_game(data['player'], "false", data['shots'], data['points'])
            upload_results_after_game(data['second_player'], "true", data['second_shots'], data['second_points'])
        add_game(data)
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    return redirect('/game')


@game.route('/game', methods=['POST', 'GET'])
@login_required
def play():
    if session.get('Second Player'):
        return render_template('game.html')
    else:
        flash('Drugi użytkownik musi być zalogowany żeby przejść do rozgrywki!')
        return redirect('/')


def add_game(game_data):
    game_dict = Game(
        player1=game_data['player'],
        player2=game_data['second_player'],
        player1_ships=str(game_data['ships']),
        player2_ships=str(game_data['second_ships']),
        player1_shots=str(game_data['shot_list']),
        player2_shots=str(game_data['second_shot_list']),
        winner=int(game_data['winner'])
    )
    db.session.add(game_dict)
    db.session.commit()


@game.route('/pregame', methods=['POST', 'GET'])
@login_required
def pregame():
    session.pop('Second Player', None)
    return render_template('pregame.html')


class LogoutForm(FlaskForm):
    logout = SubmitField('Wyloguj się')


class LoginForm(FlaskForm):
    username = StringField('Wprowadź swój nick:', validators=[DataRequired(message='Pole nie może być puste')])
    password = PasswordField('Wprowadź hasło:', validators=[DataRequired(message='Pole nie może być puste')])
    submit = SubmitField('Zaloguj się')


@game.route('/game/pvp', methods=['POST', 'GET'])
@login_required
def pvp():
    form = LoginForm()
    form2 = LogoutForm()
    player2 = None
    if form2.validate_on_submit() and form2.logout.data:
        session.pop('Second Player', None)
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


@game.route('/replay/<rep_id>/', methods=['GET', 'POST'])
def replay(rep_id):
    rep = Game.query.filter_by(id=rep_id).first()
    return render_template('replay.html', game=rep)


@game.route('/replays/<int:page_num>/', methods=['GET'])
def history(page_num):
    games = Game.query.order_by(desc('id')).paginate(page=page_num, per_page=3)
    return render_template('history.html', games=games)


@game.route('/replays', methods=['GET'])
@game.route('/replay', methods=['GET'])
def redirect_history():
    return redirect('/replays/1')


@game.route('/computer', methods=['GET'])
def computer():
    return render_template('computer.html')


@game.route('/cvc_pre', methods=['GET', 'POST'])
def cvc_pre():
    return render_template('cvc_pregame.html')


@game.route('/cvc', methods=['GET', 'POST'])
def cvc():
    return render_template('cvc.html')
