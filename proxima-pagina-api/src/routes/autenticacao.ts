import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { Router, type Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma'
import {
  autenticacaoOpcional,
  cookieDeSessao,
  DURACAO_SESSAO_MS,
  hashToken,
  tokenDaRequisicao,
} from '../middlewares/autenticacao'
import { HttpError } from '../errors/HttpError'

const router = Router()
const scrypt = promisify(scryptCallback)
const credenciaisSchema = z.object({
  email: z.string().trim().email().max(254),
  senha: z.string().min(8).max(128),
}).strict()
const cadastroSchema = credenciaisSchema.extend({
  nome: z.string().trim().min(1).max(80),
}).strict()

async function gerarHashSenha(senha: string) {
  const salt = randomBytes(16)
  const hash = await scrypt(senha, salt, 64) as Buffer
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

async function validarSenha(senha: string, registro: string) {
  const [saltHex, hashHex] = registro.split(':')
  if (!saltHex || !hashHex || !/^[a-f0-9]+$/i.test(saltHex) || !/^[a-f0-9]+$/i.test(hashHex)) {
    return false
  }

  const hashEsperado = Buffer.from(hashHex, 'hex')
  const hashRecebido = await scrypt(senha, Buffer.from(saltHex, 'hex'), hashEsperado.length) as Buffer
  return hashEsperado.length === hashRecebido.length &&
    timingSafeEqual(hashEsperado, hashRecebido)
}

async function criarSessao(usuarioId: string, response: Response) {
  const token = randomBytes(32).toString('hex')
  const expiraEm = new Date(Date.now() + DURACAO_SESSAO_MS)

  await prisma.sessao.create({
    data: { tokenHash: hashToken(token), usuarioId, expiraEm },
  })
  response.setHeader('Set-Cookie', cookieDeSessao(token, DURACAO_SESSAO_MS))
}

router.get('/me', autenticacaoOpcional, (request, response) => {
  response.json({
    usuario: request.usuarioId
      ? {
          id: request.usuarioId,
          nome: request.usuarioNome,
          email: request.usuarioEmail,
        }
      : null,
  })
})

router.post('/cadastro', async (request, response) => {
  const dados = cadastroSchema.parse(request.body)
  const email = dados.email.toLowerCase()
  const senhaHash = await gerarHashSenha(dados.senha)
  const usuario = await prisma.usuario.create({
    data: { nome: dados.nome, email, senhaHash },
    select: { id: true, nome: true, email: true },
  })

  await criarSessao(usuario.id, response)
  response.status(201).json({ usuario })
})

router.post('/login', async (request, response) => {
  const dados = credenciaisSchema.parse(request.body)
  const usuario = await prisma.usuario.findUnique({
    where: { email: dados.email.toLowerCase() },
  })

  if (!usuario || !(await validarSenha(dados.senha, usuario.senhaHash))) {
    throw new HttpError(401, 'E-mail ou senha incorretos')
  }

  await criarSessao(usuario.id, response)
  response.json({
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
  })
})

router.post('/logout', autenticacaoOpcional, async (request, response) => {
  const token = tokenDaRequisicao(request)
  if (token) {
    await prisma.sessao.deleteMany({ where: { tokenHash: hashToken(token) } })
  }
  response.setHeader('Set-Cookie', cookieDeSessao('', 0))
  response.status(204).end()
})

export default router
