from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, TextAreaField, validators


class LoginForm(FlaskForm):
    username = StringField('Login')
    password = PasswordField('Password')
    submit = SubmitField('Submit')


class PostForm(FlaskForm):
    post_title = StringField('Title', validators=[validators.Length(max=100, min=1)])
    post_public = BooleanField('Public')
    post_text = TextAreaField('Text', validators=[validators.Length(max=500, min=1)])
    post_submit = SubmitField('Submit')


class CommentForm(FlaskForm):
    comment_text = TextAreaField('Text', validators=[validators.Length(max=250, min=1)])
    comment_id = StringField('ID');
    comment_submit = SubmitField('Submit')