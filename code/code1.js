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

var p = Promise.resolve()
    .then(a=> 'hello')
    .then(res =>{
    return  res+'lagou'
}).then(res => {
   return  console.log(res+'I ♥ U')
})
console.log(p)

