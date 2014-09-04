/*global module:false*/
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
        dist: 'dist'
    },
    // Task configuration.
    concat: {
        options: {
            banner: '<%= banner %>',
            stripBanners: false
        },
        dist: {
            src: ['<%=path.node%>/jquery/dist/jquery.js', '<%=path.js%>/init.js'],
            dest: 'dist/<%=path.js%>/<%= pkg.name %>.min.js'
        }
    },
    sass: {
        dist: {
            files: {
                'dist/<%=path.css%>/style.css': '<%=path.sass%>/main.sass'
            }
        }
    },
    autoprefixer: {
        options: {
            browsers: ['last 3 versions']
        },
        dist: {
            src: 'dist/<%=path.css%>/style.css',
            dest: 'dist/<%=path.css%>/style.css'
        }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%=path.js%>/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      livereload: {
          options: { livereload: true },
          files: ['dist/**/*.html', '<%=path.sass%>/**/*'],
          tasks: ['dev']
      }

    },
    connect: {
        server: {
          options: {
              hostname: 'localhost',
              open: true,
              port: 9001,
              livereload: true,
              base: 'dist'
          }
        }
    }
  });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task.
    grunt.registerTask('dist', ['concat', 'uglify']);
    grunt.registerTask('styles', ['sass', 'autoprefixer']);
    grunt.registerTask('serve', ['connect', 'watch']);
    grunt.registerTask('dev', ['sass', 'autoprefixer', 'concat']);

};
