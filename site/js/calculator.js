(function () {
  const COMPOUNDING = {
    annually: 1,
    semiannually: 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  }

  function toNumber(value) {
    if (value == null || value === "") return 0
    const n = Number(String(value).replace(/,/g, "").trim())
    return Number.isFinite(n) ? n : 0
  }

  function periodsPerYear(compounding) {
    return COMPOUNDING[compounding] || 1
  }

  function periodicRate(annualRatePct, compounding) {
    return toNumber(annualRatePct) / 100 / periodsPerYear(compounding)
  }

  function dueFactor(r, mode) {
    if (mode !== "beginning") return 1
    return r === 0 ? 1 : 1 + r
  }

  function futureValue(opts) {
    const pv = toNumber(opts.pv)
    const pmt = toNumber(opts.pmt)
    const n = toNumber(opts.n != null ? opts.n : opts.years)
    const r = periodicRate(opts.rate, opts.compounding)
    const due = dueFactor(r, opts.mode)
    if (n === 0) return pv
    if (r === 0) return pv + pmt * n
    const growth = Math.pow(1 + r, n)
    return pv * growth + pmt * ((growth - 1) / r) * due
  }

  function presentValue(opts) {
    const fv = toNumber(opts.fv)
    const pmt = toNumber(opts.pmt)
    const n = toNumber(opts.n != null ? opts.n : opts.years)
    const r = periodicRate(opts.rate, opts.compounding)
    const due = dueFactor(r, opts.mode)
    if (n === 0) return fv
    if (r === 0) return fv - pmt * n
    const growth = Math.pow(1 + r, n)
    return (fv - pmt * ((growth - 1) / r) * due) / growth
  }

  function payment(opts) {
    const pv = toNumber(opts.pv)
    const fv = toNumber(opts.fv)
    const n = toNumber(opts.n != null ? opts.n : opts.years)
    const r = periodicRate(opts.rate, opts.compounding)
    const due = dueFactor(r, opts.mode)
    if (n === 0) return 0
    if (r === 0) return (fv - pv) / n
    const growth = Math.pow(1 + r, n)
    return (fv - pv * growth) / (((growth - 1) / r) * due)
  }

  function periods(opts) {
    const pv = toNumber(opts.pv)
    const pmt = toNumber(opts.pmt)
    const fv = toNumber(opts.fv)
    const r = periodicRate(opts.rate, opts.compounding)
    const due = dueFactor(r, opts.mode)
    if (r === 0) {
      if (pmt === 0) return null
      return (fv - pv) / pmt
    }
    const start = pv + (pmt * due) / r
    const end = fv + (pmt * due) / r
    if (start === 0 || end / start <= 0) return null
    const n = Math.log(end / start) / Math.log(1 + r)
    return Number.isFinite(n) ? n : null
  }

  function annualRate(opts) {
    const pv = toNumber(opts.pv)
    const pmt = toNumber(opts.pmt)
    const fv = toNumber(opts.fv)
    const n = toNumber(opts.n != null ? opts.n : opts.years)
    const ppy = periodsPerYear(opts.compounding)
    if (n === 0) return null

    function residual(r) {
      const due = dueFactor(r, opts.mode)
      if (r === 0) return pv + pmt * n - fv
      const growth = Math.pow(1 + r, n)
      return pv * growth + pmt * ((growth - 1) / r) * due - fv
    }

    if (pmt === 0) {
      if (pv === 0 || fv / pv <= 0) return null
      const r = Math.pow(fv / pv, 1 / n) - 1
      return Number.isFinite(r) ? r * ppy * 100 : null
    }

    let r = 0.04 / ppy
    for (let i = 0; i < 80; i++) {
      const f = residual(r)
      const h = Math.max(1e-8, Math.abs(r) * 1e-6)
      const df = (residual(r + h) - residual(r - h)) / (2 * h)
      if (!Number.isFinite(df) || Math.abs(df) < 1e-14) break
      const next = r - f / df
      if (!Number.isFinite(next)) break
      if (Math.abs(next - r) < 1e-12) {
        r = next
        break
      }
      r = next
    }
    if (!Number.isFinite(r) || Math.abs(residual(r)) > 1e-2) return null
    return r * ppy * 100
  }

  function formatMoney(amount, decimals) {
    const places = Number(decimals)
    const safe = Number.isInteger(places) && places >= 0 && places <= 5 ? places : 2
    const abs = Math.abs(amount)
    const formatted = abs.toLocaleString("en-US", {
      minimumFractionDigits: safe,
      maximumFractionDigits: safe,
    })
    return (amount < 0 ? "-$" : "$") + formatted
  }

  function formatNumber(amount, decimals) {
    const places = Number(decimals)
    const safe = Number.isInteger(places) && places >= 0 && places <= 5 ? places : 2
    if (!Number.isFinite(amount)) return ""
    return String(Number(amount.toFixed(safe)))
  }

  function bindCalculator(root) {
    if (!root) return

    const output = root.querySelector("[data-fv]")
    const error = root.querySelector("[data-calc-error]")
    const inputs = {
      pv: root.querySelector('[name="pv"]'),
      pmt: root.querySelector('[name="pmt"]'),
      fv: root.querySelector('[name="fv"]'),
      rate: root.querySelector('[name="rate"]'),
      n: root.querySelector('[name="n"]'),
    }
    const compounding = root.querySelector('[name="compounding"]')
    const advancedBtn = root.querySelector("[data-advanced]")
    const hint = root.querySelector("[data-calc-hint]")
    let lastSolve = null

    function selected(name) {
      const on = root.querySelector('[data-group="' + name + '"] button.is-on')
      return on ? on.getAttribute("data-value") : null
    }

    function opts() {
      return {
        pv: inputs.pv.value,
        pmt: inputs.pmt.value,
        fv: inputs.fv ? inputs.fv.value : 0,
        rate: inputs.rate.value,
        n: inputs.n.value,
        compounding: compounding ? compounding.value : selected("compounding") || "annually",
        mode: selected("mode") || "end",
      }
    }

    function decimals() {
      return selected("decimals") || "2"
    }

    function showError(message) {
      if (!error) return
      error.textContent = message || ""
      error.hidden = !message
    }

    function renderResult(value) {
      output.textContent = formatMoney(Number.isFinite(value) ? value : 0, decimals())
    }

    function solve(which) {
      const current = opts()
      let value = null
      if (which === "fv") value = futureValue(current)
      if (which === "pv") value = presentValue(current)
      if (which === "pmt") value = payment(current)
      if (which === "n") value = periods(current)
      if (which === "rate") value = annualRate(current)

      if (value == null || !Number.isFinite(value)) {
        showError("Enter the other values, then tap a button to solve.")
        return
      }

      lastSolve = which
      showError("")
      const places = which === "n" || which === "rate" ? Math.max(Number(decimals()), 4) : decimals()
      if (inputs[which]) inputs[which].value = formatNumber(value, places)
      renderResult(futureValue(opts()))
    }

    function reformat() {
      if (lastSolve) solve(lastSolve)
    }

    root.querySelectorAll("[data-group] button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.parentElement.querySelectorAll("button").forEach(function (el) {
          el.classList.toggle("is-on", el === btn)
        })
        reformat()
      })
    })

    root.querySelectorAll("[data-solve]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        solve(btn.getAttribute("data-solve"))
      })
    })

    if (compounding) {
      compounding.addEventListener("change", reformat)
    }

    if (advancedBtn && hint) {
      advancedBtn.addEventListener("click", function () {
        const open = hint.hasAttribute("hidden")
        hint.toggleAttribute("hidden", !open)
        advancedBtn.setAttribute("aria-expanded", open ? "true" : "false")
        advancedBtn.classList.toggle("is-on", open)
      })
    }

    renderResult(0)
  }

  window.WealthPathCalculator = {
    futureValue: futureValue,
    presentValue: presentValue,
    payment: payment,
    periods: periods,
    annualRate: annualRate,
    formatMoney: formatMoney,
    bindCalculator: bindCalculator,
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-calculator]").forEach(bindCalculator)
  })
})()
