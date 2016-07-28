from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.planning_current, name='index'),
    url(r'^activities$', views.activities, name='activities'),
    url(r'^users$', views.users, name='users'),

    url(r'^planning$', views.planning_current, name='planning'),
    url(r'^planning/([0-9]{4})/$', views.planning_year, name='planning'),
    url(r'^planning/status-([0-9]*)-(\d{1,2})-(\d{1,2})-([0-9]{4})-([a-z])$', views.status_appoint, name='appointment status'),
    url(r'^planning/set-([0-9]*)-(\d{1,2})-(\d{1,2})-([0-9]{4})-([a-z])-act-([0-9]*)$', views.set_appoint, name='set appointment'),
    url(r'^planning/get/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})$', views.get_appoint, name='get appointment'),
    url(r'^planning/del-([0-9]*)-(\d{1,2})-(\d{1,2})-([0-9]{4})-([a-z])$', views.del_appoint, name='del appointment'),
    url(r'^planning/([0-9]{4})/(\d{1,2})/$', views.planning_month, name='planning'),
]
