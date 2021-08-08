import {
  assertEquals,
  Candidate,
  Context,
  DdcOptions,
  Denops,
  FilterOptions,
  SourceOptions,
} from "./deps.ts";
import { Filter } from "./matcher_fuzzy.ts";

function testCandidates(): Candidate[] {
  return [
    { "word": "foobar" },
    { "word": "afoobar" },
    { "word": "fooBar" },
    { "word": "afooBar" },
    { "word": "Foobar" },
    { "word": "aFoobar" },
    { "word": "FooBar" },
    { "word": "aFooBar" },
  ];
}

async function filterWrapper(
  complete_str: string,
  ignorecase: boolean = true,
  camelcase: boolean = true,
): Promise<Candidate[]> {
  let filter = new Filter();
  return filter.filter(
    {} as Denops,
    {} as Context,
    {} as DdcOptions,
    { "ignoreCase": ignorecase } as SourceOptions,
    {} as FilterOptions,
    { "camelcase": camelcase },
    complete_str,
    testCandidates(),
  );
}

Deno.test("fuzzy filter", async () => {
  assertEquals(await filterWrapper(""), [
    { "word": "foobar" },
    { "word": "afoobar" },
    { "word": "fooBar" },
    { "word": "afooBar" },
    { "word": "Foobar" },
    { "word": "aFoobar" },
    { "word": "FooBar" },
    { "word": "aFooBar" },
  ]);

  assertEquals(await filterWrapper("FOBR"), [
    { "word": "foobar" },
    { "word": "fooBar" },
    { "word": "Foobar" },
    { "word": "FooBar" },
  ]);
  assertEquals(await filterWrapper("foBr", false, true), [
    { "word": "fooBar" },
    { "word": "FooBar" },
  ]);
  assertEquals(await filterWrapper("FOBR", true, false), [
    { "word": "foobar" },
    { "word": "fooBar" },
    { "word": "Foobar" },
    { "word": "FooBar" },
  ]);
  assertEquals(await filterWrapper("FOBR", false, false), [
    { "word": "foobar" },
  ]);
});
