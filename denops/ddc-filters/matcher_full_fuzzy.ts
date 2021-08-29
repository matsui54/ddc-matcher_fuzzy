import {
  BaseFilter,
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.4.1/types.ts#^";
import{
  FilterArguments,
} from "https://deno.land/x/ddc_vim@v0.4.1/base/filter.ts#^";
import { fuzzy_escape } from "./matcher_fuzzy.ts";

type Params = {
  camelcase: boolean;
};

export class Filter extends BaseFilter {
  filter({
    sourceOptions,
    filterParams,
    completeStr,
    candidates,
  }: FilterArguments): Promise<Candidate[]> {
    if (sourceOptions.ignoreCase) {
      completeStr = completeStr.toLowerCase();
    }
    const pattern = new RegExp(
      fuzzy_escape(completeStr, filterParams.camelcase as boolean),
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

  params(): Record<string, unknown> {
    const params: Params = {
      camelcase: false,
    };
    return params as unknown as Record<string, unknown>;
  }
}
