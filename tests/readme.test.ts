import { assertEquals } from '@std/assert'
import { type ternary, both, either, resolve } from '../mod.ts'

type LoanApplicantStatus = {
  income: ternary
  debt: ternary
  assets: ternary
  history: ternary
}

function check({ income, debt, assets, history }: LoanApplicantStatus) {
  let result = either(both(income, debt), both(assets, history))

  return resolve(result, "Approve", "Reject", "Needs review")
}

Deno.test(function readme() {
  assertEquals(check({ income: true,  debt: false,     assets: true,      history: true  }), "Approve")
  assertEquals(check({ income: true,  debt: undefined, assets: false,     history: false }), "Needs review")
  assertEquals(check({ income: false, debt: undefined, assets: undefined, history: false }), "Reject")
})
