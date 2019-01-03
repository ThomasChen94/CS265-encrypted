'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

    function setUserDetail(responseData) {
      $scope.$apply(function() {
        $scope.user = responseData;
        $scope.main.pageInfo = $scope.user.first_name + " " + $scope.user.last_name;
        console.log('UserDetail of ', userId);
        console.log($scope.user);
      });
    }

    $scope.FetchModel("/user/" + userId, setUserDetail);
  }]);
