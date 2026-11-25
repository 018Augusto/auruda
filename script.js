(() => {
  "use strict";
  const feed = document.getElementById("feed");
  const scenes = [...document.querySelectorAll(".scene")];
  const dots = [...document.querySelectorAll("#progressDots span")];
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  const like = document.getElementById("likeBtn");
  const save = document.getElementById("saveBtn");
  const toast = document.getElementById("toast");
  let current = 0, toastTimer;
  const showToast = (message) => {
    toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  };
  const goTo = (index) => {
    current = Math.max(0, Math.min(scenes.length - 1, index));
    scenes[current].scrollIntoView({behavior:"smooth", block:"start"});
    updateProgress();
  };
  const updateProgress = () => {
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    prev.disabled = current === 0; next.disabled = current === scenes.length - 1;
    document.querySelector(".scroll-guide span:last-child")?.replaceChildren(document.createTextNode(String(current + 1).padStart(2,"0") + " — 05"));
  };
  prev.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));
  document.getElementById("restartBtn").addEventListener("click", () => goTo(0));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > .55) {
        current = scenes.indexOf(entry.target); updateProgress();
      }
    });
  }, {root:feed, threshold:[.55,.75]});
  scenes.forEach(scene => observer.observe(scene));
  like.addEventListener("click", () => {
    const active = like.classList.toggle("liked");
    like.querySelector(".action-heart").textContent = active ? "♥" : "♡";
    document.getElementById("likeLabel").textContent = active ? "curtido" : "curtir";
    showToast(active ? "Um carinho registrado ♡" : "Curtida desfeita");
  });
  save.addEventListener("click", () => {
    const active = save.classList.toggle("saved");
    document.getElementById("saveLabel").textContent = active ? "guardado" : "guardar";
    showToast(active ? "Essa lembrança ficou guardada ✦" : "Removido dos guardados");
  });
  document.getElementById("shareBtn").addEventListener("click", async () => {
    const shareData = {title:"Para Maria Clara ♡", text:"Fiz esse cantinho para você.", url:location.href};
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(location.href); showToast("Link copiado para compartilhar!"); }
      else showToast("Copie o endereço do site para compartilhar.");
    } catch (error) { if (error.name !== "AbortError") showToast("Não foi possível compartilhar agora."); }
  });
  // Navegação por teclado no computador.
  document.addEventListener("keydown", event => {
    if (["ArrowDown","PageDown"].includes(event.key)) { event.preventDefault(); goTo(current + 1); }
    if (["ArrowUp","PageUp"].includes(event.key)) { event.preventDefault(); goTo(current - 1); }
  });
  // O botão de som é um indicador visual: o projeto não inicia música automaticamente.
  const soundToggle = document.getElementById("soundToggle");
  soundToggle.addEventListener("click", () => {
    const on = soundToggle.dataset.on !== "true";
    soundToggle.dataset.on = String(on);
    soundToggle.querySelector("span").textContent = on ? "som: efeitos" : "som: off";
    showToast(on ? "Efeitos sonoros podem ser adicionados depois ♫" : "Som desativado");
  });
  updateProgress();
})();