from app import db, app
from app.models import Stat, User

if __name__ == '__main__':
    app.app_context().push()
    if not User.query.filter_by(username='Barbarossa').first():
        easy = User(username='Barbarossa', is_bot=True)
        db.session.add(easy)
    if not Stat.query.filter_by(username='Barbarossa').first():
        easy_stat = Stat(username='Barbarossa')
        db.session.add(easy_stat)
    if not User.query.filter_by(username='Kapitan Jack').first():
        medium = User(username='Kapitan Jack', is_bot=True)
        db.session.add(medium)
    if not Stat.query.filter_by(username='Kapitan Jack').first():
        medium_stat = Stat(username='Kapitan Jack')
        db.session.add(medium_stat)
    if not User.query.filter_by(username='Krzysztof Kolumb').first():
        hard = User(username='Krzysztof Kolumb', is_bot=True)
        db.session.add(hard)
    if not Stat.query.filter_by(username='Krzysztof Kolumb').first():
        hard_stat = Stat(username='Krzysztof Kolumb')
        db.session.add(hard_stat)
    db.session.commit()

