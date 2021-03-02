// /**
//  * 封装 发送钉钉消息
//  */
// const access_token = 'e61184c4450f33a3313dc5651f7e63ed64c1e2e1f4dd37b585ffda93e9e801ee';
// const mobiles = ['15538819853'];
// const queryParams = {
//   "msgtype": "text",
//   "text": {
//     "content": "站会开始了"
//   },
//   "at": {
//     "atMobiles": mobiles,
//     "isAtAll": true
//   }
// };
// console.log('sssssssssssssssssssssssssssssssss');
// const url = 'https://oapi.dingtalk.com/robot/send?access_token=' + access_token;
// // export default function send_dingding(info){
//
// //   fetch(url, {
// //     method: "POST",
// //     mode: "no-cors",//可以在这设置跨域
// //     headers: {"Content-Type": "application/json"},
// //     body: JSON.stringify(queryParams)
// //   }).then(function(res) {
// //     console.log("Response succeeded?", JSON.stringify(res.ok));
// //     console.log(JSON.stringify(res));
// //   }).catch(function(e) {
// //     console.log("fetch fail", queryParams);
// //   });
// // }
// // var request1 = require('jy_request');
// //
// // request1({
// //   method: 'POST',
// //   uri: url,
// //   body: queryParams,
// //   json: true
// // }, function (error, response, body) {
// //   console.log('code: '+ response.statusCode);
// //   console.log(body);
// // });
