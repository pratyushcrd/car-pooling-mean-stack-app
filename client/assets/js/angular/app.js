/**
 * Created by Pratyush on 14-03-2016.
 */
var app = angular.module('cityCommute', ['ngResource', 'ngRoute']);
app.factory('Journey', function($resource) {
    return $resource('/api/journey/:id', null, {
        'update': {
            method: 'PUT'
        }
    });
});
/* Controller for index page */
app.controller('HomeController', function($scope, $http, $timeout) {});
/* Controller for index page */
app.controller('JourneyController', function($scope, $http, $timeout) {});
    /* Configuing routes */
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/home.html',
        controller: 'HomeController'
    })
    .when('/addjourney', {
        templateUrl: '/post_journey.html',
        controller: 'JourneyController'
    }).otherwise({
        templateUrl: '/home.html',
        controller: 'HomeController',
    });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});