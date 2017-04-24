var app=angular.module('myApp', ['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/tracks', {
            templateUrl: 'tracks.html',
            controller: 'trackCtrl'
        })
        .when('/genres', {
            templateUrl: 'genres.html',
            controller: 'genreCtrl'
        })
        .otherwise({
            redirectTo: '/tracks'
        });
});

app.factory('trackService', function ($resource) {
    return $resource('http://104.197.128.152:8000/v1/tracks',{}, {
        'query': {
            method:'GET', 
            url: "http://104.197.128.152:8000/v1/tracks"
        },
        'create': { 
            method:'POST',
            url: "http://104.197.128.152:8000/v1/tracks/" 
        },
        'update': { 
            method:'POST',
            url: "http://104.197.128.152:8000/v1/tracks/:id" 
        },
        'remove': { 
            method: "DELETE", 
            url: "http://104.197.128.152:8000/v1/tracks/:id" 
        },
        'search': {
            method: "GET",
            url: "http://104.197.128.152:8000/v1/tracks?title=:name"
        },
        'get': {
            method: "GET",
            url: "http://104.197.128.152:8000/v1/tracks?page=:no"
        }
    });
});

app.controller('trackCtrl', function($scope, trackService) {
    $scope.editStatus=false;
    $scope.pageNo = 1;
    $scope.tracks = trackService.query()
    $scope.onpageload = function(){
        setTimeout(function () {
           $scope.tracks = trackService.get({no: $scope.pageNo});
           $scope.$apply();
        }, 700);
    }

    $scope.pageCtrl = function (number) {
        $scope.pageNo += number;
        $scope.tracks = trackService.get({no: $scope.pageNo});
    };

    $scope.deleteCtrl = function(idNo) {
        trackService.remove({id: idNo})
        alert("Deleted successfully")
        $scope.onpageload();
    }

    $scope.createModal = function() {
        $scope.editStatus=false;
        $scope.titleName = '';
        $scope.rating = ''
        $scope.editID = '';
        $('#modifyModal').modal('show');
    }

    $scope.editModal = function(track){
        $scope.editStatus=true;
        $('#modifyModal').modal('show');
        $scope.titleName = track.title
        $scope.rating = track.rating
        $scope.editID = track.id
    }

    $scope.modify = function(track, rating) {
         if (!$scope.editStatus){
             trackService.create({title: track, rating: rating})
             alert("Inserted Successfully")
         } else {
             trackService.update({id: $scope.editID}, {title: track, rating: rating})
         }
        $scope.onpageload();
    }

    $scope.searchName = function(trackName){
        setTimeout(function () {
           $scope.tracks = trackService.search({name:trackName});
           $scope.$apply();
        }, 700);
    }

});

app.factory('genreService', function ($resource) {
    return $resource('http://104.197.128.152:8000/v1/genres',{}, {
        'query': {
            method:'GET', 
            url: "http://104.197.128.152:8000/v1/genres"
        },
        'create': { 
            method:'POST',
            url: "http://104.197.128.152:8000/v1/genres/" 
        },
        'update': { 
            method:'POST',
            url: "http://104.197.128.152:8000/v1/genres/:id" 
        },
        'remove': { 
            method: "DELETE", 
            url: "http://104.197.128.152:8000/v1/genres/:id" 
        },
        'get': {
            method: "GET",
            url: "http://104.197.128.152:8000/v1/genres?page=:no"
        }
    });
});

app.controller('genreCtrl', function($scope, $http, genreService) {
    $scope.editStatus=false;
    $scope.pageNo = 1;
    $scope.genres = genreService.query();

    $scope.onpageload = function(){
        setTimeout(function () {
           $scope.genres = genreService.get({no: $scope.pageNo});
           $scope.$apply();
        }, 700);
    }

    $scope.pageCtrl = function (number) {
            $scope.pageNo += number;
            $scope.genres = genreService.get({no: $scope.pageNo});
    };

    $scope.editModal = function(genre){
        $scope.editStatus=true;
        $('#modifyModal').modal('show');
        $scope.genreName = genre.name
        $scope.editID = genre.id
    }

    $scope.createModal = function() {
        $scope.editStatus=false;
        $scope.genreName = '';
        $scope.editID = '';
        $('#modifyModal').modal('show');
    }

     $scope.modify = function(name) {
         if (!$scope.editStatus){
             genreService.create({name: name})
         } else {
             genreService.update({id: $scope.editID}, {name: name})
         }
        $scope.onpageload();
    }

    $scope.deleteCtrl = function(idNo) {
        genreService.remove({id: idNo})
        alert("Deleted successfully")
        $scope.onpageload();
    }
});

app.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '='
        },
        link: function (scope, elem, attrs) {
            scope.stars = [];
            for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.ratingValue
                });
            }
        }
    }
});