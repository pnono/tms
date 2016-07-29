from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from schedule.models import Group
from schedule.models import Resource
from schedule.models import Activity
from schedule.models import Appointment

import calendar
import json
from schedule.isoweek import Week
import datetime


from django.core import serializers

def index(request):
    return HttpResponse("Got it!")


def activities(request):
    list = Activity.objects.filter(active=True).order_by("priority","name")
    json_data = serializers.serialize('json', list)
    return HttpResponse(json_data)


def users(request):
    list = Resource.objects.filter(active=True)
    json_data = serializers.serialize('json', list)
    return HttpResponse(json_data)


def planning_year(request, year):
    return HttpResponse("Got it year!" + year)


def planning_current(request):
    d = datetime.datetime.now()
    return planning_month(request, str(d.year), str(d.month))




def del_appoint(request, uid_str, day_str, month_str, year_str, ab_str):
    print("Del appoint: "+uid_str+" at "+ab_str+" "+day_str+'/'+month_str+'/'+year_str)
    month = int(month_str)
    year = int(year_str)
    day = int(day_str)
    uid = int(uid_str)

    if ab_str=="a":
        starth=9
        lasth=12
    else:
        starth=12
        lasth=18

    res = Resource.objects.filter(id=uid)
    if not res.exists():
        return HttpResponse("fail")
    print("Get resource")

    appoint = Appointment.objects.filter(date=datetime.datetime(year,month,day),start_hour=starth,last_hour=lasth,
                                            resource=res[0])
    print("Set appoint")
    appoint.delete()


    ret = uid_str+"-"+day_str+"-"+month_str+"-"+year_str+"-"+ab_str;
    return HttpResponse(ret)


def get_appoint(request, year_str, minw_str, maxw_str):
    list=[]
    ##print("get  appoint: "+uid_str+" between "+minw_str+" and "+maxw_str +" for " + year_str)
    minw=int(minw_str)
    maxw=int(maxw_str)
    year = int(year_str)

    rlist = Resource.objects.filter(active=True)

    for res in rlist:
        for week in range(minw,maxw+1):
            w = Week(year, week)
            for i in range(0,6):
                d = w.day(i)
                appoint1 = Appointment.objects.filter(date=d,start_hour=9,last_hour=12,resource=res)
                if appoint1.exists():
                    act = appoint1[0].activity
                    if(act.active==True):
                        list.append((str(res.id)+"-"+str(d.day)+"-"+str(d.month)+'-'+str(d.year)+'-a', act.color, act.name))
                appoint2 = Appointment.objects.filter(date=d,start_hour=12,last_hour=18,resource=res)
                if appoint2.exists():
                    act = appoint2[0].activity
                    if(act.active==True):
                        list.append((str(res.id)+"-"+str(d.day)+"-"+str(d.month)+'-'+str(d.year)+'-b',act.color, act.name))

    json_data = json.dumps(list)#, ensure_ascii=False)#serializers.serialize('json', list)
    print(json_data)
    return HttpResponse(json_data)


def set_appoint(request, uid_str, day_str, month_str, year_str, ab_str, activity_str):
    print("Set appoint: "+uid_str+" at "+ab_str+" "+day_str+'/'+month_str+'/'+year_str+" for "+activity_str)
    month = int(month_str)
    year = int(year_str)
    day = int(day_str)
    uid = int(uid_str)
    actid = int(activity_str)
    if ab_str=="a":
        starth=9
        lasth=12
    else:
        starth=12
        lasth=18

    res = Resource.objects.filter(id=uid)
    if not res.exists():
        return HttpResponse("fail")
    print("Get resource")
    act = Activity.objects.filter(id=actid)
    if not act.exists():
        return HttpResponse("fail")
    appoint = Appointment.objects.filter(date=datetime.datetime(year,month,day),start_hour=starth,last_hour=lasth,resource_id=uid)
    if not appoint.exists():
        print("delete previous appointment")
        appoint.delete()

    print("Get activity")
    appoint = Appointment(date=datetime.datetime(year,month,day),start_hour=starth,last_hour=lasth)
    appoint.resource=res[0]
    appoint.activity=act[0]
    print("Set appoint")
    appoint.save()
    return HttpResponse("set appoint")

def status_appoint(request, uid_str, day_str, month_str, year_str, ab_str):
    print(uid_str+';'+day_str+'/'+month_str+'/'+year_str)
    month = int(month_str)
    year = int(year_str)
    day = int(day_str)
    uid = int(uid_str)
    if ab_str=="a":
        starth=9
        lasth=12
    else:
        starth=12
        lasth=18

    res = Appointment.objects.filter(resource_id=uid,date=datetime.datetime(year,month,day),
                                     start_hour=starth,last_hour=lasth)
    if not res.exists():
        print("no appointment")
        return HttpResponse("free")
    else:
        print("already an appointment")
        return HttpResponse("occupied")


def planning_month(request, year_str, month_str):
    month = int(month_str)
    year = int(year_str)
    if (month > 12):
        return HttpResponse("invalid value " + month +".")
    cal = calendar.Calendar()
    listdate = cal.monthdatescalendar(year, month)
    max_w = 0
    min_w = 60
    for week in listdate:
        cw = week[0].isocalendar()[1]
        if cw > max_w :
            max_w = cw
        if cw < min_w :
            min_w = cw
    template = loader.get_template('schedule/planning.html')
    users = []
    user_list = Resource.objects.filter(active=True).order_by("group")
    for user in user_list:
        ietm = {}
        ietm["user"] = user.name
        ietm["id"] = user.id
        ietm['group'] = user.group.name
        users.append(ietm)

    context = {'users': users, "date": listdate, "gmonth": month, "gyear": year, "minw": min_w, "maxw": max_w  }

    return HttpResponse(template.render(context, request))
