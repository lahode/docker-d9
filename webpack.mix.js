/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your application. See https://github.com/JeffreyWay/laravel-mix.
 |
 */
const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Configuration
 |--------------------------------------------------------------------------
 */
mix
  .setPublicPath(process.env.PROJECT_THEMEPATH + '/build')
  .disableNotifications();

/*
 |--------------------------------------------------------------------------
 | Browsersync
 |--------------------------------------------------------------------------
 */
mix.browserSync({
  proxy: process.env.PROJECT_BASE_URL + ':' + process.env.PROJECT_PORT,
  files: [process.env.PROJECT_THEMEPATH + 'build/**/*.js', process.env.PROJECT_THEMEPATH + 'build/**/*.css'],
  stream: true,
});

/*
 |--------------------------------------------------------------------------
 | SASS
 |--------------------------------------------------------------------------
 */
mix
  .js(process.env.PROJECT_THEMEPATH + '/assets/js/script.js', 'js')
  .sass(process.env.PROJECT_THEMEPATH + '/assets/scss/style.scss', 'css')
  .webpackConfig({
    module: {
      rules: [{
        test: /\.scss/,
        loader: 'import-glob-loader'
      }]
    },
    externals: {
      "jquery": "jQuery"
    }
  })