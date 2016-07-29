scheduleApp
 .config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
 }])
 .config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
 })
 .controller('ActivityListController', function ActivityListController($scope,$http) {


  })
 .controller('scheduleCtrl',function($scope, $http)
 {
  $("#printMessage").hide();
  $("#printError").hide();
  $("#carlist").prop("disabled", false);
  $scope.activities = [];
  $scope.allactivities = [];
  refreshActivityList();

  function refreshActivityList()
  {
   $http.get('/schedule/activities').then(function(response) {
   $scope.activities.length = 0;
   for(var i = 0, len = response.data.length; i < len; ++i)
     $scope.activities[i] = response.data[i];
   });
   $http.get('/activity/all').then(function(response) {
   $scope.allactivities.length = 0;
   for(var i = 0, len = response.data.length; i < len; ++i)
     $scope.allactivities[i] = response.data[i];
   });

  };

  $scope.doDeleteActivity = function()
  {
   var index = document.getElementById("carlist").selectedIndex;
   var activity = document.getElementById("carlist").options[index];
   data = { pk : activity.id }

   $http.post("/activity/del", data).then(function(response) {
    if(response.data == "ok")
    {
     $("#printMessage")[0].textContent = 'Activité "' + activity.label + '" supprimée';
     $("#printMessage").show();
     refreshActivityList();
    } else {
     $("#printError")[0].textContent = "Impossible de supprimer l'activité " + activity.id;
     $("#printError").show();
    }
   });


  };


  $scope.doEditActivity = function()
  {
   var index = document.getElementById("carlist").selectedIndex;
   var name = $("#inputName");
   if(name[0].textLength==0)
   {
    $("#gdesign").addClass("has-error");
    $("#printError")[0].textContent = "Désignation de l'activité à renseigner";
    $("#printError").show();
    return;
   }
   var activity = document.getElementById("carlist").options[index];
   data = { pk : activity.id, name : name[0].value , color : $("#inputColor")[0].value, fcolor : $("#inputFColor")[0].value,
    ops : $("#cop")[0].checked, active : $("#cac")[0].checked  };
   $http.post("/activity/update", data).then(function(response) {
    if(response.data == "ok")
    {
     $("#printMessage")[0].textContent = 'Activité "' +  name[0].value + '" modifié';
     $("#printMessage").show();
     refreshActivityList();
    } else {
     $("#printError")[0].textContent = "Impossible de modifier l'activité " +  name[0].value;
     $("#printError").show();
    }
   });

   };



  $scope.doShowEditActivity = function()
  {
   var index = document.getElementById("carlist").selectedIndex;

   if(index==-1)
   {
     $("#printError")[0].textContent = "Sélectionner une activité à éditer";
     $("#printError").show();
     return;
    }

   var activity = document.getElementById("carlist").options[index];
   data = { pk : activity.id }

   $http.post("/activity/get", data).then(function(response) {
   var res = response.data;
    if(response.data == "nok")
    {
     $("#printError")[0].textContent = "Impossible d'obtenir des informations sur l'activité " + activity.id;
     $("#printError").show();
     return;
    }

    $("#idsql")[0].textContent = res[0].pk;
    $("#inputName")[0].value = res[0].fields.name;
    $("#cac").prop('checked', res[0].fields.active);
    $("#cop").prop('checked', res[0].fields.ops);
    $("#inputColor")[0].value = res[0].fields.color;
    $("#inputFColor")[0].value = res[0].fields.fcolor;
    $(".editact").show();
   });

   $("#gdesign").removeClass("has-error");
   $("#atitle").text("Modifier une activité");
   $("#printMessage").hide();
   $("#printError").hide();
  };


  $scope.doShowNewActivity = function()
  {
   $(".editact").hide();
   $(".newact").show();
   $("#carlist").prop("disabled", true);
   $("#gdesign").removeClass("has-error");
   $("#atitle").text("Nouvelle activité");
   $("#inputName")[0].value="";
   $("#cac").prop('checked', true);
   $("#cop").prop('checked', false);
   $("#printMessage").hide();
   $("#printError").hide();
  };

  $scope.doCancelNewActivity = function()
  {
   $(".editact").hide();
   $(".newact").hide();
   $("#carlist").prop("disabled", false);
   $("#printMessage").hide();
   $("#printError").hide();
  };

  $scope.doNewActivity = function()
  {
   var name = $("#inputName");
   if(name[0].textLength==0)
   {
    $("#gdesign").addClass("has-error");
    $("#printError")[0].textContent = "Désignation de l'activité à renseigner";
    $("#printError").show();
    return;
   }

   data = { name : name[0].value , color : $("#inputColor")[0].value, fcolor : $("#inputFColor")[0].value,
    ops : $("#cop")[0].checked, active : $("#cac")[0].checked  };
   $http.post("/activity/new", data).then(function(response) {
    if(response.data == "ok")
    {
     $("#printMessage")[0].textContent = 'Activité "' +  name[0].value + '" ajoutée';
     $("#printMessage").show();
     refreshActivityList();
    } else {
     $("#printError")[0].textContent = "Impossible d'ajouter l'activité " +  name[0].value;
     $("#printError").show();
    }
   });

    $("#carlist").prop("disabled", false);
    $(".newact").hide();

   };

  $scope.doAppoint = function()
  {
   var index = document.getElementById("carlist").selectedIndex;
   var activity = document.getElementById("carlist").options[index];

   $( ".highlighted" ).each(
    function( index )
    {
     $(this).toggleClass("highlighted");
     var aurs= '/schedule/planning/set-' + $(this).attr("id");
     var uri = '/schedule/planning/status-' + $(this).attr("id");
     $http.get(uri).then(
      function(response)
      {
       if(response.data=="free")
       {
        var urs= aurs + '-' + activity.id;
        $http.get(urs).then(
         function(response)
         {
          resp=response.data;
         }
        );
       }
      }
     );

     $(this).css("background-color", ''+activity.style.getPropertyValue("background-color"));
     $(this).title = activity.value;
     }
    );
   };

   $scope.doClear = function()
   {
    $( ".highlighted" ).each(function( index )
    {
     $(this).toggleClass("highlighted");
     var sid = $(this);
     var uri = '/schedule/planning/del-' + sid.attr("id");
     $http.get(uri).then(
      function(response)
      {
       if(response.data!="deleted")
        $("#"+response.data).css("background-color", 'White');
      });
     });
    };

   $scope.doRefresh = function()
   {
    var maxw = document.getElementById("maxw").value;
    var minw = document.getElementById("minw").value;
    var year = document.getElementById("year").value;

    var uri = '/schedule/planning/get/' + year + '/' + minw + '/' + maxw ;
    $("#wait").show();
    $http.get(uri).then(
     function(response)
     {
      var res = response.data;
      for(var i=0 ; i<res.length;i++)
      {
       var r = res[i];
       var item = $("#"+r[0])[0];
       item.bgColor = r[1];
       item.title = r[2];
      }
      $("#wait").hide();
     });
    };

    $scope.doForward = function()
    {
     var year = parseInt(document.getElementById("year").value);
     var month = parseInt(document.getElementById("month").value);
     if(month == 12)
     {
      year = year + 1;
      month = 1;
     } else {
      month = month + 1;
     }

     location.href = location.pathname = "/schedule/planning/" + year + "/" + month + "/";
    };


    $scope.doBackward = function()
    {
     var year = parseInt(document.getElementById("year").value);
     var month = parseInt(document.getElementById("month").value);
     if(month == 1)
     {
      year = year - 1;
      month = 12;
     } else {
      month = month - 1;
     }

     location.href = location.pathname = "/schedule/planning/" + year + "/" + month + "/";
    };


});