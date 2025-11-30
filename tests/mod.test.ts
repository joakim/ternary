import { assertEquals } from '@std/assert'

import { type ternary, Ternary, not, both, either, same, differ, and, or, xor, xnor, resolve, collapse, toBoolean } from '../mod.ts'
import { testAPI } from "./api.ts";

const t: ternary = true
const f: ternary = false
const u: ternary = undefined

const fut: ternary[] = [f, u, t]

testAPI<ternary>(fut, { not, both, either, differ, same, and, or, xor, xnor, resolve, collapse, toBoolean })

Deno.test(function coercionTest() {
  // truthy
  assertEquals(Ternary(true), t)
  assertEquals(Ternary({}), t)
  assertEquals(Ternary([]), t)
  assertEquals(Ternary(42), t)
  assertEquals(Ternary("0"), t)
  assertEquals(Ternary("false"), t)
  assertEquals(Ternary(new Date()), t)
  assertEquals(Ternary(-42), t)
  assertEquals(Ternary(12n), t)
  assertEquals(Ternary(3.14), t)
  assertEquals(Ternary(-3.14), t)
  assertEquals(Ternary(Infinity), t)
  assertEquals(Ternary(-Infinity), t)

  // falsy
  assertEquals(Ternary(false), f)
  assertEquals(Ternary(0), f)
  assertEquals(Ternary(-0), f)
  assertEquals(Ternary(0n), f)
  assertEquals(Ternary(""), f)
  assertEquals(Ternary(null), f)
  assertEquals(Ternary(NaN), f)

  // undefined
  assertEquals(Ternary(u), u)
  assertEquals(Ternary(), u)
})

Deno.test(function valueOfTest() {
  assertEquals(new Ternary(f).valueOf(), f)
  assertEquals(new Ternary(u).valueOf(), u)
  assertEquals(new Ternary(t).valueOf(), t)
  assertEquals(new Ternary().valueOf(), u)
})

Deno.test(function toStringTest() {
  assertEquals(new Ternary(f).toString(), "false")
  assertEquals(new Ternary(u).toString(), "undefined")
  assertEquals(new Ternary(t).toString(), "true")
})
