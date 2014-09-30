/**
 * Created by tijmen on 04/09/14.
 */
(function() {
    var canisiApp = angular.module('canisiApp', ['ngRoute', 'ngAnimate']);

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
            .when('/about/:id', {
                templateUrl: '/partials/register.html',
                controller: 'registerController'
            })
        $locationProvider.html5Mode(true);
    });

    canisiApp.controller('homeController', function($scope,$http) {
        $scope.pageClass = 'page-home';
        $http.get("/data/data.json")
        .success(function(response) {
                $scope.page = response;
        });

        $scope.showNav = function () {
            console.log('toggleNAv');
            if ($('#site-wrapper').hasClass('show-nav')) {
                // Do things on Nav Close
                $('#site-wrapper').removeClass('show-nav');
            } else {
                // Do things on Nav Open
                $('#site-wrapper').addClass('show-nav');
            }
        }

    });

    canisiApp.controller('registerController', function($scope) {
        $scope.pageClass = 'page-register';
    });

    var text = {
        title: 'hoofdstuk 1',
        paragraphs: [
            'Phasellus nibh mauris, vehicula vitae arcu eget, iaculis condimentum metus. Mauris vulputate mauris at leo mattis porta. Nam laoreet at sem mollis pulvinar. Sed tempus semper purus blandit elementum. Ut mauris augue, vestibulum ut arcu sit amet, lacinia volutpat lectus. Sed ut tellus a enim ultricies lobortis nec euismod est. Phasellus consequat nunc id dui iaculis, id faucibus sapien mollis. Aliquam dapibus dolor nulla, at porttitor enim interdum vel. Suspendisse ultricies, mauris ut efficitur ornare, magna augue fermentum magna, nec pulvinar eros nulla ut nisl. Vivamus interdum a magna ac semper.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at mauris et elit lacinia mollis non vel ex. Vestibulum id laoreet eros. Duis pulvinar lacus eleifend nisi ullamcorper consequat. Fusce luctus ultrices enim, at eleifend elit dapibus at. Praesent pharetra nulla risus, quis vehicula nibh dignissim eu. Praesent placerat, nibh vel vehicula venenatis, ex sem aliquet felis, quis elementum ipsum massa nec ex. Phasellus sodales tortor a pretium pulvinar. Donec pellentesque sem sed aliquet sollicitudin. Nulla egestas, elit eu dictum sollicitudin, purus nulla dapibus ipsum, vel vulputate nisl dolor nec metus. Vivamus tincidunt, mauris et malesuada malesuada, sem odio ultrices risus, sed pellentesque sem orci non lorem. In lobortis mattis vehicula. Curabitur urna risus, ornare sit amet interdum sit amet, varius sit amet elit. Maecenas pellentesque sem lacus, eget tincidunt nisl commodo nec. Sed quis odio scelerisque ligula dignissim condimentum. Cras dignissim sapien et quam pulvinar posuere ornare ut massa. Integer rhoncus nibh justo, at pellentesque mi laoreet maximus.',
            'Suspendisse tempor nisi nec sagittis rutrum. Proin at elit laoreet, laoreet enim ac, aliquet nisl. Nam et lobortis ipsum. Morbi pretium bibendum elit, nec ultricies justo vehicula non. In et volutpat elit. Proin sagittis, purus congue rutrum euismod, dolor metus accumsan metus, vel facilisis urna mi eu massa. Etiam tristique, quam non vehicula malesuada, massa massa convallis diam, ut viverra metus magna et sem. Proin ac dictum nisi, ac ullamcorper neque. Mauris rhoncus mauris non quam ullamcorper, non faucibus augue tempus. Fusce finibus lacinia felis at facilisis. Sed nec nisl a dolor sagittis posuere in accumsan enim. Ut ultrices, est in placerat commodo, leo sem eleifend metus, eget sollicitudin ante neque id dui.'
        ]
    }

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