import sqlalchemy.exc
from flask import render_template, redirect, flash
from flask_login import login_user, logout_user, login_required
from flask_wtf import FlaskForm
from werkzeug.security import generate_password_hash
from wtforms import StringField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Length, Regexp

from app import db
from app.models import User, Stat
from . import auth


class RegisterForm(FlaskForm):
    """
    Formularz do rejestracji
    """
    username = StringField('Wprowadź swój username:',
                           validators=[DataRequired(message='Pole nie może być puste'),
                                       Length(min=5, max=20, message='Nazwa musi mieć od 5 do 20 znaków'),
                                       Regexp(r'^[\w.@+-]+$', message='Nazwa nie może zawierać spacji')])
    password = PasswordField('Wprowadź hasło:', validators=[DataRequired(message='Pole nie może być puste')])
    password2 = PasswordField('Potwierdź hasło:', validators=[DataRequired(message='Pole nie może być puste')])
    submit = SubmitField('Zatwierdź')


@auth.route('/register', methods=['GET', 'POST'])
def register():
    """
    Endpoint renderujący stronę z formularzem rejestracji w nowym oknie
    """
    form = RegisterForm()
    if form.validate_on_submit():
        if form.password.data == form.password2.data:
            user = User(username=form.username.data, password_hash=generate_password_hash(form.password.data))
            user_statistics = Stat(username=form.username.data)
            try:
                db.session.add(user)
                db.session.add(user_statistics)
                db.session.commit()
                flash(f'Poprawnie zarejestrowano użytkownika {form.username.data}')
                return redirect('/close')
            except sqlalchemy.exc.IntegrityError:
                flash(f'Nick jest juz uzywany przez kogos innego')
        else:
            flash("Hasła nie są takie same")
    return render_template('register.html', form=form)


class LoginForm(FlaskForm):
    """
    Formularz do logowania
    """
    username = StringField('Wprowadź swój nick:',
                           validators=[DataRequired(message='Pole nie może być puste'),
                                       Length(min=5, max=20, message='Nazwa musi mieć od 5 do 20 znaków'),
                                       Regexp(r'^[\w.@+-]+$', message='Nazwa nie może zawierać spacji')])
    password = PasswordField('Wprowadź hasło:', validators=[DataRequired(message='Pole nie może być puste')])
    remember_me = BooleanField('Nie wylogowywuj mnie')
    submit = SubmitField('Zaloguj się')


@auth.route('/login', methods=['GET', 'POST'])
def login():
    """
    Endpoint renderujący stronę z formularzem logowania w nowym oknie
    """
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.verify_password(form.password.data) and user.is_active:
            login_user(user, form.remember_me.data)
            flash(f'Poprawnie zalogowano użytkownika {form.username.data}')
            return redirect('/close')
        flash('Niepoprawny nick lub hasło')
    return render_template('auth.html', form=form)


@auth.route('/logout')
@login_required
def logout():
    """
    Endpoint który wylogowywuje użytkownika
    """
    logout_user()
    flash('Wylogowałeś się!')
    return redirect('/')
