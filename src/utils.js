function debounce(fn, context, time) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn.bind(context), time);
  };
}

function throttle(fn, context, time) {
  let timer;
  return function () {
    if (!timer) {
      timer = setTimeout(fn.bind(context), time);
    }
  };
}
