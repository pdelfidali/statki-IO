import sqlalchemy
from flask import render_template, request, flash
from sqlalchemy import cast
from sqlalchemy import desc

from app.models import *
from . import statistics

ROWS_PER_PAGE = 20


def upload_results_after_game(username, games_won, shot_total, shot_hit):
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
    user_best = Stat.query.with_entities(Stat.username, Stat.games_total_count.label('games_count'),
                                         (cast(Stat.games_won_count, sqlalchemy.Float) / Stat.games_total_count).label(
                                             'games'),
                                         (cast(Stat.shot_hit_count, sqlalchemy.Float) / Stat.shot_total_count).label(
                                             'shots')). \
        order_by(desc('games')).paginate(page=page, per_page=ROWS_PER_PAGE)

    return render_template('statistics.html', title='Bootstrap Table',
                           users=user_best)
