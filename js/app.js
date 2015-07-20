/**
 * Created by tijmen on 04/09/14.
 *
 */
(function () {

    var canisiApp = angular.module('canisiApp', ['ngRoute', 'ngAnimate']);


    canisiApp.run(function ($rootScope) {
        $rootScope.showMenu = function () {
            $('#site-wrapper').addClass('show-nav');
        }
        $rootScope.closeMenu = function () {
            $('#site-wrapper').removeClass('show-nav');
            window.scrollTo(0, 0);
        }
        $rootScope.toggleMenu = function () {
            if ($('#site-wrapper').hasClass('show-nav')) {
                $rootScope.closeMenu();
            }
            else {
                $rootScope.showMenu();
            }
        }


    })


    canisiApp.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/home.html',
                controller: 'homeController'
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
                controller: 'chapterController'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);

    });

    canisiApp.service('sharedVar', function ($rootScope) {
        var c_page = 0;

        this.incrementPage = function () {
            c_page++;
            $rootScope.$apply();
        };
        this.decrementPage = function () {
            c_page--;
            $rootScope.$apply();
        };
        this.getCPage = function () {
            return c_page;
        }
    });

    canisiApp.controller('homeController', function ($scope, $http, $rootScope) {
        $rootScope.closeMenu();
        $scope.pageClass = 'page-home';


        $http.get("https://canisi.iriscouch.com/db_canisi/_design/book_title/_view/book_title")
            .success(function (response) {
                $scope.page = response;
            });

    });

    canisiApp.controller('chapterController', function ($scope, $http, $routeParams, $rootScope, Catechismus) {
        $scope.chapterID = $routeParams.chapterId;
        if (_.isUndefined($scope.paragraphNumber)) {
            $scope.paragraphNumber = 0;
        }
        ;
        var head = Catechismus.returnIdInLevel(0, $scope.chapterID);
        $scope.chptr_title = head.title;
        $scope.chptr_subtitle = head.subtitle;
        $scope.chptr_preface = head.preface;
        $scope.paragraphs = Catechismus.getPage($scope.paragraphNumber);
        $scope.paragraphNumber += 5;
    });

    canisiApp.controller('menuController', function ($scope, $http) {

        $http.get("https://canisi.iriscouch.com/db_canisi/_design/register/_view/register")
            .success(function (response) {
                $scope.page = response;
            });
    });


    canisiApp.directive('page', function (sharedVar) {
        return {
            restrict: 'E',
            templateUrl: 'partials/page.html',
            link: function (scope, elem, attrs) {

            }

        }

    });

    canisiApp.directive('nav', function (sharedVar, $location) {
        return {
            restrict: 'E',
            template: '<div class="nav-{{dir}} icon icon-arrow-{{dir}}" ng-show="show"></div>',
            scope: {},
            link: function (scope, elem, attrs) {
                scope.show = true;
                scope.service = sharedVar;
                if (attrs.dir === 'back') {
                    scope.dir = 'left';
                }
                else {
                    scope.dir = 'right';
                }

                scope.$watch('service.getCPage()', function () {
                    if(scope.service.getCPage() === 0 ) {
                        if(scope.dir === 'left') {
                            scope.show = false;
                        }
                    }
                    else {
                        if(scope.dir === 'left') {
                            scope.show = true;
                        }
                    }


                }, true);

                elem.on('click', function () {
                    if (scope.dir === 'left') {
                        scope.service.decrementPage();
                        $location.path( "chapter/3/page/2");
                    }
                    if (scope.dir === 'right') {
                        scope.service.incrementPage();
                        $location.path( "chapter/3/page/2");
                    }
                })

            }
        }
    })


    canisiApp.factory('Catechismus', function ($http) {
        var Catechismus = {},
            levels = [];


        var promise = $http.get('https:/canisi.iriscouch.com/db_canisi/0f7902d1271c7560533ef86a450005ec').success(function (data) {
            _.each(data.levels, function (level, index) {
                levels[index] = level.objects;
            })
        });

        Catechismus.promise = promise;

        Catechismus.returnLevel = function (levelId) {
            return levels[levelId];
        };

        Catechismus.returnIdInLevel = function (levelId, id) {
            return levels[levelId][id];
        }

        Catechismus.returnFirstWithConLevel = function (con_level, id_in_con_level) {
            for (var i = levels.length - 1; i >= 1; i--) {
                var result = _.findWhere(levels[i], {"con_level": con_level, "id_in_con_level": id_in_con_level});
                if (result !== undefined) {
                    return result
                }
            }
        }

        Catechismus.getPage = function (start_p) {
            var page = [];
            for (var i = 0; i < 5; i++) {
                page.push(levels[8][start_p]);
                start_p++;
            }
            return page;
        }

        return Catechismus;
    });

})
();


/*========================================
 =            CUSTOM FUNCTIONS            =
 ========================================*/


//close nav with escape
$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        if ($('#site-wrapper').hasClass('show-nav')) {
            // Assuming you used the function I made from the demo
            toggleNav();
        }
    }
});