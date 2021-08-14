import { createNotificationFailure, ZircusElement } from "../utils.js";

// Mixin to asyncronously load a SDK script file
export default function withAsyncScript() {
  let loaded = false;
  return {
    async loadScript({ src, type = "text/javascript", async = true }) {
      return loaded
        ? await Promise.resolve({ ok: true, loaded })
        : await new Promise((resolve, reject) => {
          this.scriptElement = new ZircusElement("script", null, {
            src,
            async,
            type,
          }).render();
          document.head.appendChild(this.scriptElement);
          this.scriptElement.addEventListener("load", () => {
            resolve({ ok: true, loaded });
            loaded = true;
          });
          this.scriptElement.addEventListener("error", () =>
            reject({
              error: `Error loading script from ${src}`,
            }));
        }).catch((e) =>
          createNotificationFailure(`Script loading failed: ${e}`)
        );
    },
  };
}
