'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

    $scope.FetchModel("/user/" + userId, function(responseData) {
      $scope.$apply(function() {
        $scope.main.pageInfo = "Photo of " + responseData.first_name + 
            " " + responseData.last_name;
      });
    });

    function setUserPhoto(responseData) {
      $scope.$apply(function() {
        $scope.userPhotos = responseData;
        console.log('UserPhoto of ', $routeParams.userId);
        console.log($scope.userPhotos);
      });
    }
    $scope.FetchModel("/photosOfUser/" + userId, setUserPhoto);
  }]);
