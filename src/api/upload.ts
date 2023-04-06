import * as HTTP from '@/http'

export interface UploadContext {
  organizationId: number
  collectionId: number
  deviceId: number
  form: FormData
}

async function create(ctx: UploadContext) {
  await HTTP.post(
    `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}/update`,
    ctx.form
  )
}

async function useFirmware(ctx: UploadContext) {
  await HTTP.post(
    `/v1/organization/${ctx.organizationId}/collection/${ctx.collectionId}/device/${ctx.deviceId}/update`,
    ctx.form
  )
}

const UploadService = {
  create,
  useFirmware
}
export default UploadService
