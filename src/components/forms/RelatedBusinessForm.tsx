"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    message,
    Row,
    Col,
    Select,
    Switch,
    InputNumber,
    Spin,
    Alert,
    Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import LanguageJsonTextInput from "../inputs/standalone/LanguageJsonTextInput";
import LanguageJsonTextarea from "../inputs/standalone/LanguageJsonTextarea";
import ImageSelector from "@/components/inputs/standalone/ImageSelection";

const DAY_OPTIONS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
].map((d) => ({ label: d, value: d }));

const PLATFORM_OPTIONS = [
    { label: "Facebook", value: "facebook" },
    { label: "Instagram", value: "instagram" },
    { label: "Twitter", value: "twitter" },
    { label: "LinkedIn", value: "linkedin" },
];

const TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/;

const slugify = (s: string) =>
    (s || "")
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const isValidUrl = (s?: string) => {
    if (!s) return true;
    try {
        const u = new URL(s);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

// Your rule: EN is the source-of-truth.
const getEn = (obj: any) => String(obj?.en ?? "").trim();

type Props = {
    business?: any;
};

const RelatedBusinessForm: React.FC<Props> = ({ business }) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const isEdit = Boolean(business?._id);

    // "slugTouched" means: user typed slug manually (so we stop auto-generating)
    const slugTouchedRef = useRef(false);

    // prevent onValuesChange from treating programmatic slug writes as "user typed"
    const programmaticSlugRef = useRef(false);

    useEffect(() => {
        slugTouchedRef.current = false;
        programmaticSlugRef.current = false;

        if (business) {
            form.setFieldsValue({
                slug: business.slug ?? "",
                isActive: business.isActive ?? true,
                order: business.order ?? 0,
                title: business.title ?? { en: "" },
                subtitle: business.subtitle ?? {},
                description: business.description ?? {},
                image: business.image ?? "",
                website: business.website ?? "",
                email: business.email ?? "",
                address: business.address ?? "",
                mapLink: business.mapLink ?? "",
                contacts: business.contacts ?? [],
                operatingHours: business.operatingHours ?? [],
                tags: business.tags ?? [],
                socialLinks: business.socialLinks ?? [],
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                isActive: true,
                order: 0,
                slug: "",
                title: { en: "" },
                subtitle: {},
                description: {},
                image: "",
                website: "",
                email: "",
                address: "",
                mapLink: "",
                contacts: [],
                operatingHours: [],
                tags: [],
                socialLinks: [],
            });
        }
    }, [business, form]);

    const setSlugProgrammatically = (next: string) => {
        programmaticSlugRef.current = true;
        form.setFieldsValue({ slug: next });
    };

    const regenerateSlug = () => {
        const en = getEn(form.getFieldValue("title"));
        if (!en) {
            message.error("Title (EN) is required before generating slug.");
            return;
        }
        slugTouchedRef.current = false;
        setSlugProgrammatically(slugify(en));
    };

    const onValuesChange = (changed: any, all: any) => {
        // 1) slug changed
        if (Object.prototype.hasOwnProperty.call(changed, "slug")) {
            if (programmaticSlugRef.current) {
                programmaticSlugRef.current = false;
            } else {
                slugTouchedRef.current = String(all.slug || "").trim().length > 0;
            }
            return;
        }

        if (Object.prototype.hasOwnProperty.call(changed, "title")) {
            if (slugTouchedRef.current) return;

            const curSlug = String(all.slug || "").trim();
            if (curSlug) return;

            const en = getEn(all.title);
            if (!en) return;

            setSlugProgrammatically(slugify(en));
        }
    };

    const onFinish = async (values: any) => {
        // hard validate EN title (source-of-truth)
        const en = getEn(values.title);
        if (!en) {
            message.error("Title (EN) is required.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                slug: values.slug,
                isActive: values.isActive ?? true,
                order: values.order ?? 0,
                title: values.title ?? {},
                subtitle: values.subtitle ?? {},
                description: values.description ?? {},
                image: values.image,
                website: values.website,
                email: values.email,
                address: values.address,
                mapLink: values.mapLink,
                contacts: values.contacts ?? [],
                operatingHours: values.operatingHours ?? [],
                tags: values.tags ?? [],
                socialLinks: values.socialLinks ?? [],
            };

            if (isEdit) {
                await apiClient.put(`/related-businesses/id/${business._id}`, payload);
                message.success("Related business updated!");
            } else {
                await apiClient.post("/related-businesses", payload);
                message.success("Related business created!");
            }

            router.push("/dashboard/related-businesses");
        } catch (e: any) {
            console.error("RelatedBusiness submit error:", e);
            message.error(e?.response?.data?.message || "Failed to submit form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} md={24}>
                <Card title={isEdit ? "Edit Related Business" : "Create Related Business"}>
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 10 }}
                        message="Tip: Title (EN) will auto-generate slug unless you manually edit slug."
                    />

                    <Spin spinning={loading}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            onValuesChange={onValuesChange}
                            autoComplete="off"
                        >
                            <Row gutter={[16, 12]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={
                                            <Space>
                                                <span>Slug</span>
                                                <Button
                                                    htmlType="button"
                                                    size="small"
                                                    icon={<ReloadOutlined />}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        regenerateSlug();
                                                    }}
                                                >
                                                    Generate
                                                </Button>
                                            </Space>
                                        }
                                        name="slug"
                                        normalize={(v) => slugify(v)}
                                        rules={[
                                            { required: true, message: "Please enter a slug" },
                                            {
                                                pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                                message: "Use kebab-case only (a-z, 0-9, hyphens)",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="protax-tax-accounting" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item label="Active" name="isActive" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item label="Order" name="order">
                                        <InputNumber style={{ width: "100%" }} min={0} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        label="Title"
                                        name="title"
                                        valuePropName="value"
                                        trigger="onChange"
                                        getValueFromEvent={(v) => v}
                                        rules={[
                                            {
                                                validator: async (_, v) => {
                                                    if (getEn(v)) return;
                                                    throw new Error("Title (EN) is required");
                                                },
                                            },
                                        ]}
                                    >
                                        <LanguageJsonTextInput />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        label="Subtitle"
                                        name="subtitle"
                                        valuePropName="value"
                                        trigger="onChange"
                                        getValueFromEvent={(v) => v}
                                    >
                                        <LanguageJsonTextInput />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        label="Description"
                                        name="description"
                                        valuePropName="value"
                                        trigger="onChange"
                                        getValueFromEvent={(v) => v}
                                    >
                                        <LanguageJsonTextarea />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Website"
                                        name="website"
                                        rules={[
                                            {
                                                validator: async (_, v) => {
                                                    if (isValidUrl(v)) return;
                                                    throw new Error("Website must be a valid http/https URL");
                                                },
                                            },
                                        ]}
                                    >
                                        <Input placeholder="https://example.com" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {
                                                validator: async (_, v) => {
                                                    if (!v) return;
                                                    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v));
                                                    if (ok) return;
                                                    throw new Error("Invalid email");
                                                },
                                            },
                                        ]}
                                    >
                                        <Input placeholder="name@domain.com" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item label="Address" name="address">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        label="Map Link"
                                        name="mapLink"
                                        rules={[
                                            {
                                                validator: async (_, v) => {
                                                    if (isValidUrl(v)) return;
                                                    throw new Error("Map link must be a valid http/https URL");
                                                },
                                            },
                                        ]}
                                    >
                                        <Input placeholder="https://maps.google.com/..." />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        label="Image"
                                        name="image"
                                        rules={[
                                            {
                                                validator: async (_, v) => {
                                                    if (isValidUrl(v)) return;
                                                    throw new Error("Image URL must be a valid http/https URL");
                                                },
                                            },
                                        ]}
                                    >
                                        <ImageSelector />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item label="Contacts">
                                        <Form.List name="contacts">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <Row key={key} gutter={[8, 8]} align="middle">
                                                            <Col flex="auto">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "name"]}
                                                                    rules={[{ required: true, message: "Contact name required" }]}
                                                                    style={{ marginBottom: 4 }}
                                                                >
                                                                    <Input placeholder="Name" />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col flex="auto">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "number"]}
                                                                    rules={[{ required: true, message: "Phone number required" }]}
                                                                    style={{ marginBottom: 4 }}
                                                                >
                                                                    <Input placeholder="+66 ..." />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col flex="40px">
                                                                <Button
                                                                    danger
                                                                    onClick={() => remove(name)}
                                                                    icon={<MinusCircleOutlined />}
                                                                    style={{ marginBottom: 4 }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    ))}


                                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                                                        Add Contact
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item label="Operating Hours">
                                        <Form.List name="operatingHours">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <Row key={key} gutter={[8, 8]} align="middle">
                                                            <Col flex="160px">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "day"]}
                                                                    rules={[{ required: true, message: "Day required" }]}
                                                                    style={{ marginBottom: 4 }}
                                                                >
                                                                    <Select options={DAY_OPTIONS} placeholder="Day" />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col flex="auto">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "open"]}
                                                                    rules={[
                                                                        { required: true, message: "Open time required" },
                                                                        {
                                                                            validator: async (_, v) => {
                                                                                if (TIME_24H.test(String(v || ""))) return;
                                                                                throw new Error("Use HH:mm (24h)");
                                                                            },
                                                                        },
                                                                    ]}
                                                                    style={{ marginBottom: 4 }}
                                                                >
                                                                    <Input placeholder="09:00" />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col flex="auto">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "close"]}
                                                                    rules={[
                                                                        { required: true, message: "Close time required" },
                                                                        {
                                                                            validator: async (_, v) => {
                                                                                if (TIME_24H.test(String(v || ""))) return;
                                                                                throw new Error("Use HH:mm (24h)");
                                                                            },
                                                                        },
                                                                    ]}
                                                                    style={{ marginBottom: 4 }}
                                                                >
                                                                    <Input placeholder="18:00" />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col flex="40px">
                                                                <Button
                                                                    danger
                                                                    onClick={() => remove(name)}
                                                                    icon={<MinusCircleOutlined />}
                                                                    style={{ marginBottom: 4 }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    ))}


                                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                                                        Add Hour Row
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item label="Tags">
                                        <Form.List
                                            name="tags"
                                            rules={[
                                                {
                                                    validator: async (_, tags) => {
                                                        const arr = Array.isArray(tags) ? tags : [];
                                                        const vals = arr
                                                            .map((t: any) => String(t?.value ?? "").trim().toLowerCase())
                                                            .filter(Boolean);
                                                        const dup = vals.find((v, i) => vals.indexOf(v) !== i);
                                                        if (dup) throw new Error(`Duplicate tag: "${dup}"`);
                                                    },
                                                },
                                            ]}
                                        >
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <Row key={key} gutter={[8, 8]} align="middle">
                                                            <Col flex="auto">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "value"]}
                                                                    rules={[{ required: true, message: "Tag required" }]}
                                                                    style={{ marginBottom: 4 }}
                                                                >
                                                                    <Input placeholder="Tag" />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col flex="40px">
                                                                <Button
                                                                    danger
                                                                    onClick={() => remove(name)}
                                                                    icon={<MinusCircleOutlined />}
                                                                    style={{ marginBottom: 4 }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    ))}

                                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                                                        Add Tag
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item label="Social Links">
                                        <Form.List
                                            name="socialLinks"
                                            rules={[
                                                {
                                                    validator: async (_, links) => {
                                                        const arr = Array.isArray(links) ? links : [];
                                                        const platforms = arr.map((x: any) => String(x?.platform ?? "").trim()).filter(Boolean);
                                                        const dup = platforms.find((v, i) => platforms.indexOf(v) !== i);
                                                        if (dup) throw new Error(`Duplicate platform: "${dup}"`);
                                                    },
                                                },
                                            ]}
                                        >
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <Row key={key} gutter={[8, 8]} align="middle">
                                                            <Col flex="160px">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "platform"]}
                                                                    rules={[{ required: true, message: "Platform required" }]}
                                                                    style={{ marginBottom: 4 }}
                                                                >
                                                                    <Select options={PLATFORM_OPTIONS} placeholder="Platform" />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col flex="auto">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "url"]}
                                                                    rules={[
                                                                        { required: true, message: "URL required" },
                                                                        {
                                                                            validator: async (_, v) => {
                                                                                if (isValidUrl(v)) return;
                                                                                throw new Error("URL must be http/https");
                                                                            },
                                                                        },
                                                                    ]}
                                                                    style={{ marginBottom: 4 }}
                                                                >
                                                                    <Input placeholder="https://..." />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col flex="40px">
                                                                <Button
                                                                    danger
                                                                    onClick={() => remove(name)}
                                                                    icon={<MinusCircleOutlined />}
                                                                    style={{ marginBottom: 4 }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    ))}


                                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                                                        Add Social Link
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={loading} block>
                                            {isEdit ? "Update" : "Create"}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Card>
            </Col>
        </Row>
    );
};

export default RelatedBusinessForm;
