// /auth/login
import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/UserService";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const { email, password, deviceName } = await req.json();

    if (!email || !password || !deviceName) {
      return NextResponse.json(
        { message: "Email, password, and device name are required." },
        { status: 400 }
      );
    }

    const user = await userService.getAuthUserByEmail(email);
    if (!user || !userService.verifyPassword(password, user)) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const { token: accessToken, expirationTime: accessTokenExpiry } =
      userService.generateAccessToken(user.id);

    const { token: refreshToken } = userService.generateRefreshToken(user.id);

    await userService.saveDeviceToken(user.id, deviceName, refreshToken);

    const safeUser = await userService.getUserByEmail(email);

    const res = NextResponse.json(
      { user: safeUser, accessToken, accessTokenExpiry },
      { status: 200 }
    );

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
