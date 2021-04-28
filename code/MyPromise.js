/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/
// 等待
const PENDING = 'pending';
// 成功
const FULFILLED = 'fulfilled';
// 失败
const REJECTED = 'rejected';

class MyPromise {
    constructor() {
    }

    status = PENDING
}