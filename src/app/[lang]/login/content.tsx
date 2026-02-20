"use client";

import { Button, Input, Form, Alert, Card } from "antd";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SubLoader from "@/components/loaders/SubLoader";
import { useUser } from "@/hooks/useUser";
import { DEFAULT_LANG, isSupportedLanguageLocal, type SupportedLanguage } from "@/i18n/languages";

function getLangFromPath(pathname: string | null): SupportedLanguage {
  const seg = (pathname?.split("/")[1] || "").trim();
  return (seg && isSupportedLanguageLocal(seg) ? seg : DEFAULT_LANG) as SupportedLanguage;
}

function sanitizeRedirect(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v.startsWith("/")) return null;
  if (v.startsWith("//")) return null;
  if (v.includes("\r") || v.includes("\n")) return null;
  return v;
}

function ensureLangPrefix(path: string, lang: SupportedLanguage): string {
  if (path === "/") return `/${lang}`;
  const seg = (path.split("/")[1] || "").trim();
  if (seg && isSupportedLanguageLocal(seg)) return path;
  return `/${lang}${path}`;
}

function normalizePostLoginTarget(redirect: string | null, lang: SupportedLanguage): string {
  const safe = sanitizeRedirect(redirect);
  if (!safe) return `/${lang}`;
  if (safe.startsWith("/dashboard") || safe.startsWith("/api")) return safe;
  return ensureLangPrefix(safe, lang);
}

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const lang = useMemo(() => getLangFromPath(pathname), [pathname]);
  const redirectParam = searchParams.get("redirect");
  const target = useMemo(() => normalizePostLoginTarget(redirectParam, lang), [redirectParam, lang]);

  const { user, signIn, loading: sessionLoading, initialLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    router.replace(target);
  }, [user, target, router]);

  if (initialLoading || sessionLoading) return <SubLoader tip="Checking session..." />;

  if (user) return <SubLoader tip="Redirecting..." />;

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await signIn(values.email, values.password);
      router.replace(target);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%" }}>
      <Card title="Login" style={{ width: "100%", maxWidth: "400px" }}>
        {error && <Alert message="Login Error" description={error} type="error" showIcon closable style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please input your email!" }]}>
            <Input placeholder="Email" size="large" autoComplete="email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password placeholder="Password" size="large" autoComplete="current-password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} disabled={loading} size="large">
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          Don&apos;t have an account? <a href={`/${lang}/signup`}>Sign Up</a>
        </div>
      </Card>
    </div>
  );
}
