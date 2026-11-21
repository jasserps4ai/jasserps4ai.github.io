document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggle
  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Top scroll progress bar
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      progressBar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // Subtle reveal on scroll (respecting reduced motion)
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  // Copy buttons for contact number, profile links, and verification URLs
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      if (!value) return;
      const originalText = btn.textContent;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const temp = document.createElement("textarea");
          temp.value = value;
          temp.setAttribute("readonly", "");
          temp.style.position = "absolute";
          temp.style.left = "-9999px";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }
        btn.textContent = "Copied";
      } catch (_) {
        btn.textContent = "Copy failed";
      }

      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    });
  });

  // Interactive Penetration Testing Scope Previewer
  const scopeData = {
    web: {
      title: "Web Applications Penetration Testing",
      code: "SCOPE-01 // WEB",
      summary:
        "Focuses on mapping application attack surface, testing authentication and authorization boundaries, validating user inputs, and verifying remediation steps with clear reproducible notes.",
      items: [
        "Authentication, session handling, and access control verification",
        "Input validation, injection surfaces, and workflow logic checks",
        "Structured reproduction steps and remediation guidance"
      ]
    },
    api: {
      title: "APIs & Backend Endpoints Assessment",
      code: "SCOPE-02 // API",
      summary:
        "Focuses on reviewing API authentication, object/endpoint authorization, parameter handling, and sensitive data exposure across requests and responses.",
      items: [
        "Endpoint authorization and object access boundary testing",
        "Payload validation, error handling, and rate/abuse exposure checks",
        "Clear documentation of request/response behavior and fixes"
      ]
    },
    mobile: {
      title: "Mobile Applications Security Review (iOS & Android)",
      code: "SCOPE-03 // MOBILE",
      summary:
        "Focuses on evaluating iOS and Android client security posture, network transport protection, local data handling, and backend API interaction.",
      items: [
        "iOS and Android client-side storage and configuration inspection",
        "Transport security and mobile-to-API communication review",
        "Actionable notes on hardening mobile workflows"
      ]
    },
    network: {
      title: "Network & Home Network Security Assessment",
      code: "SCOPE-04 // NETWORK & HOME",
      summary:
        "Focuses on inspecting reachable hosts, open ports and services, network segmentation, and router/gateway security configurations.",
      items: [
        "Host discovery, exposed ports/services, and protocol posture review",
        "Home network router settings, wireless security, and device exposure checks",
        "Practical hardening recommendations for network devices"
      ]
    },
    ai: {
      title: "AI & LLM Systems Security Review",
      code: "SCOPE-05 // AI & LLM",
      summary:
        "Focuses on identifying prompt/input risks, data leakage boundaries, and adversarial resilience in AI-powered applications and workflows.",
      items: [
        "Prompt and instruction boundary resilience checks",
        "Sensitive data exposure and model/tool interaction review",
        "Alignment with secure AI workflow practices"
      ]
    }
  };

  const tabs = document.querySelectorAll(".scope-tab");
  const titleEl = document.getElementById("scope-title");
  const codeEl = document.getElementById("scope-code");
  const summaryEl = document.getElementById("scope-summary");
  const listEl = document.getElementById("scope-checklist");

  if (tabs.length && titleEl && codeEl && summaryEl && listEl) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-target");
        const entry = scopeData[key];
        if (!entry) return;

        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        titleEl.textContent = entry.title;
        codeEl.textContent = entry.code;
        summaryEl.textContent = entry.summary;

        listEl.innerHTML = "";
        entry.items.forEach((itemText) => {
          const li = document.createElement("li");
          li.textContent = itemText;
          listEl.appendChild(li);
        });
      });
    });
  }
});
