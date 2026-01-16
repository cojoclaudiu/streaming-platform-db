import { createSerializer } from "nuqs/server";
import { collectionSearchParams } from "./collection-search-params";

export const serializeCollection = createSerializer(collectionSearchParams, {
  processUrlSearchParams: (search) => {
    // keeps URLs stable for SEO
    search.sort();
    return search;
  },
});
