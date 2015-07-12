/**
 * Created by tijmen on 04/09/14.
 *
 */
(function() {

    var canisiApp = angular.module('canisiApp', ['ngRoute', 'ngAnimate']);



    canisiApp.run(function($rootScope) {
        console.log('RUN');
        $rootScope.showMenu = function () {
            $('#site-wrapper').addClass('show-nav');
        }
        $rootScope.closeMenu = function () {
            $('#site-wrapper').removeClass('show-nav');
            window.scrollTo(0,0);
        }
        $rootScope.toggleMenu = function () {
            if($('#site-wrapper').hasClass('show-nav')) {
                $rootScope.closeMenu();
            }
            else {
                $rootScope.showMenu();
            }
        }

        $rootScope.chapterId = 0;
        $rootScope.pageId = 0;
        $rootScope.sectionId = 0;
        $rootScope.paragraphNmbr = 0;
        $rootScope.inChapter = false;
        $rootScope.inSection = false;
        $rootScope.next = false;

    })


    canisiApp.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/home.html',
                controller: 'homeController'
            })
            .when('/register', {
                templateUrl: '/partials/register.html',
                controller: 'registerController'
            })
            .when('/chapter/:chapterId', {
                templateUrl: '/partials/chapter.html',
                controller: 'chapterController',
                resolve: {
                    'CatechismusData': function (Catechismus) {
                        return Catechismus.promise;

                    }
                }
            })
            .when('/chapter/:chapterId/page/:pageId', {
                templateUrl: '/partials/chapter.html',
                controller: 'chapterController',
            })
        $locationProvider.html5Mode(true);
    });

    canisiApp.controller('homeController', function($scope,$http, $rootScope) {
        $rootScope.closeMenu();
        $scope.pageClass = 'page-home';

        $http.get("https://canisi.iriscouch.com/db_canisi/_design/book_title/_view/book_title")
        .success(function(response) {
            $scope.page = response;
        });

    });

    canisiApp.controller('chapterController', function($scope, $http, $routeParams, $rootScope, Catechismus) {

        //console.log($routeParams.chapterId);
        //console.log(Level8.firstWithLevel0($routeParams.chapterId));
        console.log( Catechismus.returnFirstWithConLevel('0','2'));
        //Catechismus.getPart('3');

    });

    canisiApp.controller('menuController', function($scope, $http) {
        $http.get("https://canisi.iriscouch.com/db_canisi/_design/register/_view/register")
            .success(function(response) {
                $scope.page = response;
            });
    });

    canisiApp.factory('Catechismus', function($http) {
        var Catechismus = {},
            levels = [];


        var promise = $http.get('https:/canisi.iriscouch.com/db_canisi/0f7902d1271c7560533ef86a450005ec').success(function (data) {
            _.each(data.levels, function(level, index) {
                levels[index] = level.objects;
            })
        });

        Catechismus.promise = promise;

        Catechismus.returnLevel = function(levelId) {
            return levels[levelId];
        };

        Catechismus.returnIdInLevel = function(levelId, id) {
            return levels[levelId][id];
        }

        Catechismus.returnFirstWithConLevel = function(con_level, id_in_con_level) {
           for(var i = levels.length -1 ; i >= 1; i--) {
               console.log(levels[i]);
               var result = _.findWhere(levels[i], {"con_level": con_level, "id_in_con_level": id_in_con_level});
               if(result !== undefined) {
                   return result
               }
           }
        }

        return Catechismus;
    });

    canisiApp.controller('NavigationContrller', function() {
        console.log('BLA');
    });





})();






/*========================================
 =            CUSTOM FUNCTIONS            =
 ========================================*/


//close nav with escape
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        if ($('#site-wrapper').hasClass('show-nav')) {
            // Assuming you used the function I made from the demo
            toggleNav();
        }
    }
});