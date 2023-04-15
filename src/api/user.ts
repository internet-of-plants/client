import type { User } from '@/models'
import * as HTTP from '@/http'

async function find(): Promise<User> {
  return await HTTP.get('/v1/user')
}

interface LoginRequest {
  email: string
  password: string
}

async function login(login: LoginRequest): Promise<string> {
  return await HTTP.postRaw('/v1/user/login', login)
}

interface SignupRequest {
  email: string
  username: string
  password: string
  organizationName: string
}

async function signup(signup: SignupRequest): Promise<string> {
  return await HTTP.postRaw('/v1/user', signup)
}

const UserService = {
  find,
  login,
  signup
}
export default UserService
