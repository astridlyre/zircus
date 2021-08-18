const PENDING = false;
const COMPLETED = true;
const queue = new Map();

async function loadPage(url) {
  return await fetch(url, { method: "GET" })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      } else {
        return res.text();
      }
    });
}

onmessage = (event) => {
  const url = event.data.url;
  if (!queue.get(url)) {
    queue.set(url, { status: PENDING }); // pending
    loadPage(event.data.url).then((res) => {
      postMessage({
        ok: true,
        url: event.data.url,
        text: res,
      });
      queue.set(url, { status: COMPLETED });
    }).catch((error) => postMessage({ ok: false, error }));
  }
};
