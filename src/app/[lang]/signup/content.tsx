"use client";

import { Button, Input, Form, Alert, Card } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import SubLoader from "@/components/loaders/SubLoader";
import { DEFAULT_LANG, isSupportedLanguageLocal, type SupportedLanguage } from "@/i18n/languages";

function getLangFromPath(pathname: string | null): SupportedLanguage {
  const seg = (pathname?.split("/")[1] || "").trim();
  return (seg && isSupportedLanguageLocal(seg) ? seg : DEFAULT_LANG) as SupportedLanguage;
}

export default function SignupContent() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = useMemo(() => getLangFromPath(pathname), [pathname]);

  const { user, signUp, initialLoading } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    if (!user) return;
    router.replace("/dashboard"); 
  }, [user, router, lang]);

  if (initialLoading) return <SubLoader tip="Checking session..." />;
  if (user) return <SubLoader tip="Redirecting..." />;

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await signUp(values.username, values.email, values.password);
      
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%", padding: 16 }}>
      <Card title="Sign Up" style={{ width: "100%", maxWidth: 400, borderRadius: 8 }}>
        {error && (
          <Alert title="Signup Error" description={error} type="error" showIcon closable style={{ marginBottom: 16 }} />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ username: "", email: "", password: "" }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please input your username!" },
              { pattern: /^[a-z0-9]+$/, message: "Username must be lowercase and contain no spaces." },
            ]}
          >
            <Input placeholder="Username" size="large" autoComplete="username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input placeholder="Email" size="large" autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters long." },
            ]}
          >
            <Input.Password placeholder="Password" size="large" autoComplete="new-password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} disabled={loading} size="large">
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          Already have an account? <a href={`/${lang}/login`}>Log In</a>
        </div>
      </Card>
    </div>
  );
}
