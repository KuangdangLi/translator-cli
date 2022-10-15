import * as https from 'https';
import * as querystring from 'querystring';
import {appId, appKey} from './private';
import md5 = require('md5');

export const translate = (word: string) => {
  const salt = Math.random().toString();
  const sign = md5(appId + word + salt + appKey);
  let from,to;
  if(/[a-zA-Z]/.test(word[0])){
    from = 'en';
    to='zh';
  }else{
    from = 'zh';
    to='en';
  }
  interface ErrorMap{
    [key:string]:string
  }
  const errorMap:ErrorMap = {
     52000:"成功",
     52001:"请求超时",
     52002:"系统错误",
     52003:"未授权用户",
     54000:"必填参数为空",
     54001:"签名错误 ",
     54003:"访问频率受限 ",
     54004:"账户余额不足 ",
     54005:"长query请求频繁",
     58000:"客户端IP非法 	 ",
     58001:"译文语言方向不支持 ",
     58002:"服务当前已关闭 	 ",
     90107:"认证未通过或未生效 "
}
  const query = querystring.stringify({q: word, from, to, appid: appId, salt, sign});
  const options = {
    hostname: 'fanyi-api.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };
  const request = https.request(options, (response) => {
    const chunks: Buffer[] = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      type BaiduResult = {
        from: string,
        to: string,
        trans_result: { src: string, dst: string }[],
        error_code?: string,
        error_msg?: string
      };
      const result: BaiduResult = JSON.parse(string);
      if (result.error_code) {
        // console.log(result.error_msg);
        console.log(errorMap[result.error_code]);
      }else{
        console.log(result.trans_result[0].dst);
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};