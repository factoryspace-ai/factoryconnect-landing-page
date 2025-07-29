import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const header = req.headers

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/user`, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body)
        });
        const data = await response.json()
        return NextResponse.json(data, {status: response.status})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const header = req.headers
        const user_id = req.nextUrl.searchParams.get("user_id")
        if (user_id) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/user/${user_id}`, {
                method: "GET",
                headers: header,
            });
            const data = await response.json()
            return NextResponse.json(data, {status: response.status})
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/user/`, {
            method: "GET",
            headers: header,
        });
        const data = await response.json()
        return NextResponse.json(data, {status: response.status})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        const header = req.headers
        const user_id = req.nextUrl.searchParams.get("user_id")
        if (!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/user/${user_id}`, {
            method: "PUT",
            headers: header,
            body: JSON.stringify(body)
        });
        const data = await response.json()
        return NextResponse.json(data, {status: response.status})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const header = req.headers
        const user_id = req.nextUrl.searchParams.get("user_id")
        if (!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/user/${user_id}`, {
            method: "DELETE",
            headers: header,
        });
        const data = await response.json()
        return NextResponse.json(data, {status: response.status})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
