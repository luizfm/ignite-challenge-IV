import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase


describe('Get Balance UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  })

  it("should be able to get balance", async () => {
    process.env.JWT_SECRET = 'senhasupersecreta123'
    const user = await createUserUseCase.execute({
      name: 'Luiz',
      email: 'test@gmail.com',
      password: '1234test'
    })

    await authenticateUserUseCase.execute({
      email: 'test@gmail.com',
      password: '1234test'
    })

    const userBalance = await getBalanceUseCase.execute({ user_id: user.id || ''})
    expect(userBalance).toHaveProperty('balance')
  })

  it("should not be able to get balance from a non-existent user", () => {
    expect(async () => {
      process.env.JWT_SECRET = 'senhasupersecreta123'
      const user = await createUserUseCase.execute({
        name: 'Luiz',
        email: 'test@gmail.com',
        password: '1234test'
      })

      await authenticateUserUseCase.execute({
        email: 'test@gmail.com',
        password: '1234test'
      })

      await getBalanceUseCase.execute({ user_id: ''})
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to get balance from a non-authenticated user", () => {
    expect(async () => {
      process.env.JWT_SECRET = 'senhasupersecreta123'
      const user = await createUserUseCase.execute({
        name: 'Luizz',
        email: 'test@gmaill.com',
        password: '12344test'
      })

      const userBalance = await getBalanceUseCase.execute({ user_id: ''})
    }).rejects.toBeInstanceOf(AppError)
  })
})
