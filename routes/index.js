// 管理子路由服务挂载
const post = require('./post');

module.exports = (app) => {
  app.use('/post', post);// 挂载子路由服务
};