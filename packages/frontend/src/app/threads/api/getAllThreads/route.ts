import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const page = url.searchParams.get("page");
}
