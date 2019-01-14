'use strict';

cs142App.controller('UserListController', ['$scope', '$rootScope', '$resource',
    function ($scope, $rootScope, $resource) {
        $scope.main.title = 'Users';

        var User = $resource('/user/list', {
          query: {
            method: 'GET',
            isArray: true
          }
        });
        User.query(function (userList) {
          $scope.userList = userList;
        });
        console.log($scope.userList);
    }]);

