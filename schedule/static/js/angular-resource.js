

scheduleApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
 }])
.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
 })
 .controller('resourceController', ['$scope', '$http', function($scope,$http) {
   $scope.data = {
    model: null,
    agent: null,
    groupagent: null,
    groupnewagent: null,
    availableOptions: [],
    grouplist: [],
   };


  function refreshAgentList()
  {
   $http.get('/resource/all').then(function(response) {
   $scope.data.availableOptions.length = 0;
   for(var i = 0, len = response.data.length; i < len; ++i)
     $scope.data.availableOptions[i] = response.data[i];
   });
  };

  function refreshGroupList()
  {
   $http.get('/resource/allgroup').then(function(response) {
   $scope.data.grouplist.length = 0;
   for(var i = 0, len = response.data.length; i < len; ++i)
     $scope.data.grouplist[response.data[i].pk] = response.data[i];
   });
  };

  refreshAgentList();
  refreshGroupList();;

  $(function () {
   $('[data-toggle="tooltip"]').tooltip()
  })

  $scope.doSelect = function() {
   $scope.data.groupagent = $scope.data.grouplist[$scope.data.agent.fields.group];
  };

  $scope.doEditResource = function() {
    var sdata = {
     id: $scope.data.agent.pk,
     name: $scope.data.agent.fields.name,
     active: $scope.data.agent.fields.active,
     num: $scope.data.agent.fields.num,
     group: $scope.data.groupagent.pk
    };
    $http.post("/resource/update", sdata).then(function(response) {
    if(response.data == "ok")
    {
     refreshAgentList();
     $scope.data.agent=null;
     $scope.data.groupagent=null;
    }
   });
  };

   $scope.doNewResource = function() {
   var input = $("#inputnew");

   $("#divanew").removeClass("has-error");
   $("#divgnew").removeClass("has-error");

   if ( input[0].textLength == 0 )
   {
    $("#divanew").toggleClass("has-error");
    return;
   }
   if ( $scope.data.groupnewagent == null )
   {
    $("#divgnew").toggleClass("has-error");
    return;
   }

    var sdata = {
     name: input[0].value,
     group: $scope.data.groupnewagent.pk
    };
    $http.post("/resource/new", sdata).then(function(response) {
     if( response.data == "ok" )
     {
      refreshAgentList();
      $scope.data.agent=null;
      $scope.data.groupagent=null;
      $("#divanew").toggleClass("has-success");
      $("#divgnew").toggleClass("has-success");
      return;
     }

     if( response.data == "duplicate" )
     {
      $("#divanew").toggleClass("has-error");
      return;
     }
   });
  };

  $scope.doDeleteResource = function()
  {
   var sdata = { id: $scope.data.agent.pk };
    $http.post("/resource/del", sdata).then(
     function(response)
     {
      if(response.data == "ok")
      {
       refreshAgentList();
       $scope.data.agent=null;
       $scope.data.groupagent=null;
      }
     });
  };
}]);


