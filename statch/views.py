from django.shortcuts import render
import datetime
import calendar
from django.http import HttpResponse
from django.template import loader
from schedule.models import Appointment
import json
from schedule.models import Activity
from django.core import serializers

def stats_current(request):
    d = datetime.datetime.now()
    return stats_month(request, str(d.year), str(d.month))


def stats_month(request, year_str, month_str):
    print("Print for " + month_str + "/" + year_str)
    month = int(month_str)
    year = int(year_str)
    if (month > 12):
        return HttpResponse("invalid value " + month +".")
    cal = calendar.Calendar()
    d = cal.monthdatescalendar(year, month)
    max_w = 0
    min_w = 60

    template = loader.get_template('statch/compute.html')
    act_list = Activity.objects.filter(active=True).order_by("priority","name")

    data = {}
    for week in d:
        cw = week[0].isocalendar()[1]
        if cw > max_w :
            max_w = cw
        if cw < min_w :
            min_w = cw

        countr = {}
        for act in act_list:
            val = {}
            applist = Appointment.objects.filter(activity=act,date__lt=week[6],date__gt=week[0])
            app_number = 0
            app_agent = {}
            for app in applist:
                app_agent[app.resource.name] = True
                app_number = app_number + 1

            app_number = app_number / float(2)
            val["actname"] = act.name
            val["actsum"] = "{0:.2f}".format(app_number)
            val["actetp"] = "{0:.2f}".format(app_number/5)
            val["agent"] = app_agent.keys
            countr[act.id] = val

        data[str(cw)] = countr

    context = { "data" : data, "month" : month_str, "year" : year_str }

    ##json_data = serializers.serialize('json', resp)
    return HttpResponse(template.render(context, request))

