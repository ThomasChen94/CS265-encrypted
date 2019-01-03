'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

    $scope.user = window.cs142models.userModel(userId);

    $scope.main.pageInfo = $scope.user.first_name + " " + $scope.user.last_name;
    
    console.log('UserDetail of ', userId);

    console.log('window.cs142models.userModel($routeParams.userId)',
        window.cs142models.userModel(userId));

  }]);
