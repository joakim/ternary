import { assertEquals } from '@std/assert'

export function testAPI<T>(fut: T[], fns: Record<string, Function>) {
  let { not, both, either, differ, same, and, or, xor, xnor, resolve, collapse, toBoolean } = fns
  let [f, u, t] = fut

  const andTruthTable: T[][] = [
    [f, f, f],
    [f, u, u],
    [f, u, t],
  ]

  const orTruthTable: T[][] = [
    [f, u, t],
    [u, u, t],
    [t, t, t],
  ]

  const xorTruthTable: T[][] = [
    [f, u, t],
    [u, u, u],
    [t, u, f],
  ]

  const xnorTruthTable: T[][] = [
    [t, u, f],
    [u, u, u],
    [f, u, t],
  ]

  function assertTable(fn: Function, truthTable: T[][]) {
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
    assertTable(both, andTruthTable)
    assertTable(and, andTruthTable)
  })

  Deno.test(function orTest() {
    assertTable(either, orTruthTable)
    assertTable(or, orTruthTable)
  })

  Deno.test(function xorTest() {
    assertTable(differ, xorTruthTable)
    assertTable(xor, xorTruthTable)
  })

  Deno.test(function xnorTest() {
    assertTable(same, xnorTruthTable)
    assertTable(xnor, xnorTruthTable)
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

  Deno.test(function toBooleanTest() {
    assertEquals(toBoolean(f), false)
    assertEquals(toBoolean(u), true)
    assertEquals(toBoolean(t), true)
  })
}
