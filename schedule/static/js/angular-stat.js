scheduleApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
 }])
.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
 })
 .controller('statController', ['$scope', '$http', function($scope,$http) {
   $scope.data = {
    model: null,
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

     location.href = location.pathname = "/stat/" + year + "/" + month + "/";
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

     location.href = location.pathname = "/stat/" + year + "/" + month + "/";
    };

  }]);
