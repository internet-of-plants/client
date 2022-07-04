import type { Collection } from "@/models";
import * as HTTP from "@/http";

export interface CollectionContext {
  collectionId: number;
}

async function find(ctx: CollectionContext): Promise<Collection> {
  return await HTTP.get("/v1/collection", ctx);
}

const CollectionService = {
  find,
};
export default CollectionService;
