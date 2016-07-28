from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^edit$', views.edit, name='activities'),
    url(r'^new$', views.new, name='new activity'),
    url(r'^all$', views.all, name='get all activities'),
    url(r'^del$', views.delete, name='delete an activity'),
    url(r'^update$', views.update, name='update an activity'),
]