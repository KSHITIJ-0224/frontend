import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Client-side protection is used instead
  // See: app/dashboard/page.tsx for authentication check
  return NextResponse.next();
}
