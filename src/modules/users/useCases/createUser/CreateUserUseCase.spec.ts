import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create User UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: 'Luiz',
      email: 'luiz.ado@hotmail.com',
      password: '1234teste'
    })

    expect(user).toHaveProperty('id')
  })

  it("should not be able to create a user with an existent email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Luiz',
        email: 'luiz.ado@hotmail.com',
        password: '1234teste'
      })

      await createUserUseCase.execute({
        name: 'Luiz',
        email: 'luiz.ado@hotmail.com',
        password: '1234teste'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
