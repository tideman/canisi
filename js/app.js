/**
 * Created by tijmen on 04/09/14.
 */
(function() {
    var canisiApp = angular.module('canisiApp', ['ngRoute', 'ngAnimate']);



    canisiApp.run(function($rootScope) {
        $rootScope.showNav = function () {
            console.log('toggleNAv');
            if ($('#site-wrapper').hasClass('show-nav')) {
                // Do things on Nav Close
                $('#site-wrapper').removeClass('show-nav');
            } else {
                // Do things on Nav Open
                $('#site-wrapper').addClass('show-nav');
            }
        }

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
                controller: 'chapterController'
            })
            .when('/chapter/:chapterId/page/:pageId', {
                templateUrl: '/partials/chapter.html',
                controller: 'chapterController'
            })
        $locationProvider.html5Mode(true);
    });

    canisiApp.controller('homeController', function($scope,$http) {
        $scope.pageClass = 'page-home';

        //hide navigation;
        $scope.book = true;

        $http.get("https://canisi.iriscouch.com/db_canisi/_design/book_title/_view/book_title")
        .success(function(response) {
            $scope.page = response;
        });
    });

    canisiApp.controller('registerController', function($scope,$http) {
        $scope.pageClass = 'page-register';

    });

    canisiApp.controller('chapterController', function($scope, $http, $routeParams, $rootScope) {
        var chapterId,
            pageId,
            sectionId;

        $scope.pageClass = 'page-chapter';

        //show navigation;
        $scope.book = false;

        chapterId = parseInt($routeParams.chapterId);
        pageId = parseInt($routeParams.pageId);
        sectionId = parseInt($routeParams.sectionId);

        if(isNaN(pageId)) {
            pageId = 1;
        }

        $scope.currentChapter = chapterId;
        $scope.currentPage = pageId;
        $scope.currentSection = sectionId;

        $scope.previous = '/test/1';
        $scope.next = '/nogwat/3';

        //check if chapter fetched
        if($scope.chapterContent == undefined) {
            fetchChapter();
        }
        else {
            buildPage();
        }


        function addChapterHeader() {
            //chapter head
            $scope.chptr_title = $scope.chapterContent.chptr_title;
            $scope.chptr_subtitle = $scope.chapterContent.chptr_subtitle;
            $scope.chptr_preface = $scope.chapterContent.chptr_preface;
        }

        function fetchChapter() {
            console.log('fetching chapter');
            $http.get("https://canisi.iriscouch.com/db_canisi/_design/chapter/_view/chapter?key=" + chapterId)
                .success(function(response) {
                    $scope.chapterContent = response.rows[0].value;
                    if(pageId === 1) {
                        addChapterHeader();
                    }
                    buildPage();
                });
            //addChapterHeader();
        }

        function buildPage() {
           console.log('BUILD PAGE');


            //check for paragraphs
            if($scope.chapterContent.chptr_txt.paragraphs == undefined) {
                console.log($scope.chapterContent.chptr_txt.sections);
                fetchParagraphs($scope.chapterContent.chptr_txt.sections[0]);
            }
            else {
                console.log($scope.chapterContent.chptr_txt);
                fetchParagraphs($scope.chapterContent.chptr_txt);
            }
        }

        function fetchParagraphs(p_container) {
            console.log('bla' + p_container);
            var p_start,
                i,
                paragraphs = [];
            //fetch 3 paragraphs
            p_start = pageId * 3;
            for(i = 0; i < 3 ; i++) {
                paragraphs.push(p_container.paragraphs[i]);
                p_start++;

            }
            $scope.paragraphs = paragraphs;
        }





    });

    canisiApp.controller('menuController', function($scope, $http) {
        $http.get("https://canisi.iriscouch.com/db_canisi/_design/register/_view/register")
            .success(function(response) {
                $scope.page = response;
            });
    });

    canisiApp.controller('navigationController', function($scope) {

        if($scope.currentPage == undefined) {
            $scope.currentPage = 0;
        }
        if($scope.currentChapter == undefined) {
            $scope.currentChapter= 0;
        }
        if($scope.currentSection == undefined) {
            $scope.currentSection= 0;
        }

        $scope.previous = function() {
            console.log('PREVIOUS');
            console.log('chapter: ' + $scope.currentChapter);
            console.log('page: ' + $scope.currentPage);
            console.log('section: ' + $scope.currentSection);

        }


        $scope.next = function() {
            console.log('NEXT');
            console.log('chapter: ' + $scope.currentChapter);
            console.log('page: ' + $scope.currentPage);
            console.log('section: ' + $scope.currentSection);

        }


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