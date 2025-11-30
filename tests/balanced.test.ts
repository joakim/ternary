import { assertEquals } from '@std/assert'

import { type trit, not, both, either, differ, same, and, or, xor, xnor, resolve, collapse, toBoolean, toTernary, fromTernary } from '../balanced.ts'
import { testAPI } from "./api.ts";

const t: trit = 1 as trit
const f: trit = -1 as trit
const u: trit = 0 as trit

const fut: trit[] = [f, u, t]

testAPI<trit>(fut, { not, both, either, differ, same, and, or, xor, xnor, resolve, collapse, toBoolean })

Deno.test(function toTernaryTest() {
  assertEquals(toTernary(f), false)
  assertEquals(toTernary(u), undefined)
  assertEquals(toTernary(t), true)
})

Deno.test(function fromTernaryTest() {
  assertEquals(fromTernary(false), f)
  assertEquals(fromTernary(undefined), u)
  assertEquals(fromTernary(true), t)
})
