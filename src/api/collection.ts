import type { Collection } from '@/models'
import * as HTTP from '@/http'

export interface NameUpdateContext {
  collectionId: number
  name: string
}

async function setName(ctx: NameUpdateContext): Promise<void> {
  await HTTP.post('/v1/collection/name', ctx)
}

const CollectionService = {
  setName
}
export default CollectionService
