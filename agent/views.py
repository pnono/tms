from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.core import serializers
from django.db import IntegrityError
import json
from schedule.models import Resource
from schedule.models import Group
from django.views.decorators.http import require_http_methods

# Create your views here.
def index(request):
    template = loader.get_template('agent/resource.html')
    context = {}
    return HttpResponse(template.render(context, request))



def all(request):
    list = Resource.objects.order_by("name")
    json_data = serializers.serialize('json', list)
    return HttpResponse(json_data)


@require_http_methods(["POST"])
def new(request):
    print("new agent")
    param = json.loads(request.body)

    res = Resource(name = param["name"])
    group = Group(id=param["group"])
    res.group = group
    try:
        res.save()
    except IntegrityError as e:
        return HttpResponse("duplicate")

    return HttpResponse("ok")


@require_http_methods(["POST"])
def delete(request):
    print("del agent")
    param = json.loads(request.body)

    res = Resource(id = param["id"])
    res.delete()

    return HttpResponse("ok")


def allgroup(request):
    list = Group.objects.order_by("name")
    json_data = serializers.serialize('json', list)
    return HttpResponse(json_data)


@require_http_methods(["POST"])
def update(request):
    print("update agent")

    param = json.loads(request.body)

    res = Resource(id=param["id"])
    res.name = param["name"]
    res.active = param["active"]
    res.num = param["num"]
    group = Group(id=param["group"])
    res.group = group

    res.save()

    return HttpResponse("ok")
