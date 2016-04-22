/**
 * Created by Pratyush on 14-03-2016.
 */
var app = angular.module('cityCommute', ['ngResource', 'ngRoute']);
app.factory('Journey', function($resource) {
    return $resource('/api/journeys/:id', null, {
        'update': {
            method: 'PUT'
        },
        past: {
            method: 'GET',
            isArray: true,
            params: {
                id: 'past'
            }
        },
        user: {
            method: 'GET',
            isArray: true,
            params: {
                id: 'user'
            }
        }
    });
});
app.factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
app.factory('Chat', function($resource) {
    return $resource('/api/chats/:id', null, {
        'update': {
            method: 'PUT'
        }
    });
});
/* Controller for chat bar */
app.controller('ChatController', function($scope, $rootScope, socket, $http, $routeParams, $interval, Chat) {
    // Array to save chats initially
    $scope.messages = Chat.query({
        jid: $routeParams.id
    });
    // Moment js
    $scope.timeInWords = function(date) {
        return moment(date).fromNow();
    };
    // Function to send chat
    $scope.sendMessage = function() {
        var chat = new Chat();
        chat.message = $scope.message;
        chat.jid = $routeParams.id;
        chat.$save(function(message) {
            $scope.message = '';
            message.userId = $rootScope.user;
            console.log(message);
        });
    }
    socket.on('chat', function(message){
        console.log('A chat received');
        $scope.messages.unshift(message);
    })
});
/* Controller for side bar */
app.controller('SidebarController', function($scope, $rootScope, $http) {
    $http.get('/api/users/full').then(function(response) {
        $rootScope.user = response.data;
    });
});
/* Controller for index page */
app.controller('JourneyController', function($scope, $rootScope, $routeParams, $http, $timeout, Journey) {
    // List of all journeys
    $scope.journeys = Journey.query();
    // List of all past journeys
    $scope.pastJourneys = Journey.past();
    // List of all user journeys
    $scope.userJourneys = Journey.user();
    // Simple array to stores options of seats available
    $scope.seatsAvailable = [];
    // Boolean to check if request panel is to be shown
    $scope.hideRequestPanel = false;
    // Boolean to check if user req in journey
    $scope.ifRequestedJourney = false;
    // function to refresh journey page
    $scope.refreshJourney = function() {
            window.location = '/journey/' + $routeParams.id;
        }
        //getting single joutney by id
    if ($routeParams.id) {
        $scope.journey = Journey.get({
            id: $routeParams.id
        }, function(data) {
            $scope.seatsAvailable = [];
            for (var i = 1; i <= $scope.journey.availableSeats; ++i) {
                $scope.seatsAvailable.push(i);
            }
            if ($scope.journey.posted_by._id == $rootScope.user._id) {
                $scope.hideRequestPanel = true;
            }
            for (index in $scope.journey.requested_by) {
                console.log($scope.journey.requested_by[index]);
                console.log($rootScope.user._id);
                if ($scope.journey.requested_by[index].id._id == $rootScope.user._id) {
                    $scope.hideRequestPanel = true;
                    $scope.ifRequestedJourney = true;
                }
            }
            for (index in $scope.journey.accepted_requests) {
                if ($scope.journey.accepted_requests[index].id._id == $rootScope.user._id) {
                    $scope.hideRequestPanel = true;
                }
            }
        });
    }
    // Moment js
    $scope.timeInWords = function(date) {
        return moment(date).fromNow();
    };
    // Object to store form data
    $scope.journeyObject = {};
    // List of vehicles
    $scope.vehicles = [];
    // Retrieve vehicles
    $http.get('/api/vehicles').then(function(response) {
        $scope.vehicles = response.data;
    });
    // function to decline request
    $scope.decline = function(userId) {
            $http({
                method: "DELETE",
                url: "/api/journeys/" + $routeParams.id + "/request/" + userId,
            }).then(function(response) {
                $scope.refreshJourney();
            }, function(response) {});
        }
        // function to accept request
    $scope.accept = function(userId) {
            $http({
                method: "POST",
                url: "/api/journeys/" + $routeParams.id + "/accept/" + userId,
            }).then(function(response) {
                $scope.refreshJourney();
            }, function(response) {});
        }
        // seatsRequestedByUser
    $scope.makeRequest = function() {
            $http({
                method: "POST",
                url: "/api/journeys/" + $routeParams.id + "/request",
                data: {
                    seats: $scope.seatsRequestedByUser
                }
            }).then(function(response) {
                console.log(response.data);
                $scope.refreshJourney();
            }, function(response) {});
        }
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
        controller: 'JourneyController'
    }).when('/addjourney', {
        templateUrl: '/post_journey.html',
        controller: 'JourneyController'
    }).when('/journey/:id', {
        templateUrl: '/journey.html',
        controller: 'JourneyController'
    }).when('/chat', {
        templateUrl: '/chat_group.html',
        controller: 'ChatController'
    }).when('/chat/:id', {
        templateUrl: '/chat.html',
        controller: 'ChatController'
    }).otherwise({
        templateUrl: '/home.html',
        controller: 'JourneyController',
    });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});