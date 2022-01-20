import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase


describe('Create Statement UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
  })

  it("should be able to create a statement", async () => {
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

    const statement = await createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      amount: 2000.00,
      description: 'salary',
      user_id: user.id || ''
    })

    expect(statement).toHaveProperty('id')
  })

  it("should not be able to create a statement from a non-existent user", () => {
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

      const statement = await createStatementUseCase.execute({
        type: OperationType.DEPOSIT,
        amount: 2000.00,
        description: 'salary',
        user_id: ''
      })

      expect(statement).toHaveProperty('id')
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to create a statement from a non-authenticated user", () => {
    expect(async () => {
      process.env.JWT_SECRET = 'senhasupersecreta123'
      const user = await createUserUseCase.execute({
        name: 'Luiz',
        email: 'test@gmail.com',
        password: '1234test'
      })

      const statement = await createStatementUseCase.execute({
        type: OperationType.DEPOSIT,
        amount: 2000.00,
        description: 'salary',
        user_id: ''
      })

      expect(statement).toHaveProperty('id')
    }).rejects.toBeInstanceOf(AppError)
  })
})
