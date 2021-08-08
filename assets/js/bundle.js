!function(){"use strict";const t=t=>document.getElementById(t),e="https://zircus.herokuapp.com/api";class i{#notify;#notification;#modal;#state;constructor(){this.#state=JSON.parse(localStorage.getItem("state"))||{},this.#notification=null,this.#notify=null,this.#modal=null}static dispatch(t){return document.dispatchEvent(new CustomEvent(t))}#set(t,e){this.#state[t]=e,localStorage.setItem("state",JSON.stringify(this.#state))}get inv(){return this.#state.inv||[]}set inv(t){return this.#set("inv",t(this.inv)),i.dispatch("inv-updated"),this}get countries(){return this.#state.countries||[]}set countries(t){return this.#set("countries",t(this.countries)),i.dispatch("countries-updated"),this}get cart(){return this.#state.cart||[]}set cart(t){return this.#set("cart",t(this.cart)),i.dispatch("cart-updated"),this}get secret(){return this.#state.secret||null}set secret(t){return this.#set("secret",t)}get currentItem(){return this.#state.currentItem||null}set currentItem(t){return this.#set("currentItem",t)}get order(){return this.#state.order||null}set order(t){if(!this.#state.order||null==t)return this.#set("order",t)}setModal(t){return this.#modal=t,this}showModal(t){return this.#modal(t)}setNotify(t){this.#notify=t}notify(t,e,i){return this.#notify(t,e,i)}set currentNotification(t){this.#notification=t}get currentNotification(){return this.#notification}}const s=new i;class n{constructor(t,e,i){if(this.e=document.createElement(t),this.children=[],e&&Array.isArray(e)?e.forEach((t=>{this.e.classList.add(t)})):e&&"string"==typeof e&&this.e.classList.add(e),i)for(const[t,e]of Object.entries(i))this.e.setAttribute(t,e)}render(){return this.children.forEach((t=>{t instanceof n?this.e.appendChild(t.render()):this.e.textContent=t})),this.e}event(t,e){return this.e.addEventListener(t,e),this}addChild(t){return this.children.push(t),this}}function a(t){return document.head.appendChild(new n("link",null,{href:t,rel:"prefetch",as:"image"}).render())}const r=async()=>await fetch(`${e}/inv`).then((t=>t.json())).then((t=>s.inv=()=>[...t.cf,...t.pf,...t.ff])).catch((t=>{console.error("Unable to get inventory",t.message)}));function o(){let t=null;return t||document.documentElement.getAttribute("lang")}function c(t){return t[o()]}r(),setInterval(r,3e5);const d={Canada:{states:[{id:872,name:"Alberta",state_code:"AB"},{id:875,name:"British Columbia",state_code:"BC"},{id:867,name:"Manitoba",state_code:"MB"},{id:868,name:"New Brunswick",state_code:"NB"},{id:877,name:"Newfoundland and Labrador",state_code:"NL"},{id:878,name:"Northwest Territories",state_code:"NT"},{id:874,name:"Nova Scotia",state_code:"NS"},{id:876,name:"Nunavut",state_code:"NU"},{id:866,name:"Ontario",state_code:"ON"},{id:871,name:"Prince Edward Island",state_code:"PE"},{id:873,name:"Quebec",state_code:"QC"},{id:870,name:"Saskatchewan",state_code:"SK"},{id:869,name:"Yukon",state_code:"YT"}]},"United States":{states:[{id:1456,name:"Alabama",state_code:"AL"},{id:1400,name:"Alaska",state_code:"AK"},{id:1424,name:"American Samoa",state_code:"AS"},{id:1434,name:"Arizona",state_code:"AZ"},{id:1444,name:"Arkansas",state_code:"AR"},{id:1402,name:"Baker Island",state_code:"UM-81"},{id:1416,name:"California",state_code:"CA"},{id:1450,name:"Colorado",state_code:"CO"},{id:1435,name:"Connecticut",state_code:"CT"},{id:1399,name:"Delaware",state_code:"DE"},{id:1437,name:"District of Columbia",state_code:"DC"},{id:1436,name:"Florida",state_code:"FL"},{id:1455,name:"Georgia",state_code:"GA"},{id:1412,name:"Guam",state_code:"GU"},{id:1411,name:"Hawaii",state_code:"HI"},{id:1398,name:"Howland Island",state_code:"UM-84"},{id:1460,name:"Idaho",state_code:"ID"},{id:1425,name:"Illinois",state_code:"IL"},{id:1440,name:"Indiana",state_code:"IN"},{id:1459,name:"Iowa",state_code:"IA"},{id:1410,name:"Jarvis Island",state_code:"UM-86"},{id:1428,name:"Johnston Atoll",state_code:"UM-67"},{id:1406,name:"Kansas",state_code:"KS"},{id:1419,name:"Kentucky",state_code:"KY"},{id:1403,name:"Kingman Reef",state_code:"UM-89"},{id:1457,name:"Louisiana",state_code:"LA"},{id:1453,name:"Maine",state_code:"ME"},{id:1401,name:"Maryland",state_code:"MD"},{id:1433,name:"Massachusetts",state_code:"MA"},{id:1426,name:"Michigan",state_code:"MI"},{id:1438,name:"Midway Atoll",state_code:"UM-71"},{id:1420,name:"Minnesota",state_code:"MN"},{id:1430,name:"Mississippi",state_code:"MS"},{id:1451,name:"Missouri",state_code:"MO"},{id:1446,name:"Montana",state_code:"MT"},{id:1439,name:"Navassa Island",state_code:"UM-76"},{id:1408,name:"Nebraska",state_code:"NE"},{id:1458,name:"Nevada",state_code:"NV"},{id:1404,name:"New Hampshire",state_code:"NH"},{id:1417,name:"New Jersey",state_code:"NJ"},{id:1423,name:"New Mexico",state_code:"NM"},{id:1452,name:"New York",state_code:"NY"},{id:1447,name:"North Carolina",state_code:"NC"},{id:1418,name:"North Dakota",state_code:"ND"},{id:1431,name:"Northern Mariana Islands",state_code:"MP"},{id:4851,name:"Ohio",state_code:"OH"},{id:1421,name:"Oklahoma",state_code:"OK"},{id:1415,name:"Oregon",state_code:"OR"},{id:1448,name:"Palmyra Atoll",state_code:"UM-95"},{id:1422,name:"Pennsylvania",state_code:"PA"},{id:1449,name:"Puerto Rico",state_code:"PR"},{id:1461,name:"Rhode Island",state_code:"RI"},{id:1443,name:"South Carolina",state_code:"SC"},{id:1445,name:"South Dakota",state_code:"SD"},{id:1454,name:"Tennessee",state_code:"TN"},{id:1407,name:"Texas",state_code:"TX"},{id:1432,name:"United States Minor Outlying Islands",state_code:"UM"},{id:1413,name:"United States Virgin Islands",state_code:"VI"},{id:1414,name:"Utah",state_code:"UT"},{id:1409,name:"Vermont",state_code:"VT"},{id:1427,name:"Virginia",state_code:"VA"},{id:1405,name:"Wake Island",state_code:"UM-79"},{id:1462,name:"Washington",state_code:"WA"},{id:1429,name:"West Virginia",state_code:"WV"},{id:1441,name:"Wisconsin",state_code:"WI"},{id:1442,name:"Wyoming",state_code:"WY"}]}};s.countries=()=>d;const u={nav:{cartText:{en:"cart",fr:"panier"}},product:{addToCart:{en:["out of stock","add to cart"],fr:["non disponible","ajouter"]},addNotificationText:t=>({en:`Added ${t.name.en} to cart`,fr:`Ajouté des ${t.name.fr} au panier`}),stockText:t=>t>5?{en:"In stock",fr:"En stock"}:t>0?{en:`Only ${t} left!`,fr:`Il n'en reste que ${t}!`}:{en:"None available",fr:"Non disponible"}},cart:{removeNotificationText:t=>({en:`Removed ${t.name.en} from cart`,fr:`${t.name.fr} retiré du panier`}),removeBtnText:t=>({en:`Remove ${t.name.en} (size: ${t.size} quantity: ${t.quantity}) from cart`,fr:`Retirer ${t.name.fr} (taille: ${t.size} quantité: ${t.quantity}) du panier`})},checkout:{formText:{Canada:{en:["Province","Postal Code"],fr:["Province","Code postal"]},"United States":{en:["State","Zip"],fr:["État","Code postal"]}}},contactText:{en:{error:["Error","ok"],default:["Success","ok","Close modal","cancel","Cancel"],message:(t,e)=>`Thanks for your message, ${t}! We'll get back to you at ${e} as soon as possible.`},fr:{error:["Error","ok"],default:["Succès","ok","Fermer la fenêtre contextuelle","annuler","Annuler"],message:(t,e)=>`Merci pour votre message ${t}! Nous vous rappelleons à votre courriel ${e} dans les plus brefs délais.`}},redirect:{en:"Visit our site in English?",fr:"Visitez notre site en Français?"}};function l(){!function(){const e=t("nav"),i=t("menu-mobile-btn");class s extends HTMLElement{constructor(){super(),this._isHidden=!0,this.image=new n("img","product__full__img").render(),this.appendChild(this.image)}connectedCallback(){this.classList.add("full"),this.setAttribute("src","")}set isHidden(t){this._isHidden=t,this.isHidden?this.hide():this.show()}get isHidden(){return this._isHidden}show(){this.image.src=this.getAttribute("src"),this.image.alt=this.getAttribute("alt"),this.image.title=this.getAttribute("title"),this.style.display="flex",e.classList.add("hidden"),i.classList.add("hidden"),document.body.classList.add("hide-y")}hide(){this.style.display="none",e.classList.remove("hidden"),i.classList.remove("hidden"),document.body.classList.remove("hide-y")}attributeChangedCallback(t,e,i){"src"===t&&(this.isHidden=0===i.length)}static get observedAttributes(){return["src"]}}customElements.get("zircus-full-image")||customElements.define("zircus-full-image",s)}();class e extends HTMLElement{constructor(){super(),this.image=new n("img","product__img").render(),this.appendChild(this.image)}connectedCallback(){this.fullImage=this.querySelector("zircus-full-image"),this.fullImage.addEventListener("click",(()=>this.fullImage.setAttribute("src",""))),this.image.src=this.getAttribute("src"),this.image.alt=this.getAttribute("alt"),this.image.setAttribute("title",this.getAttribute("title")),this.image.addEventListener("pointerenter",(()=>this.isHovered=!0)),this.image.addEventListener("pointerleave",(()=>this.isHovered=!1)),this.image.addEventListener("click",(()=>this.fullImage.setAttribute("src",this.getAttribute("fullsrc"))))}attributeChangedCallback(t,e,i){return"alt"===t?this.image.alt=i:"title"===t?this.image.setAttribute("title",i):"src"===t?this.image.src=i:void 0}set isHovered(t){this._isHovered=t,this.isHovered?this.image.src=this.getAttribute("hovered"):this.image.src=this.getAttribute("src")}get isHovered(){return this._isHovered}static get observedAttributes(){return["src","hovered","alt","title"]}}customElements.get("zircus-product-image")||customElements.define("zircus-product-image",e)}const h=({prefix:t,color:e})=>["a-400.png","b-400.png","a-1920.jpg"].forEach((i=>a(`/assets/img/products/masked/${t}-${e}-${i}`)));function m({productTemplate:t,updateSubtotal:e=null,renderCartProducts:i=null,item:a,withActions:r=!1}){const{removeBtnText:d,removeNotificationText:l}=u.cart;const h=t.content.cloneNode(!0),m=h.querySelector(".cart__product"),p=h.querySelector("a"),f=h.querySelector("img"),g=h.querySelector("p"),y=h.querySelector("span"),_=h.querySelector(".input"),C=h.querySelector("label"),b=h.querySelector("button");return p.href=`/products/${a.name.en.toLowerCase().split(" ").join("-")}${"en"!==o()?`-${o()}`:""}.html`,p.addEventListener("click",(()=>s.currentItem={type:a.type,color:a.color,size:a.size})),p.setAttribute("title",a.name[o()]),f.src=a.images.sm_a,f.alt=`${a.name[o()]} ${a.size} ${a.color} underwear`,r?(g.textContent=`${a.name[o()]} (${a.size})`,y.textContent="$"+a.price*a.quantity,_.value=a.quantity,_.id=a.type,_.setAttribute("name",`${a.name[o()]} ${a.size} ${a.color}`),C.setAttribute("for",a.type),_.addEventListener("input",(()=>{_.value||(_.value=1);const t=s.inv.find((t=>t.type===a.type)).quantity;Number(_.value)>t&&(_.value=t),s.cart=t=>t.map((t=>t.id===a.id?{...t,quantity:Number(_.value)}:t)),y.textContent="$"+a.price*Number(_.value),b.setAttribute("title",c(d({...a,quantity:Number(_.value)}))),e()})),b.setAttribute("title",c(d(a))),b.setAttribute("aria-label",c(d(a))),b.addEventListener("click",(()=>{s.cart=t=>t.filter((t=>t.id!==a.id)),m.remove(),e(),s.notify(function(t,e){const i=new n("img","notification__image",{src:t.images.sm_a,alt:t.name[o()]}),s=new n("a","notification__text",{href:e,title:c({en:"Go to product page",fr:"Aller au page du produit"})}).addChild(c(l(t)));return{content:[i.render(),s.render()],color:"gray"}}(a,p.href)),!s.cart.length&&i()}))):g.textContent=`${a.name[o()]} (${a.size}) x ${a.quantity}`,h}const p=Stripe("pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP");const f={overnight:{name:{en:"Overnight",fr:"Expédition de nuit"},price:29.99,default:!1},standard:{name:{en:"Standard",fr:"Expédition standard"},price:9.99,default:!0},economy:{name:{en:"Economy",fr:"Expédition économique"},price:5.99,default:!1}},g=/^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/,y=/^[0-9]{5}(-[0-9]{4})?$/;function _(){const t=u.nav.cartText;return{updateCartLink(){return s.cart.length>0?this.cartLink.textContent=`${c(t)} (${s.cart.reduce(((t,e)=>t+e.quantity),0)})`:this.cartLink.textContent=c(t)}}}function C(){class t extends HTMLElement{#MIN_SCROLL=100;constructor(){super(),this._isFocused=!1,this._isThrottled=!1,this._isHidden=!1,this.nav=this.querySelector("#nav"),this.nav.classList.add("slide-down"),this.cartLink=this.querySelector("#cart-link"),this.nav.addEventListener("focusin",(()=>this.isFocused=!0)),this.nav.addEventListener("focusout",(()=>this.isFocused=!1)),document.addEventListener("scroll",(()=>{this.scrollHandler(window.scrollY<this.#MIN_SCROLL||this.scrollState.next().value<=0)})),this.updateCartLink(),document.addEventListener("cart-updated",(()=>this.updateCartLink()))}get isThrottled(){return this._isThrottled}set isThrottled(t){this._isThrottled=t}get isFocused(){return this._isFocused}set isFocused(t){this._isFocused=t,this._isFocused||window.scrollY<this.#MIN_SCROLL?this.show():this.hide()}get isHidden(){return this._isHidden}set isHidden(t){this._isHidden=t,this._isHidden?this.hide():this.show()}show(){this.nav.classList.replace("slide-up","slide-down"),this.isThrottled=!1}hide(){this.nav.classList.replace("slide-down","slide-up"),this.isThrottled=!1}scrollHandler(t){return this.isThrottled?this.isThrottled=!0:setTimeout((()=>t&&this.isHidden?this.isHidden=!1:!t&&!this.isHidden&&(this.isHidden=!0)),100)}}var e,i;Object.assign(t.prototype,_(),(e=0,i=0,{scrollState:function*(){for(;;)[e,i]=[i,window.scrollY],yield i-e}()})),customElements.get("zircus-nav-desktop")||customElements.define("zircus-nav-desktop",t)}const{contactText:b}=u;!function(){!function(){class t extends HTMLElement{constructor(){super(),this.text=new n("p",["product__inputs_stock","dot"]).render(),this.appendChild(this.text)}connectedCallback(){this.quantity=this.getAttribute("quantity")}inStock(){this.text.classList.add("in-stock"),this.text.classList.remove("out-stock")}outStock(){this.text.classList.add("out-stock"),this.text.classList.remove("in-stock")}attributeChangedCallback(t,e,i){return"text"===t?this.text.textContent=i:"quantity"===t?Number(i)>0?this.inStock():this.outStock():void 0}static get observedAttributes(){return["text"]}}customElements.get("zircus-in-stock-text")||customElements.define("zircus-in-stock-text",t)}(),l();const t=u.product.addToCart,e=u.product.addNotificationText,i=u.product.stockText;class a extends HTMLElement{connectedCallback(){this.priceText=this.querySelector("#product-price-text"),this.sizeInput=this.querySelector("#product-size"),this.imageElement=this.querySelector("zircus-product-image"),this.quantityInput=this.querySelector("#product-quantity"),this.colorInput=this.querySelector("#product-color"),this.addToCartButton=this.querySelector("#add-to-cart"),this.goToCartButton=this.querySelector("#go-to-cart"),this.goToCartButtonText=this.querySelector("#go-to-cart-qty"),this.productAccent=this.querySelector("#product-accent"),this.stockStatusText=this.querySelector("zircus-in-stock-text"),this.productPrice=this.getAttribute("price"),this._prefix=this.getAttribute("prefix"),this.defaultColor=this.getAttribute("defaultcolor"),this.currentColor=this.colorInput.value,this.item=this.currentItem;for(const t of this.colorInput.children)h({color:t.value,prefix:this._prefix}),t.value===this.defaultColor&&(t.setAttribute("selected",!0),this.productAccent.classList.add(`${t.value}-before`),this.currentColor=t.value);this.updateStatus(),this.updateCartBtnQty(),this.updateColorOptionText(),this.updateSizeOptionText(),this.colorInput.addEventListener("change",(()=>{this.updateStatus(),this.updateSizeOptionText()})),this.quantityInput.addEventListener("input",(t=>{Number(t.target.value)>this.currentItem.quantity&&(this.quantityInput.value=this.currentItem.quantity),this.setProductPriceText()})),this.quantityInput.addEventListener("blur",(t=>{const e=Number(t.target.value);e>this.currentItem.quantity&&(this.quantityInput.value=this.currentItem.quantity),e<=0&&(this.quantityInput.value=1),this.setProductPriceText()})),this.sizeInput.addEventListener("input",(()=>{this.updateStatus(),this.updateColorOptionText()})),this.addToCartButton.addEventListener("click",(()=>this.handleAddToCart())),this.goToCartButton.addEventListener("click",(()=>location.assign(c({en:"/cart",fr:"/fr/panier"})))),document.addEventListener("inv-updated",(()=>this.updateStatus())),document.addEventListener("cart-updated",(()=>this.updateCartBtnQty()))}setProductPriceText(){this.priceText.textContent=`$${Math.abs(Number(this.quantityInput.value)*Number(this.productPrice))}`}get currentItem(){return s.inv.find((t=>t.type===`${this._prefix}-${this.colorInput.value}-${this.sizeInput.value}`))}setImage(){this.currentItem&&(this.imageElement.setAttribute("src",this.currentItem.images.sm_a),this.imageElement.setAttribute("hovered",this.currentItem.images.sm_b),this.imageElement.setAttribute("fullsrc",this.currentItem.images.lg_a))}createNotificationSuccess(){return{content:[new n("img","notification__image",{src:this.currentItem.images.sm_a,alt:this.currentItem.name}).render(),new n("a","notification__text",{href:c({en:"/cart",fr:"/fr/panier"}),title:c({en:"Go to cart",fr:"Aller au panier"})}).addChild(c(e(this.currentItem))).render()]}}createNotificationFailure(){return{content:[new n("span",["notification__prefix","red"]).addChild("!").render(),new n("p",["notification__text"]).addChild(c({en:"Unable to add to cart - not enough stock",fr:"Impossible d'ajouter au panier, pas assez de stock"})).render()]}}handleAddToCart(){if(this.currentItem.quantity-Number(this.quantityInput.value)<0||!this.currentItem.quantity)return s.notify(this.createNotificationFailure());const t=s.cart.find((t=>t.type==this.currentItem.type)),e=s.inv.find((t=>t.type===this.currentItem.type));if(t){if(!(t.quantity+Number(this.quantityInput.value)<=e.quantity))return s.notify(this.createNotificationFailure());this.updateCartItem()}else this.addNewCartItem();s.notify(this.createNotificationSuccess()),this.addToCartButton.blur()}updateCartItem(){return s.cart=t=>t.map((t=>t.type===this.currentItem.type?{...t,quantity:t.quantity+Number(this.quantityInput.value)}:t))}addNewCartItem(){return s.cart=t=>t.concat({...this.currentItem,quantity:Number(this.quantityInput.value)})}updateCartBtnQty(){const t=s.cart.reduce(((t,e)=>t+e.quantity),0);this.goToCartButtonText.textContent=""+(t>0?`(${t})`:"")}outOfStock(){this.quantityInput.disabled=!0,this.addToCartButton.disabled=!0,this.addToCartButton.textContent=c(t)[0]}inStock(){this.currentItem.quantity<Number(this.quantityInput.value)&&(this.quantityInput.value=this.currentItem.quantity),this.quantityInput.disabled=!1,this.addToCartButton.disabled=!1,this.addToCartButton.textContent=c(t)[1]}updateOptionText({input:t,test:e,alt:i}){for(const n of t.children){const t=s.inv.find((t=>e({item:t,child:n}))),[a]=n.textContent.split(" - ");n.textContent=`${a} - (${i} ${t.quantity>0?c({en:"in stock",fr:"en stock"}):c({en:"out of stock",fr:"pas disponible"})})`}}updateSizeOptionText(){return this.updateOptionText({input:this.sizeInput,alt:this.colorInput.value,test:({child:t,item:e})=>e.type===`${this._prefix}-${this.colorInput.value}-${t.value}`})}updateColorOptionText(){return this.updateOptionText({input:this.colorInput,alt:this.sizeInput.value,test:({child:t,item:e})=>e.type===`${this._prefix}-${t.value}-${this.sizeInput.value}`})}updateStatus({inv:t,currentItem:e}=s){t&&(e&&(this.sizeInput.value=e.size,this.colorInput.value=e.color,s.currentItem=null),this.setImage(),this.productAccent.classList.replace(`${this.currentColor}-before`,`${this.colorInput.value}-before`),this.currentColor=this.colorInput.value,this.stockStatusText.setAttribute("quantity",this.currentItem?.quantity),this.stockStatusText.setAttribute("text",c(i(this.currentItem?.quantity))),!this.currentItem||this.currentItem.quantity<=0?this.outOfStock():this.inStock(),this.setProductPriceText())}}customElements.get("zircus-product")||customElements.define("zircus-product",a)}(),function(){const t=u.checkout.formText;!function({shippingTypes:t}){class e extends HTMLElement{connectedCallback(){this.inputsContainer=this.querySelector("#checkout-shipping-inputs"),this.container=new n("div","flex-inputs").render(),Object.entries(t).forEach((([t,e])=>{const i=new n("span",null).addChild(`${c(e.name)} - $${e.price.toFixed(2)}`).render(),s=new n("label","row",{for:`shipping-${t}`}).render(),a=new n("input",null,{type:"radio",name:"shipping",id:`shipping-${t}`}).event("input",(e=>this.inputHandler(e,t))).render();e.default&&(this.setAttribute("shipping-type",t),a.checked=!0),s.appendChild(a),s.appendChild(i),this.container.appendChild(s)})),this.inputsContainer.appendChild(this.container)}inputHandler(t,e){t.target.checked&&(this.setAttribute("shipping-type",e),this.dispatchEvent(new CustomEvent("method-changed")))}}customElements.get("zircus-shipping-inputs")||customElements.define("zircus-shipping-inputs",e)}({shippingTypes:f});class i extends HTMLElement{connectedCallback(){0===s.cart.length&&location.assign("/"),this.formName=this.querySelector("#checkout-name"),this.formEmail=this.querySelector("#checkout-email"),this.formStreetAddress=this.querySelector("#checkout-street"),this.formCity=this.querySelector("#checkout-city"),this.formState=this.querySelector("#checkout-state"),this.formStateLabel=this.querySelector("#checkout-state-text"),this.formCountry=this.querySelector("#checkout-country"),this.formZip=this.querySelector("#checkout-zip"),this.formZipLabel=this.querySelector("#checkout-zip-text"),this.formElement=this.querySelector("#checkout-form"),this.checkoutSubtotal=this.querySelector("#checkout-subtotal"),this.checkoutTax=this.querySelector("#checkout-tax"),this.checkoutTotal=this.querySelector("#checkout-total"),this.checkoutShipping=this.querySelector("#checkout-shipping"),this.shippingInputs=this.querySelector("zircus-shipping-inputs"),this.productTemplate=this.querySelector("#checkout-product-template"),this.productList=this.querySelector("#checkout-products"),this.placeOrderButton=this.querySelector("#place-order"),function(t){const{formName:i,formEmail:n,formStreetAddress:a,formCity:r,formCountry:d,formState:u,formZip:l,formElement:h,formShipping:m}=t;class f extends HTMLElement{constructor(){super(),this.style.display="none",this._isLoaded=!1,this._paymentCompleted=!1}connectedCallback(){this.classList.add("stripe-payment-form"),this.paymentPrice=this.querySelector("#stripe-payment-price"),this.resultMessage=this.querySelector("#result-message"),this._cardElement=this.querySelector("#card-element"),h.addEventListener("submit",(t=>{t.preventDefault(),this.createPaymentIntent()}))}showError(t=this.getAttribute("failure"),e){e({value:!1}),this.resultMessage.textContent=t,this.resultMessage.classList.remove("hidden"),this.resultMessage.classList.add("red"),setTimeout((()=>{this.resultMessage.classList.add("hidden"),this.resultMessage.classList.remove("red")}),4e3)}async createPaymentIntent(){const{setActive:t}=s.showModal({content:this,heading:this.getAttribute("heading"),ok:{action:t=>this.payWithCard(t),text:this.getAttribute("buttontext")},cancel:{action:({close:t,clear:e})=>{s.cart.length||location.assign(c({en:"/thanks",fr:"/fr/merci"})),t(),this._paymentCompleted&&e()},text:this.getAttribute("canceltext")}});this.style.display="flex",t({value:!1,spinning:!0});const h={lang:o(),update:s.secret,name:i.value,email:n.value,streetAddress:a.value,city:r.value,country:d.value,state:u.value,zip:l.value,shippingMethod:m.getAttribute("shipping-type"),items:s.cart.map((t=>({images:t.images,type:t.type,prefix:t.prefix,size:t.size,name:t.name,color:t.color,quantity:t.quantity})))};fetch(`${e}/orders/create-payment-intent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h)}).then((t=>t.json())).then((e=>{if(s.secret=e.clientSecret,s.order={id:e.id,name:e.name,email:e.email},e.error)return this.showError(e.error,t);this.paymentPrice.textContent=`Calculated total: $${e.total.toFixed(2)}`,this.loadStripe(e,t)}))}loadStripe(t,e){if(e({value:!1}),this._isLoaded)return;const i=p.elements().create("card",{style:{base:{color:"#211b22",fontFamily:"Nunito, sans-serif",fontSmoothing:"antialiased",fontSize:"16px","::placeholder":{color:"#8b808f"}},invalid:{fontFamily:"Nunito, sans-serif",color:"#8f3342",iconColor:"#8f3342"}}});i.mount("#card-element"),i.on("change",(t=>{e({value:!t.empty}),t.error?.message&&this.showError(t.error.message,e)})),this._card=i,this._secret=t.clientSecret,this._isLoaded=!0}payWithCard({setActive:t,setCustomClose:e}){t({value:!1,spinning:!0}),p.confirmCardPayment(this._secret,{payment_method:{card:this._card}}).then((i=>i.error?this.showError(i.error.message,t):this.orderComplete({setActive:t,setCustomClose:e})))}orderComplete({setActive:t,setCustomClose:e}){this._paymentCompleted=!0,t({value:!1,spinning:!1}),s.cart=()=>[],s.secret=null,e({text:c({en:"finish",fr:"complétez"}),title:c({en:"finish",fr:"complétez"})}),this.resultMessage.textContent=this.getAttribute("success"),this.resultMessage.classList.remove("hidden")}}customElements.get("zircus-stripe")||customElements.define("zircus-stripe",f)}({formName:this.formName,formEmail:this.formEmail,formStreetAddress:this.formStreetAddress,formCity:this.formCity,formState:this.formState,formCountry:this.formCountry,formZip:this.formZip,formShipping:this.shippingInputs,formElement:this.formElement}),this.setTotals(),this.renderCartItems(),this.populateSelects(this.formCountry,Object.keys(s.countries),(t=>t)),this.handleCountry(),this.formCountry.addEventListener("input",(()=>this.handleCountry())),this.formState.addEventListener("input",(()=>this.setTotals())),this.formZip.addEventListener("input",(t=>{t.target.value=this.normalizeZip(t.target.value,this.formCountry.value)})),this.shippingInputs.addEventListener("method-changed",(()=>this.setTotals()))}setTotals(){const t=Number(f[this.shippingInputs.getAttribute("shipping-type")].price),e=s.cart.reduce(((t,e)=>t+e.price*e.quantity),0),i=(e+t)*((t,e)=>{if("Canada"!==t)return.05;switch(e){case"New Brunswick":case"Newfoundland and Labrador":case"Nova Scotia":case"Prince Edward Island":return.15;case"Ontario":return.13;default:return.05}})(this.formCountry.value,this.formState.value),n=e+i;this.checkoutSubtotal.textContent=`$${e.toFixed(2)}`,this.checkoutShipping.textContent=`$${t.toFixed(2)}`,this.checkoutTax.textContent=`$${i.toFixed(2)}`,this.checkoutTotal.textContent=`$${n.toFixed(2)}`}renderCartItems(){const t=new DocumentFragment;s.cart.forEach((e=>t.appendChild(m({item:e,productTemplate:this.productTemplate})))),this.productList.appendChild(t)}populateSelects(t,e=[],i){t.textContent="",e.forEach((e=>{t.appendChild(new n("option",null,{value:i(e)}).addChild(i(e)).render())}))}handleCountry(){const e=this.formCountry.value;this.formState.textContent="",this.formZip.value="",this.populateSelects(this.formState,s.countries[e].states,(t=>t.name)),this.formStateLabel.textContent=t[e][o()][0],this.formZipLabel.textContent=t[e][o()][1],this.formZip.setAttribute("pattern","Canada"===e?g.source:y.source),this.formZip.setAttribute("maxlength","Canada"===e?"7":"10"),this.formZip.setAttribute("size","Canada"===e?"7":"10"),this.setTotals()}normalizeZip(t){return t=t.toUpperCase(),"Canada"===this.formCountry.value?6===t.length&&g.test(t)?t.substring(0,3)+" "+t.substring(3,6):t:6===t.length&&"-"!==t[5]?t.substring(0,5):t}}customElements.get("zircus-payment")||customElements.define("zircus-payment",i)}(),function(){class t extends HTMLElement{connectedCallback(){this.checkoutButton=this.querySelector("#cart-checkout"),this.subtotalText=this.querySelector("#cart-subtotal"),this.cartProductsList=this.querySelector("#cart-products"),this.productTemplate=this.querySelector("#cart-product-template"),this.emptyCartPlaceholder=this.querySelector("#cart-products-none"),this.renderCartProducts(),this.checkoutButton.addEventListener("click",(()=>{s.cart.length>0&&location.assign(c({en:"/checkout",fr:"/fr/la-caisse"}))}))}enableButtons(){return s.cart.length>0?this.checkoutButton.disabled=!1:this.checkoutButton.disabled=!0}updateSubtotal(){this.subtotalText.textContent=`$${s.cart.reduce(((t,e)=>t+e.price*e.quantity),0).toFixed(2)}`,this.enableButtons()}renderCartProducts(){if(!s.cart.length)return this.emptyCartPlaceholder.style.display="block",this.updateSubtotal();this.emptyCartPlaceholder.style.display="none";const t=new DocumentFragment;return s.cart.forEach((e=>t.appendChild(m({item:e,productTemplate:this.productTemplate,updateSubtotal:()=>this.updateSubtotal(),renderCartProducts:()=>this.renderCartProducts(),withActions:!0})))),this.cartProductsList.appendChild(t),this.updateSubtotal()}}customElements.get("zircus-cart")||customElements.define("zircus-cart",t)}(),C(),function(){class t extends HTMLElement{constructor(){super(),this.button=new n("button",["skip-to-content","small-spaced-bold"],{title:this.getAttribute("text")}).addChild(this.getAttribute("text")).event("click",this.focusMainContent).render(),this.appendChild(this.button)}focusMainContent(){document.getElementById("main-content").focus()}}customElements.get("zircus-skip-to-content")||customElements.define("zircus-skip-to-content",t)}(),function(){class t extends HTMLElement{constructor(){super(),this._isHidden=!0}connectedCallback(){this.classList.add("nav_mobile"),this.cartLink=this.querySelector("#cart-link-mobile"),this.list=this.querySelector("#menu-mobile-list"),this.button=this.querySelector("#menu-mobile-btn"),this.list.addEventListener("click",(()=>this.isHidden=!0)),this.button.addEventListener("click",(()=>this.isHidden=!this.isHidden)),this.updateCartLink(),document.addEventListener("cart-updated",(()=>this.updateCartLink()))}get isHidden(){return this._isHidden}set isHidden(t){this._isHidden=t,this.isHidden?this.hide():this.show()}hide(){this.list.classList.add("hide"),document.body.classList.remove("hide-y")}show(){this.list.classList.remove("hide"),document.body.classList.add("hide-y")}}Object.assign(t.prototype,_()),customElements.get("zircus-nav-mobile")||customElements.define("zircus-nav-mobile",t)}(),function(){class t extends HTMLElement{#MIN_SCROLL=400;constructor(){super(),this.button=this.querySelector("#to-top-button"),this._isHidden=!0,this._isThrottled=!1}connectedCallback(){this.button.addEventListener("click",(()=>{window.scroll({top:0}),this.button.blur()})),document.addEventListener("scroll",(()=>this.scrollHandler(window.scrollY>this.#MIN_SCROLL)))}get isHidden(){return this._isHidden}set isHidden(t){this._isHidden=t,this._isHidden?this.hide():this.show()}show(){this.button.classList.add("show"),this._isThrottled=!1}hide(){this.button.classList.remove("show"),this._isThrottled=!1}scrollHandler(t){this._isThrottled?this._isThrottled=!0:setTimeout((()=>t&&this.isHidden?this.isHidden=!1:!t&&!this.isHidden&&(this.isHidden=!0)),100)}}customElements.get("zircus-to-top-button")||customElements.define("zircus-to-top-button",t)}(),(()=>{class t extends HTMLElement{constructor(){super(),this._images=new Array(Number(this.getAttribute("num-images"))+1).fill("").map(((t,e)=>`${this.getAttribute("image-path")}${e}.jpg`)),this._images.forEach((t=>a(t))),this._currentImage=1,this._imageEl=new n("img","section__hero_image",{src:this._images[this._currentImage],alt:this.getAttribute("alt"),title:this.getAttribute("title")}).render(),this._roundedBottom=new n("div",["bg-light","rounded-big-top","absolute","b-0","l-0"]).render(),this.appendChild(this._imageEl),this.appendChild(this._roundedBottom),this.classList.add("section__hero"),setInterval((()=>{this._imageEl.src=this._images[this.getCurrentImage()]}),4500)}getCurrentImage(){return this._currentImage===this._images.length-1?this._currentImage=1:++this._currentImage}}customElements.get("zircus-hero-image")||customElements.define("zircus-hero-image",t)})(),function(){const e=t("order-id");if(!e)return;s.order||location.assign("/");const i=t("user-name"),n=t("user-email"),a=s.order;e.textContent=a.id,i.textContent=a.name.split(" ")[0],n.textContent=a.email}(),function(){class t extends HTMLElement{connectedCallback(){this._form=this.querySelector("#contact-form"),this._nameInput=this.querySelector("#contact-name"),this._emailInput=this.querySelector("#contact-email"),this._sendButton=this.querySelector("#contact-button"),this._messageText=this.querySelector("#contact-message");const t=[this._nameInput,this._emailInput,this._sendButton,this._messageText];this._form.addEventListener("submit",(i=>{i.preventDefault();const n={name:this._nameInput.value,email:this._emailInput.value,message:this._messageText.value};t.forEach((t=>{t.value="",t.disabled=!0})),fetch(`${e}/message`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then((t=>t.json())).then((t=>{return t.error?(e=t.error,s.showModal({heading:b[o()].error[0],content:e,ok:{text:b[o()].error[1],title:b[o()].error[2],action:({close:t})=>t()}})):(t=>s.showModal({heading:b[o()].default[0],content:b[o()].message(t.name,t.email),ok:{text:b[o()].default[1],title:b[o()].default[2],action:({close:t})=>t()}}))(t);var e})).then((()=>t.forEach((t=>t.disabled=!1)))).catch((t=>console.log(t)))}))}}customElements.get("zircus-contact-form")||customElements.define("zircus-contact-form",t)}(),function(){const e=t("blur"),i=t("nav");class a extends HTMLElement{constructor(){super(),this._active=!1,this._isClear=!0}connectedCallback(){this._heading=this.querySelector("#modal-heading"),this._content=this.querySelector("#modal-content"),this._ok=this.querySelector("#modal-ok"),this._okText=this.querySelector("#modal-button-text"),this._cancel=this.querySelector("#modal-cancel"),this._spinner=this.querySelector("#modal-spinner"),s.setModal((t=>(this.show(t),this.isClear=!1,{setActive:t=>this.active=t,close:()=>this.hide(),clear:()=>this.clear()})))}set isClear(t){this._isClear=t}get isClear(){return this._isClear}set active({value:t,spinning:e=!1}){this._active=t,e?(this._okText.classList.add("hidden"),this._spinner.classList.remove("hidden")):e||(this._okText.classList.remove("hidden"),this._spinner.classList.add("hidden")),this.active?this._ok.disabled=!1:this._ok.disabled=!0}get active(){return this._active}clear(){this._heading.textContent="",this._content.textContent="",this._okText.textContent="",this._cancel.textContent="",s.modal=null}hide(){e.classList.remove("blur"),i.classList.remove("blur"),document.body.classList.remove("hide-y"),this.classList.add("hidden")}show({content:t,ok:s,heading:a,cancel:r}){e.classList.add("blur"),i.classList.add("blur"),document.body.classList.add("hide-y"),this.classList.remove("hidden"),this.isClear&&(this._heading.textContent=a,"string"==typeof t?this._content.appendChild(new n("p","modal__text").addChild(t).render()):t instanceof HTMLElement&&this._content.appendChild(t),this._okText.textContent=s.text,this._ok.setAttribute("title",s.title),this._ok.addEventListener("click",(()=>{s.action({setActive:t=>this.active=t,close:()=>this.hide(),clear:()=>this.clear(),setCustomClose:t=>{this._cancel.textContent=t.text,this._cancel.setAttribute("title",t.title)}})})),r?(this._cancel.classList.remove("hidden"),this._cancel.textContent=r.text,this._cancel.setAttribute("title",r.title),this._cancel.addEventListener("click",(()=>{r.action({setActive:t=>this.active=t,close:()=>this.hide(),clear:()=>this.clear(),setCustomClose:t=>this._cancel.textContent=t})})),this._cancel.focus()):(this._ok.focus(),this._cancel.classList.add("hidden")))}attributeChangedCallback(t,e,i){"show"===t&&"true"===i&&this.show(s.modal)}static get observedAttributes(){return["show"]}}customElements.get("zircus-modal")||customElements.define("zircus-modal",a)}(),function(){class t extends HTMLElement{constructor(){super(),this._isHidden=!0,this.notificationElement=this.querySelector("#notification"),this.notificationContent=this.querySelector("#notification-content"),this.closeButton=this.querySelector("#notification-close"),this.closeButton.addEventListener("click",(()=>{this.setAttribute("show",!1)}))}connectedCallback(){s.setNotify((({content:t,time:e=4e3})=>{s.currentNotification&&clearTimeout(s.currentNotification.id),s.currentNotification={content:t,id:setTimeout((()=>this.setAttribute("show",!1)),e)},this.setAttribute("show",!0),this.addEventListener("mouseenter",(()=>clearTimeout(s.currentNotification.id))),this.addEventListener("mouseleave",(()=>setTimeout((()=>this.setAttribute("show",!1)),e-e/2)))}))}attributeChangedCallback(t,e,i){"show"===t&&(this.isHidden="false"===i)}get isHidden(){return this._isHidden}set isHidden(t){this._isHidden=t,this._isHidden?this.hide():this.show()}clear(){this.notificationContent.textContent=""}show(){this.clear(),"string"==typeof s.currentNotification.content?this.notificationContent.appendChild(new n("p","notification__text").addChild(s.currentNotification.content).render()):Array.isArray(s.currentNotification.content)?s.currentNotification.content.forEach((t=>this.notificationContent.append(t))):this.notificationContent.textContent=s.currentNotification.content,this.notificationElement.classList.remove("hidden")}hide(){s.currentNotification&&clearTimeout(s.currentNotification.id),this.notificationElement.classList.add("hidden"),s.currentNotification=null}static get observedAttributes(){return["show"]}}customElements.get("zircus-notification")||customElements.define("zircus-notification",t)}(),function(){class t extends HTMLElement{connectedCallback(){this.tagLines=this.getAttribute("taglines").split("|");const t=new n("h1","home__heading");t.addChild(new n("span").addChild(this.tagLines[Math.floor(Math.random()*this.tagLines.length)])),t.addChild(new n("span","teal").addChild(".")),this.classList.add("home__heading_container"),this.appendChild(t.render())}}customElements.get("zircus-tag-line")||customElements.define("zircus-tag-line",t)}(),function(){const t=navigator.language,e=location.pathname.includes(`/${t}`),i=!!localStorage.getItem("notified");!/^fr\b/.test(t)||e||i||(t=>{const e=u.redirect[t],i=new n("a","notification__text",{href:`/${t}`,title:e}).addChild(e),a=new n("span",["notification__prefix","green"]).addChild("?");s.notify({color:"gray",time:8e3,content:[a.render(),i.render()]}),localStorage.setItem("notified",JSON.stringify(!0))})("fr")}()}();
