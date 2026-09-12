(() => {
  const btn = document.querySelector(".menu-btn");
  const menu = document.getElementById("mobilus-meniu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.setAttribute("aria-label", open ? "Atidaryti meniu" : "Uždaryti meniu");
      menu.hidden = open;
    });
  }

  const paths = document.getElementById("paths");
  const cta = document.getElementById("path-cta");
  if (paths && cta) {
    paths.addEventListener("click", (e) => {
      const b = e.target.closest("[data-path]");
      if (!b) return;
      paths.querySelectorAll(".path").forEach((el) => el.classList.toggle("is-on", el === b));
      cta.setAttribute("href", b.dataset.href);
      cta.innerHTML = b.dataset.cta + ' <svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    });
  }

  const form = document.getElementById("uzklausa");
  const ok = document.getElementById("cf-ok");
  const err = document.getElementById("cf-error");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const honey = String(data.get("_honey") || "");
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const topic = String(data.get("topic") || "").trim();
    const message = String(data.get("message") || "").trim();
    const showErr = (t) => { err.hidden = false; err.textContent = t; };
    if (honey) { form.hidden = true; ok.hidden = false; return; }
    if (!name) return showErr("Įrašykite vardą.");
    if (!email && !phone) return showErr("Palikite el. paštą arba telefoną.");
    if (!message) return showErr("Parašykite trumpą žinutę.");
    err.hidden = true;
    const submit = form.querySelector("[type=submit]");
    submit.disabled = true;
    submit.textContent = "Siunčiama…";
    const payload = {
      name, company, email, phone, topic, message,
      _subject: "Užklausa iš pandafix.lt — " + (topic || name),
      _template: "table",
      _captcha: "false",
    };
    if (email) payload._replyto = email;
    try {
      const res = await fetch("https://formsubmit.co/ajax/info@pandafix.lt", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("fail");
      form.hidden = true;
      ok.hidden = false;
    } catch {
      const body = [
        "Vardas: " + name,
        company ? "Įmonė: " + company : null,
        email ? "El. paštas: " + email : null,
        phone ? "Tel.: " + phone : null,
        "Tema: " + (topic || "—"),
        "",
        message,
      ].filter(Boolean).join("\n");
      window.location.href = "mailto:info@pandafix.lt?subject=" + encodeURIComponent("Užklausa iš pandafix.lt — " + (topic || name)) + "&body=" + encodeURIComponent(body);
      form.hidden = true;
      ok.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = "Siųskite užklausą";
    }
  });
})();
