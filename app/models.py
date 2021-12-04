from sqlalchemy import false

from . import db, login_manager
from werkzeug.security import  generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(25), unique=True, index=True)
    image_file = db.Column(db.String(120), nullable=False, default='default.jpg')
    password_hash = db.Column(db.String(128))

    def password(self):
        raise AttributeError('User.password is protected')

    def newpassword(self, newPassword):
        self.password_hash = generate_password_hash(newPassword)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    def __repr__(self):
        return f'{self.id}: {self.username}'

class Stat(db.Model):
    __tablename__ = 'stat'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(25), unique=True, index=True)
    games_total_count = db.Column(db.Integer, default=0)
    games_won_count = db.Column(db.Integer, default=0)
    shot_total_count = db.Column(db.Integer, default=0)
    shot_hit_count = db.Column(db.Integer, default=0)

    def change_statistics(self, games_won='false', shot_total=0, shot_hits=0):
        self.games_total_count += 1
        self.shot_total_count += shot_total
        self.shot_hit_count += shot_hits
        if games_won == 'true':
            self.games_won_count += 1

    def __repr__(self):
        return f'{self.id}: {self.username}'