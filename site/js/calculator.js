(function () {
  function toNumber(value) {
    const n = Number(String(value).replace(/,/g, "").trim())
    return Number.isFinite(n) ? n : 0
  }

  function futureValue(opts) {
    const pv = Math.max(0, toNumber(opts.pv))
    const pmt = toNumber(opts.pmt)
    const annualRate = Math.max(0, toNumber(opts.rate))
    const years = Math.max(0, toNumber(opts.years))
    const periodsPerYear = opts.compounding === "monthly" ? 12 : 1
    const n = years * periodsPerYear
    const r = annualRate / 100 / periodsPerYear

    const fvPv = r === 0 ? pv : pv * Math.pow(1 + r, n)
    let fvPmt
    if (n === 0) fvPmt = 0
    else if (r === 0) fvPmt = pmt * n
    else fvPmt = pmt * ((Math.pow(1 + r, n) - 1) / r)
    if (opts.mode === "beginning") fvPmt *= 1 + r
    return fvPv + fvPmt
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

  function bindCalculator(root) {
    if (!root) return

    const output = root.querySelector("[data-fv]")
    const inputs = {
      pv: root.querySelector('[name="pv"]'),
      pmt: root.querySelector('[name="pmt"]'),
      rate: root.querySelector('[name="rate"]'),
      years: root.querySelector('[name="years"]'),
    }

    function selected(name) {
      const on = root.querySelector('[data-group="' + name + '"] button.is-on')
      return on ? on.getAttribute("data-value") : null
    }

    function update() {
      const value = futureValue({
        pv: inputs.pv.value,
        pmt: inputs.pmt.value,
        rate: inputs.rate.value,
        years: inputs.years.value,
        compounding: selected("compounding") || "annually",
        mode: selected("mode") || "end",
      })
      output.textContent = formatMoney(value, selected("decimals") || "2")
    }

    root.querySelectorAll("[data-group] button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.parentElement.querySelectorAll("button").forEach(function (el) {
          el.classList.toggle("is-on", el === btn)
        })
        update()
      })
    })

    Object.keys(inputs).forEach(function (key) {
      inputs[key].addEventListener("input", update)
      inputs[key].addEventListener("change", update)
    })

    update()
  }

  window.WealthPathCalculator = { futureValue: futureValue, formatMoney: formatMoney, bindCalculator: bindCalculator }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-calculator]").forEach(bindCalculator)
  })
})()
