(()=>{"use strict";const e=e=>document.getElementById(e),t="https://zircus.herokuapp.com/api",n=new class{constructor(){this.__hooks=[]}get hooks(){return this.__hooks}addHook(e){return this.__hooks.push(e),this}get inv(){const e=localStorage.getItem("inv");return e?JSON.parse(e):[]}set inv(e){return localStorage.setItem("inv",JSON.stringify(e(this.inv))),this.update()}get countries(){const e=localStorage.getItem("countries");return e?JSON.parse(e):[]}set countries(e){return localStorage.setItem("countries",JSON.stringify(e(this.countries))),this.update()}set cart(e){return localStorage.setItem("cart",JSON.stringify(e(this.cart))),this.update()}get cart(){const e=localStorage.getItem("cart");return e?JSON.parse(e):[]}get secret(){const e=localStorage.getItem("clientSecret");return e?JSON.parse(e):null}set secret(e){localStorage.setItem("clientSecret",JSON.stringify(e))}set currentItem(e){localStorage.setItem("currentItem",JSON.stringify(e))}get currentItem(){const e=localStorage.getItem("currentItem");return e?JSON.parse(e):null}set order(e){localStorage.setItem("order",JSON.stringify(e))}get order(){const e=localStorage.getItem("order");return e?JSON.parse(e):null}update(){return this.hooks.forEach((e=>e({cart:this.cart,inv:this.inv,countries:this.countries}))),this}};class a{constructor(e,t,n){if(this.e=document.createElement(e),this.children=[],t&&t.forEach((e=>{this.e.classList.add(e)})),n)for(const[e,t]of Object.entries(n))this.e.setAttribute(e,t)}render(){return this.children.forEach((e=>{e instanceof a?this.e.appendChild(e.render()):this.e.innerText=e})),this.e}event(e,t){return this.e.addEventListener(e,(()=>t())),this}addChild(e){return this.children.push(e),this}}function o(e,t,n){let a=e;return()=>n(a=t(a))}const s=async()=>await fetch(`${t}/inv`).then((e=>e.json())).then((e=>n.inv=()=>[...e.cf,...e.pf,...e.ff])).catch((e=>{console.error("Unable to get inventory",e.message)}));function r(){return document.documentElement.getAttribute("lang")}s(),setInterval(s,3e5),(e=>{if(!e)return;const t=["For your thunder down under","Guard the crown jewels","For your national treasure","A luxury condo for your privates","If you are here, you may be gay","Contain your thunder in style","A stylish shape for your bits","One person's junk is another's treasure"],n=["Pour votre tonnerre vers le bas sous","Garde les bijoux de la couronne","Pour votre tresor national","Un condo de luxe pour vos petit soldats","si vous l'etes, vous pourriez etre gai","Contenir votre tonnerre dans le style","Une forme elegante pour vos meches","La camelote d'une personne est le tresor d'une autre"];e.innerText=(e=>"en"===e?t[Math.floor(Math.random()*t.length)]:n[Math.floor(Math.random()*n.length)])(r())})(e("home-heading"));const i={Canada:{states:[{id:872,name:"Alberta",state_code:"AB"},{id:875,name:"British Columbia",state_code:"BC"},{id:867,name:"Manitoba",state_code:"MB"},{id:868,name:"New Brunswick",state_code:"NB"},{id:877,name:"Newfoundland and Labrador",state_code:"NL"},{id:878,name:"Northwest Territories",state_code:"NT"},{id:874,name:"Nova Scotia",state_code:"NS"},{id:876,name:"Nunavut",state_code:"NU"},{id:866,name:"Ontario",state_code:"ON"},{id:871,name:"Prince Edward Island",state_code:"PE"},{id:873,name:"Quebec",state_code:"QC"},{id:870,name:"Saskatchewan",state_code:"SK"},{id:869,name:"Yukon",state_code:"YT"}]},"United States":{states:[{id:1456,name:"Alabama",state_code:"AL"},{id:1400,name:"Alaska",state_code:"AK"},{id:1424,name:"American Samoa",state_code:"AS"},{id:1434,name:"Arizona",state_code:"AZ"},{id:1444,name:"Arkansas",state_code:"AR"},{id:1402,name:"Baker Island",state_code:"UM-81"},{id:1416,name:"California",state_code:"CA"},{id:1450,name:"Colorado",state_code:"CO"},{id:1435,name:"Connecticut",state_code:"CT"},{id:1399,name:"Delaware",state_code:"DE"},{id:1437,name:"District of Columbia",state_code:"DC"},{id:1436,name:"Florida",state_code:"FL"},{id:1455,name:"Georgia",state_code:"GA"},{id:1412,name:"Guam",state_code:"GU"},{id:1411,name:"Hawaii",state_code:"HI"},{id:1398,name:"Howland Island",state_code:"UM-84"},{id:1460,name:"Idaho",state_code:"ID"},{id:1425,name:"Illinois",state_code:"IL"},{id:1440,name:"Indiana",state_code:"IN"},{id:1459,name:"Iowa",state_code:"IA"},{id:1410,name:"Jarvis Island",state_code:"UM-86"},{id:1428,name:"Johnston Atoll",state_code:"UM-67"},{id:1406,name:"Kansas",state_code:"KS"},{id:1419,name:"Kentucky",state_code:"KY"},{id:1403,name:"Kingman Reef",state_code:"UM-89"},{id:1457,name:"Louisiana",state_code:"LA"},{id:1453,name:"Maine",state_code:"ME"},{id:1401,name:"Maryland",state_code:"MD"},{id:1433,name:"Massachusetts",state_code:"MA"},{id:1426,name:"Michigan",state_code:"MI"},{id:1438,name:"Midway Atoll",state_code:"UM-71"},{id:1420,name:"Minnesota",state_code:"MN"},{id:1430,name:"Mississippi",state_code:"MS"},{id:1451,name:"Missouri",state_code:"MO"},{id:1446,name:"Montana",state_code:"MT"},{id:1439,name:"Navassa Island",state_code:"UM-76"},{id:1408,name:"Nebraska",state_code:"NE"},{id:1458,name:"Nevada",state_code:"NV"},{id:1404,name:"New Hampshire",state_code:"NH"},{id:1417,name:"New Jersey",state_code:"NJ"},{id:1423,name:"New Mexico",state_code:"NM"},{id:1452,name:"New York",state_code:"NY"},{id:1447,name:"North Carolina",state_code:"NC"},{id:1418,name:"North Dakota",state_code:"ND"},{id:1431,name:"Northern Mariana Islands",state_code:"MP"},{id:4851,name:"Ohio",state_code:"OH"},{id:1421,name:"Oklahoma",state_code:"OK"},{id:1415,name:"Oregon",state_code:"OR"},{id:1448,name:"Palmyra Atoll",state_code:"UM-95"},{id:1422,name:"Pennsylvania",state_code:"PA"},{id:1449,name:"Puerto Rico",state_code:"PR"},{id:1461,name:"Rhode Island",state_code:"RI"},{id:1443,name:"South Carolina",state_code:"SC"},{id:1445,name:"South Dakota",state_code:"SD"},{id:1454,name:"Tennessee",state_code:"TN"},{id:1407,name:"Texas",state_code:"TX"},{id:1432,name:"United States Minor Outlying Islands",state_code:"UM"},{id:1413,name:"United States Virgin Islands",state_code:"VI"},{id:1414,name:"Utah",state_code:"UT"},{id:1409,name:"Vermont",state_code:"VT"},{id:1427,name:"Virginia",state_code:"VA"},{id:1405,name:"Wake Island",state_code:"UM-79"},{id:1462,name:"Washington",state_code:"WA"},{id:1429,name:"West Virginia",state_code:"WV"},{id:1441,name:"Wisconsin",state_code:"WI"},{id:1442,name:"Wyoming",state_code:"WY"}]}};n.countries=()=>i;const c=Stripe("pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP"),d=/^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/,l=/^[0-9]{5}(-[0-9]{4})?$/;!function(){const t=e("product-prefix");if(!t)return;const s=e("product-price"),i=e("product-price-text"),c=e("product-size"),d=e("product-image"),l=e("product-image-full"),u=e("product-image-full-image"),m=e("product-quantity"),h=e("product-color"),p=e("product-default-color"),v=e("add-to-cart"),f=e("go-to-cart"),y=e("go-to-cart-qty"),g=e("product-accent"),_=e("product-stock"),b={en:["out of stock","add to cart"],fr:["non disponible","ajouter"]};let k=h.value;function L(e,t){switch(t){case"en":return["None available",`Only ${e} left!`,"In stock"];case"fr":return["Non disponible",`Il n'en reste que ${e}!`,"En stock"];default:return[]}}const[N,C]=(()=>{let e=null;return[()=>e,a=>e=n.inv.find((e=>a?e.type===a.type:e.type===`${t.value}-${h.value}-${c.value}`))]})();function S(e){return N()&&(d.src=N().images[e])}const x=o(!1,(e=>!e),(e=>S(e?"sm_b":"sm_a"))),$=o(!1,(e=>!e),(t=>{t?(u.src=N().images.lg_a,l.style.display="flex",e("nav").classList.add("hidden"),e("menu-mobile-btn").classList.add("hidden"),document.body.classList.add("hide-y")):(l.style.display="none",e("nav").classList.remove("hidden"),e("menu-mobile-btn").classList.remove("hidden"),document.body.classList.remove("hide-y"))}));function I(e){for(const n of["a-400.png","b-400.png","a-1920.jpg"]){const o=new a("link",null,{href:`/assets/img/products/masked/${t.value}-${e}-${n}`,rel:"prefetch",as:"image"});document.head.appendChild(o.render())}}for(const e of h.children)I(e.value),e.value===p.value&&(e.setAttribute("selected",!0),g.classList.add(`${e.value}-before`),k=e.value);function w(){const e=n.cart.reduce(((e,t)=>e+t.quantity),0);y.innerText=e>0?`(${e})`:""}function A(e){if(!n.inv)return;const t=C(e);e&&(c.value=e.size,h.value=e.color,n.currentItem=null),e||g.classList.remove(`${k}-before`),g.classList.add(`${h.value}-before`),k=h.value,t&&0!==t.quantity?function(e){const t=L(e.quantity,r());_.innerText=`${e.quantity>5?t[2]:t[1]}`,e.quantity<Number(m.value)&&(m.value=e.quantity),_.classList.add("in-stock"),_.classList.remove("out-stock"),m.removeAttribute("disabled"),v.removeAttribute("disabled"),v.textContent=b[r()][1]}(t):(_.innerText=L(0,r())[0],_.classList.add("out-stock"),_.classList.remove("in-stock"),m.setAttribute("disabled",!0),v.setAttribute("disabled",!0),v.innerText=b[r()][0]),S("sm_a"),i.textContent="$"+Number(s.value)*Number(m.value)}A(n.currentItem),w(),h.addEventListener("change",(()=>{S("sm_a"),A()})),m.addEventListener("input",(()=>{const e=N().quantity;Number(m.value)>e&&(m.value=e),i.textContent="$"+Number(m.value)*Number(s.value)})),c.addEventListener("input",(()=>A())),d.addEventListener("pointerover",(()=>x())),d.addEventListener("pointerleave",(()=>x())),d.addEventListener("click",(()=>$())),l.addEventListener("click",(()=>$())),v.addEventListener("click",(function(){const e=N();e.quantity-Number(m.value)<0||!e.quantity||(n.cart.find((t=>t.type===e.type))?function(e){n.cart=t=>t.map((t=>t.type===e.type?{...t,quantity:t.quantity+Number(m.value)}:t))}(e):function(e){n.cart=t=>t.concat({...e,quantity:Number(m.value)})}(e),v.blur())})),f.addEventListener("click",(()=>location.assign("/cart"))),n.addHook((()=>A())),n.addHook((()=>w()))}(),function(){if(!e("place-order"))return;0===n.cart.length&&location.assign("/");const o=e("checkout-name"),s=e("checkout-email"),i=e("checkout-street"),u=e("checkout-city"),m=e("checkout-state"),h=e("checkout-state-text"),p=e("checkout-country"),v=e("checkout-zip"),f=e("checkout-zip-text"),y=e("stripe-payment-modal"),g=e("stripe-payment-form"),_=e("pay-button"),b=e("card-error"),k=e("spinner"),L=e("button-text"),N=e("checkout-form"),C=e("cancel"),S=e("checkout-subtotal"),x=e("checkout-tax"),$=e("checkout-total"),I=e("checkout-product-template"),w=e("checkout-products");let A=!1;function M(e){e?(_.disabled=!0,k.classList.remove("hidden"),L.classList.add("hidden")):(_.disabled=!1,k.classList.add("hidden"),L.classList.remove("hidden"))}function E(){const e=n.cart.reduce(((e,t)=>e+t.price*t.quantity),0),t=e*((e,t)=>{if("Canada"!==e)return.05;switch(t){case"New Brunswick":case"Newfoundland and Labrador":case"Nova Scotia":case"Prince Edward Island":return.15;case"Ontario":return.13;default:return.05}})(p.value,m.value),a=e+t;S.innerText=`$${e.toFixed(2)}`,x.innerText=`$${t.toFixed(2)}`,$.innerText=`$${a.toFixed(2)}`}function q(e,t=[],n){e.textContent="",t.forEach((t=>{e.appendChild(new a("option",null,{value:n(t)}).addChild(n(t)).render())}))}function O(t){M(!1),t?(document.body.classList.add("hide-y"),e("blur").classList.add("blur"),y.classList.add("show-modal"),_.disabled=!0,e("payment-price").innerText=$.textContent):(document.body.classList.remove("hide-y"),e("blur").classList.remove("blur"),y.classList.remove("show-modal"),0===n.cart.length&&location.assign("/thanks"))}function T(){const e=p.value;m.textContent="",q(m,n.countries[e].states,(e=>e.name)),h.innerText="Canada"===e?"Province":"State",f.innerText="Canada"===e?"Postal Code":"Zip",v.setAttribute("pattern","Canada"===e?d.source:l.source),v.setAttribute("maxlength","Canada"===e?"7":"10"),v.setAttribute("size","Canada"===e?"7":"10"),E()}E(),function(){const e=new DocumentFragment;n.cart.forEach((t=>{const a=I.content.cloneNode(!0),o=a.querySelector("a"),s=a.querySelector("img"),i=a.querySelector("p");return o.href=`/products/${t.name.toLowerCase().split(" ").join("-")}${"fr"===r()?"-fr":""}.html`,o.addEventListener("click",(()=>n.currentItem={type:t.type,color:t.color,size:t.size})),s.src=t.images.sm_a,i.textContent=`${t.name} (${t.size}) - ${t.quantity} x $${t.price}`,e.appendChild(a)})),w.appendChild(e)}(),q(p,Object.keys(n.countries),(e=>e)),T(),N.addEventListener("submit",(a=>{a.preventDefault(),async function(){O(!0),M(!0);const a={update:n.secret,name:o.value,email:s.value,streetAddress:i.value,city:u.value,country:p.value,state:m.value,zip:v.value,items:n.cart.map((e=>({type:e.type,prefix:e.prefix,size:e.size,name:e.name,color:e.color,quantity:e.quantity})))};fetch(`${t}/orders/create-payment-intent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then((e=>e.json())).then((t=>{n.secret=t.clientSecret,n.order={id:t.id,name:t.name},e("payment-price").innerText=`$${t.total.toFixed(2)}`,function(t){if(A)return;A=!0;const a=c.elements().create("card",{style:{base:{color:"#1a171b",fontFamily:"Nunito, sans-serif",fontSmoothing:"antialiased",fontSize:"16px","::placeholder":{color:"#1a171b"}},invalid:{fontFamily:"Nunito, sans-serif",color:"#fa755a",iconColor:"#fa755a"}}});a.mount("#card-element"),a.on("change",(e=>{_.disabled=e.empty,b.textContent=e.error?e.error.message:""})),g.addEventListener("submit",(o=>{o.preventDefault(),function(t,a,o){M(!0),t.confirmCardPayment(o,{payment_method:{card:a}}).then((t=>{return t.error?(a=t.error.message,M(!1),b.textContent=a,void setTimeout((()=>{b.textContent=""}),4e3)):(M(!1),n.cart=()=>[],n.secret=null,e("result-message").classList.remove("hidden"),_.disabled=!0,C.innerText="close",C.classList.add("btn__primary"),void C.classList.remove("btn__secondary"));var a}))}(c,a,t.clientSecret)}))}(t),M(!1)}))}()})),C.addEventListener("click",(()=>O(!1))),p.addEventListener("input",(()=>T())),m.addEventListener("input",(()=>E())),v.addEventListener("input",(e=>{e.target.value=function(e){const t=e.toUpperCase();return"Canada"===p.value?6===t.length&&d.test(t)?t.substring(0,3)+" "+t.substring(3,6):t:6===t.length&&"-"!==t[5]?t.substring(0,5):t}(e.target.value,p.value)}))}(),function(){const t=e("cart-checkout");if(!t)return;const a=e("cart-subtotal"),o=e("cart-products"),s=e("cart-product-template"),i=e("cart-products-none");function c(){a.innerText=`$${n.cart.reduce(((e,t)=>e+t.price*t.quantity),0).toFixed(2)}`,n.cart.length>0?t.disabled=!1:t.disabled=!0}(function e(){if(!n.cart.length)return i.style.display="block",c();i.style.display="none";const t=new DocumentFragment;return n.cart.forEach((a=>function(t,a){const o=s.content.cloneNode(!0),i=o.querySelector(".cart__product"),d=o.querySelector("a"),l=o.querySelector("img"),u=o.querySelector("p"),m=o.querySelector("span"),h=o.querySelector(".input"),p=o.querySelector("label"),v=o.querySelector("button");return d.href=`/products/${t.name.toLowerCase().split(" ").join("-")}${"fr"===r()?"-fr":""}.html`,d.addEventListener("click",(()=>n.currentItem={type:t.type,color:t.color,size:t.size})),l.src=t.images.sm_a,l.alt=`${t.name} ${t.size} ${t.color} underwear`,u.textContent=`${t.name} (${t.size})`,m.textContent="$"+t.price*t.quantity,h.value=t.quantity,h.id=t.type,h.setAttribute("name",`${t.name} ${t.size} ${t.color}`),p.setAttribute("for",t.type),h.addEventListener("input",(()=>{h.value||(h.value=1);const e=n.inv.find((e=>e.type===t.type)).quantity;Number(h.value)>e&&(h.value=e),n.cart=e=>e.map((e=>e.id===t.id?{...e,quantity:Number(h.value)}:e)),m.textContent="$"+t.price*Number(h.value),c()})),v.setAttribute("aria-label",`Remove ${t.name} size ${t.size} color ${t.color} from cart`),v.addEventListener("click",(()=>{n.cart=e=>e.filter((e=>e.id!==t.id)),i.remove(),c(),!n.cart.length&&e()})),a.appendChild(o)}(a,t))),o.appendChild(t),c()})(),t.addEventListener("click",(()=>{if(n.cart.length>0)return"fr"===r()?location.assign("/fr/la-caisse"):location.assign("/checkout")}))}(),function(){const t=e("nav"),a=e("cart-link"),s=e("cart-link-mobile"),i=e("menu-mobile-list"),c=e("menu-mobile-btn"),d={en:"cart",fr:"panier"},l=(e=>{let t=!0;return()=>(t=!t,t?(i.classList.add("hide"),void document.body.classList.remove("hide-y")):(i.classList.remove("hide"),void document.body.classList.add("hide-y")))})(),u=(()=>{const e=function*(){let e=0,t=0;for(;;)[e,t]=[t,window.scrollY],yield t-e}();let n=!1,a=!1;return o(!0,(()=>window.scrollY<100||e.next().value<=0),(e=>{n?n=!0:setTimeout((()=>{e&&a?(t.classList.add("slide-down"),t.classList.remove("slide-up"),a=!1):e||a||(t.classList.remove("slide-down"),t.classList.add("slide-up"),a=!0),n=!1}),100)}))})();function m(){if(n.cart.length>0){const e=n.cart.reduce(((e,t)=>e+t.quantity),0);a.textContent=`${d[r()]} (${e})`,s.textContent=`${d[r()]} (${e})`}else a.textContent=d[r()],s.textContent=d[r()]}m(),c.addEventListener("click",l),n.addHook((()=>m())),document.addEventListener("scroll",(()=>u()))}(),function(){const t=e("hero-image");if(!t)return;const n=e=>t.src=`/assets/img/people/hero${e}.jpg`;for(let e=0;e<6;e++)document.head.appendChild(new a("link",null,{href:`/assets/img/people/hero${e}.jpg`,rel:"prefetch",as:"image"}).render());const o=function*(e){let t=0;for(;;)5===t&&(t=0),yield++t}();n(o.next().value),setInterval((()=>{n(o.next().value)}),5e3)}(),function(){const t=e("order-id");if(!t)return;n.order||location.assign("/");const a=e("user-name"),o=e("user-email"),s=n.order;t.textContent=s.id,a.textContent=s.name.split(" ")[0],o.textContent=s.email}()})();