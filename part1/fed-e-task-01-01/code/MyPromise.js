// 等待
const PENDING = 'pending';
// 成功
const FULFILLED = 'fulfilled';
// 失败
const REJECTED = 'rejected';
//成功之后的值
value = undefined;
//失败的值
reason = undefined;

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    status = PENDING;    // promise 状态
    value = undefined;  // 成功之后的值
    reason = undefined;// 失败后的原因
    successCallback = []; // 成功回调
    failCallback = [];    // 失败回调

    resolve = value => {
        // 如果状态不是等待 阻止程序向下执行
        if (this.status !== PENDING) return;
        // 将状态更改为成功
        this.status = FULFILLED;
        // 保存成功之后的值
        this.value = value;
        // 判断成功回调是否存在 如果存在 调用
        while(this.successCallback.length) this.successCallback.shift()()
    }

    reject = reason => {
        // 如果状态不是等待 阻止程序向下执行
        if (this.status !== PENDING) return;
        // 将状态更改为失败
        this.status = REJECTED;
        // 保存失败后的原因
        this.reason = reason;
        // 判断失败回调是否存在 如果存在 调用
        while(this.failCallback.length) this.failCallback.shift()()
    }
    then (successCallback, failCallback) {
        // 参数可选
        successCallback = successCallback ? successCallback : value => value;
        // 参数可选
        failCallback = failCallback ? failCallback: reason => { throw reason };
        let promsie2 = new MyPromise((resolve, reject) => {
            // 判断状态
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value);
                        resolvePromise(promsie2, x, resolve, reject)
                    }catch (e) {
                        reject(e);
                    }
                }, 0)
            }else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason);
                        resolvePromise(promsie2, x, resolve, reject)
                    }catch (e) {
                        reject(e);
                    }
                }, 0)
            } else {
                // 将成功回调和失败回调存储起来
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value);
                            resolvePromise(promsie2, x, resolve, reject)
                        }catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason);
                            resolvePromise(promsie2, x, resolve, reject)
                        }catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
            }
        });
        return promsie2;
    }
    finally (callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value);
        }, reason => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    }
    catch (failCallback) {
        return this.then(undefined, failCallback)
    }
    static all (array) {
        let result = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            function addData (key, value) {
                result[key] = value;
                index++;
                if (index === array.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current instanceof MyPromise) {
                    // promise 对象
                    current.then(value => addData(i, value), reason => reject(reason))
                }else {
                    // 普通值
                    addData(i, array[i]);
                }
            }
        })
    }
    static resolve (value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }
}

function resolvePromise (promsie2, x, resolve, reject) {
    if (promsie2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        // promise 对象
        // x.then(value => resolve(value), reason => reject(reason));
        x.then(resolve, reject);
    } else {
        // 普通值
        resolve(x);
    }
}