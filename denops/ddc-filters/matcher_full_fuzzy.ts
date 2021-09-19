import {
  BaseFilter,
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.11.0/types.ts#^";
import{
  FilterArguments,
} from "https://deno.land/x/ddc_vim@v0.11.0/base/filter.ts#^";
import { fuzzyEscape } from "./matcher_fuzzy.ts";

type Params = {
  camelcase: boolean;
};

export class Filter extends BaseFilter<Params> {
  filter({
    sourceOptions,
    filterParams,
    completeStr,
    candidates,
  }: FilterArguments<Params>): Promise<Candidate[]> {
    if (sourceOptions.ignoreCase) {
      completeStr = completeStr.toLowerCase();
    }
    const pattern = new RegExp(
      fuzzyEscape(completeStr, filterParams.camelcase as boolean),
    );
    if (sourceOptions.ignoreCase) {
      return Promise.resolve(candidates.filter(
        (candidate) => candidate.word.toLowerCase().match(pattern),
      ));
    } else {
      return Promise.resolve(candidates.filter(
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
