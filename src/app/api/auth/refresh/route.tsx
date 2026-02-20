
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserService from "@/services/UserService";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: "Missing refresh token cookie." },
        { status: 401 }
      );
    }

    const { deviceName } = await req.json().catch(() => ({}));
    if (!deviceName) {
      return NextResponse.json(
        { message: "Device name is required." },
        { status: 400 }
      );
    }

    const user = await userService.findRefreshToken(refreshToken);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid refresh token." },
        { status: 403 }
      );
    }

    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.json(
        { message: "Failed to verify refresh token." },
        { status: 403 }
      );
    }

    if (!payload?.userId) {
      return NextResponse.json(
        { message: "Invalid refresh token payload." },
        { status: 403 }
      );
    }

    
    const ok = await userService.findDeviceToken(user.id, refreshToken);
    if (!ok) {
      return NextResponse.json(
        { message: "Refresh token not recognized for this user/device." },
        { status: 403 }
      );
    }

    const refreshTokenExpiryTime = (payload.exp ?? 0) * 1000;
    const timeRemaining = refreshTokenExpiryTime - Date.now();

    let nextRefreshToken = refreshToken;

    
    if (timeRemaining < 7 * 24 * 60 * 60 * 1000) {
      const { token: newRefresh } = userService.generateRefreshToken(payload.userId as string);
      nextRefreshToken = newRefresh;

      
      await userService.deleteDeviceToken(user.id, refreshToken);
      await userService.saveDeviceToken(user.id, deviceName, nextRefreshToken);
    }

    const { token: newAccessToken, expirationTime: newAccessTokenExpiry } =
      userService.generateAccessToken(payload.userId as string);

    const res = NextResponse.json(
      { accessToken: newAccessToken, accessTokenExpiry: newAccessTokenExpiry },
      { status: 200 }
    );

    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    
    if (nextRefreshToken !== refreshToken) {
      res.cookies.set("refreshToken", nextRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return res;
  } catch (err) {
    console.error("Error during token refresh:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred during token refresh." },
      { status: 500 }
    );
  }
}
