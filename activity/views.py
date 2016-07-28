from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from schedule.models import Activity
from django.core import serializers


@require_http_methods(["POST"])
def delete(request):
    print("del activity")
    param = json.loads(request.body)

    activity = Activity(id = param["id"])
    activity.delete()

    return HttpResponse("ok")


@require_http_methods(["GET"])
def all(request):
    list = Activity.objects.order_by("priority","name")
    json_data = serializers.serialize('json', list)
    return HttpResponse(json_data)


@require_http_methods(["GET"])
def edit(request):
    template = loader.get_template('activity/activity.html')
    context = {}
    return HttpResponse(template.render(context, request))


@require_http_methods(["POST"])
def new(request):
    print("new activity")

    param = json.loads(request.body)

    activity = Activity(name=param["name"])
    try:
        activity.save()
    except IntegrityError as e:
        return HttpResponse("duplicate")

    return HttpResponse("ok")



##@csrf_exempt
@require_http_methods(["POST"])
def update(request):
    print("update activity")

    param = json.loads(request.body)

    activity = Activity(id=param["id"])
    activity.name = param["name"]
    activity.color = param["color"]
    activity.fcolor = param["fcolor"]
    activity.ops = param["ops"]
    activity.active = param["active"]
    try:
        activity.save()
    except IntegrityError as e:
        return HttpResponse("duplicate")

    return HttpResponse("ok")