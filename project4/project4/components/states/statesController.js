'use strict';

/**
 * Define StatesController for the states component of CS142 project #4
 * problem #2.  The model data for this view (the states) is available
 * at window.cs142models.statesModel().
 */

cs142App.controller('StatesController', ['$scope', function($scope) {

  // List of all states
  $scope.stateList = window.cs142models.statesModel(); 

  // Candidate states matching the query string
  $scope.candidateStates = [];  

  $scope.filterStates = function(queryString) {
    $scope.candidateStates = []; 
    $scope.stateList.forEach(function(state) {
      if (state.toLowerCase().includes(queryString.toLowerCase())) {
        // If state's name contains the query string, 
        // add the state to candidate list
        $scope.candidateStates.push(state);
      }
    })
    if ($scope.candidateStates.length === 0) {
      $scope.candidateStates.push("There is no state matching your query!");
    } else {
      $scope.candidateStates.sort();
    }
  }

}]);
