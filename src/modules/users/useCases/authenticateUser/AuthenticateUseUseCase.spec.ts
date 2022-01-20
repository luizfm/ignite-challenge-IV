import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Authenticate User UseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
  })

  it("should be able to authenticate a user", async () => {
    process.env.JWT_SECRET = 'senhasupersecreta123'
    await createUserUseCase.execute({
      name: 'Luiz',
      email: 'teste@gmail.com',
      password: '1234test'
    })

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: 'teste@gmail.com',
      password: '1234test'
    })

    expect(authenticatedUser).toHaveProperty('token')
  })

  it("should not be able to authenticate a user with a wrong email", () => {
    expect(async () => {
      process.env.JWT_SECRET = 'senhasupersecreta123'
      await createUserUseCase.execute({
        name: 'Luiz',
        email: 'teste@gmail.com',
        password: '1234test'
      })

      const authenticatedUser = await authenticateUserUseCase.execute({
        email: 'teste@gmail.co',
        password: '1234test'
      })

      expect(authenticatedUser).toHaveProperty('token')
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to authenticate a user with a wrong password", () => {
    expect(async () => {
      process.env.JWT_SECRET = 'senhasupersecreta123'
      await createUserUseCase.execute({
        name: 'Luiz',
        email: 'teste@gmail.com',
        password: '1234test'
      })

      const authenticatedUser = await authenticateUserUseCase.execute({
        email: 'teste@gmail.com',
        password: '1234tes'
      })

      expect(authenticatedUser).toHaveProperty('token')
    }).rejects.toBeInstanceOf(AppError)
  })
})
