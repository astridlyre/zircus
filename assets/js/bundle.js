(()=>{"use strict";const e=e=>document.getElementById(e),t="https://zircus.herokuapp.com/api",n=new class{constructor(){const e=localStorage.getItem("state");this.__state=JSON.parse(e)||{},this.__hooks=[],this.__notification=null,this.__notify=null}set(e,t){return this.__state[e]=t,this.save()}save(){return localStorage.setItem("state",JSON.stringify(this.__state)),this}get hooks(){return this.__hooks}addHook(e){return this.__hooks.push(e),this}get inv(){return this.__state.inv||[]}set inv(e){return this.set("inv",e(this.inv)).update()}get countries(){return this.__state.countries||[]}set countries(e){return this.set("countries",e(this.countries)).update()}get cart(){return this.__state.cart||[]}set cart(e){return this.set("cart",e(this.cart)).update()}get secret(){return this.__state.secret||null}set secret(e){return this.set("secret",e)}get currentItem(){return this.__state.currentItem||null}set currentItem(e){return this.set("currentItem",e)}get order(){return this.__state.order||null}set order(e){return this.set("order",e)}setNotify(e){this.__notify=e}notify(e,t,n){return this.__notify(e,t,n)}set currentNotification(e){this.__notification=e}get currentNotification(){return this.__notification}update(){return this.hooks.forEach((e=>e({cart:this.cart,inv:this.inv,countries:this.countries}))),this}};class a{constructor(e,t,n){if(this.e=document.createElement(e),this.children=[],t&&Array.isArray(t)?t.forEach((e=>{this.e.classList.add(e)})):t&&"string"==typeof t&&this.e.classList.add(t),n)for(const[e,t]of Object.entries(n))this.e.setAttribute(e,t)}render(){return this.children.forEach((e=>{e instanceof a?this.e.appendChild(e.render()):this.e.innerText=e})),this.e}event(e,t){return this.e.addEventListener(e,(()=>t())),this}addChild(e){return this.children.push(e),this}}function s(e){return document.head.appendChild(new a("link",null,{href:e,rel:"prefetch",as:"image"}).render())}function i(e,t,n){let a=e;return()=>n(a=t(a))}const o=async()=>await fetch(`${t}/inv`).then((e=>e.json())).then((e=>n.inv=()=>[...e.cf,...e.pf,...e.ff])).catch((e=>{console.error("Unable to get inventory",e.message)}));function r(){return document.documentElement.getAttribute("lang")}function c(e){return e[r()]}o(),setInterval(o,3e5),(e=>{if(!e)return;const t=["For your thunder down under","Guard the crown jewels","For your national treasure","A luxury condo for your privates","If you are here, you may be gay","Contain your thunder in style","A stylish shape for your bits","One person's junk is another's treasure"],n=["Pour votre tonnerre vers le bas sous","Garde les bijoux de la couronne","Pour votre tresor national","Un condo de luxe pour vos petit soldats","si vous l'etes, vous pourriez etre gai","Contenir votre tonnerre dans le style","Une forme elegante pour vos meches","La camelote d'une personne est le tresor d'une autre"];e.innerText=(e=>"en"===e?t[Math.floor(Math.random()*t.length)]:n[Math.floor(Math.random()*n.length)])(r())})(e("home-heading"));const d={Canada:{states:[{id:872,name:"Alberta",state_code:"AB"},{id:875,name:"British Columbia",state_code:"BC"},{id:867,name:"Manitoba",state_code:"MB"},{id:868,name:"New Brunswick",state_code:"NB"},{id:877,name:"Newfoundland and Labrador",state_code:"NL"},{id:878,name:"Northwest Territories",state_code:"NT"},{id:874,name:"Nova Scotia",state_code:"NS"},{id:876,name:"Nunavut",state_code:"NU"},{id:866,name:"Ontario",state_code:"ON"},{id:871,name:"Prince Edward Island",state_code:"PE"},{id:873,name:"Quebec",state_code:"QC"},{id:870,name:"Saskatchewan",state_code:"SK"},{id:869,name:"Yukon",state_code:"YT"}]},"United States":{states:[{id:1456,name:"Alabama",state_code:"AL"},{id:1400,name:"Alaska",state_code:"AK"},{id:1424,name:"American Samoa",state_code:"AS"},{id:1434,name:"Arizona",state_code:"AZ"},{id:1444,name:"Arkansas",state_code:"AR"},{id:1402,name:"Baker Island",state_code:"UM-81"},{id:1416,name:"California",state_code:"CA"},{id:1450,name:"Colorado",state_code:"CO"},{id:1435,name:"Connecticut",state_code:"CT"},{id:1399,name:"Delaware",state_code:"DE"},{id:1437,name:"District of Columbia",state_code:"DC"},{id:1436,name:"Florida",state_code:"FL"},{id:1455,name:"Georgia",state_code:"GA"},{id:1412,name:"Guam",state_code:"GU"},{id:1411,name:"Hawaii",state_code:"HI"},{id:1398,name:"Howland Island",state_code:"UM-84"},{id:1460,name:"Idaho",state_code:"ID"},{id:1425,name:"Illinois",state_code:"IL"},{id:1440,name:"Indiana",state_code:"IN"},{id:1459,name:"Iowa",state_code:"IA"},{id:1410,name:"Jarvis Island",state_code:"UM-86"},{id:1428,name:"Johnston Atoll",state_code:"UM-67"},{id:1406,name:"Kansas",state_code:"KS"},{id:1419,name:"Kentucky",state_code:"KY"},{id:1403,name:"Kingman Reef",state_code:"UM-89"},{id:1457,name:"Louisiana",state_code:"LA"},{id:1453,name:"Maine",state_code:"ME"},{id:1401,name:"Maryland",state_code:"MD"},{id:1433,name:"Massachusetts",state_code:"MA"},{id:1426,name:"Michigan",state_code:"MI"},{id:1438,name:"Midway Atoll",state_code:"UM-71"},{id:1420,name:"Minnesota",state_code:"MN"},{id:1430,name:"Mississippi",state_code:"MS"},{id:1451,name:"Missouri",state_code:"MO"},{id:1446,name:"Montana",state_code:"MT"},{id:1439,name:"Navassa Island",state_code:"UM-76"},{id:1408,name:"Nebraska",state_code:"NE"},{id:1458,name:"Nevada",state_code:"NV"},{id:1404,name:"New Hampshire",state_code:"NH"},{id:1417,name:"New Jersey",state_code:"NJ"},{id:1423,name:"New Mexico",state_code:"NM"},{id:1452,name:"New York",state_code:"NY"},{id:1447,name:"North Carolina",state_code:"NC"},{id:1418,name:"North Dakota",state_code:"ND"},{id:1431,name:"Northern Mariana Islands",state_code:"MP"},{id:4851,name:"Ohio",state_code:"OH"},{id:1421,name:"Oklahoma",state_code:"OK"},{id:1415,name:"Oregon",state_code:"OR"},{id:1448,name:"Palmyra Atoll",state_code:"UM-95"},{id:1422,name:"Pennsylvania",state_code:"PA"},{id:1449,name:"Puerto Rico",state_code:"PR"},{id:1461,name:"Rhode Island",state_code:"RI"},{id:1443,name:"South Carolina",state_code:"SC"},{id:1445,name:"South Dakota",state_code:"SD"},{id:1454,name:"Tennessee",state_code:"TN"},{id:1407,name:"Texas",state_code:"TX"},{id:1432,name:"United States Minor Outlying Islands",state_code:"UM"},{id:1413,name:"United States Virgin Islands",state_code:"VI"},{id:1414,name:"Utah",state_code:"UT"},{id:1409,name:"Vermont",state_code:"VT"},{id:1427,name:"Virginia",state_code:"VA"},{id:1405,name:"Wake Island",state_code:"UM-79"},{id:1462,name:"Washington",state_code:"WA"},{id:1429,name:"West Virginia",state_code:"WV"},{id:1441,name:"Wisconsin",state_code:"WI"},{id:1442,name:"Wyoming",state_code:"WY"}]}};n.countries=()=>d;const u=Stripe("pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP"),l=/^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/,m=/^[0-9]{5}(-[0-9]{4})?$/;!function(){const t=e("product-prefix");if(!t)return;const a=e("product-price"),o=e("product-price-text"),r=e("product-size"),d=e("product-image"),u=e("product-image-full"),l=e("product-image-full-image"),m=e("product-quantity"),h=e("product-color"),f=e("product-default-color"),p=e("add-to-cart"),v=e("go-to-cart"),_=e("go-to-cart-qty"),y=e("product-accent"),g=e("product-stock"),b={en:["out of stock","add to cart"],fr:["non disponible","ajouter"]};let L=h.value;const k=e=>({en:["None available",`Only ${e} left!`,"In stock"],fr:["Non disponible",`Il n'en reste que ${e}!`,"En stock"]}),[x,C]=(()=>{let e=null;return[()=>e,a=>e=n.inv.find((e=>a?e.type===a.type:e.type===`${t.value}-${h.value}-${r.value}`))]})();function $(e){return x()&&(d.src=x().images[e])}const N=i(!1,(e=>!e),(e=>$(e?"sm_b":"sm_a"))),E=i(!1,(e=>!e),(t=>{t?(l.src=x().images.lg_a,u.style.display="flex",e("nav").classList.add("hidden"),e("menu-mobile-btn").classList.add("hidden"),document.body.classList.add("hide-y")):(u.style.display="none",e("nav").classList.remove("hidden"),e("menu-mobile-btn").classList.remove("hidden"),document.body.classList.remove("hide-y"))}));function A(e){for(const n of["a-400.png","b-400.png","a-1920.jpg"])s(`/assets/img/products/masked/${t.value}-${e}-${n}`)}for(const e of h.children)A(e.value),e.value===f.value&&(e.setAttribute("selected",!0),y.classList.add(`${e.value}-before`),L=e.value);function I(){const e=n.cart.reduce(((e,t)=>e+t.quantity),0);_.innerText=e>0?`(${e})`:""}function w(e){if(!n.inv)return;const t=C(e);e&&(r.value=e.size,h.value=e.color,n.currentItem=null),e||y.classList.remove(`${L}-before`),y.classList.add(`${h.value}-before`),L=h.value,t&&0!==t.quantity?function(e){const t=c(k(e.quantity));g.innerText=`${e.quantity>5?t[2]:t[1]}`,e.quantity<Number(m.value)&&(m.value=e.quantity),g.classList.add("in-stock"),g.classList.remove("out-stock"),m.removeAttribute("disabled"),p.removeAttribute("disabled"),p.textContent=c(b)[1]}(t):(g.innerText=c(k(0))[0],g.classList.add("out-stock"),g.classList.remove("in-stock"),m.setAttribute("disabled",!0),p.setAttribute("disabled",!0),p.innerText=c(b)[0]),$("sm_a"),o.textContent="$"+Number(a.value)*Number(m.value)}w(n.currentItem),I(),h.addEventListener("change",(()=>{$("sm_a"),w()})),m.addEventListener("input",(()=>{const e=x().quantity;Number(m.value)>e&&(m.value=e),o.textContent="$"+Number(m.value)*Number(a.value)})),r.addEventListener("input",(()=>w())),d.addEventListener("pointerover",(()=>N())),d.addEventListener("pointerleave",(()=>N())),d.addEventListener("click",(()=>E())),u.addEventListener("click",(()=>E())),p.addEventListener("click",(function(){const e=x();e.quantity-Number(m.value)<0||!e.quantity||(n.cart.find((t=>t.type===e.type))?function(e){n.cart=t=>t.map((t=>t.type===e.type?{...t,quantity:t.quantity+Number(m.value)}:t))}(e):function(e){n.cart=t=>t.concat({...e,quantity:Number(m.value)})}(e),n.notify(c((e=>({en:`Added ${e.name.en} to cart`,fr:`Ajouté des ${e.name.fr} au panier`}))(e)),"green",(()=>location.assign(c({en:"/cart",fr:"/fr/panier"})))),p.blur())})),v.addEventListener("click",(()=>location.assign(c({en:"/cart",fr:"/fr/panier"})))),n.addHook((()=>w())),n.addHook((()=>I()))}(),function(){if(!e("place-order"))return;0===n.cart.length&&location.assign("/");const s=e("checkout-name"),i=e("checkout-email"),o=e("checkout-street"),d=e("checkout-city"),h=e("checkout-state"),f=e("checkout-state-text"),p=e("checkout-country"),v=e("checkout-zip"),_=e("checkout-zip-text"),y=e("stripe-payment-modal"),g=e("stripe-payment-form"),b=e("pay-button"),L=e("card-error"),k=e("spinner"),x=e("button-text"),C=e("checkout-form"),$=e("cancel"),N=e("checkout-subtotal"),E=e("checkout-tax"),A=e("checkout-total"),I=e("checkout-product-template"),w=e("checkout-products"),S={Canada:{en:["Province","Postal Code"],fr:["Province","Code postal"]},"United States":{en:["State","Zip"],fr:["État","Code postal"]}};let M=!1;function q(e){e?(b.disabled=!0,k.classList.remove("hidden"),x.classList.add("hidden")):(b.disabled=!1,k.classList.add("hidden"),x.classList.remove("hidden"))}function T(){const e=n.cart.reduce(((e,t)=>e+t.price*t.quantity),0),t=e*((e,t)=>{if("Canada"!==e)return.05;switch(t){case"New Brunswick":case"Newfoundland and Labrador":case"Nova Scotia":case"Prince Edward Island":return.15;case"Ontario":return.13;default:return.05}})(p.value,h.value),a=e+t;N.innerText=`$${e.toFixed(2)}`,E.innerText=`$${t.toFixed(2)}`,A.innerText=`$${a.toFixed(2)}`}function z(e,t=[],n){e.textContent="",t.forEach((t=>{e.appendChild(new a("option",null,{value:n(t)}).addChild(n(t)).render())}))}function O(t){q(!1),t?(document.body.classList.add("hide-y"),e("blur").classList.add("blur"),y.classList.add("show-modal"),b.disabled=!0,e("payment-price").innerText=A.textContent):(document.body.classList.remove("hide-y"),e("blur").classList.remove("blur"),y.classList.remove("show-modal"),0===n.cart.length&&location.assign(c({en:"/thanks",fr:"/fr/merci"})))}function U(){const e=p.value;h.textContent="",z(h,n.countries[e].states,(e=>e.name)),f.innerText=S[e][r()][0],_.innerText=S[e][r()][1],v.setAttribute("pattern","Canada"===e?l.source:m.source),v.setAttribute("maxlength","Canada"===e?"7":"10"),v.setAttribute("size","Canada"===e?"7":"10"),T()}T(),function(){const e=new DocumentFragment;n.cart.forEach((t=>{const a=I.content.cloneNode(!0),s=a.querySelector("a"),i=a.querySelector("img"),o=a.querySelector("p"),c=r();return s.href=`/products/${t.name.en.toLowerCase().split(" ").join("-")}${"en"!==c?`-${c}`:""}.html`,s.addEventListener("click",(()=>n.currentItem={type:t.type,color:t.color,size:t.size})),i.src=t.images.sm_a,o.textContent=`${t.name[c]} (${t.size}) - ${t.quantity} x $${t.price}`,e.appendChild(a)})),w.appendChild(e)}(),z(p,Object.keys(n.countries),(e=>e)),U(),C.addEventListener("submit",(a=>{a.preventDefault(),async function(){O(!0),q(!0);const a={lang:r(),update:n.secret,name:s.value,email:i.value,streetAddress:o.value,city:d.value,country:p.value,state:h.value,zip:v.value,items:n.cart.map((e=>({images:e.images,type:e.type,prefix:e.prefix,size:e.size,name:e.name,color:e.color,quantity:e.quantity})))};fetch(`${t}/orders/create-payment-intent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then((e=>e.json())).then((t=>{n.secret=t.clientSecret,n.order={id:t.id,name:t.name,email:t.email},e("payment-price").innerText=`$${t.total.toFixed(2)}`,function(t){if(M)return;M=!0;const a=u.elements().create("card",{style:{base:{color:"#1a171b",fontFamily:"Nunito, sans-serif",fontSmoothing:"antialiased",fontSize:"16px","::placeholder":{color:"#1a171b"}},invalid:{fontFamily:"Nunito, sans-serif",color:"#fa755a",iconColor:"#fa755a"}}});a.mount("#card-element"),a.on("change",(e=>{b.disabled=e.empty,L.textContent=e.error?e.error.message:""})),g.addEventListener("submit",(s=>{s.preventDefault(),function(t,a,s){q(!0),t.confirmCardPayment(s,{payment_method:{card:a}}).then((t=>{return t.error?(a=t.error.message,q(!1),L.textContent=a,void setTimeout((()=>{L.textContent=""}),4e3)):(q(!1),n.cart=()=>[],n.secret=null,e("result-message").classList.remove("hidden"),b.disabled=!0,$.innerText="close",$.classList.add("btn__primary"),void $.classList.remove("btn__secondary"));var a}))}(u,a,t.clientSecret)}))}(t),q(!1)}))}()})),$.addEventListener("click",(()=>O(!1))),p.addEventListener("input",(()=>U())),h.addEventListener("input",(()=>T())),v.addEventListener("input",(e=>{e.target.value=function(e){const t=e.toUpperCase();return"Canada"===p.value?6===t.length&&l.test(t)?t.substring(0,3)+" "+t.substring(3,6):t:6===t.length&&"-"!==t[5]?t.substring(0,5):t}(e.target.value,p.value)}))}(),function(){const t=e("cart-checkout");if(!t)return;const a=e("cart-subtotal"),s=e("cart-products"),i=e("cart-product-template"),o=e("cart-products-none");function d(){a.innerText=`$${n.cart.reduce(((e,t)=>e+t.price*t.quantity),0).toFixed(2)}`,n.cart.length>0?t.disabled=!1:t.disabled=!0}(function e(){if(!n.cart.length)return o.style.display="block",d();o.style.display="none";const t=new DocumentFragment;return n.cart.forEach((a=>function(t,a){const s=i.content.cloneNode(!0),o=s.querySelector(".cart__product"),u=s.querySelector("a"),l=s.querySelector("img"),m=s.querySelector("p"),h=s.querySelector("span"),f=s.querySelector(".input"),p=s.querySelector("label"),v=s.querySelector("button"),_=r();return u.href=`/products/${t.name.en.toLowerCase().split(" ").join("-")}${"en"!==_?`-${_}`:""}.html`,u.addEventListener("click",(()=>n.currentItem={type:t.type,color:t.color,size:t.size})),l.src=t.images.sm_a,l.alt=`${t.name[_]} ${t.size} ${t.color} underwear`,m.textContent=`${t.name[_]} (${t.size})`,h.textContent="$"+t.price*t.quantity,f.value=t.quantity,f.id=t.type,f.setAttribute("name",`${t.name[_]} ${t.size} ${t.color}`),p.setAttribute("for",t.type),f.addEventListener("input",(()=>{f.value||(f.value=1);const e=n.inv.find((e=>e.type===t.type)).quantity;Number(f.value)>e&&(f.value=e),n.cart=e=>e.map((e=>e.id===t.id?{...e,quantity:Number(f.value)}:e)),h.textContent="$"+t.price*Number(f.value),d()})),v.setAttribute("aria-label",c((e=>({en:`Remove ${e.name.en} (size: ${e.size} quantity: ${e.quantity}) from cart`,fr:`Retirer ${e.name.fr} (taille: ${e.size} quantité: ${e.quantity}) du panier`}))(t))),v.addEventListener("click",(()=>{n.cart=e=>e.filter((e=>e.id!==t.id)),o.remove(),d(),n.notify(c((e=>({en:`Removed ${e.name.en} from cart`,fr:`${e.name.fr} retiré du panier`}))(t)),"red",(()=>location.assign(u.href))),!n.cart.length&&e()})),a.appendChild(s)}(a,t))),s.appendChild(t),d()})(),t.addEventListener("click",(()=>{n.cart.length>0&&location.assign(c({en:"/checkout",fr:"/fr/la-caisse"}))}))}(),function(){const t=e("nav"),a=e("cart-link"),s=e("cart-link-mobile"),o=e("menu-mobile-list"),r=e("menu-mobile-btn"),d=e("skip-link"),u=e("main-content"),l={en:"cart",fr:"panier"},m=(e=>{let t=!0;return()=>(t=!t,t?(o.classList.add("hide"),void document.body.classList.remove("hide-y")):(o.classList.remove("hide"),void document.body.classList.add("hide-y")))})(),[h,f]=(()=>{const e=function*(){let e=0,t=0;for(;;)[e,t]=[t,window.scrollY],yield t-e}(),n=()=>{t.classList.add("slide-down"),t.classList.remove("slide-up"),s=!1};let a=!1,s=!1,o=!1;return[i(!0,(()=>window.scrollY<100||e.next().value<=0),(e=>{a?a=!0:setTimeout((()=>{e&&s||o?n():e||s||(t.classList.remove("slide-down"),t.classList.add("slide-up"),s=!0),a=!1}),100)})),e=>{e?(o=!0,n()):o=!1}]})();function p(){if(n.cart.length>0){const e=n.cart.reduce(((e,t)=>e+t.quantity),0);a.textContent=`${c(l)} (${e})`,s.textContent=`${c(l)} (${e})`}else a.textContent=c(l),s.textContent=c(l)}p(),r.addEventListener("click",m),d.addEventListener("click",(()=>{u.focus()})),o.addEventListener("click",(()=>m())),t.addEventListener("focusin",(()=>f(!0))),t.addEventListener("focusout",(()=>f(!1))),n.addHook((()=>p())),document.addEventListener("scroll",(()=>h()))}(),(()=>{class e extends HTMLElement{constructor(){super(),this._images=new Array(Number(this.getAttribute("num-images"))).fill("").map(((e,t)=>`${this.getAttribute("image-path")}${t}.jpg`)),this._images.forEach((e=>s(e))),this._currentImage=1,this._imageEl=new a("img","section__hero_image",{src:this._images[this._currentImage],alt:this.getAttribute("alt"),title:this.getAttribute("title")}).render(),this._roundedBottom=new a("div",["bg-light","rounded-big-top","absolute","b-0","l-0"]).render(),this.appendChild(this._imageEl),this.appendChild(this._roundedBottom),this.classList.add("section__hero"),setInterval((()=>{this._imageEl.src=this._images[this.getCurrentImage()]}),4500)}getCurrentImage(){return this._currentImage===this._images.length-1?this._currentImage=0:++this._currentImage}}customElements.get("hero-image")||customElements.define("hero-image",e)})(),function(){const t=e("order-id");if(!t)return;n.order||location.assign("/");const a=e("user-name"),s=e("user-email"),i=n.order;t.textContent=i.id,a.textContent=i.name.split(" ")[0],s.textContent=i.email}(),function(){const n=e("contact-form");if(!n)return;const a=e("contact-name"),s=e("contact-email"),i=e("contact-message"),o=e("contact-button"),c=[a,s,i,o],d=function(){const t=e("modal");if(!t)return;const n=e("modal-heading"),a=e("modal-text"),s=e("modal-ok"),i=e("modal-cancel"),o=e("blur"),r=e("nav");function c(){o.classList.remove("blur"),r.classList.remove("blur"),document.body.classList.remove("hide-y"),i.classList.add("hidden"),t.classList.add("hidden"),n.textContent="",a.textContent="",s.textContent="",i.textContent=""}return function(e){e&&(o.classList.add("blur"),r.classList.add("blur"),document.body.classList.add("hide-y"),t.classList.remove("hidden"),n.textContent=e.heading,a.textContent=e.text,s.textContent=e.ok.text,s.addEventListener("click",(()=>c())),e.cancel?(i.classList.remove("hidden"),i.textContent=e.cancel.text,i.addEventListener("click",(()=>c())),i.focus()):s.focus())}}(),u={en:{error:["Error","ok"],default:["Success","ok","cancel"],message:(e,t)=>`Thanks for your message, ${e}! We'll get back to you at ${t} as soon as possible.`},fr:{error:["Error","ok"],default:["Succès","ok","annuler"],message:(e,t)=>`Merci pour votre message ${e}! Nous vous rappelleons à votre courriel ${t} dans les plus brefs délais.`}};n.addEventListener("submit",(e=>{e.preventDefault();const n={name:a.value,email:s.value,message:i.value};c.forEach((e=>{e.value="",e.disabled=!0})),fetch(`${t}/message`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then((e=>e.json())).then((e=>{c.forEach((e=>{e.disabled=!1})),e.error?d({heading:u[r()].error[0],text:e.error,ok:{text:u[r()].error[1]}}):d({heading:u[r()].default[0],text:u[r()].message(e.name,e.email),ok:{text:u[r()].default[1]}})})).catch((e=>console.log(e)))}))}(),function(){const t=e("notification");if(!t)return;const a=e("notification-text");function s(e){t.classList.add("hidden"),t.classList.remove(e),a.textContent=""}n.setNotify(((e,i,o)=>{n.currentNotification&&clearTimeout(n.currentNotification),function(e,n){t.classList.add(n),a.textContent=e,t.classList.remove("hidden")}(e,i),n.currentNotification=setTimeout((()=>s(i)),4e3),t.addEventListener("mouseenter",(()=>clearTimeout(n.currentNotification))),t.addEventListener("mouseleave",(()=>setTimeout((()=>s()),2e3))),t.onclick=()=>o()}))}()})();