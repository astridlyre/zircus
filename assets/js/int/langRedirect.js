import { state, ZircusElement } from "../utils.js";
import intText from "./intText.js";

const notify = (lang = "en", title = intText.redirect[lang]) => {
  localStorage.setItem("notified", true);
  return state.notify({
    time: 8000,
    content: [
      new ZircusElement("span", ["notification__prefix", "green"])
        .addChild("?")
        .render(),
      new ZircusElement("zircus-router-link")
        .addChild(
          new ZircusElement("a", "notification__text", {
            href: `/${lang}`,
            title,
          }).addChild(title),
        )
        .render(),
    ],
  });
};

export default function langRedirect() {
  // Redirect notification
  const lang = navigator.language;
  const langInPath = location.pathname.includes(`/${lang}`);
  const wasNotified = !!localStorage.getItem("notified");

  // French
  if (/^fr\b/.test(lang) && !langInPath && !wasNotified) notify("fr");
}
