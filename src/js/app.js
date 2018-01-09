const angular = require('angular');
const angularRoute = require('angular-route');
require('bootstrap/dist/css/bootstrap.min.css');
require('../css/estilo.styl');

angular.module('webpackStarter', ['ngRoute']);

const ngModule = angular.module('webpackStarter')
require('./config/routes').default(ngModule);
require('./services').default(ngModule);
require('./controllers').default(ngModule);
