import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const header = req.headers
        const skip = req.nextUrl.searchParams.get("skip")
        const limit = req.nextUrl.searchParams.get("limit")
        const msme_id = req.nextUrl.searchParams.get("msme_id")
        if (msme_id) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/msme/${msme_id}`, {
                method: "GET",
                headers: header,
            });
            const data = await response.json()
            return NextResponse.json(data, { status: response.status })
        }

        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/msme/?` + `${skip ? `skip=${skip}` : ""}&limit=${limit}`, {
        //     method: "GET",
        //     headers: header,
        // });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/msme/?skip=0&limit=100`, {
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
        const creator_user_id = req.nextUrl.searchParams.get("creator_user_id")
        if (!creator_user_id) {
            return NextResponse.json({ error: "Creator User ID is required" }, { status: 400 })
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/msme?creator_user_id=${creator_user_id}`, {
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

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        const header = req.headers
        const msme_id = req.nextUrl.searchParams.get("msme_id")
        if (!msme_id) {
            return NextResponse.json({ error: "MSME ID is required" }, { status: 400 })
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/msme/${msme_id}`, {
            method: "PUT",
            headers: header,
            body: JSON.stringify(body)
        });
        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const header = req.headers
        const msme_id = req.nextUrl.searchParams.get("msme_id")
        if (!msme_id) {
            return NextResponse.json({ error: "MSME ID is required" }, { status: 400 })
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usmsm/msme/${msme_id}`, {
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
