from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.stats_current, name='index'),

    url(r'^([0-9]{4})/(\d{1,2})/$', views.stats_month, name='planning'),
]
