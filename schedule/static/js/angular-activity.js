scheduleApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
 }])
.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
 })
 .controller('activityController', ['$scope', '$http', function($scope,$http) {
   $scope.data = {
    model: null,
    act: null,
    availableOptions: [],
   };


  function refreshActivityList()
  {
   $http.get('/activity/all').then(function(response) {
   $scope.data.availableOptions.length = 0;
   for(var i = 0, len = response.data.length; i < len; ++i)
     $scope.data.availableOptions[i] = response.data[i];
   });
  };

  refreshActivityList();

  $(function () {
   $('[data-toggle="tooltip"]').tooltip()
  })

  $scope.doSelect = function() {
   $scope.data.groupagent = $scope.data.grouplist[$scope.data.agent.fields.group];
  };

  $scope.doEditActivity = function() {
    var sdata = {
     id: $scope.data.act.pk,
     name: $scope.data.act.fields.name,
     active: $scope.data.act.fields.active,
     ops: $scope.data.act.fields.ops,
     fcolor: $scope.data.act.fields.fcolor,
     color: $scope.data.act.fields.color,
    };
    $http.post("/activity/update", sdata).then(function(response) {
    if(response.data == "ok")
    {
     refreshActivityList();
     $scope.data.act=null;
    }
    if( response.data == "duplicate" )
    {
      $("#divanew").toggleClass("has-error");
      return;
    }
   });
  };

   $scope.doNewActivity = function() {
   var input = $("#inputnew");

   $("#divanew").removeClass("has-error");

   if ( input[0].textLength == 0 )
   {
    $("#divanew").toggleClass("has-error");
    return;
   }

    var sdata = {
     name: input[0].value,
    };
    $http.post("/activity/new", sdata).then(function(response) {
     if( response.data == "ok" )
     {
      refreshActivityList();
      $scope.data.act=null;
      $("#divanew").toggleClass("has-success");
      return;
     }

     if( response.data == "duplicate" )
     {
      $("#divanew").toggleClass("has-error");
      return;
     }
   });
  };

  $scope.doDeleteActivity = function()
  {
   var sdata = { id: $scope.data.act.pk };
    $http.post("/activity/del", sdata).then(
     function(response)
     {
      if(response.data == "ok")
      {
       refreshActivityList();
       $scope.data.act=null;
      }
     });
  };
}]);
