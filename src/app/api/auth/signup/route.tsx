// /auth/signup
import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import {
  SESSION_HINT_COOKIE,
  SESSION_HINT_MAX_AGE_SECONDS,
  SESSION_HINT_COOKIE_VALUE,
} from "@/utils/auth/sessionHint";

const userService = new UserService();

export async function POST(request: Request) {
  try {
    const { email, password, username, deviceName } = await request.json();

    if (!email || !password || !username || !deviceName) {
      return NextResponse.json(
        { error: "Username, email, password, and device name are required." },
        { status: 400 }
      );
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email." },
        { status: 400 }
      );
    }

    const newUser = await userService.signup({ email, password, username });

    const { token: accessToken, expirationTime: accessTokenExpiry } =
      userService.generateAccessToken(newUser.id);

    const { token: refreshToken } = userService.generateRefreshToken(newUser.id);

    await userService.saveDeviceToken(newUser.id, deviceName, refreshToken);

    const safeUser = await userService.getUserByEmail(email);

    const res = NextResponse.json(
      { user: safeUser, accessToken, accessTokenExpiry },
      { status: 201 }
    );

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    res.cookies.set(SESSION_HINT_COOKIE, SESSION_HINT_COOKIE_VALUE, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_HINT_MAX_AGE_SECONDS,
    });

    return res;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
