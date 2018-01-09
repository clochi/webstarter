export default ngModule =>{
  require('./host').default(ngModule);
  require('./usuarios').default(ngModule);
  require('./auth').default(ngModule);
}
