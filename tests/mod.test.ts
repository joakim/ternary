/// <reference lib="es6" />
import { assertEquals } from '@std/assert'
import { type ternary, Ternary, not, both, either, same, differ, and, or, xor, xnor, resolve, collapse } from '../mod.ts'

const t: ternary = true
const f: ternary = false
const u: ternary = undefined

const fut: ternary[] = [f, u, t]

const andTruthTable: ternary[][] = [
  [f, f, f],
  [f, u, u],
  [f, u, t],
]

const orTruthTable: ternary[][] = [
  [f, u, t],
  [u, u, t],
  [t, t, t],
]

const xorTruthTable: ternary[][] = [
  [f, u, t],
  [u, u, u],
  [t, u, f],
]

const xnorTruthTable: ternary[][] = [
  [t, u, f],
  [u, u, u],
  [f, u, t],
]

function assertTable(fn: Function, truthTable: ternary[][]) {
  for (let y = 0; y < truthTable.length; y++) {
    for (let x = 0; x < truthTable[y].length; x++) {
      // console.log(`${fn.name}(${fut[x]}, ${fut[y]}) = ${truthTable[y][x]}`)
      assertEquals(fn(fut[x], fut[y]), truthTable[y][x])
    }
  }
}

Deno.test(function notTest() {
  assertEquals(not(f), t)
  assertEquals(not(u), u)
  assertEquals(not(t), f)
})

Deno.test(function andTest() {
  assertTable(and, andTruthTable)
  assertTable(both, andTruthTable)
})

Deno.test(function orTest() {
  assertTable(or, orTruthTable)
  assertTable(either, orTruthTable)
})

Deno.test(function xnorTest() {
  assertTable(xnor, xnorTruthTable)
  assertTable(same, xnorTruthTable)
})

Deno.test(function xorTest() {
  assertTable(xor, xorTruthTable)
  assertTable(differ, xorTruthTable)
})

Deno.test(function resolveTest() {
  assertEquals(resolve(f, "t", "f", "u"), "f")
  assertEquals(resolve(u, "t", "f", "u"), "u")
  assertEquals(resolve(t, "t", "f", "u"), "t")
})

Deno.test(function collapseTest() {
  assertEquals(collapse(f, "t", "f"), "f")
  assertEquals(collapse(u, "t", "f"), "t")
  assertEquals(collapse(t, "t", "f"), "t")
})

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
