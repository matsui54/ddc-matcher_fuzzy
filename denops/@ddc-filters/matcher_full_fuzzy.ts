import { BaseFilter, Item } from "https://deno.land/x/ddc_vim@v3.3.0/types.ts";
import {
  FilterArguments,
} from "https://deno.land/x/ddc_vim@v3.3.0/base/filter.ts";
import { fuzzyEscape } from "./matcher_fuzzy.ts";

export type Params = {
  camelcase: boolean;
};

export class Filter extends BaseFilter<Params> {
  filter({
    sourceOptions,
    filterParams,
    completeStr,
    items,
  }: FilterArguments<Params>): Promise<Item[]> {
    if (sourceOptions.ignoreCase) {
      completeStr = completeStr.toLowerCase();
    }
    const pattern = new RegExp(
      fuzzyEscape(completeStr, filterParams.camelcase as boolean),
    );
    if (sourceOptions.ignoreCase) {
      return Promise.resolve(items.filter(
        (candidate) => candidate.word.toLowerCase().match(pattern),
      ));
    } else {
      return Promise.resolve(items.filter(
        (candidate) => candidate.word.match(pattern),
      ));
    }
  }

  params(): Params {
    return {
      camelcase: false,
    };
  }
}
