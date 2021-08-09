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

async function filterWrapper(
  complete_str: string,
  candidates: Candidate[],
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
    candidates,
  );
}

Deno.test("fuzzy filter", async () => {
  let testCandidates = [
    { "word": "foobar" },
    { "word": "afoobar" },
    { "word": "fooBar" },
    { "word": "afooBar" },
    { "word": "Foobar" },
    { "word": "aFoobar" },
    { "word": "FooBar" },
    { "word": "aFooBar" },
  ];

  assertEquals(await filterWrapper("", testCandidates), [
    { "word": "foobar" },
    { "word": "afoobar" },
    { "word": "fooBar" },
    { "word": "afooBar" },
    { "word": "Foobar" },
    { "word": "aFoobar" },
    { "word": "FooBar" },
    { "word": "aFooBar" },
  ]);
  assertEquals(await filterWrapper("FOBR", testCandidates), [
    { "word": "foobar" },
    { "word": "fooBar" },
    { "word": "Foobar" },
    { "word": "FooBar" },
  ]);
  assertEquals(await filterWrapper("foBr", testCandidates, false, true), [
    { "word": "fooBar" },
    { "word": "FooBar" },
  ]);
  assertEquals(await filterWrapper("fobr", testCandidates, true, false), [
    { "word": "foobar" },
    { "word": "fooBar" },
    { "word": "Foobar" },
    { "word": "FooBar" },
  ]);
  assertEquals(await filterWrapper("fobr", testCandidates, false, false), [
    { "word": "foobar" },
  ]);

  await filterWrapper("foo+=", testCandidates, false, false);
});
