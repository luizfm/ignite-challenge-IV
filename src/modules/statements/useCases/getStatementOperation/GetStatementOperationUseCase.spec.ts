import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let authenticateUserUseCase: AuthenticateUserUseCase


describe('Get Balance UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
  })

  it("should be able to get statements operations", async () => {
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
      user_id: user.id || '',
      type: OperationType.DEPOSIT,
      amount: 1500.00,
      description: 'salary'
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id || '',
      statement_id: statement.id || ''
    })

    expect(statementOperation).toHaveProperty('id')
  })

  it("should not be able to get statements operations from a non-existent user", async () => {
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
        user_id: user.id || '',
        type: OperationType.DEPOSIT,
        amount: 1500.00,
        description: 'salary'
      })

      await getStatementOperationUseCase.execute({
        user_id: '',
        statement_id: statement.id || ''
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to get statements operations from a non-authenticated user", async () => {
    expect(async () => {
      process.env.JWT_SECRET = 'senhasupersecreta123'
      const user = await createUserUseCase.execute({
        name: 'Luiz',
        email: 'test@gmail.com',
        password: '1234test'
      })

      const statement = await createStatementUseCase.execute({
        user_id: user.id || '',
        type: OperationType.DEPOSIT,
        amount: 1500.00,
        description: 'salary'
      })

      await getStatementOperationUseCase.execute({
        user_id: '',
        statement_id: statement.id || ''
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
