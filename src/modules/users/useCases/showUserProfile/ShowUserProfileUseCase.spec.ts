import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let usersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase

describe('Show user profile UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository
    createUserUseCase = new CreateUserUseCase(usersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
  })

  it("should be able to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: 'Luiz',
      email: 'teste@gmail.com',
      password: '1234test'
    })

    const userProfile = await showUserProfileUseCase.execute(user.id || '')
    expect(userProfile).toHaveProperty('id')
  })

  it("should not be able to show a profile from a non-existent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute('')
    }).rejects.toBeInstanceOf(AppError)
  })
})
