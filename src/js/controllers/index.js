//  controllers
export default ngModule => {
  require('./main').default(ngModule);
  require('./login').default(ngModule);
  require('./home').default(ngModule);
};
