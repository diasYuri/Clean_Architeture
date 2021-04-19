import { Request, Response } from 'express'
import { Controller, httpRequest, httpResponse } from '../../presentation/protocols'

export const adaptRoutes = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: httpRequest = {
      body: req.body
    }

    const httpResponse: httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
