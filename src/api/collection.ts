import type { CollectionView } from "@/models";
import * as HTTP from "@/http";

export interface CollectionContext {
  organizationId: number;
  collectionId: number;
}

async function find(ctx: CollectionContext): Promise<CollectionView> {
  return await HTTP.get(
    `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}`
  );
}

const CollectionService = {
  find,
};
export default CollectionService;
