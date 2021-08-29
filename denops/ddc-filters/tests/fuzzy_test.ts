import {
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.4.1/types.ts#^";
import{
  FilterArguments
} from "https://deno.land/x/ddc_vim@v0.4.1/base/filter.ts#^";
import {
  assertEquals
} from "https://deno.land/std@0.106.0/testing/asserts.ts#^";
import { Filter } from "../matcher_fuzzy.ts";

async function filterWrapper(
  completeStr: string,
  candidates: Candidate[],
  ignoreCase: boolean = true,
  camelcase: boolean = true,
): Promise<Candidate[]> {
  let filter = new Filter();
  return filter.filter({
    sourceOptions: { ignoreCase },
    filterParams: { camelcase },
    completeStr,
    candidates,
  } as unknown as FilterArguments);
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
