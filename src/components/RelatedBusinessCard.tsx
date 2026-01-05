"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Typography, Tag, Button, theme } from "antd";
import { GlobalOutlined, ArrowRightOutlined } from "@ant-design/icons";

import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText, LanguageJson } from "@/utils/getTranslatedText";
import { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

const { Title, Text, Paragraph } = Typography;

type Props = {
  item: RelatedBusinessAPI;
  variant?: "directory" | "widget";
};

const getFallbackEn = (obj: any) => String(obj?.en ?? "").trim();

const pickText = (v: any, lang: string) => {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
  return (getTranslatedText(v as LanguageJson, lang) || "").trim();
};

const RelatedBusinessCard: React.FC<Props> = ({ item, variant = "directory" }) => {
  const router = useRouter();
  const { language } = useLanguage();
  const { token } = theme.useToken();

  const compact = variant === "widget";
  const href = `/related-businesses/${item.slug}`;

  const title = useMemo(() => {
    return (
      pickText(item.title, language) ||
      getFallbackEn(item.title) ||
      String(item.slug || "Profile")
    );
  }, [item.title, item.slug, language]);

  const subtitle = useMemo(() => pickText(item.subtitle, language), [item.subtitle, language]);
  const desc = useMemo(() => pickText(item.description, language), [item.description, language]);

  const initials = useMemo(() => {
    const t = String(title || "").trim();
    const parts = t.split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((s) => s[0]?.toUpperCase()).join("") || "RB";
  }, [title]);

  const tags = useMemo(() => {
    const raw = Array.isArray(item.tags) ? item.tags : [];
    const limit = compact ? 2 : 3;

    return raw
      .filter(Boolean)
      .slice(0, limit)
      .map((t: any, i: number) => ({
        key: t?._id || `${t?.value || "tag"}-${i}`,
        label:
          typeof t?.value === "string"
            ? t.value
            : pickText(t?.value, language) || String(t?.value || ""),
      }))
      .filter((t) => t.label.trim().length > 0);
  }, [item.tags, compact, language]);

  const imageFit = useMemo<"cover" | "contain">(() => {
    const u = String(item.image || "").toLowerCase();
    // crude but works well for partner logos/banners
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

  // ratio: directory cards should feel “banner-ish”, not tall
  const paddingTop = compact ? "52%" : "34%";

  // single-source-of-truth shadows (no Ant hover shadow fighting you)
  const shadowBase = "0 6px 18px rgba(15, 23, 42, 0.06)";
  const shadowHover = "0 10px 26px rgba(15, 23, 42, 0.10)";

  return (
    <>
      <Link href={href} aria-label={`Open ${title}`} style={{ display: "block" }}>
        <Card
          hoverable
          className="rbCard"
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
              borderRadius: 18,
              overflow: "hidden",
              height: "100%",
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              // CSS vars used by global styles below
              ["--rb-shadow" as any]: shadowBase,
              ["--rb-shadow-hover" as any]: shadowHover,
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
            <div className="rbCover" style={{ paddingTop }}>
              {item.image ? (
                <div
                  className="rbCoverImg"
                  style={
                    {
                      backgroundImage: `url(${item.image})`,
                      ["--rb-bg-size" as any]: imageFit,
                    } as React.CSSProperties
                  }
                />
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
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
            <Title
              level={compact ? 5 : 4}
              style={{ margin: 0, lineHeight: 1.18 }}
              ellipsis={{ rows: 1 }}
            >
              {title}
            </Title>

            {!!subtitle && (
              <Text
                type="secondary"
                style={{
                  display: "block",
                  lineHeight: 1.35,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {subtitle}
              </Text>
            )}
          </div>

          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.map((t) => (
                <Tag key={t.key} className="rbTag">
                  {t.label}
                </Tag>
              ))}
            </div>
          )}

          {!!desc && (
            <Paragraph
              className="rbDesc"
              style={{ margin: 0 }}
              ellipsis={{ rows: compact ? 2 : 3 }}
            >
              {desc}
            </Paragraph>
          )}

          <div style={{ marginTop: "auto", paddingTop: 8 }}>
            <div className="rbFooter">
              {item.website ? (
                <Button
                  size={compact ? "small" : "middle"}
                  icon={<GlobalOutlined />}
                  href={item.website}
                  target="_blank"
                  rel="noreferrer"
                  onClick={stop}
                  onMouseDown={stop}
                  className="rbBtn"
                >
                  {!compact ? "Website" : null}
                </Button>
              ) : (
                <span />
              )}

              <span className="rbCta">
                View profile <ArrowRightOutlined />
              </span>
            </div>
          </div>
        </Card>
      </Link>

      <style jsx global>{`
        /* kill Ant default hover shadow + use ours */
        .rbCard.ant-card {
          box-shadow: var(--rb-shadow) !important;
          transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
          will-change: transform;
        }
        .rbCard.ant-card-hoverable:hover {
          transform: translateY(-1px);
          box-shadow: var(--rb-shadow-hover) !important;
        }

        .rbCard.ant-card:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.10), var(--rb-shadow) !important;
        }

        .rbCover {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(2, 6, 23, 0.10), rgba(2, 6, 23, 0.03));
        }

        .rbCoverImg {
          position: absolute;
          inset: 0;
          background-position: center;
          background-repeat: no-repeat;
          background-size: var(--rb-bg-size, cover);
          /* IMPORTANT: no transform scale -> reduces blur */
          transform: none;
        }

        .rbCoverFallback {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
        }

        .rbInitials {
          width: 52px;
          height: 52px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: rgba(2, 6, 23, 0.75);
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(2, 6, 23, 0.10);
          backdrop-filter: blur(6px);
        }

        .rbCoverShadeTop {
          position: absolute;
          inset: 0;
          background: radial-gradient(600px 220px at 20% 0%, rgba(2, 6, 23, 0.14), rgba(2, 6, 23, 0) 62%);
          pointer-events: none;
        }

        .rbCoverShadeBottom {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 56%, rgba(255, 255, 255, 0.92) 100%);
          pointer-events: none;
        }

        .rbTag.ant-tag {
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 12px;
          background: rgba(2, 6, 23, 0.03);
          border: 1px solid rgba(2, 6, 23, 0.08);
          color: rgba(2, 6, 23, 0.78);
          margin-inline-end: 0;
        }

        .rbDesc {
          color: rgba(15, 23, 42, 0.76);
          line-height: 1.55;
        }

        .rbFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .rbBtn.ant-btn {
          border-radius: 999px;
          border-color: rgba(15, 23, 42, 0.18);
        }

        .rbCta {
          color: rgba(15, 23, 42, 0.72);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          user-select: none;
        }

        .rbCard.ant-card-hoverable:hover .rbCta {
          color: rgba(15, 23, 42, 0.92);
        }
      `}</style>
    </>
  );
};

export default RelatedBusinessCard;
