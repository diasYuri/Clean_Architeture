import { Request, Response, NextFunction } from 'express'

export const cors = (_req: Request, res: Response, next: NextFunction): void => {
  res.set('acess-control-allow-origins', '*')
  res.set('acess-control-allow-methods', '*')
  res.set('acess-control-allow-headers', '*')
  next()
}
