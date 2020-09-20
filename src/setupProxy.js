// const proxy = require("http-proxy-middleware");
// // console.log(1);
// module.exports = function(app) {
//   app.use(
//     proxy("/api", {
//       target: "http://m.kugou.com?json=true",
//       changeOrigin: true
//     })
//   );
// //   app.use(
// //     proxy("/fans/**", {
// //       target: "https://easy-mock.com/mock/5c0f31837214cf627b8d43f0/",
// //       changeOrigin: true
// //     })
// //   );
// };

const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    // 将原来的proxy改为createProxyMiddleware 
      createProxyMiddleware(
        '/api',
        {
          target: 'http://127.0.0.1:7001',
          changeOrigin: true,
          pathRewrite : { '^/api': '' },
        },
        
      )
    )
  // app.use(proxy('/api', { target: ' http://127.0.0.1:7001' }));
};