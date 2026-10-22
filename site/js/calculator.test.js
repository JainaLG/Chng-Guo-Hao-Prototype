const fs = require("fs")
const vm = require("vm")
const code = fs.readFileSync(__dirname + "/calculator.js", "utf8")
const sandbox = { window: {}, document: { addEventListener() {}, querySelectorAll() { return [] } } }
vm.createContext(sandbox)
vm.runInContext(code, sandbox)
const { futureValue, formatMoney } = sandbox.window.WealthPathCalculator

const base = { pv: 100000, pmt: 1000, rate: 4, years: 20, compounding: "annually", mode: "end" }
const fv = futureValue(base)
if (formatMoney(fv, 2) !== "$248,890.39") {
  throw new Error("Default Figma case failed: " + formatMoney(fv, 2))
}
if (futureValue({ ...base, pmt: 0 }).toFixed(2) !== (100000 * Math.pow(1.04, 20)).toFixed(2)) {
  throw new Error("PV-only case failed")
}
if (futureValue({ ...base, rate: 0 }) !== 100000 + 1000 * 20) {
  throw new Error("Zero-rate case failed")
}
const due = futureValue({ ...base, mode: "beginning" })
if (!(due > fv)) throw new Error("Annuity due should be larger")
console.log("calculator tests passed", formatMoney(fv, 2))
