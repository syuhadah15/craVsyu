const categoryData = {
  "Cakes":[["Chocolate Cake","cake-chocolate.jpg"],["Red Velvet Cake","cake-red-velvet.jpg"],["Lotus Biscoff Cake","cake-lotus-biscoff.jpg"]],
  "Cookies":[["Chocolate Chip Cookies","cookie-chocolate-chip.jpg"],["White Chocolate Matcha Cookies","cookie-matcha.jpg"],["Red Velvet Cookies","cookie-red-velvet.jpg"]],
  "Cupcakes":[["Red Velvet Cupcake","cupcake-red-velvet.jpg"],["Chocolate Cupcake","cupcake-chocolate.jpg"],["Blueberry Cupcake","cupcake-blueberry.jpg"]],
  "Brownies & Bars":[["Fudgy Brownies","brownie-fudgy.jpg"],["Strawberry Brownies","brownie-strawberry.jpg"],["Matcha Brownies","brownie-matcha.jpg"]],
  "Pies & Tarts":[["Fruit Tart","tart-fruit.jpg"],["Mini Fruit Tarts","tart-mini-fruit.jpg"],["Chocolate Tart","tart-chocolate.jpg"]]
};

const recipeVideos=[
  ["Easy Chocolate Cake","https://vt.tiktok.com/ZSb5RR7FD/"],
  ["Strawberry Cheesecake","https://vt.tiktok.com/ZSb5RyuuU/"],
  ["Red Velvet Cupcake","https://vt.tiktok.com/ZSb5RayV5/"],
  ["Fudgy Brownies","https://vt.tiktok.com/ZSb5RAUL5/"],
  ["Chocolate Chip Cookies","https://vt.tiktok.com/ZSb5RxHAJ/"],
  ["Fruit Tart","https://vt.tiktok.com/ZSb5Rmjhd/"]
];

const galleryMoments=[
  ["Baking Moment 1","https://vt.tiktok.com/ZSbafrM6o/"],
  ["Baking Moment 2","https://vt.tiktok.com/ZSbaf19xc/"],
  ["Baking Moment 3","https://vt.tiktok.com/ZSbafjgeB/"]
];

const bakingTips=[
  ["Measure Ingredients Accurately","Use measuring cups and a digital scale for better and more consistent baking results.","https://vt.tiktok.com/ZSbmR6xyL/"],
  ["Preheat Your Oven","Always preheat your oven to the correct temperature before baking for more even results.","https://vt.tiktok.com/ZSbmRgy27/"],
  ["Let Cakes Cool Before Decorating","Allow cakes to cool completely before decorating so the frosting stays in place and the texture is better.","https://vt.tiktok.com/ZSbm8RdNg/"]
];

function dessertCard(item){return `<article class="card"><div class="card-img"><img src="images/${item[1]}" alt="${item[0]}"></div><div class="card-body"><h3>${item[0]}</h3></div></article>`}
function renderDesserts(category="Cakes"){
 const grid=document.querySelector("#dessertGrid");if(!grid)return;
 grid.innerHTML=(categoryData[category]||categoryData.Cakes).map(dessertCard).join("");
 document.querySelectorAll(".category-btn").forEach(b=>b.classList.toggle("active",b.dataset.category===category));
 const heading=document.querySelector("#dessertHeading"),crumb=document.querySelector("#dessertCrumb");
 if(heading)heading.innerHTML=category+" <span class='heart'>♡</span>";
 if(crumb)crumb.textContent=`Desserts  >  ${category}`;
}
function initDesserts(){
 if(!document.querySelector("#dessertGrid"))return;
 document.querySelectorAll(".category-btn").forEach(b=>b.addEventListener("click",()=>renderDesserts(b.dataset.category)));
 const requested=new URLSearchParams(location.search).get("category");
 renderDesserts(categoryData[requested]?requested:"Cakes");
 const sort=document.querySelector("#sortDesserts");
 if(sort)sort.addEventListener("change",()=>{const cards=[...document.querySelectorAll("#dessertGrid .card")];cards.sort((a,b)=>{const aa=a.querySelector("h3").textContent,bb=b.querySelector("h3").textContent;return sort.value==="za"?bb.localeCompare(aa):aa.localeCompare(bb)});cards.forEach(c=>document.querySelector("#dessertGrid").appendChild(c))});
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));}
function videoShell(title,url,extraClass=""){
 return `<article class="video-card vertical-video-card ${extraClass}"><div class="video-title">${escapeHtml(title)}</div><div class="video-frame" data-tiktok-url="${escapeHtml(url)}" data-video-title="${escapeHtml(title)}"><div class="video-loading"><span class="placeholder-play">▶</span><small>Loading TikTok video…</small></div></div></article>`;
}
function initTikTokFrames(){
 document.querySelectorAll(".video-frame[data-tiktok-url]").forEach(async frame=>{
   const url=frame.dataset.tiktokUrl;
   try{
     const res=await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
     if(!res.ok)throw new Error("TikTok oEmbed unavailable");
     const data=await res.json();
     const match=String(data.html||"").match(/data-video-id=["'](\d+)["']/i);
     const id=match?match[1]:null;
     if(id){
       frame.innerHTML=`<iframe src="https://www.tiktok.com/player/v1/${id}?autoplay=1&loop=1&controls=1&description=0&music_info=0&rel=0&fullscreen_button=1&muted=1" title="TikTok video" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe><a class="platform" href="${url}" target="_blank" rel="noopener">TikTok</a>`;
     }else throw new Error("No TikTok video ID");
   }catch(e){
     frame.innerHTML=`<div class="video-fallback"><span class="placeholder-play">▶</span><strong>TikTok Video</strong><small>Open the video on TikTok</small><a class="btn" href="${url}" target="_blank" rel="noopener">Open TikTok</a></div>`;
   }
 });
}
function initVideos(){
 const recipe=document.querySelector("#recipeVideos");if(recipe)recipe.innerHTML=recipeVideos.map(v=>videoShell(v[0],v[1])).join("");
 const gallery=document.querySelector("#galleryMoments");if(gallery)gallery.innerHTML=galleryMoments.map(v=>videoShell(v[0],v[1])).join("");
 const baking=document.querySelector("#bakingTipsList");
 if(baking)baking.innerHTML=bakingTips.map(v=>`<article class="tip-video-row"><div class="tip-copy"><h2>${escapeHtml(v[0])}</h2><p>${escapeHtml(v[1])}</p></div><div class="tip-video">${videoShell(v[0],v[2],"tip-video-card")}</div></article>`).join("");
 initTikTokFrames();
}
function initGallery(){
 const tabs=document.querySelectorAll(".tab"),photos=document.querySelector("#dessertPhotos"),moments=document.querySelector("#bakingMoments");if(!tabs.length)return;
 function show(x){photos.classList.toggle("hidden",x!=="photos");moments.classList.toggle("hidden",x!=="moments");tabs.forEach(t=>t.classList.toggle("active",t.dataset.tab===x))}
 tabs.forEach(t=>t.addEventListener("click",()=>show(t.dataset.tab)));show("photos");
}
function initSearch(){
 const b=document.querySelector("#searchBtn"),w=document.querySelector("#searchWrap");if(b&&w)b.addEventListener("click",()=>{w.classList.toggle("show");if(w.classList.contains("show"))w.querySelector("input").focus()});
 const i=document.querySelector("#siteSearch");if(i)i.addEventListener("input",()=>{const q=i.value.toLowerCase();document.querySelectorAll("#dessertGrid .card").forEach(c=>c.classList.toggle("hidden",!c.innerText.toLowerCase().includes(q)))
 });
}
function initContact(){const f=document.querySelector("#contactForm"),m=document.querySelector("#formMsg");if(f)f.addEventListener("submit",e=>{e.preventDefault();m.textContent="Thank you! Your message has been prepared successfully. ♡";f.reset()})}
document.addEventListener("DOMContentLoaded",()=>{initDesserts();initVideos();initGallery();initSearch();initContact()});


function initMobileMenu(){
 const toggle=document.querySelector("#menuToggle");
 const menu=document.querySelector("#mobileMenu");
 if(!toggle||!menu)return;
 toggle.addEventListener("click",()=>{
   const open=menu.classList.toggle("open");
   toggle.setAttribute("aria-expanded",String(open));
   toggle.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu");
   toggle.textContent=open?"✕":"☰";
 });
 menu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
   menu.classList.remove("open");
   toggle.setAttribute("aria-expanded","false");
   toggle.setAttribute("aria-label","Open navigation menu");
   toggle.textContent="☰";
 }));
}
document.addEventListener("DOMContentLoaded",initMobileMenu);
