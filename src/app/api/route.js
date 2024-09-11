// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


export async function GET() {
    return Response.json({ message: 'world' })
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