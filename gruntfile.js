module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },

      my_target: {
        files: {
          'public/app-<%= pkg.version %>.min.js': ['public/app.js']
        }
      }
    },

    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: ['lib/*.js'],
        dest: 'public/app.js'
      }
    },

    watch: {
      application_code: {
        files: ['lib/**/*.js'],
        tasks: ['concat']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('release', ['concat', 'uglify']);
};