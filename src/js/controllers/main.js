
//  Controller usando function

export default (ngModule) => {
  ngModule.controller('main', ['$rootScope', '$scope', '$mdSidenav', '$location', '$mdDialog', '$mdToast', main]);
}
class main{
  constructor($rootScope, $scope, $mdSidenav, $location, $mdDialog, $mdToast){
    this.nombre = "Click aquí para cambiar estado";

      //FUNCIONES GENERALES DE LA APP
    this.app = {
      abrirMenuUser: function($mdOpenMenu, ev){
    			$mdOpenMenu(ev);
    		},
        abrirMenu: function(){
          $mdSidenav('left').toggle();
        },
        isLoginScreen: function(){
    			return !($location.path() === '/');
    		},
        navActive: function(a){
    			return ($location.path() === a);
    		},
        logout: function(){
    			delete localStorage.token;
    			$location.url('/');
    		},
        passChange: function(ev) {
			    $mdDialog.show({
			      controller: passChange,
			      controllerAs: 'pc',
			      template: require('../../views/templates/passchange.html'),
			      parent: angular.element(document.body),
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			    });
			  },
        redirection: function(){
          window.open('http://www.redmontego.com.ar/RedMontegoManual.pdf', '_blank');
        }
    }

    $rootScope.tools = {
        alerta: function (titulo, msg, callbk){
  				$mdDialog.show(
  			      $mdDialog.alert()
  			        .parent(angular.element(document.querySelector('body')))
  			        .clickOutsideToClose(true)
  			        .title(titulo)
  			        .textContent(msg)
  			        .ariaLabel(titulo)
  			        .ok('Aceptar')
  			  	);
  			  	if(typeof callbk === 'function'){
  			  		callbk();
  			  	}
  			},
        notificar: function(msg, action, callbk){

			  	var notificacion = $mdToast.simple()
			  		.textContent(msg)
			  		.action(action)
			  		.highlightAction(true)
			  		//.highlightClass('md-accent')
			  		.position('bottom right');

		  		$mdToast.show(notificacion)
		  		.then(function(res){
		  			if(res == 'ok'){
		  				callbk(true);
		  			}
		  		});

			  },
        confirmar: function(obj){
  				// ** {title, message, ok, cancel}
  				return new Promise(function(resolve, reject){
  					var confirm = $mdDialog.confirm()
  	              .title(obj.title)
  	              .textContent(obj.message)
  	              .ok(obj.ok)
  	              .cancel(obj.cancel);

  	        $mdDialog.show(confirm).then(function() {
  	          resolve(true);
  	        }, function(){
  						reject(false);
  					});
  				})

  			},
        checkResponse: function(res, data, callbk){
          //{res: es el objeto response de angular}
          //data = {btnText: [texto de botones], title: titulo del form}
          //{callbk: es la función que devuelve el objeto result de lo que se debe hacer}
          var result = {};
          result.res = {};
          try{
            if(res.status >= 200 & res.status < 400){
              result.btn = data.btnText[0];
            }else if(res.status >= 400 & res.status < 500){
              if(!res.data.message){
                res.data.message = 'Hubo problemas para agregar el reevendedor';
              }
              result.btn = data.btnText[1];
            }else{
              result.btn = data.btnText[2];
              if(!res.data.message){
                result.res.message = 'Hubo problemas con el servidor';
              }
            }
            result.title = data.title;
            result.message = res.data.message;
            return callbk(result);
          }
          catch(err){
            result.title = 'Error';
            result.message = err.message;
            return callbk(result);
          }
        },
        spinner: function(){
          return{
            on: function(){
              var spinner = $('.spinnerGral');
        			spinner.fadeIn(300);
            },
            off: function(){
              var spinner = $('.spinnerGral');
        			spinner.fadeOut(300);
            }
          };
        }
      };

      //FIN FUNCIONES GENERALES DE LA APP
      var vm = this;
      $rootScope.init = false; // Este es para que en auth.js se salté el updateSidenav si ya inició
      var menuDesplegado = false;
  		vm.submenuStates = {};
  		vm.desplegarSubMenu = function(e, item){
  			if (item.childs.length > 0){
  				var activo;
  				if(activo = document.querySelector('.sub-menu-activo')){
  					var flech = activo.querySelector('.flecha-menu');
  					$(activo).find('.submenu').stop().slideToggle();
  					flech.classList.remove('flecha-up');
  					vm.submenuStates[activo.dataset.id] = false;
  					activo.classList.remove('sub-menu-activo');
  					if(activo.dataset.id == e.currentTarget.dataset.id){
              e.preventDefault();
              return false;
            }
  					//vm.desplegarSubMenu(e, item);
  				}
  				var flechita = e.currentTarget.querySelector('.flecha-menu');
  				e.currentTarget.classList.add('sub-menu-activo');
  				$(e.currentTarget).find('.submenu').stop().slideToggle();
  				$rootScope.subMenuActive = true;
  				if(vm.submenuStates[e.currentTarget.dataset.id] != undefined){

  					if(vm.submenuStates[e.currentTarget.dataset.id]){
  						flechita.classList.remove('flecha-up')
  						vm.submenuStates[e.currentTarget.dataset.id] = false
  					}else{
  						flechita.classList.add('flecha-up')
  						vm.submenuStates[e.currentTarget.dataset.id] = true;
  					}
  				}else{
  					flechita.classList.add('flecha-up')
  					vm.submenuStates[e.currentTarget.dataset.id] = true;
  				}
  				e.preventDefault();
  			}
  		}

      $rootScope.$on('updateSidenav', function(e, menu){
        vm.listaMenu = menu;
      });

    function passChange($rootScope, $mdDialog, usuariosService){
      		var ctrl = this;
      		ctrl.password = {};
      		ctrl.btnPassChange = 'ENVIAR';
      		ctrl.enviar = function(){
      			var boton = document.getElementById('btnPassChange');
      			ctrl.btnPassChange = "ENVIANDO...";
      			usuariosService.passChange($rootScope.usuario.id, ctrl.password)
              .then(function(res){
                ctrl.btnPassChange = "ENVIADO";
      					boton.ngDisabled = 'true';
      					boton.classList.remove('md-warn');
      					$rootScope.tools.alerta(res.data.title, res.data.message);
              }, function(res){

              })
              if(res.status >= 400 & res.status < 500){
                ctrl.btnPassChange = "REENVIAR";
      					boton.classList.add('md-warn');
      					$rootScope.tools.alerta(res.data.title,'No se pudo actualizar.', vm.app.passChange);
              }else{
                ctrl.btnPassChange = "REENVIAR";
      					boton.classList.add('md-warn');
      					$rootScope.tools.alerta(res.data.title, 'Error en el servidor.', vm.app.passChange);
              }
      		};

      		ctrl.cancel = function(){
      			var boton = document.getElementById('btnPassChange');
      			boton.ngDisabled = 'false';
      			boton.classList.remove('md-warn');
      			$mdDialog.cancel();
      		};
      	}
  }
  //  Fin Constructor

  changeName(){
    this.nombre = "Como puedes ver, el estado cambió ;)"
  }

}

//export {main};

//-----------------------------

/* Controller usando class
export default class main{
constructor($rootScope, $scope){
this.nombre = "Click aquí para cambiar estado";
}
changeName(){
this.nombre = "Como puedes ver, el estado cambió ;)"
}

}*/
