import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import Fastify from 'fastify'
import z from 'zod'

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

const app = Fastify();
const prisma = new PrismaClient()

app.register(cors, {
  origin: true, //http://localhost:3000 para produção
})

app.get('/users', () => {
  const users = prisma.user.findMany()
  return users
})

app.get('/mensagens/:id_user', () => {
  const mensage = prisma.mensage.findMany({
    orderBy:{
      date: 'asc'
    }
  })
  return mensage
})

app.post('/users', async(request, reply) => {
  const createUser = z.object({
    email: z.string().email(),
    name: z.string().min(4),
    senha: z.string().min(4),
  })
  const {email, name, senha} = createUser.parse(request.body)
  await prisma.user.create({
    data: {
      email,
      name,
      senha,
    }
  })
  return reply.status(201).send({email, name, senha});
})
app.post('/mensages', async(request, reply) => {
  const createMessage = z.object({    
    mensage: z.string(),
    user_id: z.string(),    
  })
  const {mensage, user_id} = createMessage.parse(request.body)
  await prisma.mensage.create({
    data: {
     mensage,
     user_id,
    }
  })
  return reply.status(201).send(mensage);
})

app.listen({
  port: 3333,
}).then(()=> {
  console.log('HTTP Server runnig port:3333')
})
}
bootstrap()