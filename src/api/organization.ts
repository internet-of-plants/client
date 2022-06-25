import { Organization, } from "@/models";
import * as HTTP from "@/http";

async function list(): Promise<Organization[]> {
  return await HTTP.get("/v1/organizations");
}

async function find(organizationId: number): Promise<Organization> {
  return await HTTP.get("/v1/organization",{organizationId});
}

const OrganizationService = {
  list,
  find,
};
export default OrganizationService;
