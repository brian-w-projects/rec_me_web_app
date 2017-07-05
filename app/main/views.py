from flask import render_template, request, jsonify, session, redirect, url_for, get_template_attribute
from . import main
from .forms import LoginForm, PostForm, CommentForm
from .. import redis_store
from ..tasks import celery_render_recs, celery_post_recs, celery_post_comments
import requests
from datetime import datetime
from flask_moment import _moment


@main.route('/recs_async')
def recs_async():
    id = request.args.get('id')
    task = celery_render_recs.AsyncResult(id)
    if task.state != 'SUCCESS':
        return jsonify({'status': 'PROGRESS'})
    to_process = task.get()
    if not to_process:
        return jsonify({'status': 'EMPTY'})
    for ele in to_process:
        ele['timestamp'] = datetime.strptime(ele['timestamp'], '%a, %d %b %Y %X %Z')
    to_return = get_template_attribute('macros/render.html', 'render_recs')
    return jsonify({'status': 'SUCCESS', 'inject': to_return(to_process, _moment)})


@main.route('/recs_async_begin')
def recs_async_begin(page='', term='', user=''):
    if 'user' in session and redis_store.get(session['user']):
        page = str(page) or str(request.args.get('page', '1'))
        term = term or str(request.args.get('term', ''))
        user = user or str(request.args.get('user', ''))
        params = {'user': user, 'term': term}
        task = celery_render_recs.apply_async([redis_store.get(session['user']).decode('utf-8'), page, params])
        return task.id
    else:
        return -1


@main.route('/comments_get')
def comments_get():
    if 'user' in session and redis_store.get(session['user']):
        id = str(request.args.get('id'))
        session['id'] = id
        r = requests.get('https://rec-me.herokuapp.com/api1/recs/'+str(id)+'/comments/'+str(1),
                        auth=(redis_store.get(session['user']).decode('utf-8'),''))
        if r.status_code == 200:
            to_return = get_template_attribute('macros/render.html', 'render_comments')
            if not r.json().values():
                return jsonify({'status': 'EMPTY'})
            to_process = r.json().values()
            for ele in to_process:
                ele['timestamp'] = datetime.strptime(ele['timestamp'], '%a, %d %b %Y %X %Z')
            return jsonify({'status': 'SUCCESS', 'inject':
                to_return(sorted(to_process, key=lambda x: x['id'], reverse=True), _moment)})
        else:
            return jsonify({'status': 'FAILED'})


@main.route('/post_comments', methods=['POST'])
def post_comments():
    comment_form = CommentForm(request.form)
    if comment_form.validate():
        text = comment_form.comment_text.data
        id = comment_form.comment_id.data
        celery_post_comments.apply_async([redis_store.get(session['user']).decode('utf-8'), text, id])
        to_return = get_template_attribute('macros/render.html', 'render_comment')
        to_render = {'author_username': session['user'], 'text': text, 'timestamp': datetime.utcnow()}
        return jsonify({'status': 'SUCCESS', 'inject': to_return(to_render, _moment), 'id': id})
    return jsonify({'status': 'FAILURE'})


@main.route('/post_recs', methods=['POST'])
def post_recs():
    post_form = PostForm(request.form)
    if post_form.validate():
        title = post_form.post_title.data
        text = post_form.post_text.data
        public = 'True' if post_form.post_public.data else 'False'
        celery_post_recs.apply_async([redis_store.get(session['user']).decode('utf-8'), title, text, public])
        return jsonify({'status': 'SUCCESS'})
    return jsonify({'status': 'FAILURE'})


@main.route('/logout')
def logout():
    if 'user' in session:
        redis_store.dump(session['user'])
    session.clear()
    return redirect(url_for('main.index'))


@main.route('/login', methods=['POST'])
def login():
    login_form = LoginForm(request.form)
    if login_form.validate():
        user = login_form.username.data
        password = login_form.password.data
        r = requests.get('https://rec-me.herokuapp.com/api1/token/new', auth=(user, password))
        if r.status_code == 200:
            session['user'] = user
            redis_store.set(user, r.json()['token'], 3600)
            return jsonify({'status': 'SUCCESS', 'id': recs_async_begin(user=user)})
    return jsonify({'status': 'FAILURE'})


@main.route('/')
def index():
    login_form = LoginForm(request.form)
    post_form = PostForm(request.form)
    comment_form = CommentForm(request.form)
    id = recs_async_begin(user=session['user']) if 'user' in session else -1
    return render_template('main/index.html', login_form=login_form, post_form=post_form,
                           comment_form=comment_form, id=id)
