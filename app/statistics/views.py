import sqlalchemy
from sqlalchemy import select, cast, Float
from . import statistics
from app.models import *
from flask import render_template, redirect, url_for, request, flash
from flask_login import current_user

ROWS_PER_PAGE = 4

# temp
def nowi_goscie(username, gt=0, gw=0, st=0, sh=0):
    stat_test = Stat(username=username, games_total_count=gt, games_won_count=gw, shot_total_count=st, shot_hit_count=sh)
    try:
        db.session.add(stat_test)
        db.session.commit()
        return redirect('/')
    except sqlalchemy.exc.IntegrityError:
        flash(f'goscie nie dzialaja')

def upload_resuls_after_game(username, games_won, shot_total, shot_hit):
    user = Stat.query.filter_by(username=username).first()
    if user:
        try:
            user.change_statistics(games_won, shot_total, shot_hit)
            db.session.commit()
        except:
            flash(f'nie udalo sie zapisac danych do bazy danych')


@statistics.route('/statistics/<int:ann_id>', methods=['GET'])
def print_top5(ann_id):
    page = request.args.get('page', ann_id, type=int)
    user_best = Stat.query.with_entities(Stat.username, (cast(Stat.games_won_count, sqlalchemy.Float)/Stat.games_total_count).label('games'), (cast(Stat.shot_hit_count, sqlalchemy.Float)/Stat.shot_total_count).label('shots')).\
        paginate(page=page, per_page=ROWS_PER_PAGE)
    # users_best = Stat.query.paginate(page=page, per_page=ROWS_PER_PAGE)

    # # pokazuje wyniki obecnego uzytkownika
    # my_stats = ''
    # if current_user.is_authenticated:
    #     my_stats = Stat.query.filter_by(username=current_user.username).first()
    return render_template('bootstrap_table.html', title='Bootstrap Table',
                           users=user_best)