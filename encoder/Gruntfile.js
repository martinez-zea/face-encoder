module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      production: {
        options: {
          paths: ["src/static/css"],
          cleancss: true,
          compress: true
        },
        files: {
          "src/static/css/main.css": "src/static/css/main.less"
        }
      }
    },
    watch: {
      files: ['src/static/css/*.less'],
      tasks: ['less'],
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['watch', 'less']);

};
