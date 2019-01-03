'use strict';

cs142App.controller('UserListController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
        $scope.main.title = 'Users';

        $scope.userList = window.cs142models.userListModel();
        console.log('window.cs142models.userListModel()', window.cs142models.userListModel());
    }]);

