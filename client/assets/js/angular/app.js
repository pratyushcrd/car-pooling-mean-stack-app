/**
 * Created by Pratyush on 14-03-2016.
 */
var app = angular.module('cityCommute', ['ngResource', 'ngRoute']);

app.factory('Journey', function ($resource) {
        return $resource('/api/journey/:id', null, {
            'update': {method: 'PUT'}
        });
    }
);

app.controller('HomeController', function ($scope, $http, $timeout) {


});

app.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function (event) {

        // put ! below
        if ($rootScope.userasd) {
            console.log('DENY : Redirecting to Login');
            event.preventDefault();
            window.location = '/login.html';
        }
        else {
            console.log('ALLOW');
        }
    });
}])

    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/home.html',
                controller: 'HomeController'
            })
            .otherwise({
                templateUrl: '/home.html',
                controller: 'HomeController',
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });
