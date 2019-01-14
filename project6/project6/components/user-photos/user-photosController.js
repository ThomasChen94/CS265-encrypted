'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource',
  function($scope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    var User = $resource('/user/:id', {id: '@id'});
    User.get({id: userId}, function (user) {
      $scope.main.pageInfo = "Photo of " + user.first_name + 
          " " + user.last_name;
    });

    var Photo = $resource('/photosOfUser/:id', {id: '@id'}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
    Photo.query({id: userId}, function (photo) {
      $scope.userPhotos = photo;
    });
  }]);
