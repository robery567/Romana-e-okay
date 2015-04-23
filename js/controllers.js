/*
	Contains PageChangeCtrl - for changing views.
*/

var app = angular.module('app', ['ngRoute']);

app.controller('PageChangeCtrl', function ($scope) {
	$scope.selected = 0;
	$scope.currentContext = context[0];
	$scope.Contexts = 5;
	$scope.chosenView = "none";
	$scope.SelectedCreation = -1;

	$scope.hasLider = function() {
		// for contexts
		return $scope.currentContext.lider != "-";
	}

	$scope.changePage = function(x) {
		// changing view
		$scope.selected = x;
		$scope.SelectedCreation = -1;
		if (x > 0 && x <= $scope.Contexts) {
			$scope.currentContext = context[x - 1];
			$scope.chosenView = "none";
			$scope.SelectedCreation = -1;
		}
	}

	$scope.chooseView = function(x) {
		// Creations or Context
		$scope.chosenView = x;
		$scope.SelectedCreation = -1;
		showElement(x);
	}

	$scope.openCreation = function(id) {
		//opens Creation
		console.log(creations[$scope.selected - 1][id].page);
		$scope.SelectedCreation = creations[$scope.selected - 1][id].page;
	}

});

