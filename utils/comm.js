
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function getStr(str, num) {
  if (str.length > num) {
    return str.substr(0, num) + "..."
  } else {
    return str
  }
}

function color16() {//十六进制颜色随机
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  var color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
  return color;
}

//时间戳转换成日期时间
function js_date_time(unixtime) {
  var date = new Date(unixtime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
  // return y + '/' + m + '/' + d + ' ' + h + ':' + minute;

}





module.exports={
  formatTimeTwo: formatTimeTwo,
  getStr: getStr,
  color16: color16,
  js_date_time: js_date_time

}