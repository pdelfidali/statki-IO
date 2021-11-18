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
