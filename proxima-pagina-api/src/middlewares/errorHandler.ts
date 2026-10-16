import type { ErrorRequestHandler } from 'express'
import { Prisma } from '../generated/prisma/client'
import { ZodError } from 'zod'
import { HttpError } from '../errors/HttpError'

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next
  if (error instanceof ZodError) {
    response.status(400).json({
      erro: 'Dados inválidos',
      detalhes: error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      })),
    })
    return
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ erro: error.message })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    response.status(409).json({ erro: 'Este livro já está na sua biblioteca' })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    response.status(404).json({ erro: 'Registro não encontrado' })
    return
  }

  console.error(error)
  response.status(500).json({ erro: 'Erro interno do servidor' })
}
