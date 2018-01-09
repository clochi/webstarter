export default ngModule => {
  ngModule
    .factory('HOST', HOST);

  function HOST(){
    //  Agregar en la variable url el endpoint del Api ejemplo
    //  let url = 'http://www.midominio.com:8000/api/';
    let url = '';
    let HOST = {
      url: function(){
        return url;
      }
    };
    return HOST;
  }
}
