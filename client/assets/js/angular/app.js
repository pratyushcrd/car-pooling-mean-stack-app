/**
 * Created by Pratyush on 14-03-2016.
 */
var app = angular.module('cityCommute', ['ngResource', 'ngRoute']);
app.factory('Journey', function($resource) {
    return $resource('/api/journeys/:id', null, {
        'update': {
            method: 'PUT'
        }
    });
});
/* Controller for index page */
app.controller('HomeController', function($scope, $http, $timeout, Journey) {
    // List of all journeys
    $scope.journeys = Journey.query();
    
});
/* Controller for side bar */
app.controller('SidebarController', function($scope, $rootScope, $http) {
    $http.get('/api/users/user')
    .then(function(response) {
        console.log(response);
        $rootScope.user = response.data;
    });
});
/* Controller for index page */
app.controller('JourneyController', function($scope, $http, $timeout, Journey) {
    // Object to store form data
    $scope.journeyObject = {};
    // function to post joureys
    $scope.postJourney = function() {
        var newJourney = new Journey();
        newJourney.startStreet = $scope.journeyObject.startStreet;
        newJourney.startArea = $scope.journeyObject.startArea;
        newJourney.endStreet = $scope.journeyObject.endStreet;
        newJourney.endArea = $scope.journeyObject.endArea;
        newJourney.departure = $scope.journeyObject.departure;
        newJourney.vehicle = $scope.journeyObject.vehicle;
        newJourney.availableSeats = $scope.journeyObject.availableSeats;
        newJourney.genderPreference = $scope.journeyObject.genderPreference;
        newJourney.description = $scope.journeyObject.description;
        newJourney.fare = $scope.journeyObject.fare;
        newJourney.$save($scope.journeyObject, function(tweet) {
            console.log(tweet);
        }, function(err) {
            console.log(err);
        })
    }
});
/* Configuing routes */
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/home.html',
        controller: 'HomeController'
    }).when('/addjourney', {
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