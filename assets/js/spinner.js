export default class ZircusSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = Template.render();
  }
}

const Template = {
  render() {
    return `${this.html()}${this.css()}`;
  },
  html: () =>
    `<div class="lds-ellipsis gray">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>`,
  css: () =>
    `<style>
:host {
  margin: 0 auto;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
}
.lds-ellipsis.gray div {
  background: var(--gray-50);
}
.lds-ellipsis div {
  position: absolute;
  top: 16.5px;
  width: var(--base-unit);
  height: var(--base-unit);
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 4px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 4px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 16px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 28px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(12px, 0);
  }
}
</style>`,
};

customElements.get("zircus-spinner") ||
  customElements.define("zircus-spinner", ZircusSpinner);
