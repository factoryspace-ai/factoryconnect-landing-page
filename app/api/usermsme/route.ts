import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const header = req.headers
        const skip = req.nextUrl.searchParams.get("skip")
        const limit = req.nextUrl.searchParams.get("limit")
        const user_id = req.nextUrl.searchParams.get("user_id")
        const msme_id = req.nextUrl.searchParams.get("msme_id")
        const association_id = req.nextUrl.searchParams.get("association_id")
        if (user_id) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/usermsme/user/${user_id}`, {
                method: "GET",
                headers: header,
            });
            const data = await response.json()
            return NextResponse.json(data, { status: response.status })
        }

        if (msme_id) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/usermsme/msme/${msme_id}`, {
                method: "GET",
                headers: header,
            });
            const data = await response.json()
            return NextResponse.json(data, { status: response.status })
        }

        if (association_id) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/usermsme/${association_id}`, {
                method: "GET",
                headers: header,
            });
            const data = await response.json()
            return NextResponse.json(data, { status: response.status })
        }

        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/usermsme`+`${skip ? `skip=${skip}` : ""}&limit=${limit}`, {
        //     method: "GET",
        //     headers: header,
        // });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/usermsme/?skip=1&limit=100`, {
            method: "GET",
            headers: header,
        });
        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const header = req.headers
        console.log(body)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/usermsme/`, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body)
        });
        const data = await response.json()
        console.log(data)
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const header = req.headers
        const association_id = req.nextUrl.searchParams.get("association_id")
        if (!association_id) {
            return NextResponse.json({ error: "Association ID is required" }, { status: 400 })
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/usermsme/${association_id}`, {
            method: "DELETE",
            headers: header,
        });
        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}