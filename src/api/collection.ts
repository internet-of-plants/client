import type { Collection } from "@/models";
import * as HTTP from "@/http";

export interface CollectionContext {
  collectionId: number;
}

async function find(ctx: CollectionContext): Promise<Collection> {
  return await HTTP.get("/v1/collection", ctx);
}

export interface NameUpdateContext extends CollectionContext {
  name: string;
}

async function setName(ctx: NameUpdateContext): Promise<void> {
  await HTTP.post("/v1/collection/name", ctx);
}


const CollectionService = {
  find,
  setName,
};
export default CollectionService;
