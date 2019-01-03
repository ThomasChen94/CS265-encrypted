'use strict';

cs142App.controller('UserListController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
        $scope.main.title = 'Users';

        function setUserList(responseData) {
          $scope.$apply(function() {
            $scope.userList = responseData;
          });
        }
        $scope.FetchModel("/user/list", setUserList);
        console.log($scope.userList);
    }]);

