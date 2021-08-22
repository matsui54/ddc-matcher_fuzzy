import {
  BaseFilter,
  Candidate,
  SourceOptions,
} from "./deps.ts";

export function fuzzy_escape(str: string, camelcase: boolean): string {
  // escape special letters
  let p = str.replaceAll(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&");
  p = p.replaceAll(/([a-zA-Z0-9])/g, "$1.*");
  if (camelcase && str.search(/[A-Z]/) != -1) {
    p = p.replaceAll(
      /([a-z])/g,
      ((pat) => `[${pat.concat(pat.toUpperCase())}]`),
    );
  }
  p = p.replaceAll(/([a-zA-Z0-9_])\.\*/g, "$1[^$1]*");
  return p;
}

type Params = {
  camelcase: boolean;
};

export class Filter extends BaseFilter {
  filter(args: {
    sourceOptions: SourceOptions;
    filterParams: Record<string, unknown>;
    completeStr: string;
    candidates: Candidate[];
  }): Promise<Candidate[]> {
    let completeStr = args.completeStr;
    if (!args.completeStr) {
      return Promise.resolve(args.candidates);
    }
    let pattern: RegExp;
    if (args.sourceOptions.ignoreCase) {
      completeStr = completeStr.toLowerCase();
    }
    pattern = new RegExp(
      "^" + fuzzy_escape(completeStr, args.filterParams.camelcase as boolean),
    );

    if (args.sourceOptions.ignoreCase) {
      return Promise.resolve(args.candidates.filter(
        (candidate) => candidate.word.toLowerCase().search(pattern) != -1,
      ));
    } else {
      return Promise.resolve(args.candidates.filter(
        (candidate) => candidate.word.search(pattern) != -1,
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
