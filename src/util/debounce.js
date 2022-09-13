/**
 * 防抖实现
 * @param fn
 * @param delay
 * @returns {function(...[*]=)}
 */
export default function debounce(fn,delay){
    let timer = null
    return function() {  //借助闭包
        let th = this;
        let args = arguments;
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            fn.apply(th, args)
        },delay)
    }
}