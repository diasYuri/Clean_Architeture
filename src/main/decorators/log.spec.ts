import { Controller, httpRequest, httpResponse } from '../../presentation/protocols'
import { LogControlllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: httpRequest): Promise<httpResponse> {
        const httpResponse: httpResponse = {
          statusCode: 200,
          body: {
            name: 'Any_name'
          }
        }
        return await new Promise(resolve => resolve(httpResponse))
      }
    }

    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControlllerDecorator(controllerStub)
    const httpRequest: httpRequest = {
      body: {
        email: 'any@mail.com',
        name: 'any_name',
        password: 'any123',
        passwordConfirmation: 'any123'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
