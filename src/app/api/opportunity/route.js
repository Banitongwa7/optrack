// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function GET() {
    const data = await prisma.opportunity.findMany()

    return Response.json(data)
}

export async function POST() {
    const data = [
        {
            id: 1,
            name: 'John Doe'
        },
        {
            id: 2,
            name: 'Jane Doe'
        }
    ]

    return Response.json(data)
}