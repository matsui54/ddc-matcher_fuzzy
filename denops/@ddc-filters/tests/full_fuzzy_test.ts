import { Item } from "https://deno.land/x/ddc_vim@v3.3.0/types.ts";
import {
  FilterArguments,
} from "https://deno.land/x/ddc_vim@v3.3.0/base/filter.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { Filter, Params } from "../matcher_full_fuzzy.ts";

export function filterWrapper(
  completeStr: string,
  items: Item[],
  ignoreCase = true,
  camelcase = true,
): Promise<Item[]> {
  const filter = new Filter();
  return filter.filter({
    sourceOptions: { ignoreCase },
    filterParams: { camelcase },
    completeStr,
    items,
  } as FilterArguments<Params>);
}

Deno.test("fuzzy filter", async () => {
  const testCandidates = [
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
    { "word": "afoobar" },
    { "word": "fooBar" },
    { "word": "afooBar" },
    { "word": "Foobar" },
    { "word": "aFoobar" },
    { "word": "FooBar" },
    { "word": "aFooBar" },
  ]);
  assertEquals(await filterWrapper("foBr", testCandidates, false, true), [
    { "word": "fooBar" },
    { "word": "afooBar" },
    { "word": "FooBar" },
    { "word": "aFooBar" },
  ]);
  assertEquals(await filterWrapper("fobr", testCandidates, true, false), [
    { "word": "foobar" },
    { "word": "afoobar" },
    { "word": "fooBar" },
    { "word": "afooBar" },
    { "word": "Foobar" },
    { "word": "aFoobar" },
    { "word": "FooBar" },
    { "word": "aFooBar" },
  ]);
  assertEquals(await filterWrapper("fobr", testCandidates, false, false), [
    { "word": "foobar" },
    { "word": "afoobar" },
  ]);

  await filterWrapper("foo+=", testCandidates, false, false);
});
