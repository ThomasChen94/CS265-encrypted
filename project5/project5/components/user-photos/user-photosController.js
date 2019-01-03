'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

    var user = window.cs142models.userModel(userId);

    $scope.userPhotos = window.cs142models.photoOfUserModel(userId);

    $scope.main.pageInfo = "Photo of " + user.first_name + " " + user.last_name;

    console.log('UserPhoto of ', $routeParams.userId);

    console.log('window.cs142models.photoOfUserModel($routeParams.userId)',
       window.cs142models.photoOfUserModel(userId));

  }]);
