/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

function fn(str) {
  return new Promise(reslove => {
    setTimeout(() => {
      reslove(str)
    }, 10);
  })
}

fn('hello')
  .then(str => fn(str + 'lagou'))
  .then(str => fn(str + 'I ♥ U'))
  .then(console.log)