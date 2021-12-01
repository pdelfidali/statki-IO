import sqlalchemy
from . import statistics
from app.models import *
from flask import render_template, redirect, url_for, request, flash
from flask_login import current_user

# temp
def nowi_goscie(username, gt=0, gw=0, st=0, sh=0):
    stat_test = Stat(username=username, games_total_count=gt, games_won_count=gw, shot_total_count=st, shot_hit_count=sh)
    try:
        db.session.add(stat_test)
        db.session.commit()
        return redirect('/')
    except sqlalchemy.exc.IntegrityError:
        flash(f'goscie nie dzialaja')

def upload_resuls_after_game(username, shot_total, shot_hit):
    user = Stat.query.filter_by(username=username).first()
    if user:
        user.change_statistics(shot_total, shot_hit)
        db.session.commit()

@statistics.route('/statistics', methods=['GET'])
def print_top5():
    # nowi_goscie('dd', 9808, 1111, 7358)
    # nowi_goscie('vdsdsd', 94538, 784, 98)
    # nowi_goscie('gsdds', 4444, 444, 44, 828)
    # nowi_goscie('aaaabgdbv', 9099)
    # upload_resuls_after_game('dupa', 10, 10)

    # czesc pierwsza pokazuje najlepszych pieciu graczy
    users_best = Stat.query
    my_stats = ''

    # pokazuje wyniki obecnego uzytkownika
    if current_user.is_authenticated:
        my_stats = Stat.query.filter_by(username=current_user.username).first()
    return render_template('bootstrap_table.html', title='Bootstrap Table',
                           users=users_best, moje=my_stats)