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
      if (result.error_msg) {
        console.log(result.error_msg);
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