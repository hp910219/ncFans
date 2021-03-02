// 'use strict';
// const Client = require('@alicloud/nls-filetrans-2018-08-17');
import Client from '@alicloud/nls-filetrans-2018-08-17';
export const fileTrans = (akID, akSecret, appKey, fileLink) => {
  /**
   * 地域ID
   * 常量内容，请勿改变
   */
  const ENDPOINT = 'http://filetrans.cn-shanghai.aliyuncs.com';
  const API_VERSION = '2018-08-17';
  /**
   * 创建阿里云鉴权client
   */
    // const Client = require('@alicloud/nls-filetrans-2018-08-17');
  const client = new Client({
      accessKeyId: akID,
      secretAccessKey: akSecret,
      endpoint: ENDPOINT,
      apiVersion: API_VERSION
    });
  //设置允许跨域请求
  // client.all('*', function(req, res, next) {
  //   client.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
  //   client.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
  //   client.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
  //   client.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
  //   client.header('Content-Type', 'application/json;charset=utf-8');
    // next();
  // });
  /**
   * 提交录音文件识别请求，设置请求参数Task
   * 请求参数app_key：您的项目应用appkey
   * 请求参数file_link：需要识别的录音文件
   * 请求参数组合成JSON格式的字符串作为Task的值
   */
  let task = {
    app_key : appKey,
    file_link : fileLink,
    version : "4.0",        // 新接入请使用4.0版本，已接入(默认2.0)如需维持现状，请注释掉该参数设置
    enable_words : false     // 设置是否输出词信息，默认为false，开启时需要设置version为4.0
  };
  const taskParams = {
    Task : JSON.stringify(task)
  };
  const header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, x-sdk-client, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, PUT, POST, DELETE',
  };
  const options = {
    method: 'POST',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, x-sdk-client, Accept',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, PUT, POST, DELETE',
  // {...header},
    header
  };
  // client.request().header('Access-Control-Allow-Headers', 'x-sdk-client');
  // 提交录音文件识别请求，处理服务端返回的响应
  // let ss =
  client.submitTask(taskParams, options).then((response) => {
    console.log(response);
    // 服务端响应信息的状态描述 StatusText
    var statusText = response.StatusText;
    if (statusText != 'SUCCESS') {
      console.log('录音文件识别请求响应失败!');
      return;
    }
    console.log('录音文件识别请求响应成功!');
    // 获取录音文件识别请求任务的TaskId，以供识别结果查询使用
    var taskId = response.TaskId;
    /**
     * 以TaskId为查询参数，提交识别结果查询请求
     * 以轮询的方式进行识别结果的查询，直到服务端返回的状态描述为"SUCCESS"、SUCCESS_WITH_NO_VALID_FRAGMENT，
     * 或者为错误描述，则结束轮询。
     */
    var taskIdParams = {
      TaskId : taskId
    };
    var timer = setInterval(() => {
      client.getTaskResult(taskIdParams).then((response) => {
        console.log('识别结果查询响应：');
        console.log(response);
        var statusText = response.StatusText;
        if (statusText == 'RUNNING' || statusText == 'QUEUEING') {
          // 继续轮询，注意间隔周期为3秒
        }
        else {
          if (statusText == 'SUCCESS' || statusText == 'SUCCESS_WITH_NO_VALID_FRAGMENT') {
            console.log('录音文件识别成功：');
            var sentences = response.Result;
            console.log(sentences);
          }
          else {
            console.log('录音文件识别失败!');
          }
          // 退出轮询
          clearInterval(timer);
        }
      }).catch((error) => {
        console.error(error);
        // 异常情况，退出轮询
        clearInterval(timer);
      });
    }, 3000);
  }).catch((error) => {
    console.error('sssssssssssssss', error);
  });
};
