const fs = require("fs")
const vm = require("vm")
const code = fs.readFileSync(__dirname + "/calculator.js", "utf8")
const sandbox = { window: {}, document: { addEventListener() {}, querySelectorAll() { return [] } } }
vm.createContext(sandbox)
vm.runInContext(code, sandbox)
const {
  futureValue,
  presentValue,
  payment,
  periods,
  annualRate,
  formatMoney,
} = sandbox.window.WealthPathCalculator

function assert(cond, message) {
  if (!cond) throw new Error(message)
}

function almost(a, b, tol) {
  return Math.abs(a - b) <= (tol == null ? 0.02 : tol)
}

const empty = { pv: "", pmt: "", fv: "", rate: "", n: "", compounding: "annually", mode: "beginning" }
assert(formatMoney(futureValue(empty), 2) === "$0.00", "Empty fields should be $0.00")

const base = { pv: 100000, pmt: 1000, rate: 4, n: 20, compounding: "annually", mode: "end" }
const fv = futureValue(base)
assert(formatMoney(fv, 2) === "$248,890.39", "Default Figma case failed: " + formatMoney(fv, 2))
assert(
  futureValue({ ...base, pmt: 0 }).toFixed(2) === (100000 * Math.pow(1.04, 20)).toFixed(2),
  "PV-only case failed"
)
assert(futureValue({ ...base, rate: 0 }) === 100000 + 1000 * 20, "Zero-rate case failed")
const due = futureValue({ ...base, mode: "beginning" })
assert(due > fv, "Annuity due should be larger")

const solvedPv = presentValue({ ...base, fv: fv })
assert(almost(solvedPv, 100000, 0.05), "Solve PV failed: " + solvedPv)

const solvedPmt = payment({ ...base, fv: fv })
assert(almost(solvedPmt, 1000, 0.05), "Solve PMT failed: " + solvedPmt)

const solvedN = periods({ ...base, fv: fv })
assert(almost(solvedN, 20, 0.001), "Solve Periods failed: " + solvedN)

const solvedRate = annualRate({ ...base, fv: fv })
assert(almost(solvedRate, 4, 0.01), "Solve Rate failed: " + solvedRate)

console.log("calculator tests passed", formatMoney(fv, 2), formatMoney(due, 2))
