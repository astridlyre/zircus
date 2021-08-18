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

onmessage = async (event) => {
  return await loadPage(event.data.url).then((res) =>
    postMessage({
      ok: true,
      url: event.data.url,
      text: res,
    })
  ).catch((error) => postMessage({ ok: false, error }));
};
