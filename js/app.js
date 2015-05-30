/**
 * Created by tijmen on 04/09/14.
 */
(function() {
    var canisiApp = angular.module('canisiApp', ['ngRoute', 'ngAnimate']);



    canisiApp.run(function($rootScope) {
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
                controller: 'chapterController'
            })
            .when('/chapter/:chapterId/page/:pageId', {
                templateUrl: '/partials/chapter.html',
                controller: 'chapterController'
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

    canisiApp.controller('chapterController', function($scope, $http, $routeParams, $rootScope) {
        //show navigation;
        $scope.pageClass = 'page-chapter';
        $rootScope.book = true;
        console.log('chapter executed');
        $rootScope.closeMenu();

        $rootScope.chapterId = parseInt($routeParams.chapterId);

       //check if chapter fetched
        if($rootScope.location == undefined) {
            fetchChapter();
        }
        else {
            buildPage();
        }

        function addChapterHeader() {
            //chapter head
            $scope.chptr_title = $rootScope.response.chptr_title;
            $scope.chptr_subtitle = $rootScope.response.chptr_subtitle;
            $scope.chptr_preface = $rootScope.response.chptr_preface;
        }

        function addSectionHeader(section_number) {
            $scope.sctn_nmbr = $scope.chapterContent.chptr_txt.sections[section_number].sctn_nmbr;
            $scope.sctn_title = $scope.chapterContent.chptr_txt.sections[section_number].sctn_title;

        }

        function fetchChapter() {
            $http.get("https://canisi.iriscouch.com/db_canisi/_design/chapter/_view/chapter?key=" + $rootScope.chapterId)
                .success(function(response) {
                    $rootScope.response = response.rows[0].value;

                    if($rootScope.pageId === 1) {
                        addChapterHeader();
                    }
                    buildPage();
                });
            //addChapterHeader();
        }

        function buildPage() {
            //check for paragraphs
            var paragraphs = [];
            if($rootScope.paragraphNmbr === 0 && $rootScope.pageId === 0) {
                $rootScope.pageId = 1;
                 //beginning of chapter
                //show chapter header


                $rootScope.location = $rootScope.response.chptr_txt;
                $rootScope.inChapter = true;
                addChapterHeader();
            }

            for(var i = 0; i < 3; i++) {
                console.log('number:' + $rootScope.paragraphNmbr);
                if($rootScope.location.paragraphs) {
                    if($rootScope.location.paragraphs[$rootScope.paragraphNmbr] === undefined) {

                        jump();
                    }
                    else {
                        paragraphs.push($rootScope.location.paragraphs[$rootScope.paragraphNmbr]);
                    }
                }
                else {

                    jump();
                    paragraphs.push($rootScope.location.paragraphs[$rootScope.paragraphNmbr]);
                }
                $rootScope.paragraphNmbr++
            }
            $rootScope.pageId++;

            $scope.paragraphs = paragraphs;

            function jump() {
                //change location
                //check for section
                if($rootScope.inSection) {
                    $rootScope.location = $rootScope.response.chptr_txt.sections[$rootScope.sectionId++];

                }
                if($rootScope.inChapter) {

                    if($rootScope.location.sections !== undefined) {
                        $rootScope.inChapter = false;
                        $rootScope.inSection = true;
                        $rootScope.location = $rootScope.location.sections[$rootScope.sectionId++];

                    }
                }



            }

            //fetch 3 paragraphs for a page

                //paragraphs
                //section
                //supersection
                        //spr_section
                        //spr_section_subtitle
                            //paragraphs
                            //subchapter





        }






    });

    canisiApp.controller('menuController', function($scope, $http) {
        $http.get("https://canisi.iriscouch.com/db_canisi/_design/register/_view/register")
            .success(function(response) {
                $scope.page = response;
            });
    });

    canisiApp.controller('navigationController', function($scope, $rootScope, $route) {

        $scope.book = $rootScope.book;

        $scope.previous = function() {
//            console.log('PREVIOUS');
//            console.log('chapter within previous:' + $rootScope.currentChapter);
//            console.log('chapter: ' + $scope.currentChapter);
//            console.log('page: ' + $scope.currentPage);
//            console.log('section: ' + $scope.currentSection);
            $rootScope.next = false;
            $route.reload();

        }


        $scope.next = function() {
//            console.log('NEXT!');
//            console.log('chapter: ' + $scope.currentChapter);
//            console.log('page: ' + $scope.currentPage);
//            console.log('section: ' + $scope.currentSection);
              $rootScope.next = true;
              $route.reload();
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