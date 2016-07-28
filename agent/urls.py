from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^index$', views.index, name='index'),
    url(r'^all$', views.all, name='get all agent'),
    url(r'^allgroup$', views.allgroup, name='get all group'),
    url(r'^update$', views.update, name='update agent info'),
    url(r'^del$', views.delete, name='del agent'),
    url(r'^new$', views.new, name='new agent'),
]