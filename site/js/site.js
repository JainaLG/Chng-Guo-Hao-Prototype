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

    document.querySelectorAll(".cred, .usp, .philosophy article").forEach(function (el) {
      el.setAttribute("tabindex", "0")
    })

    const testimonials = [
      {
        quote: "Your ability to explain complex financial concepts in a clear manner makes me well-informed of my financial decision. I appreciate your responsiveness, attention to details and customized financial strategies you developed for me.",
        who: "Chua Rui Fen",
        role: "Management Trainee, MSD Singapore"
      },
      {
        quote: "Guohao cares for my financial planning needs and is very transparent in the proposed options. He is not pushy and able to provide sound finance advice to help me make informed decisions for my retirement planning.",
        who: "Evelyn Low",
        role: "Retiree"
      },
      {
        quote: "Guohao shares the overall concept of financial success model and provides very clear and transparent viewpoints on the recommended plans to tailor to my financial planning needs. He is also very patient in addressing all my queries.",
        who: "Julie Ji",
        role: "Senior Operational Excellence Manager, DB Schenker"
      },
      {
        quote: "Guohao is passionate in his field of work. I trust to leave my family’s financial planning needs to him. He optimizes my current resources and provides value-added inputs to meet my family’s financial needs. He goes the extra mile to ensure a fuss-free claim process, so the payout is received in a timely manner.",
        who: "Leonard Leong",
        role: "Risk Management Specialist, UOB"
      },
      {
        quote: "Guohao has in-depth financial products knowledge and is attention to details. As a wealth management practitioner, he is passionate and highly motivated to serve clients and take care of their interests.",
        who: "Daniel Tan",
        role: "Director, BroadTech Engineering"
      }
    ]

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (ch) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
      })
    }

    document.querySelectorAll("[data-testimonials]").forEach(function (root) {
      const track = root.querySelector("[data-quote-track]")
      const dotsRoot = root.querySelector(".testimonial-dots")
      if (!track || !dotsRoot) return

      track.innerHTML = testimonials.map(function (item, i) {
        return (
          '<blockquote class="quote-slide' + (i === 0 ? " is-active" : "") + '"' +
            (i === 0 ? "" : ' aria-hidden="true"') + ">" +
            "<p>“" + escapeHtml(item.quote) + "”</p>" +
            '<footer class="quote-person">' +
              '<span class="quote-avatar" aria-hidden="true"></span>' +
              "<div>" +
                '<p class="who">' + escapeHtml(item.who) + "</p>" +
                '<p class="role">' + escapeHtml(item.role) + "</p>" +
              "</div>" +
            "</footer>" +
          "</blockquote>"
        )
      }).join("")

      dotsRoot.innerHTML = testimonials.map(function (item, i) {
        return (
          '<button type="button" role="tab" aria-label="Show testimonial from ' +
          escapeHtml(item.who) + " (" + (i + 1) + " of " + testimonials.length + ')"' +
          ' aria-selected="' + (i === 0 ? "true" : "false") + '"' +
          (i === 0 ? ' class="is-active"' : "") + "></button>"
        )
      }).join("")

      const slides = Array.prototype.slice.call(track.querySelectorAll(".quote-slide"))
      const dots = Array.prototype.slice.call(dotsRoot.querySelectorAll("button"))
      let index = 0

      function show(next) {
        const wrapped = (next + slides.length) % slides.length
        if (wrapped === index) return
        const current = slides[index]
        const incoming = slides[wrapped]

        slides.forEach(function (slide) {
          slide.classList.remove("is-leave")
        })

        current.classList.remove("is-active")
        current.classList.add("is-leave")
        current.setAttribute("aria-hidden", "true")

        incoming.classList.add("is-active")
        incoming.removeAttribute("aria-hidden")

        index = wrapped
        dots.forEach(function (dot, i) {
          const on = i === index
          dot.classList.toggle("is-active", on)
          dot.setAttribute("aria-selected", on ? "true" : "false")
        })
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () { show(i) })
      })
      root.tabIndex = 0
      root.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") { event.preventDefault(); show(index + 1) }
        if (event.key === "ArrowLeft") { event.preventDefault(); show(index - 1) }
      })
      let startX = null
      root.addEventListener("pointerdown", function (event) {
        if (event.target.closest("button")) return
        startX = event.clientX
      })
      root.addEventListener("pointerup", function (event) {
        if (startX == null) return
        const dx = event.clientX - startX
        startX = null
        if (dx > 40) show(index - 1)
        if (dx < -40) show(index + 1)
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
