"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Typography, Tag, Button, theme } from "antd";
import { GlobalOutlined, ArrowRightOutlined } from "@ant-design/icons";

import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/i18n";
import { hrefLang } from "@/i18n/path";
import { normalizeUrl } from "@/utils/urlUtils";
import { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";
import "./RelatedBusinessCard.css";

const { Title, Text, Paragraph } = Typography;

type Props = {
  item: RelatedBusinessAPI;
  variant?: "directory" | "widget";
};

const RelatedBusinessCard: React.FC<Props> = ({ item, variant = "directory" }) => {
  const router = useRouter();
  const { language } = useLanguage();
  const { token } = theme.useToken();

  const compact = variant === "widget";
  const href = hrefLang(`/related-businesses/${item.slug}`, language as any);

  const tOpen = useMemo(() => t(language, "common.open"), [language]);
  const tWebsite = useMemo(() => t(language, "common.website"), [language]);

  // move related-business copy out of common
  const tViewProfile = useMemo(() => t(language, "relatedBusinesses.viewProfile"), [language]);
  const tProfileLabel = useMemo(() => t(language, "relatedBusinesses.profileLabel"), [language]);
  const tInitialsFallback = useMemo(() => t(language, "relatedBusinesses.initialsFallback"), [language]);

  const title = useMemo(() => {
    return t(language, item.title, item.slug || tProfileLabel).trim();
  }, [item.title, item.slug, language, tProfileLabel]);

  const subtitle = useMemo(() => t(language, item.subtitle ?? undefined, "").trim(), [item.subtitle, language]);
  const desc = useMemo(() => t(language, item.description ?? undefined, "").trim(), [item.description, language]);

  const initials = useMemo(() => {
    const tt = String(title || "").trim();
    const parts = tt.split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || tInitialsFallback;
  }, [title, tInitialsFallback]);

  const tags = useMemo(() => {
    const raw = Array.isArray(item.tags) ? item.tags : [];
    const limit = compact ? 2 : 3;

    return raw
      .filter(Boolean)
      .slice(0, limit)
      .map((tag: any, i: number) => {
        const key = tag?._id || `${tag?.value || "tag"}-${i}`;
        const label = String(tag?.value || "").trim();
        return { key, label };
      })
      .filter((x) => x.label.length > 0);
  }, [item.tags, compact]);

  const imageFit = useMemo<"cover" | "contain">(() => {
    const u = String(item.image || "").toLowerCase();
    if (u.includes("logo") || u.includes("brand") || u.includes("icon")) return "contain";
    return "cover";
  }, [item.image]);

  const openProfile = useCallback(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      const anyE: any = e;
      const meta = !!anyE?.metaKey || !!anyE?.ctrlKey || !!anyE?.shiftKey;

      if (meta) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(href);
    },
    [href, router]
  );

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const paddingTop = compact ? "52%" : "34%";
  const shadowBase = "0 6px 18px rgba(15, 23, 42, 0.06)";
  const shadowHover = "0 10px 26px rgba(15, 23, 42, 0.10)";

  const websiteUrl = useMemo(() => normalizeUrl(item.website), [item.website]);

  const cardStyleVars = {
    ["--rb-shadow" as any]: shadowBase,
    ["--rb-shadow-hover" as any]: shadowHover,
    ["--rb-cover-pt" as any]: paddingTop,
    ["--rb-bg-size" as any]: imageFit,
    ["--rb-cover-img" as any]: item.image ? `url(${item.image})` : "none",
  } as React.CSSProperties;

  return (
    <Link href={href} aria-label={`${tOpen} ${title}`} className="rbLink" style={{ display: "block" }}>
      <Card
        hoverable
        className={`rbCard ${compact ? "isCompact" : ""}`}
        tabIndex={0}
        onClick={(e) => {
          const anyE: any = e;
          if (anyE?.metaKey || anyE?.ctrlKey || anyE?.shiftKey) {
            e.preventDefault();
            openProfile(e);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProfile(e);
          }
        }}
        style={
          {
            ...cardStyleVars,
            borderRadius: 18,
            overflow: "hidden",
            height: "100%",
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
          } as React.CSSProperties
        }
        styles={{
          body: {
            padding: compact ? 16 : 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            height: "100%",
          },
          cover: { margin: 0 },
        }}
        cover={
          <div className="rbCover" aria-hidden={false}>
            {item.image ? (
              <div className="rbCoverImg" aria-hidden />
            ) : (
              <div className="rbCoverFallback" aria-hidden>
                <div className="rbInitials">{initials}</div>
              </div>
            )}

            <div className="rbCoverShadeTop" aria-hidden />
            <div className="rbCoverShadeBottom" aria-hidden />
          </div>
        }
      >
        <div className="rbHeader">
          <Title level={compact ? 5 : 4} className="rbTitle" ellipsis={{ rows: 1 }}>
            {title}
          </Title>

          {!!subtitle && (
            <Text type="secondary" className="rbSubtitle">
              {subtitle}
            </Text>
          )}
        </div>

        {tags.length > 0 && (
          <div className="rbTags">
            {tags.map((tg) => (
              <Tag key={tg.key} className="rbTag">
                {tg.label}
              </Tag>
            ))}
          </div>
        )}

        {!!desc && (
          <Paragraph className="rbDesc" ellipsis={{ rows: compact ? 2 : 3 }}>
            {desc}
          </Paragraph>
        )}

        <div className="rbBottom">
          <div className="rbFooter">
            {websiteUrl ? (
              <Button
                size={compact ? "small" : "middle"}
                icon={<GlobalOutlined />}
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                onClick={stop}
                onMouseDown={stop}
                className="rbBtn"
              >
                {!compact ? tWebsite : null}
              </Button>
            ) : (
              <span />
            )}

            <span className="rbCta">
              {tViewProfile} <ArrowRightOutlined />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RelatedBusinessCard;
