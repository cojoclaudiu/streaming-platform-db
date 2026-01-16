import { parseAsString, parseAsStringLiteral } from "nuqs/server";

export const collectionSearchParams = {
  q: parseAsString.withDefault(""),
  type: parseAsStringLiteral(["movie", "series"]),
};
