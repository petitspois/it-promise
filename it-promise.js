/*==================================================
 Copyright (c) 2013-2014 青豆 and other contributors

 http://www.qingdou.me/

 https://github.com/petitspois

 Released under the MIT license

 it-promise.js 0.0.1 build in 2014.12.25
 __________________________________
 support IE6+ and other browsers
 ==================================================*/

typeof function () {

    var root = this;

    //Promise 构造函数
    var Promise = function (fn) {

        var that = this,

            //执行成功回调
            resolve = function (val) {
                that.resolve(val);
            },

            //执行失败回调
            reject = function (val) {
                that.reject(val);
            };

        //状态 pending fulfilled rejected
        that.status = 'pending';

        //成功函数
        that.resolveFn = null;

        //失败函数
        that.rejectFn = null;

        //执行Promise args
        typeof fn === 'function' && fn(resolve, reject);

    }

    //触发then 成功回调
    Promise.prototype.resolve = function (val) {
         if(this.status === 'pending'){
             this.status = 'fulfilled';
             alert(this.resolveFn)
             this.resolveFn && this.resolveFn(val);
         }
    }

    //触发then 失败回调
    Promise.prototype.reject = function (val) {
        if(this.status === 'pending'){
            this.status = 'rejected';
            this.rejectFn && this.rejectFn(val);
        }
    }

    //then操作
    Promise.prototype.then = function(resolve, reject){

        //新Promsie 用于链式操作
        var borrow = new Promise();

        //成功函数 <==> 对应构造函数
        this.resolveFn = function(val){

            //回调是否存在，执行或给值
            var result = resolve ? resolve(val) : val;

            //resolve返回Promise的情况
            if(Promise.isP(result)){

                //触发返回Promise->then->success
                result.then(function(val){

                    //触发下一个then的成功回调
                    borrow.resolve(val);

                });

            }else{

                //触发下一个then的成功回调
                borrow.resolve(result);

            }

        }

        //失败函数 <==> 对应构造函数
        this.rejectFn = function(val){

            //回调是否存在，执行或给值
            var result = reject ? reject(val) : val;

            //触发下一个then的成功回调
            borrow.reject(result);

        }


        //返回新Promise
        return borrow;

    }

    //失败then
    Promise.prototype.catch = function(reject){
         return this.then(null, reject);
    }


    //将多个Promise实例，包装成一个新的Promise实例
    Promise.all = function(array){

         var borrow = new Promise(),
             len = array.length,
             i = -1,
             completeNum = 0,
             results = [],
             pme;

         while(pme = array[++i]){

             pme.then(function(val){

                results[i] = val;
                if(++completeNum === len){
                    //全部成功后执行
                    borrow.resolve(results);
                }

             },function(val){

                  borrow.reject(val)

             })

         }

        return borrow;

    }

    //将现有对象转为Promise对象fulfilled
    Promise.resolve = function(obj){

        var result;

        //如果参数不是promise
        if(!Promise.isP(obj)){
            result = obj;
            obj = new Promise();
        }

        setTimeout(function(){
            obj.resolve(result);
        });

        return obj;

    }

    //将现有对象转为Promise对象,状态为rejected
    Promise.reject = function(){

        var result;

        //如果参数不是promise
        if(!Promise.isP(obj)){
            result = obj;
            obj = new Promise();
        }

        setTimeout(function(){
            obj.reject(result);
        });

        return obj;

    }

    //实例是否为Promise
    Promise.isP = function(obj){
        return obj instanceof Promise;
    }



    //作用域转为window
    root.Promise = Promise;

    try {
        module.exports = Promise;
    } catch (e) {}


}.call(this);