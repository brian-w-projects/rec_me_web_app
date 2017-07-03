from app import celery
import requests
import json


@celery.task(bind=True)
def celery_render_recs(self, token, page, params):
    self.update_state(state='PROGRESS')
    to_display = requests.get('https://rec-me.herokuapp.com/api1/search/recs/'+str(page), params=params,
                              auth=(token,''))
    if to_display.status_code == 200:
        self.update_state(state='FINISHED')
        return sorted(to_display.json().values(), key=lambda x: x['id'], reverse=True)
    self.update_state(state='ERROR')
    return None


@celery.task()
def celery_post_recs(token, title, text, public):
    payload = json.dumps({'title': title, 'text': text, 'public': public})
    header = {'Content-Type':'application/json'}
    requests.post('https://rec-me.herokuapp.com/api1/recs', headers=header, data=payload, auth=(token,''))


@celery.task()
def celery_post_comments(token, text, id):
    payload = json.dumps({'text': text})
    header = {'Content-Type':'application/json'}
    r = requests.post('https://rec-me.herokuapp.com/api1/recs/'+str(id)+'/comments', headers=header,
                  data=payload, auth=(token,''))