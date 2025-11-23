/// <reference lib="es6" />
import { assertEquals } from '@std/assert'
import { Ternary, not, and, or, xor, xnor, eq, cond, type ternary } from './mod.ts'

const t = true
const f = false
const u = undefined

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
      // console.log(`${fn.name}(${fut[x]}, ${fut[y]}) = ${table[y][x]}`)
      assertEquals(fn(fut[x], fut[y]), truthTable[y][x])
    }
  }
}

Deno.test(function notTest() {
  assertEquals(not(t), f)
  assertEquals(not(f), t)
  assertEquals(not(u), u)
})

Deno.test(function andTest() {
  assertTable(and, andTruthTable)
})

Deno.test(function orTest() {
  assertTable(or, orTruthTable)
})

Deno.test(function xorTest() {
  assertTable(xor, xorTruthTable)
})

Deno.test(function xnorTest() {
  assertTable(xnor, xnorTruthTable)
})

Deno.test(function eqTest() {
  assertEquals(eq, xnor)
})

Deno.test(function condTest() {
  assertEquals(cond(t, t, f, u), t)
  assertEquals(cond(f, t, f, u), f)
  assertEquals(cond(u, t, f, u), u)
})

Deno.test(function functionTest() {
  assertEquals(Ternary(1), t)
  assertEquals(Ternary(-1), t)
  assertEquals(Ternary(0), f)
  assertEquals(Ternary(null), f)
  assertEquals(Ternary(u), u)
  assertEquals(Ternary(), u)
})

Deno.test(function constructorValueOfTest() {
  assertEquals(new Ternary(1).valueOf(), t)
  assertEquals(new Ternary(-1).valueOf(), t)
  assertEquals(new Ternary(0).valueOf(), f)
  assertEquals(new Ternary(null).valueOf(), f)
  assertEquals(new Ternary(u).valueOf(), u)
  assertEquals(new Ternary().valueOf(), u)
})

Deno.test(function constructorToStringTest() {
  assertEquals(new Ternary(t).toString(), "true")
  assertEquals(new Ternary(f).toString(), "false")
  assertEquals(new Ternary(u).toString(), "undefined")
})
