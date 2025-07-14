import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";

const userService = new UserService();

async function handle(_req: Request, params: { id: string }) {
  try {
    const user = await userService.getUserById(params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    console.error("Error fetching team member:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = (req: Request, context: { params: { id: string } }) =>
  withAuthMiddleware((r) => handle(r, context.params), false, [])(req);
