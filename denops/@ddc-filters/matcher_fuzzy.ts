import { BaseFilter, Item } from "https://deno.land/x/ddc_vim@v3.3.0/types.ts";
import {
  FilterArguments,
} from "https://deno.land/x/ddc_vim@v3.3.0/base/filter.ts";

export function fuzzyEscape(str: string, camelcase: boolean): string {
  // escape special letters
  let p = str.replaceAll(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&");
  p = p.replaceAll(/([a-zA-Z0-9])/g, "$1.*");
  if (camelcase && str.search(/[A-Z]/) != -1) {
    p = p.replaceAll(
      /([a-z])/g,
      (pat) => `[${pat.concat(pat.toUpperCase())}]`,
    );
  }
  p = p.replaceAll(/([a-zA-Z0-9_])\.\*/g, "$1[^$1]*");
  return p;
}

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
    if (!completeStr) {
      return Promise.resolve(items);
    }
    if (sourceOptions.ignoreCase) {
      completeStr = completeStr.toLowerCase();
    }
    const pattern = new RegExp(
      "^" + fuzzyEscape(completeStr, filterParams.camelcase as boolean),
    );

    if (sourceOptions.ignoreCase) {
      return Promise.resolve(items.filter(
        (candidate) => candidate.word.toLowerCase().search(pattern) != -1,
      ));
    } else {
      return Promise.resolve(items.filter(
        (candidate) => candidate.word.search(pattern) != -1,
      ));
    }
  }

  params(): Params {
    return {
      camelcase: false,
    };
  }
}
