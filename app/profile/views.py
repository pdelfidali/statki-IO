import os
import secrets

from PIL import Image
from flask import render_template, redirect, url_for, request, flash
from flask_login import current_user
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from sqlalchemy import text
from wtforms import PasswordField, SubmitField

from app import basedir, db
from app.models import *
from . import profile


class ChangeForm(FlaskForm):
    """
    Formularz do zmiany hasła i awatara gracza
    """
    old_password = PasswordField('Aktualne hasło')
    new_password = PasswordField('Nowe hasło')
    file = FileField('Zmień swój Awatar',
                     validators=[FileAllowed(['jpg', 'png'], message='Plik musi mieć rozszerzenie .jpg lub .png')])
    submit = SubmitField('Potwierdź')
    deactivate = SubmitField('Zdezaktywuj swoje konto')


def save_picture(form_picture):
    """
    Funkcja skalująca i zapisująca awatar gracza
    :param form_picture:  plik obrazy
    :return picture_fn: nazwa pliku który został przeskalowany i zapisany
    """
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(basedir, 'static/avatars', picture_fn)
    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)
    return picture_fn


def user_statistics(username):
    """
    :param username: user which profile is viewed
    :return: selected user statistics to print on profile page
    """
    sql = text(f"select username, games_total_count as games_count, "
               f"coalesce(cast(games_won_count as float)/nullif(games_total_count, 0), 0) as games, "
               f"coalesce(cast(shot_hit_count as float)/nullif(shot_total_count, 0), 0) as shots "
               f"from stat where username='{username}'")
    result = db.engine.execute(sql)
    for row in result:
        user_statistics = row
    return user_statistics


@profile.route('/profile/<username>', methods=['GET', 'POST'])
def show_user(username):
    """
    Endpoint renderujący profil użytkownika przekazanego w adresie URL
    :param username:
    :return:
    """
    user = User.query.filter_by(username=username).first()
    if user:
        image_file = url_for('static', filename=f'avatars/{user.image_file}')
        user_stats = user_statistics(username)
        form = ChangeForm()
        if form.validate_on_submit():
            if form.submit.data:
                if form.old_password.data and form.new_password.data:
                    user = User.query.filter_by(username=current_user.username).first()
                    if user.verify_password(form.old_password.data):
                        user.newpassword(form.new_password.data)
                        db.session.commit()
                        flash('Poprawnie zmieniono hasło')
                    else:
                        flash('Błędne hasło')
                if form.file.data:
                    user.image_file = save_picture(form.file.data)
                    db.session.commit()
                    return redirect(request.url)
            elif form.deactivate.data:
                User.deactivate_user(user)
                db.session.commit()
                return redirect('/logout')
        return render_template('profile.html', user=user, form=form, image_file=image_file, user_statistics=user_stats)
    else:
        flash(f'Użytkownik o nicku {username} nie istnieje')
        return redirect('/')
