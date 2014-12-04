/*global module:false*/
var modRewrite = require('connect-modrewrite');
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    path: {
        sass: 'sass',
        css: 'css',
        js: 'js',
        node: 'node_modules',
        dist: 'dist',
        bw: 'bower_components'
    },
    // Task configuration.
    concat: {
        options: {
            banner: '<%= banner %>',
            stripBanners: false
        },
        dist: {
            files: {
                'dist/<%=path.js%>/<%= pkg.name %>.min.js' : ['<%=path.bw%>/angular/angular.js','<%=path.bw%>/angular-resource/angular-resource.js','<%=path.bw%>/angular-touch/angular-touch.js','<%=path.bw%>/angular-animate/angular-animate.js','<%=path.bw%>/angular-route/angular-route.js','<%=path.node%>/jquery/dist/jquery.js', '<%=path.js%>/app.js'],
                'dist/<%=path.css%>/style.min.css': ['<%=path.bw%>/bootstrap/dist/css/bootstrap.css', 'dist/<%=path.css%>/style.min.css']
            }
        }
    },
    sass: {
        dist: {
            files: {
                'dist/<%=path.css%>/style.min.css': '<%=path.sass%>/main.sass'
            }
        }
    },
    autoprefixer: {
        options: {
            browsers: ['last 3 versions']
        },
        dist: {
            src: 'dist/<%=path.css%>/style.min.css',
            dest: 'dist/<%=path.css%>/style.min.css'
        }
    },
    cssmin: {
        dist: {
            src: 'dist/<%=path.css%>/style.min.css',
            dest: 'dist/<%=path.css%>/style.min.css'
        }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'dist/<%=path.js%>/<%= pkg.name %>.min.js',
        dest: 'dist/<%=path.js%>/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      livereload: {
          options: { livereload: true },
          files: ['dist/**/*.html', '<%=path.sass%>/**/*', '<%=path.js%>/**/*'],
          tasks: ['dev']
      }

    },

        connect: {
            options: {
                hostname: 'localhost',
                open: true,
                port: 9001,
                livereload: true,
                base: 'dist'
            },
            server: {
                options: {
                    middleware: function (connect) {
                        return [
                            modRewrite (['!\\.html|\\.js|\\.ico|\\.svg|\\.eot|\\.ttf|\\.woff|\\.css|\\.png|\\.jpg$ /index.html [L]']),
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            }

    }
  });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task.
    grunt.registerTask('dist', ['concat', 'cssmin', 'uglify']);
    grunt.registerTask('styles', ['sass', 'autoprefixer']);
    grunt.registerTask('serve', ['connect:server', 'watch']);
    grunt.registerTask('dev', ['sass', 'autoprefixer', 'concat']);

};
