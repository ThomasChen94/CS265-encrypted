'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', '$resource',
  function ($scope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    var User = $resource('/user/:id', {id: '@id'});
    User.get({id: userId}, function (user) {
      if (user) {
        $scope.showUserDetail = true;
        $scope.user = user;
        $scope.main.pageInfo = $scope.user.first_name + " " + $scope.user.last_name;
        console.log('UserDetail of ', userId);
        console.log($scope.user);
      } else {
        $scope.showUserDetail = false;
      }
    });
  }]);
