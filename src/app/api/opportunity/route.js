// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function GET(req) {
    const { searchParams } = new URL(req.url)
    console.log("***************************")
    console.log(searchParams)
    console.log("***************************")
    if (searchParams.has('id')) {
        const id = searchParams.get('id')
        const data = await prisma.opportunity.findMany(
            {
                where: {
                    id: Number(id)
                }
            }
        )
        return Response.json(data)
    }
    else{
        const data = await prisma.opportunity.findMany()
        return Response.json(data)
    }
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