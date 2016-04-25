/**
 * Created by Pratyush on 14-03-2016.
 */
var app = angular.module('cityCommute', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps']);
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
app.factory('Unread', function($resource) {
    return $resource('/api/unreadmessages/:id', null, {
        'update': {
            method: 'PUT'
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
app.factory('Notification', function($resource) {
    return $resource('/api/notifications/:id', null, {
        'update': {
            method: 'PUT'
        }
    });
});
/* A directive for Enter press check */
app.directive('myEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});
/* Controller for chat bar */
app.controller('ChatController', function($scope, $rootScope, socket, $http, Unread, $routeParams, $interval, Chat) {
    // Array to save chats initially
    $scope.messages = Chat.query({
        jid: $routeParams.cid
    });
    // Delete the read messages from unread category
    if ($routeParams.cid) {
        Unread.delete({
            id: $routeParams.cid
        }, function(data) {
            $rootScope.refreshUnread();
        });
    }
    // Function to send chat
    $scope.sendMessage = function() {
        var chat = new Chat();
        chat.message = $scope.message;
        chat.jid = $routeParams.cid;
        chat.$save(function(message) {
            $scope.message = '';
            message.userId = $rootScope.user;
        });
    };
    socket.on('chat' + $routeParams.cid, function(message) {
        $scope.messages.unshift(message);
        Unread.delete({
            id: $routeParams.cid
        }, function(data) {});
    })
});
/* Controller for side bar */
app.controller('SidebarController', function($scope, $rootScope, $http) {
    $scope.logout = function() {
        $http.get('/api/users/logout').then(function(response) {
            if (response.data.success) {
                window.location = '/';
            }
        });
    }
});
/* Controller for unread message */
app.controller('UnreadController', function($scope, $rootScope, $http, $routeParams, socket, Unread) {
    /*$http.get('/api/users/full').then(function(response) {
        $rootScope.user = response.data;
        $scope.setListener();
     });*/
    $rootScope.refreshUnread = function() {
        $rootScope.unreadMessages = Unread.query(function(data) {
            $rootScope.unreadCount = 0;
            for (var i in data) {
                if (data[i].occurance) {
                    $rootScope.unreadCount += data[i].occurance;
                }
            }
        });
    };
    $rootScope.refreshUnread();
    // A Listener for every chat group
    $scope.setListener = function() {
        for (var i in $rootScope.user.journeys) {
            var journeyId = $rootScope.user.journeys[i]._id;
            socket.on('chat' + journeyId, function(message) {
                if (!$routeParams.cid || $routeParams.cid != message.journeyId) {
                    $rootScope.refreshUnread();
                }
            })
        }
    }
});
app.controller('NotificationController', function($scope, $rootScope, $http, $routeParams, socket, Notification) {
    $http.get('/api/users/full').then(function(response) {
        $rootScope.user = response.data;
        $scope.setNotificationListner();
    });
    $scope.notificationCount = 0;
    $rootScope.refreshNotification = function() {
        $scope.notifications = Notification.query(function(data) {
            $scope.notificationCount = $scope.notifications.length;
        });
    };
    $rootScope.refreshNotification();
    // Moment js
    $rootScope.timeInWords = function(date) {
        return moment(date).fromNow();
    };
    // A Listener for the notification
    $scope.setNotificationListner = function() {
        console.log('notification' + $rootScope.user._id);
        socket.on('notification' + $rootScope.user._id, function() {
            $rootScope.refreshNotification();
            console.log('notification' + $rootScope.user._id);
        });
    }
    $scope.refreshPage = function(journeyId) {
        window.location = '/journey/' + journeyId;
    }
});
/* Controller for index page */
app.controller('JourneyController', function($scope, $rootScope, $log, $timeout, $routeParams, socket, $http, $timeout, Journey, Notification) {
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
    };
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
            Notification.delete({
                id: $routeParams.id
            }, function(data) {});
            $rootScope.refreshNotification();
        });
    }
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
    };
    // function to accept request
    $scope.accept = function(userId) {
        $http({
            method: "POST",
            url: "/api/journeys/" + $routeParams.id + "/accept/" + userId,
        }).then(function(response) {
            $scope.refreshJourney();
        }, function(response) {});
    };
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
    };
    // function to post joureys
    $scope.postJourney = function() {
        $scope.postError = '';
        var newJourney = new Journey();
        newJourney.startStreet = $scope.startLocation;
        newJourney.startArea = $scope.startArea;
        newJourney.startCity = $scope.startCity;
        newJourney.startAddress = $scope.startAddress;
        newJourney.startCoordLat = $scope.startCoordLat;
        newJourney.startCoordLng = $scope.startCoordLng;
        newJourney.endStreet = $scope.endLocation;
        newJourney.endArea = $scope.endArea;
        newJourney.endCity = $scope.endCity;
        newJourney.endAddress = $scope.endAddress;
        newJourney.endCoordLat = $scope.endCoordLat;
        newJourney.endCoordLng = $scope.endCoordLng;
        newJourney.departure = $scope.journeyObject.departure;
        newJourney.vehicle = $scope.journeyObject.vehicle;
        newJourney.availableSeats = $scope.journeyObject.availableSeats;
        newJourney.genderPreference = $scope.journeyObject.genderPreference;
        newJourney.description = $scope.journeyObject.description;
        newJourney.fare = $scope.journeyObject.fare;
        console.log('Hi');
        console.log(newJourney);
        newJourney.$save($scope.journeyObject, function(tweet) {
            console.log(tweet);
            if (tweet.error) {
                $scope.postError = 'Please fill all fields correctly!';
            }else{
                window.location = '/';
            }
        }, function(err) {
            console.log(err);
            $scope.postError = 'Error in posting';
        })
    };
    socket.on('journey', function(journey) {
        console.log('A journey received');
        $scope.journeys.unshift(journey);
        $.gritter.add({
            title: 'New journey posted!',
            text: '<a href="/"> ' + journey.start.street + ', ' + journey.start.area + ' to ' + journey.end.street + ', ' + journey.end.area + '<br/> ' + journey.availableSeats + ' seats available </a>',
            image: journey.vehicle.png,
            sticky: false,
            time: 6000,
            class_name: 'my-sticky-class'
        });
    });
    /* MAP CONFIGURATIONS */
    /* START MAP */
    $scope.startMap = {
        center: {
            latitude: 22.6761144,
            longitude: 88.0883865
        },
        zoom: 8
    };
    $scope.fetchStart = function() {
        var address = $scope.startAddressModel.replace(' ', '%20');
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address).then(function(response) {
            if ((response.data != undefined) && (response.data.status = 'OK') && (response.data.results != undefined) && (response.data.results[0].geometry != undefined) && (response.data.results[0].address_components != undefined)) {
                $scope.startMap.center.latitude = response.data.results[0].geometry.location.lat;
                $scope.startMap.center.longitude = response.data.results[0].geometry.location.lng;
                $scope.startMarker.coords.latitude = response.data.results[0].geometry.location.lat;
                $scope.startMarker.coords.longitude = response.data.results[0].geometry.location.lng;
                $scope.startMap.zoom = 14;
                $scope.startLocation = response.data.results[0].formatted_address.split(',')[0];
                $scope.startArea = response.data.results[0].formatted_address.split(',')[1];
                var len = response.data.results[0].formatted_address.split(',').length;
                $scope.startCity = response.data.results[0].formatted_address.split(',')[len - 3];
                $scope.startAddress = response.data.results[0].formatted_address;
                $scope.startCoordLat = response.data.results[0].geometry.location.lat;
                $scope.startCoordLng = response.data.results[0].geometry.location.lng;
            }
        });
    };
    $scope.startMarker = {
        id: 0,
        coords: {
            latitude: 0,
            longitude: 0
        },
        options: {
            draggable: true
        },
        events: {
            dragend: function(marker, eventName, args) {
                alert('ad');
                $log.log('marker dragend');
                marker.coords = $scope.startMap.center;
                $log.log(lat);
                $log.log(lon);
                $scope.startMarker.options = {
                    draggable: true,
                    labelContent: "lat: " + $scope.startMarker.coords.latitude + ' ' + 'lon: ' + $scope.startMarker.coords.longitude,
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };
    /* end MAP */
    $scope.endMap = {
        center: {
            latitude: 22.6761144,
            longitude: 88.0883865
        },
        zoom: 8
    };
    $scope.fetchend = function() {
        var address = $scope.endAddressModel.replace(' ', '%20');
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address).then(function(response) {
            if ((response.data != undefined) && (response.data.status = 'OK') && (response.data.results != undefined) && (response.data.results[0].geometry != undefined) && (response.data.results[0].address_components != undefined)) {
                $scope.endMap.center.latitude = response.data.results[0].geometry.location.lat;
                $scope.endMap.center.longitude = response.data.results[0].geometry.location.lng;
                $scope.endMarker.coords.latitude = response.data.results[0].geometry.location.lat;
                $scope.endMarker.coords.longitude = response.data.results[0].geometry.location.lng;
                $scope.endMap.zoom = 14;
                $scope.endLocation = response.data.results[0].formatted_address.split(',')[0];
                $scope.endArea = response.data.results[0].formatted_address.split(',')[1];
                var len = response.data.results[0].formatted_address.split(',').length;
                $scope.endCity = response.data.results[0].formatted_address.split(',')[len - 3];
                $scope.endAddress = response.data.results[0].formatted_address;
                $scope.endCoordLat = response.data.results[0].geometry.location.lat;
                $scope.endCoordLng = response.data.results[0].geometry.location.lng;
            }
        });
    };
    $scope.endMarker = {
        id: 0,
        coords: {
            latitude: 0,
            longitude: 0
        },
        options: {
            draggable: true
        },
        events: {
            dragend: function(marker, eventName, args) {
                alert('ad');
                $log.log('marker dragend');
                marker.coords = $scope.endMap.center;
                $log.log(lat);
                $log.log(lon);
                $scope.endMarker.options = {
                    draggable: true,
                    labelContent: "lat: " + $scope.endMarker.coords.latitude + ' ' + 'lon: ' + $scope.endMarker.coords.longitude,
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };
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
    }).when('/chat/:cid', {
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