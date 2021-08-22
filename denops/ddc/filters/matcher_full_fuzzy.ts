import {
  BaseFilter,
  Candidate,
  SourceOptions,
} from "./deps.ts";
import { fuzzy_escape } from "./matcher_fuzzy.ts";

type Params = {
  camelcase: boolean;
};

export class Filter extends BaseFilter {
  filter(args:{
    sourceOptions: SourceOptions,
    filterParams: Record<string, unknown>,
    completeStr: string,
    candidates: Candidate[],
  }): Promise<Candidate[]> {
    let completeStr = args.completeStr;
    if (args.sourceOptions.ignoreCase) {
      completeStr = completeStr.toLowerCase();
    }
    const pattern = new RegExp(
      fuzzy_escape(completeStr, args.filterParams.camelcase as boolean),
    );
    if (args.sourceOptions.ignoreCase) {
      return Promise.resolve(args.candidates.filter(
        (candidate) => candidate.word.toLowerCase().match(pattern),
      ));
    } else {
      return Promise.resolve(args.candidates.filter(
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
