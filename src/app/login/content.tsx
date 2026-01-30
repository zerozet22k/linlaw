"use client";

import { Button, Input, Form, Alert, Card } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SubLoader from "@/components/loaders/SubLoader";
import { useUser } from "@/hooks/useUser";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { user, signIn, loading: sessionLoading, initialLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (initialLoading || sessionLoading) {
    return <SubLoader tip="Checking session..." />;
  }

  if (user) {
    // if your useUser() already redirects internally, this is fine.
    // if not, you can push here:
    // router.push(redirect || "/");
    return <SubLoader tip="Redirecting..." />;
  }

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      await signIn(values.email, values.password);

      // optional: handle redirect explicitly if signIn doesn't do it
      if (redirect) router.push(redirect);
      else router.push("/");
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Card
        title="Login"
        style={{
          width: "100%",
          maxWidth: "400px",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {error && (
          <Alert
            message="Login Error"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "16px" }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" size="large" autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={loading}
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </div>
      </Card>
    </div>
  );
}
