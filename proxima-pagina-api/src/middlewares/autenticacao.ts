import { createHash } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env'
import { prisma } from '../config/prisma'
import { HttpError } from '../errors/HttpError'

declare module 'express-serve-static-core' {
  interface Request {
    usuarioId?: string
    usuarioEmail?: string
    usuarioNome?: string
  }
}

export const COOKIE_SESSAO = 'proxima_pagina_sessao'
export const DURACAO_SESSAO_MS = 7 * 24 * 60 * 60 * 1000

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function tokenDaRequisicao(request: Request) {
  const cookie = request.headers.cookie
    ?.split(';')
    .map((parte) => parte.trim())
    .find((parte) => parte.startsWith(`${COOKIE_SESSAO}=`))

  return cookie?.slice(COOKIE_SESSAO.length + 1)
}

export async function autenticacaoOpcional(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const token = tokenDaRequisicao(request)
    if (!token) {
      next()
      return
    }

    const sessao = await prisma.sessao.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    })

    if (!sessao) {
      next()
      return
    }
    if (sessao.expiraEm <= new Date()) {
      await prisma.sessao.delete({ where: { id: sessao.id } })
      next()
      return
    }

    request.usuarioId = sessao.usuario.id
    request.usuarioEmail = sessao.usuario.email
    request.usuarioNome = sessao.usuario.nome
    next()
  } catch (error) {
    next(error)
  }
}

export function exigirAutenticacao(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  if (!request.usuarioId) {
    next(new HttpError(401, 'Entre na sua conta para continuar'))
    return
  }
  next()
}

export function usuarioIdAutenticado(request: Request) {
  if (!request.usuarioId) throw new HttpError(401, 'Entre na sua conta para continuar')
  return request.usuarioId
}

export function cookieDeSessao(token: string, maxAge: number) {
  const secure = env.COOKIE_SECURE ? '; Secure' : ''
  return `${COOKIE_SESSAO}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(maxAge / 1000)}${secure}`
}
