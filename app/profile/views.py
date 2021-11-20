from . import profile
from app.models import *
from flask import render_template, redirect, url_for, request, flash
from wtforms import PasswordField, SubmitField
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms.validators import DataRequired
import secrets, os
from app import basedir, db
from PIL import Image

class ChangePasswordForm(FlaskForm):
    new_password = PasswordField('Wprowadź nowe hasło:', validators=[DataRequired(message='Pole nie może być puste')])
    new_password2 = PasswordField('Potwierdź nowe hasło:', validators=[DataRequired(message='Pole nie może być puste')])
    submit = SubmitField('Zatwierdź')

class ChangeAvatarForm(FlaskForm):
    file = FileField('Zmień swój Awatar', validators=[FileAllowed(['jpg', 'png'])])
    submit = SubmitField('Potwierdź')


def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(basedir, 'static/avatars', picture_fn)
    print(picture_path)
    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)
    return picture_fn

@profile.route('/profile/<username>', methods=['GET', 'POST'])
def show_user(username):
    user = User.query.filter_by(username=username).first()
    if user:
        image_file = url_for('static', filename=f'avatars/{user.image_file}')
        form = ChangeAvatarForm()
        if form.validate_on_submit():
            if form.file.data:
                user.image_file = save_picture(form.file.data)
                db.session.commit()
                return redirect(request.url)
        return render_template('profile.html', user=user, form=form, image_file=image_file)
    else:
        flash(f'Użytkownik o nicku {username} nie istnieje')
        return redirect('/')
