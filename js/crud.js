(function (window) {
	'use strict';

	/**
	 * Creates a base CRUD service
	 * @param  {$q}     $q     $q dependency
	 * @param  {$http}  $http  $http dependency
	 * @param  {String} entity Entity name
	 * @return {Object}        CRUD service
	 */
	window.BaseCrudService = function ($q, $http, entity) {
		/**
		 * Returns a promise of a deferred passed to the given callback function
		 * @param  {Function} fn Callback function
		 * @return {promise}
		 */
		var deferredPromise = function (fn) {
				var deferred = $q.defer();
				fn(deferred);
				return deferred.promise;
			},
			apiBase = window.ApiBase;

		/**
		 * Create a new resource
		 * Requires a route of the form http://APIBASE/ENTITY/create
		 * @method create
		 * @param  {Object} data The data sent to the server
		 * @return {promise}
		 */
		this.create = function (data) {
			return deferredPromise(function (deferred) {
				$http.post(apiBase + entity + '/create', data)
					.then(
						(response) => deferred.resolve(response.data[entity]),
						(err) => deferred.reject(err)
					);
			});
		};

		/**
		 * Updates a resource on the server
		 * Requires a route of the form http://APIBASE/ENTITY/ID
		 * @method update
		 * @param  {Number} id   Resource id
		 * @param  {Object} data Data to be updated
		 * @return {promise}
		 */
		this.update = function (id, data) {
			return deferredPromise(function (deferred) {
				$http.put(apiBase + entity + '/' + id, data)
					.then(
						(response) => deferred.resolve(response.data[entity]),
						(err) => deferred.reject(err)
					);
			});
		};

		/**
		 * Removes a resource from the server
		 * Requires a route of the form http://APIBASE/ENTITY/ID
		 * @method delete
		 * @param  {Number} id   Resource id
		 * @param  {Object} data Data sent to the server (optional)
		 * @return {promise}
		 */
		this.delete =  function (id, data = {}) {
			return deferredPromise(function (deferred) {
				$http.delete(apiBase + entity + '/' + id, data)
					.then(
						(response) => deferred.resolve(true),
						(err) => deferred.reject(err)
					);
			});
		};

		/**
		 * Returns a paginated list of entities
		 * Requires a route of the form http://APIBASE/ENTITY(prefix)/OFFSET/LIMIT
		 * @method list
		 * @param  {String} prefix Prefix for the request URL
		 * @param  {Number} offset Start position of the pagination
		 * @param  {Number} limit  Max number of entities to be returned
		 * @return {promise}
		 */
		this.list = function (offset, limit, prefix = '') {
			return deferredPromise(function (deferred) {
				$http.get(apiBase + entity + prefix + '/' + offset + '/' + limit)
					.then(
						(response) => deferred.resolve(response.data[entity + 's']),
						(err) => deferred.reject(err)
					);
			});
		};

		/**
		 * Perform a request that is not a base CRUD operation
		 * @method request
		 * @param  {String}  method Request method
		 * @param  {String}  url    Request url (must not start with "/")
		 * @param  {String}  entity Name of the JSON entity to return
		 * @param  {Object}  data   Data to send along with the request
		 * @return {promise}
		 */
		this.request = function (method, url, entity = undefined, data = {}) {
			return deferredPromise(function (deferred) {
				$http[method](apiBase + url, data)
					.then(
						(response) => {
							var resp = entity ? response.data[entity] : response.data;
							deferred.resolve(resp);
						},
						(err) => deferred.reject(err)
					);
			});
		};
	};

}(window));