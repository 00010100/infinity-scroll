export const debounce = (fn: (e: any) => void, interval: number) => {
  let timer: NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(function callOriginalFn() {
      fn.apply(fn, args)
    }, interval)
  }
}
