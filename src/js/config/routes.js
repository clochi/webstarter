
export default ngModule => {
  ngModule
    .config(configRoutes)
}

function configRoutes($routeProvider){
  $routeProvider
    .when('/', {
      controller: 'login',
      controllerAs: 'vm',
      template: require('../../views/login/login.html')
      //templateUrl: 'views/login/login.html'
    })
    .when('/home', {
      controller: 'home',
      controllerAs: 'home',
      template: require('../../views/app/home.html')
    })
    .otherwise({redirectTo: '/'});
}

//export { configRoutes };
