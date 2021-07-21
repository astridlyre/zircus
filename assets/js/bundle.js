(()=>{"use strict";const e=e=>document.getElementById(e),t="https://zircus.herokuapp.com/api",n=new class{constructor(){this.__hooks=[]}get hooks(){return this.__hooks}addHook(e){return this.__hooks.push(e),this}get inv(){const e=localStorage.getItem("inv");return e?JSON.parse(e):[]}set inv(e){return localStorage.setItem("inv",JSON.stringify(e(this.inv))),this.update()}get countries(){const e=localStorage.getItem("countries");return e?JSON.parse(e):[]}set countries(e){return localStorage.setItem("countries",JSON.stringify(e(this.countries))),this.update()}set cart(e){return localStorage.setItem("cart",JSON.stringify(e(this.cart))),this.update()}get cart(){const e=localStorage.getItem("cart");return e?JSON.parse(e):[]}get secret(){const e=localStorage.getItem("clientSecret");return e?JSON.parse(e):null}set secret(e){localStorage.setItem("clientSecret",JSON.stringify(e))}set currentItem(e){localStorage.setItem("currentItem",JSON.stringify(e))}get currentItem(){const e=localStorage.getItem("currentItem");return e?JSON.parse(e):null}set order(e){localStorage.setItem("order",JSON.stringify(e))}get order(){const e=localStorage.getItem("order");return e?JSON.parse(e):null}update(){return this.hooks.forEach((e=>e({cart:this.cart,inv:this.inv,countries:this.countries}))),this}};class a{constructor(e,t,n){if(this.e=document.createElement(e),this.children=[],t&&t.forEach((e=>{this.e.classList.add(e)})),n)for(const[e,t]of Object.entries(n))this.e.setAttribute(e,t)}render(){return this.children.forEach((e=>{e instanceof a?this.e.appendChild(e.render()):this.e.innerText=e})),this.e}event(e,t){return this.e.addEventListener(e,(()=>t())),this}addChild(e){return this.children.push(e),this}}function o(e,t,n){let a=e;return()=>n(a=t(a))}const s=async()=>await fetch(`${t}/inv`).then((e=>e.json())).then((e=>n.inv=()=>[...e.cf,...e.pf,...e.ff])).catch((e=>{console.error("Unable to get inventory",e.message)}));function r(){return document.documentElement.getAttribute("lang")}s(),setInterval(s,3e5),(e=>{if(!e)return;const t=["For your thunder down under","Guard the crown jewels","For your national treasure","A luxury condo for your privates","If you are here, you may be gay","Contain your thunder in style","A stylish shape for your bits","One person's junk is another's treasure"],n=["Pour votre tonnerre vers le bas sous","Garde les bijoux de la couronne","Pour votre tresor national","Un condo de luxe pour vos petit soldats","si vous l'etes, vous pourriez etre gai","Contenir votre tonnerre dans le style","Une forme elegante pour vos meches","La camelote d'une personne est le tresor d'une autre"];e.innerText=(e=>"en"===e?t[Math.floor(Math.random()*t.length)]:n[Math.floor(Math.random()*n.length)])(r())})(e("home-heading"));const i={Canada:{states:[{id:872,name:"Alberta",state_code:"AB"},{id:875,name:"British Columbia",state_code:"BC"},{id:867,name:"Manitoba",state_code:"MB"},{id:868,name:"New Brunswick",state_code:"NB"},{id:877,name:"Newfoundland and Labrador",state_code:"NL"},{id:878,name:"Northwest Territories",state_code:"NT"},{id:874,name:"Nova Scotia",state_code:"NS"},{id:876,name:"Nunavut",state_code:"NU"},{id:866,name:"Ontario",state_code:"ON"},{id:871,name:"Prince Edward Island",state_code:"PE"},{id:873,name:"Quebec",state_code:"QC"},{id:870,name:"Saskatchewan",state_code:"SK"},{id:869,name:"Yukon",state_code:"YT"}]},"United States":{states:[{id:1456,name:"Alabama",state_code:"AL"},{id:1400,name:"Alaska",state_code:"AK"},{id:1424,name:"American Samoa",state_code:"AS"},{id:1434,name:"Arizona",state_code:"AZ"},{id:1444,name:"Arkansas",state_code:"AR"},{id:1402,name:"Baker Island",state_code:"UM-81"},{id:1416,name:"California",state_code:"CA"},{id:1450,name:"Colorado",state_code:"CO"},{id:1435,name:"Connecticut",state_code:"CT"},{id:1399,name:"Delaware",state_code:"DE"},{id:1437,name:"District of Columbia",state_code:"DC"},{id:1436,name:"Florida",state_code:"FL"},{id:1455,name:"Georgia",state_code:"GA"},{id:1412,name:"Guam",state_code:"GU"},{id:1411,name:"Hawaii",state_code:"HI"},{id:1398,name:"Howland Island",state_code:"UM-84"},{id:1460,name:"Idaho",state_code:"ID"},{id:1425,name:"Illinois",state_code:"IL"},{id:1440,name:"Indiana",state_code:"IN"},{id:1459,name:"Iowa",state_code:"IA"},{id:1410,name:"Jarvis Island",state_code:"UM-86"},{id:1428,name:"Johnston Atoll",state_code:"UM-67"},{id:1406,name:"Kansas",state_code:"KS"},{id:1419,name:"Kentucky",state_code:"KY"},{id:1403,name:"Kingman Reef",state_code:"UM-89"},{id:1457,name:"Louisiana",state_code:"LA"},{id:1453,name:"Maine",state_code:"ME"},{id:1401,name:"Maryland",state_code:"MD"},{id:1433,name:"Massachusetts",state_code:"MA"},{id:1426,name:"Michigan",state_code:"MI"},{id:1438,name:"Midway Atoll",state_code:"UM-71"},{id:1420,name:"Minnesota",state_code:"MN"},{id:1430,name:"Mississippi",state_code:"MS"},{id:1451,name:"Missouri",state_code:"MO"},{id:1446,name:"Montana",state_code:"MT"},{id:1439,name:"Navassa Island",state_code:"UM-76"},{id:1408,name:"Nebraska",state_code:"NE"},{id:1458,name:"Nevada",state_code:"NV"},{id:1404,name:"New Hampshire",state_code:"NH"},{id:1417,name:"New Jersey",state_code:"NJ"},{id:1423,name:"New Mexico",state_code:"NM"},{id:1452,name:"New York",state_code:"NY"},{id:1447,name:"North Carolina",state_code:"NC"},{id:1418,name:"North Dakota",state_code:"ND"},{id:1431,name:"Northern Mariana Islands",state_code:"MP"},{id:4851,name:"Ohio",state_code:"OH"},{id:1421,name:"Oklahoma",state_code:"OK"},{id:1415,name:"Oregon",state_code:"OR"},{id:1448,name:"Palmyra Atoll",state_code:"UM-95"},{id:1422,name:"Pennsylvania",state_code:"PA"},{id:1449,name:"Puerto Rico",state_code:"PR"},{id:1461,name:"Rhode Island",state_code:"RI"},{id:1443,name:"South Carolina",state_code:"SC"},{id:1445,name:"South Dakota",state_code:"SD"},{id:1454,name:"Tennessee",state_code:"TN"},{id:1407,name:"Texas",state_code:"TX"},{id:1432,name:"United States Minor Outlying Islands",state_code:"UM"},{id:1413,name:"United States Virgin Islands",state_code:"VI"},{id:1414,name:"Utah",state_code:"UT"},{id:1409,name:"Vermont",state_code:"VT"},{id:1427,name:"Virginia",state_code:"VA"},{id:1405,name:"Wake Island",state_code:"UM-79"},{id:1462,name:"Washington",state_code:"WA"},{id:1429,name:"West Virginia",state_code:"WV"},{id:1441,name:"Wisconsin",state_code:"WI"},{id:1442,name:"Wyoming",state_code:"WY"}]}};n.countries=()=>i;const c=Stripe("pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP"),d=/^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/,l=/^[0-9]{5}(-[0-9]{4})?$/;!function(){const t=e("product-prefix");if(!t)return;const s=e("product-price"),i=e("product-price-text"),c=e("product-size"),d=e("product-image"),l=e("product-image-full"),u=e("product-image-full-image"),m=e("product-quantity"),h=e("product-color"),p=e("product-default-color"),f=e("add-to-cart"),v=e("go-to-cart"),y=e("go-to-cart-qty"),g=e("product-accent"),b=e("product-stock"),_={en:["out of stock","add to cart"],fr:["non disponible","ajouter"]};let k=h.value;function L(e){switch(r()){case"en":return["None available",`Only ${e} left!`,"In stock"];case"fr":return["Non disponible",`Il n'en reste que ${e}!`,"En stock"];default:return[]}}const[x,C]=(()=>{let e=null;return[()=>e,a=>e=n.inv.find((e=>a?e.type===a.type:e.type===`${t.value}-${h.value}-${c.value}`))]})();function N(e){return x()&&(d.src=x().images[e])}const S=o(!1,(e=>!e),(e=>N(e?"sm_b":"sm_a"))),$=o(!1,(e=>!e),(t=>{t?(u.src=x().images.lg_a,l.style.display="flex",e("nav").classList.add("hidden"),e("menu-mobile-btn").classList.add("hidden"),document.body.classList.add("hide-y")):(l.style.display="none",e("nav").classList.remove("hidden"),e("menu-mobile-btn").classList.remove("hidden"),document.body.classList.remove("hide-y"))}));function I(e){for(const n of["a-400.png","b-400.png","a-1920.jpg"]){const o=new a("link",null,{href:`/assets/img/products/masked/${t.value}-${e}-${n}`,rel:"prefetch",as:"image"});document.head.appendChild(o.render())}}for(const e of h.children)I(e.value),e.value===p.value&&(e.setAttribute("selected",!0),g.classList.add(`${e.value}-before`),k=e.value);function w(){const e=n.cart.reduce(((e,t)=>e+t.quantity),0);y.innerText=e>0?`(${e})`:""}function E(e){if(!n.inv)return;const t=C(e);e&&(c.value=e.size,h.value=e.color,n.currentItem=null),e||g.classList.remove(`${k}-before`),g.classList.add(`${h.value}-before`),k=h.value,t&&0!==t.quantity?function(e){const t=L(e.quantity);b.innerText=`${e.quantity>5?t[2]:t[1]}`,e.quantity<Number(m.value)&&(m.value=e.quantity),b.classList.add("in-stock"),b.classList.remove("out-stock"),m.removeAttribute("disabled"),f.removeAttribute("disabled"),f.textContent=_[r()][1]}(t):(b.innerText=L(0)[0],b.classList.add("out-stock"),b.classList.remove("in-stock"),m.setAttribute("disabled",!0),f.setAttribute("disabled",!0),f.innerText=_[r()][0]),N("sm_a"),i.textContent="$"+Number(s.value)*Number(m.value)}E(n.currentItem),w(),h.addEventListener("change",(()=>{N("sm_a"),E()})),m.addEventListener("input",(()=>{const e=x().quantity;Number(m.value)>e&&(m.value=e),i.textContent="$"+Number(m.value)*Number(s.value)})),c.addEventListener("input",(()=>E())),d.addEventListener("pointerover",(()=>S())),d.addEventListener("pointerleave",(()=>S())),d.addEventListener("click",(()=>$())),l.addEventListener("click",(()=>$())),f.addEventListener("click",(function(){const e=x();e.quantity-Number(m.value)<0||!e.quantity||(n.cart.find((t=>t.type===e.type))?function(e){n.cart=t=>t.map((t=>t.type===e.type?{...t,quantity:t.quantity+Number(m.value)}:t))}(e):function(e){n.cart=t=>t.concat({...e,quantity:Number(m.value)})}(e),f.blur())})),v.addEventListener("click",(()=>location.assign(function(){switch(r()){case"en":return"/cart";case"fr":return"/fr/panier";default:throw new Error("Invalid language")}}()))),n.addHook((()=>E())),n.addHook((()=>w()))}(),function(){if(!e("place-order"))return;0===n.cart.length&&location.assign("/");const o=e("checkout-name"),s=e("checkout-email"),i=e("checkout-street"),u=e("checkout-city"),m=e("checkout-state"),h=e("checkout-state-text"),p=e("checkout-country"),f=e("checkout-zip"),v=e("checkout-zip-text"),y=e("stripe-payment-modal"),g=e("stripe-payment-form"),b=e("pay-button"),_=e("card-error"),k=e("spinner"),L=e("button-text"),x=e("checkout-form"),C=e("cancel"),N=e("checkout-subtotal"),S=e("checkout-tax"),$=e("checkout-total"),I=e("checkout-product-template"),w=e("checkout-products"),E={Canada:{en:["Province","Postal Code"],fr:["Province","Code postal"]},"United States":{en:["State","Zip"],fr:["État","Code postal"]}};let A=!1;function M(e){e?(b.disabled=!0,k.classList.remove("hidden"),L.classList.add("hidden")):(b.disabled=!1,k.classList.add("hidden"),L.classList.remove("hidden"))}function q(){const e=n.cart.reduce(((e,t)=>e+t.price*t.quantity),0),t=e*((e,t)=>{if("Canada"!==e)return.05;switch(t){case"New Brunswick":case"Newfoundland and Labrador":case"Nova Scotia":case"Prince Edward Island":return.15;case"Ontario":return.13;default:return.05}})(p.value,m.value),a=e+t;N.innerText=`$${e.toFixed(2)}`,S.innerText=`$${t.toFixed(2)}`,$.innerText=`$${a.toFixed(2)}`}function T(e,t=[],n){e.textContent="",t.forEach((t=>{e.appendChild(new a("option",null,{value:n(t)}).addChild(n(t)).render())}))}function O(t){if(M(!1),t)document.body.classList.add("hide-y"),e("blur").classList.add("blur"),y.classList.add("show-modal"),b.disabled=!0,e("payment-price").innerText=$.textContent;else if(document.body.classList.remove("hide-y"),e("blur").classList.remove("blur"),y.classList.remove("show-modal"),0===n.cart.length)return"fr"===r()?location.assign("/fr/merci"):location.assign("/thanks")}function z(){const e=p.value;m.textContent="",T(m,n.countries[e].states,(e=>e.name)),h.innerText=E[e][r()][0],v.innerText=E[e][r()][1],f.setAttribute("pattern","Canada"===e?d.source:l.source),f.setAttribute("maxlength","Canada"===e?"7":"10"),f.setAttribute("size","Canada"===e?"7":"10"),q()}q(),function(){const e=new DocumentFragment;n.cart.forEach((t=>{const a=I.content.cloneNode(!0),o=a.querySelector("a"),s=a.querySelector("img"),i=a.querySelector("p"),c=r();return o.href=`/products/${t.name.en.toLowerCase().split(" ").join("-")}${"en"!==c?`-${c}`:""}.html`,o.addEventListener("click",(()=>n.currentItem={type:t.type,color:t.color,size:t.size})),s.src=t.images.sm_a,i.textContent=`${t.name[c]} (${t.size}) - ${t.quantity} x $${t.price}`,e.appendChild(a)})),w.appendChild(e)}(),T(p,Object.keys(n.countries),(e=>e)),z(),x.addEventListener("submit",(a=>{a.preventDefault(),async function(){O(!0),M(!0);const a={lang:r(),update:n.secret,name:o.value,email:s.value,streetAddress:i.value,city:u.value,country:p.value,state:m.value,zip:f.value,items:n.cart.map((e=>({images:e.images,type:e.type,prefix:e.prefix,size:e.size,name:e.name,color:e.color,quantity:e.quantity})))};fetch(`${t}/orders/create-payment-intent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then((e=>e.json())).then((t=>{n.secret=t.clientSecret,n.order={id:t.id,name:t.name,email:t.email},e("payment-price").innerText=`$${t.total.toFixed(2)}`,function(t){if(A)return;A=!0;const a=c.elements().create("card",{style:{base:{color:"#1a171b",fontFamily:"Nunito, sans-serif",fontSmoothing:"antialiased",fontSize:"16px","::placeholder":{color:"#1a171b"}},invalid:{fontFamily:"Nunito, sans-serif",color:"#fa755a",iconColor:"#fa755a"}}});a.mount("#card-element"),a.on("change",(e=>{b.disabled=e.empty,_.textContent=e.error?e.error.message:""})),g.addEventListener("submit",(o=>{o.preventDefault(),function(t,a,o){M(!0),t.confirmCardPayment(o,{payment_method:{card:a}}).then((t=>{return t.error?(a=t.error.message,M(!1),_.textContent=a,void setTimeout((()=>{_.textContent=""}),4e3)):(M(!1),n.cart=()=>[],n.secret=null,e("result-message").classList.remove("hidden"),b.disabled=!0,C.innerText="close",C.classList.add("btn__primary"),void C.classList.remove("btn__secondary"));var a}))}(c,a,t.clientSecret)}))}(t),M(!1)}))}()})),C.addEventListener("click",(()=>O(!1))),p.addEventListener("input",(()=>z())),m.addEventListener("input",(()=>q())),f.addEventListener("input",(e=>{e.target.value=function(e){const t=e.toUpperCase();return"Canada"===p.value?6===t.length&&d.test(t)?t.substring(0,3)+" "+t.substring(3,6):t:6===t.length&&"-"!==t[5]?t.substring(0,5):t}(e.target.value,p.value)}))}(),function(){const t=e("cart-checkout");if(!t)return;const a=e("cart-subtotal"),o=e("cart-products"),s=e("cart-product-template"),i=e("cart-products-none");function c(){a.innerText=`$${n.cart.reduce(((e,t)=>e+t.price*t.quantity),0).toFixed(2)}`,n.cart.length>0?t.disabled=!1:t.disabled=!0}function d(){if(!n.cart.length)return i.style.display="block",c();i.style.display="none";const e=new DocumentFragment;return n.cart.forEach((t=>function(e,t){const a=s.content.cloneNode(!0),o=a.querySelector(".cart__product"),i=a.querySelector("a"),l=a.querySelector("img"),u=a.querySelector("p"),m=a.querySelector("span"),h=a.querySelector(".input"),p=a.querySelector("label"),f=a.querySelector("button"),v=r();return i.href=`/products/${e.name.en.toLowerCase().split(" ").join("-")}${"en"!==v?`-${v}`:""}.html`,i.addEventListener("click",(()=>n.currentItem={type:e.type,color:e.color,size:e.size})),l.src=e.images.sm_a,l.alt=`${e.name[v]} ${e.size} ${e.color} underwear`,u.textContent=`${e.name[v]} (${e.size})`,m.textContent="$"+e.price*e.quantity,h.value=e.quantity,h.id=e.type,h.setAttribute("name",`${e.name[v]} ${e.size} ${e.color}`),p.setAttribute("for",e.type),h.addEventListener("input",(()=>{h.value||(h.value=1);const t=n.inv.find((t=>t.type===e.type)).quantity;Number(h.value)>t&&(h.value=t),n.cart=t=>t.map((t=>t.id===e.id?{...t,quantity:Number(h.value)}:t)),m.textContent="$"+e.price*Number(h.value),c()})),f.setAttribute("aria-label",function(e){switch(r()){case"en":return`Remove ${e.name.en} (size: ${e.size} quantity: ${e.quantity}) from cart`;case"fr":return`Retirer ${e.name.fr} (taille: ${e.size} quantité: ${e.quantity}) du panier`;default:throw new Error("Invalid language")}}(e)),f.addEventListener("click",(()=>{n.cart=t=>t.filter((t=>t.id!==e.id)),o.remove(),c(),!n.cart.length&&d()})),t.appendChild(a)}(t,e))),o.appendChild(e),c()}d(),t.addEventListener("click",(()=>{n.cart.length>0&&location.assign(function(){switch(r()){case"en":return"/checkout";case"fr":return"/fr/la-caisse";default:throw new Error("Invalid language")}}())}))}(),function(){const t=e("nav"),a=e("cart-link"),s=e("cart-link-mobile"),i=e("menu-mobile-list"),c=e("menu-mobile-btn"),d=e("skip-link"),l=e("main-content"),u={en:"cart",fr:"panier"},m=(e=>{let t=!0;return()=>(t=!t,t?(i.classList.add("hide"),void document.body.classList.remove("hide-y")):(i.classList.remove("hide"),void document.body.classList.add("hide-y")))})(),h=(()=>{const e=function*(){let e=0,t=0;for(;;)[e,t]=[t,window.scrollY],yield t-e}();let n=!1,a=!1;return o(!0,(()=>window.scrollY<100||e.next().value<=0),(e=>{n?n=!0:setTimeout((()=>{e&&a?(t.classList.add("slide-down"),t.classList.remove("slide-up"),a=!1):e||a||(t.classList.remove("slide-down"),t.classList.add("slide-up"),a=!0),n=!1}),100)}))})();function p(){if(n.cart.length>0){const e=n.cart.reduce(((e,t)=>e+t.quantity),0);a.textContent=`${u[r()]} (${e})`,s.textContent=`${u[r()]} (${e})`}else a.textContent=u[r()],s.textContent=u[r()]}p(),c.addEventListener("click",m),d.addEventListener("click",(()=>{l.focus()})),n.addHook((()=>p())),document.addEventListener("scroll",(()=>h()))}(),function(){const t=e("hero-image");if(!t)return;const n=e=>t.src=`/assets/img/people/hero${e}.jpg`;for(let e=0;e<6;e++)document.head.appendChild(new a("link",null,{href:`/assets/img/people/hero${e}.jpg`,rel:"prefetch",as:"image"}).render());const o=function*(e){let t=0;for(;;)5===t&&(t=0),yield++t}();n(o.next().value),setInterval((()=>{n(o.next().value)}),5e3)}(),function(){const t=e("order-id");if(!t)return;n.order||location.assign("/");const a=e("user-name"),o=e("user-email"),s=n.order;t.textContent=s.id,a.textContent=s.name.split(" ")[0],o.textContent=s.email}(),function(){const n=e("contact-form");if(!n)return;const a=e("contact-name"),o=e("contact-email"),s=e("contact-message"),i=e("contact-button"),c=[a,o,s,i],d=function(){const t=e("modal");if(!t)return;const n=e("modal-heading"),a=e("modal-text"),o=e("modal-ok"),s=e("modal-cancel"),r=e("blur"),i=e("nav");function c(){r.classList.remove("blur"),i.classList.remove("blur"),document.body.classList.remove("hide-y"),s.classList.add("hidden"),t.classList.add("hidden"),n.textContent="",a.textContent="",o.textContent="",s.textContent=""}return function(e){e&&(r.classList.add("blur"),i.classList.add("blur"),document.body.classList.add("hide-y"),t.classList.remove("hidden"),n.textContent=e.heading,a.textContent=e.text,o.textContent=e.ok.text,o.addEventListener("click",(()=>c())),e.cancel?(s.classList.remove("hidden"),s.textContent=e.cancel.text,s.addEventListener("click",(()=>c())),s.focus()):o.focus())}}(),l={en:{error:["Error","ok"],default:["Success","ok","cancel"],message:(e,t)=>`Thanks for your message, ${e}! We'll get back to you at ${t} as soon as possible.`},fr:{error:["Error","ok"],default:["Succès","ok","annuler"],message:(e,t)=>`Merci pour votre message ${e}! Nous vous rappelleons à votre courriel ${t} dans les plus brefs délais.`}};n.addEventListener("submit",(e=>{e.preventDefault();const n={name:a.value,email:o.value,message:s.value};return c.forEach((e=>{e.value="",e.disabled=!0})),fetch(`${t}/message`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then((e=>e.json())).then((e=>{c.forEach((e=>{e.disabled=!1})),e.error?d({heading:l[r()].error[0],text:e.error,ok:{text:l[r()].error[1]}}):d({heading:l[r()].default[0],text:l[r()].message(e.name,e.email),ok:{text:l[r()].default[1]}})})).catch((e=>console.log(e))),!1}))}()})();