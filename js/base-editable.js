(function (window, angular) {
	'use strict';

	/**
	 * Base editable model with edit mode and delete/undo functionalities
	 * @TODO: Busy state when editing and removing
	 * @param {Object}   $scope                Model owner scope
	 * @param {Object}   $timeout              $timeout dependency
	 * @param {String}   modelKey              Key where the model is stored in $scope
	 * @param {Function} updateFn              Update function that returns a promise, receives the edited data as parameter
	 * @param {Function} deleteFn              Remove function that returns a promise
	 * @return {Object} Scope
	 */
	window.BaseEditableModel = function ($scope, $timeout, modelKey, updateFn, deleteFn) {
		$scope.editing = false;
        $scope.showUndo = false;
        $scope.delete = false;
        $scope.visible = true;

        /**
         * Starts the editing mode of the model
         */
        $scope.edit = function () {
            $scope.editing = true;
            $scope.data = angular.copy($scope[modelKey]);
        };

        /**
         * Cancels the editing mode of the model
         */
        $scope.cancel = function () {
            $scope.editing = false;
        };

        /**
         * Save the model on the server
         */
        $scope.saveChanges = function () {
            $scope.error = false;

            var data = angular.copy($scope.data);
            updateFn(data)
            	.then(function () {
            		$scope[modelKey] = data;
                    $scope.editing = false;
                }, function () {
                    $scope.error = true;
                });
        };

        /**
         * Removes the current model 6 seconds after showing the UNDO screen if the action is not undone
         */
        $scope.remove = function () {
            $scope.showUndo = true;
            $scope.delete = true;

            $timeout(function () {
                if ($scope.delete) {
                	deleteFn()
                		.then(function () {
                            $scope.visible = false;
                        }, function () {
                            $scope.showUndo = false;
                            $scope.delete = false;
                        });
                } else {
                    $scope.showUndo = false;
                }
            }, 6000);
        };

        /**
         * Undo the delete action
         */
        $scope.undo = function () {
            $scope.delete = false;
            $scope.showUndo = false;
            $timeout.flush();
        };

        return $scope;
	};

}(window, angular));