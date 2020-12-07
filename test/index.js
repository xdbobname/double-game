self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open("v1")
      .then(function (cache) {
        return cache.addAll([
          "/",
          "/index.html",
          "/test/index.js",
          "/test/xlpic.jpg",
        ]);
      })
      .then(function () {
        console.log("缓存成功");
      })
      .catch((e) => {
        console.log("缓存失败", e);
      })
  );
});

self.addEventListener("fetch", function (event) {
  event
    .match(event.request)
    .then(function (resp) {
      return (
        resp ||
        fetch(event.request).then(function (response) {
          return caches.open("v1").then(function (cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
    .catch(function () {
      return caches.match("/fallback.html");
    });
});
