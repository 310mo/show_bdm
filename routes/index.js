var express = require('express');
var router = express.Router();
var ename="310.teiya@gmail.com";

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const SerialPort = require("serialport");
// シリアルポートに定期的に書き込んではデータを受け取る
// パーストークンは \n
// 1秒おき送信
var flag = true; // 絶起メールをまだ送っていなければtrue
var nowtime = 0;
var lasttime = 0;
// mail settings
const mailSettings = {
  service: 'Gmail',
  auth: {
      user: 'frommail',
      pass: 'pass',
      port: 25
  }
};
// mail information
var mailOptions = {
  to: ename,
  subject: '欠席連絡 ',
  text: "本日欠席させていただきます。",
  html: '<b>本日欠席させていただきます。</b>',
  form: 'Node.js'
};
// portのpath
const portPath = '/dev/ttyACM0';
// smtpのセッティングを初期化
const smtp = nodemailer_1.createTransport(mailSettings);
// portの設定
const port = new SerialPort(portPath, {
    baudRate: 9600
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'スイッチ' });
});

router.post('/post', (req, res, next) => {
  ename = req.body['ename'];
  mailOptions = {
    to: ename,
    subject: '欠席連絡 ',
    text: "本日欠席させていただきます。",
    html: '<b>本日欠席させていただきます。</b>',
    form: 'Node.js'
  };
  ename = '310.teiya@gmail.com';
  flag = true;
  res.render('index', { title: 'スイッチ' });
});

port.on('open', function () {
    console.log('Serial open.');
    var dat = new Date();
    lasttime = dat.getUTCMinutes();
});

port.on('data', function (data) {
    var dat = new Date();
    nowtime = dat.getUTCMinutes();
    if ((nowtime - lasttime) > 1) {
        flag = true;
    }
    if (flag) {
        console.log('Data:' + data);
        smtp.sendMail(mailOptions, function (error, result) {
            if (error) {
                console.log(error);
            }
            else {
                //console.dir(result);
            }
            smtp.close();
        });
        write('OK\n');
        flag = false;
        lasttime = nowtime;
        mailOptions = {
          to: "310.teiya@gmail.com",
          subject: '欠席連絡 ',
          text: "本日欠席させていただきます。",
          html: '<b>本日欠席させていただきます。</b>',
          form: 'Node.js'
        };
    }
});

function write(data) {
    console.log('Write: ' + data);
    port.write(new Buffer(data), function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            console.log('Results: ' + results);
        }
    });
}

module.exports = router;
