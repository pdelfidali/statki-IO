import os.path
from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from pathlib import Path
from flask_login import LoginManager
from flask_migrate import Migrate

bootstrap = Bootstrap()
db = SQLAlchemy()
basedir = Path(__file__).parent.absolute()
login_manager = LoginManager()
migrate = Migrate()


def create_app():
    '''
    Funkcja zwraca zainicjalizowaną aplikację
    :return:
    app
    '''
    app = Flask(__name__)
    bootstrap.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    app.config['SECRET_KEY'] = 'Sentino'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    @app.route('/')
    @app.route('/index')
    def index():
        return render_template('index.html')

    from app.auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from app.profile import profile as profile_blueprint
    app.register_blueprint(profile_blueprint)

    from app.statistics import statistics as statistics_blueprint
    app.register_blueprint(statistics_blueprint)

    @app.route('/manual')
    def manual():
        return render_template('manual.html')

    from app.game import game as game_blueprint
    app.register_blueprint(game_blueprint)

    @app.route('/close')
    def close():
        return render_template('close.html')

    @app.errorhandler(401)
    def error401(e):
        return render_template('401.html')

    @app.errorhandler(404)
    def error404(e):
        return render_template('404.html')

    @app.errorhandler(500)
    def error500(e):
        return render_template('500.html')

    return app
