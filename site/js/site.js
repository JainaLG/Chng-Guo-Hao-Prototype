(function () {
  const pages = {
    home: { href: "index.html", label: "Home" },
    about: { href: "about.html", label: "About" },
    estate: { href: "estate.html", label: "Estate Planning" },
    retirement: { href: "retirement.html", label: "Retirement Planning" },
    articles: { href: "articles.html", label: "Articles" },
  }

  function headerHtml(active) {
    const links = Object.keys(pages).map(function (key) {
      const item = pages[key]
      return '<a href="' + item.href + '"' + (key === active ? ' class="is-active"' : "") + ">" + item.label + "</a>"
    }).join("")
    return (
      '<div class="header-inner">' +
        '<a class="logo" href="index.html"><img src="assets/logo.png" alt="Chng Guohao, your trusted financial partner"></a>' +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span></span></button>' +
        '<nav class="nav" id="site-nav">' +
          links +
          '<a class="btn nav-cta" href="book.html">Book an Appointment</a>' +
        "</nav>" +
      "</div>"
    )
  }

  function footerHtml() {
    return (
      '<div class="footer-grid">' +
        "<div>" +
          '<a class="logo" href="index.html"><img src="assets/logo-white.png" alt="Chng Guohao"></a>' +
          "<p>Associate Director at Professional Investment Advisory Services Pte Ltd. Holistic financial planning to help clients achieve financial dignity.</p>" +
          '<div class="social"><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Instagram"><img src="assets/icons/instagram.svg" alt="" width="25" height="25"></a></div>' +
        "</div>" +
        "<div><h3>Navigate</h3><ul>" +
          '<li><a href="index.html">Home</a></li>' +
          '<li><a href="about.html">About</a></li>' +
          '<li><a href="articles.html">Blogs</a></li>' +
          '<li><a href="book.html">Book Consultation</a></li>' +
        "</ul></div>" +
        "<div><h3>Programmes</h3><ul>" +
          '<li><a href="estate.html">Estate Planning Programme</a></li>' +
          '<li><a href="retirement.html">Retirement Planning Programme</a></li>' +
        "</ul></div>" +
        "<div><h3>Contact</h3><ul>" +
          "<li>[Phone placeholder]</li>" +
          "<li>[Email placeholder]</li>" +
          "<li>Singapore</li>" +
        "</ul></div>" +
      "</div>" +
      '<div class="legal"><p>Copyright ©2026 Chng Guo Hao. All rights reserved.</p>' +
      '<p><a href="privacy.html">Privacy Policy</a> &nbsp; <a href="terms.html">Terms / Disclaimer</a></p></div>'
    )
  }

  document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.getAttribute("data-page") || "home"
    const header = document.querySelector("[data-site-header]")
    const footer = document.querySelector("[data-site-footer]")
    if (header) header.innerHTML = headerHtml(page)
    if (footer) footer.innerHTML = footerHtml()

    const toggle = document.querySelector(".nav-toggle")
    const nav = document.querySelector(".nav")
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const open = nav.classList.toggle("is-open")
        toggle.setAttribute("aria-expanded", String(open))
      })
    }

    document.querySelectorAll(".faq-item").forEach(function (item) {
      const btn = item.querySelector("button")
      btn.addEventListener("click", function () {
        const open = item.classList.contains("is-open")
        item.parentElement.querySelectorAll(".faq-item").forEach(function (el) {
          el.classList.remove("is-open")
          el.querySelector(".sign").textContent = "+"
        })
        if (!open) {
          item.classList.add("is-open")
          item.querySelector(".sign").textContent = "−"
        }
      })
    })

    const form = document.querySelector("[data-consult-form]")
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault()
        const name = form.querySelector('[name="name"]')
        const email = form.querySelector('[name="email"]')
        if (!name.value.trim() || !email.value.trim() || !email.value.includes("@")) {
          form.querySelector("[data-form-error]").hidden = false
          return
        }
        form.querySelector("[data-form-error]").hidden = true
        form.classList.add("is-sent")
      })
    }
  })
})()
