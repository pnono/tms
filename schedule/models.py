from django.db import models


class Group(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    num = models.IntegerField()

    class Meta:
        ordering = ["num"]


class Resource(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30,unique=True)
    active = models.BooleanField(default=True)
    num = models.IntegerField(default=1)
    group = models.ForeignKey(Group,on_delete=models.DO_NOTHING)

    class Meta:
        ordering = ["num"]


class Activity(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    ops = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    color = models.CharField(max_length=7,default='#FFFFFF')
    fcolor = models.CharField(max_length=7,default='#000000')
    priority = models.IntegerField(default=1)
    description = models.CharField(max_length=150,default='')


class Appointment(models.Model):
    date = models.DateField(auto_now=False,auto_now_add=False)
    start_hour = models.IntegerField()
    last_hour = models.IntegerField()
    resource = models.ForeignKey(Resource)
    activity = models.ForeignKey(Activity)