/* AAMINAHSPACE app - hash router + interactions (vanilla, component-style)
   NOTE: index.html contains an inlined copy of this file for reliable preview
   (external src/ scripts can stall behind slow CDN fetches and some in-app
   browsers can't preview unsaved src/ files). Keep the two in sync. */
(function(){
  if(window.__aaminahBooted) return; window.__aaminahBooted = true;
  const routes = ["home","about","services","work","contact","case-brand","case-launch","case-undercover"];
  const titles = {
    home:"AAMINAHSPACE - Brand & Content Strategist",
    about:"About - Aaminah Khan | AAMINAHSPACE",
    services:"Services - Brand & Content Strategy | AAMINAHSPACE",
    work:"Experience and CV | AAMINAHSPACE",
    contact:"Contact - Let's Work Together | AAMINAHSPACE",
    "case-brand":"Case Study - AaminahSpace Brand Feed | AAMINAHSPACE",
    "case-launch":"Case Study - Product Launch Strategy | AAMINAHSPACE",
    "case-undercover":"Case Study - Undercover Sisters | AAMINAHSPACE"
  };

  function currentRoute(){
    const h = (location.hash||"#/home").replace("#/","").replace("#","").split("?")[0];
    return routes.includes(h) ? h : "home";
  }

  function show(route){
    document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active", p.dataset.page===route));
    document.querySelectorAll("[data-nav]").forEach(a=>{
      const r = a.getAttribute("href").replace("#/","");
      a.classList.toggle("active", r===route || (route.startsWith("case-") && r==="work"));
    });
    document.title = titles[route] || titles.home;
    const mm = document.getElementById("mobileMenu");
    if(mm) mm.classList.remove("open");
    window.scrollTo({top:0, behavior:"instant" in window ? "instant" : "auto"});
    // retrigger reveals
    requestAnimationFrame(observeReveals);
    if(window.lucide) window.lucide.createIcons();
  }

  function observeReveals(){
    const els = document.querySelectorAll(".reveal:not(.in)");
    if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
    },{threshold:.12});
    els.forEach(e=>io.observe(e));
  }

  // Contact form: prefill from service inquiry links
  function prefillFromHash(){
    const m = (location.hash||"").match(/service=([^&]+)/);
    if(!m) return;
    const sel = document.getElementById("supportType");
    if(sel){
      const val = decodeURIComponent(m[1]);
      [...sel.options].forEach(o=>{ if(o.value===val) sel.value=val; });
    }
  }

  function initContactForm(){
    const form = document.getElementById("contactForm");
    if(!form || form.dataset.bound) return;
    form.dataset.bound = "1";
    form.addEventListener("submit", e=>{
      e.preventDefault();
      let ok = true;
      const need = [
        ["cName", v=>v.trim().length>=2, "Please enter your name."],
        ["cEmail", v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid email."],
        ["cMessage", v=>v.trim().length>=10, "Please tell me a little more (10+ characters)."]
      ];
      need.forEach(([id, test])=>{
        const input = document.getElementById(id);
        const field = input.closest(".field");
        const valid = test(input.value||"");
        field.classList.toggle("invalid", !valid);
        if(!valid) ok=false;
      });
      if(!ok){
        const firstBad = form.querySelector(".field.invalid input,.field.invalid textarea");
        if(firstBad) firstBad.focus();
        return;
      }
      const name = document.getElementById("cName").value.trim();
      const email = document.getElementById("cEmail").value.trim();
      const brand = document.getElementById("cBrand").value.trim();
      const type = document.getElementById("supportType").value;
      const msg = document.getElementById("cMessage").value.trim();
      // Working integration: opens the visitor's email client addressed to Aaminah.
      // To use Formspree/Netlify instead, see src/README.md and replace this block with a fetch() POST.
      const subject = encodeURIComponent(`Website inquiry - ${name} (${type||"general"})`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBrand: ${brand}\nSupport: ${type}\n\n${msg}`);
      window.location.href = `mailto:khanaaminah3@gmail.com?subject=${subject}&body=${body}`;
      document.getElementById("formSuccess").classList.add("show");
      document.getElementById("successName").textContent = ", " + name;
      form.querySelectorAll("input,textarea").forEach(i=>{ if(i.id!=="supportType") i.value=""; });
    });
    // live clear errors
    form.addEventListener("input", e=>{
      const f = e.target.closest(".field");
      if(f) f.classList.remove("invalid");
    });
  }

  function initFilters(){
    const btns = document.querySelectorAll(".filter-btn");
    if(!btns.length) return;
    btns.forEach(b=>b.addEventListener("click", ()=>{
      btns.forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      const f = b.dataset.filter;
      document.querySelectorAll(".p-card").forEach(c=>{
        c.style.display = (f==="all" || c.dataset.cat===f) ? "" : "none";
      });
    }));
  }

  function initMenu(){
    const btn = document.getElementById("menuBtn");
    const mm = document.getElementById("mobileMenu");
    if(btn && mm && !btn.dataset.bound){
      btn.dataset.bound="1";
      btn.addEventListener("click", ()=>{ mm.classList.toggle("open"); const open = mm.classList.contains("open"); btn.setAttribute("aria-expanded", open ? "true" : "false"); btn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); });
    }
  }

  function initYear(){ const y=document.getElementById("year"); if(y) y.textContent=new Date().getFullYear(); }

  function initAlive(){
    const loader = document.getElementById("loader");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(loader){ setTimeout(()=>loader.classList.add("done"), reduce ? 50 : 850); }
    const clock = document.getElementById("clockEl");
    if(clock && !clock.dataset.bound){
      clock.dataset.bound = "1";
      const tick = ()=>{
        try{ clock.textContent = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Karachi"}); }
        catch(e){ clock.textContent = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}); }
      };
      tick(); setInterval(tick, 20000);
    }
    if(!reduce){
      const rot = document.getElementById("rotWord");
      if(rot && !rot.dataset.bound){
        rot.dataset.bound = "1";
        const words = ["home.", "calm.", "clear.", "human.", "you."];
        let i = 0;
        setInterval(()=>{
          i = (i + 1) % words.length;
          rot.classList.add("swap");
          setTimeout(()=>{ rot.textContent = words[i]; rot.classList.remove("swap"); }, 300);
        }, 2200);
      }
    }
    const quizBtns = document.querySelectorAll("[data-quiz]");
    const out = document.getElementById("quizResult");
    if(quizBtns.length && out && !quizBtns[0].dataset.bound){
      const answers = {
        makeover: 'You need the <a href="#/contact?service=makeover">feed makeover</a>. Same brand, better dressed.',
        launch: 'You need the <a href="#/contact?service=launch">launch plan</a>. Buzz first, sales after.',
        audit: 'You need the <a href="#/contact?service=audit">audit</a>. I will find the leak.'
      };
      quizBtns.forEach(b=>{
        b.dataset.bound = "1";
        b.addEventListener("click", ()=>{
          quizBtns.forEach(x=>x.classList.remove("picked"));
          b.classList.add("picked");
          out.innerHTML = answers[b.dataset.quiz] || "";
        });
      });
    }
  }

  window.addEventListener("hashchange", ()=>{ show(currentRoute()); prefillFromHash(); });
  function boot(){
    initMenu(); initContactForm(); initFilters(); initYear(); initAlive();
    show(currentRoute()); prefillFromHash(); observeReveals();
    if(window.lucide) try{ window.lucide.createIcons(); }catch(e){}
  }
  if(document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
