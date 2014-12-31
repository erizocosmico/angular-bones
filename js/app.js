(function (window, angular) {
	'use strict';

	var app = angular.module('app', ['ngRoute', 'infinite-scroll']);

	// Config $routeProvider
	app.config(['$routeProvider',
		function ($routeProvider) {
			// Do the routing here
		}
	]);

	app.run(['$rootScope',
		function ($rootScope) {
			/**
			 * Default app title
			 * @type {String}
			 */
			$rootScope.title = 'App';
		}
	]);

	app.value('paginationSize', 25);

	// Remove if you won't use infinite-scroll
	angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500);

	/**
	 * Api Base URL, you can remove it if you won't use the BaseCRUD
	 * @type {String}
	 */
	window.ApiBase = '/your/api/base';
	window.app = app;

}(window, angular));