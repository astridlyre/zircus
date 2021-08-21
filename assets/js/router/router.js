import { eventBus, lang, notifyFailure } from "../utils.js";

// Error for RouterNavigation
class NavigationError extends Error {
  constructor(message) {
    super();
    this.name = "NavigationError";
    this.message = message;
  }
}

const cache = new Map();

export default class ZircusRouter extends HTMLElement {
  #currentPage;
  #currentLanguage;
  #pushState = true; // keep track of whether to change history state
  #worker;

  connectedCallback() {
    this.#worker = new Worker("/assets/js/router/routerCacheWorker.js");
    this.#currentLanguage = lang();
    this.#currentPage = this.querySelector("main");

    window.addEventListener("popstate", () => {
      this.#pushState = false;
      this.setAttribute("page", window.location.href);
    });

    eventBus.addEventListener(
      "preload-mounted",
      ({ detail }) =>
        !this.cached(detail) && this.#worker.postMessage({ url: detail }),
    );

    eventBus.addEventListener(
      ZircusRouter.NAVIGATION_REQUEST,
      ({ detail }) => this.setAttribute("page", detail),
    );

    this.#worker.onmessage = ({ data }) =>
      data.ok
        ? cache.set(data.url, data.text)
        : notifyFailure(data.error.message);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "page") {
      this.#navigate(newValue);
      this.#pushState = true;
      this.#currentPage?.focus();
    }
  }

  cached(url) {
    return cache.get(url);
  }

  get page() {
    return this.getAttribute("page");
  }

  static get observedAttributes() {
    return ["page"];
  }

  static get NAVIGATED_EVENT() {
    return "router-navigated";
  }

  static get NAVIGATION_REQUEST() {
    return "navigation-request";
  }

  static navigate(url) {
    eventBus.dispatchEvent(
      new CustomEvent(ZircusRouter.NAVIGATION_REQUEST, {
        detail: url,
      }),
    );
  }

  #navigate(href) {
    this.#pushState && history.pushState(null, null, href);
    this.changePage();
  }

  async loadPage(url, cached = cache.get(url)) {
    if (cached) return cached;
    return await fetch(url, {
      method: "GET",
    }).then((res) => {
      if (!res.ok) {
        throw new NavigationError(`Network response was not ok`);
      }
      return res.text();
    }).then((text) => {
      cache.set(url, text);
      return text;
    }).catch((error) => {
      cache.delete(url);
      notifyFailure(`Oops! ${error.message}`);
    });
  }

  async changePage() {
    return await this.loadPage(window.location.href).then((res) => {
      const { wrapper, newContent, lang, title } = this.extractContent(res);
      document.title = title;
      return lang === this.#currentLanguage
        ? this.smallPageChange(
          newContent,
          this.querySelector("#blur"),
        )
        : this.bigPageChange(
          newContent,
          wrapper.querySelector("#page"),
          lang,
        );
    }).catch((error) => {
      notifyFailure(`Oops! Network error: ${error.message}`);
      history.back();
    });
  }

  extractContent(res, wrapper = document.createElement("div")) {
    wrapper.innerHTML = res;
    const newContent = wrapper.querySelector("main");
    if (!newContent) throw new NavigationError("Prefetch failed");
    return {
      wrapper,
      newContent,
      lang: newContent.getAttribute("lang"),
      title: newContent.getAttribute("pagetitle"),
    };
  }

  notifyChanged(newContent) {
    this.#currentPage = newContent;
    eventBus.dispatchEvent(new CustomEvent(ZircusRouter.NAVIGATED_EVENT));
    return window.scrollTo({ top: 0 });
  }

  bigPageChange(newContent, page, lang) {
    document.documentElement.setAttribute("lang", lang);
    this.#currentLanguage = lang;
    return requestAnimationFrame(() => {
      this.replaceChild(page, this.querySelector("#page"));
      return this.notifyChanged(newContent);
    });
  }

  smallPageChange(newContent, blur) {
    return requestAnimationFrame(() => {
      blur.replaceChild(newContent, this.#currentPage);
      return this.notifyChanged(newContent);
    });
  }
}

customElements.get("zircus-router") ||
  customElements.define("zircus-router", ZircusRouter);
