"use client";

import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Avatar, Select, Spin, Tag, theme } from "antd";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { debounce, uniq } from "lodash";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable/SortableTag";
import apiClient from "@/utils/api/apiClient";
import type { LabeledValue } from "antd/es/select";

/* ---------- helpers ---------- */
const safeArray = (v: unknown): string[] =>
  Array.isArray(v) ? v : v ? [String(v)] : [];

interface UserAPI {
  _id: string;
  name?: string;
  username: string;
  avatar?: string;
}

/* ---------- props ---------- */
interface Props {
  value?: string[];
  onChange?: (v: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

/* ---------- component ---------- */
const UsersSelector: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Add member…",
  disabled = false,
  style = {},
}) => {
  const { token } = theme.useToken();

  /* ----- state ----- */
  const ids = uniq(safeArray(value));
  const [labelCache, setLabelCache] = useState<Record<string, UserAPI>>({});
  const [options, setOptions] = useState<UserAPI[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ----- fetch ----- */
  const fetchUsers = useCallback(
    async (q = "", p = 1, extraIds: string[] = []) => {
      setLoading(true);
      try {
        const { data } = await apiClient.post<{
          items: UserAPI[];
          hasMore: boolean;
        }>("/data", {
          type: "users",
          searchQuery: q,
          page: p,
          limit: 10,
          selected: extraIds,
        });

        setOptions((prev) => (p === 1 ? data.items : [...prev, ...data.items]));
        setHasMore(data.hasMore);
        setLabelCache((prev) => {
          const next = { ...prev };
          data.items.forEach((u) => (next[u._id] = u));
          return next;
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* fill missing */
  useEffect(() => {
    const missing = ids.filter((id) => !labelCache[id]);
    if (missing.length) fetchUsers("", 1, missing);
  }, [ids, labelCache, fetchUsers]);

  /* debounced search */
  const debouncedSearch = useMemo(
    () =>
      debounce((v: string) => {
        setSearch(v);
        setPage(1);
        fetchUsers(v, 1);
      }, 400),
    [fetchUsers]
  );

  /* infinitescroll */
  useEffect(() => {
    fetchUsers(search, page);
  }, [page, search, fetchUsers]);

  /* ----- drag-n-drop ----- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const from = ids.indexOf(active.id as string);
      const to = ids.indexOf(over.id as string);
      onChange?.(arrayMove(ids, from, to));
    }
  };

  /* ---------- render ---------- */
  const selectedChips = ids.map((id, i) => {
    const u = labelCache[id];
    return {
      id,
      index: i,
      label: u?.name || u?.username || id,
      avatar: u?.avatar,
    };
  });

  return (
    <div style={{ width: "100%", ...style }}>
      {/* chips + drag layer */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {selectedChips.map((chip) => (
              <SortableItem key={chip.id} id={chip.id}>
                <Tag
                  closable
                  closeIcon={
                    <CloseOutlined
                      style={{ fontSize: 14, opacity: 0.6 }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />
                  }
                  onClose={() => onChange?.(ids.filter((v) => v !== chip.id))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingInline: 8,
                    paddingBlock: 4,
                    borderRadius: 18,
                    background: token.colorFillSecondary,
                    border: "none",
                    cursor: "grab",
                    userSelect: "none",
                  }}
                >
                  <Avatar
                    size={20}
                    src={chip.avatar}
                    icon={!chip.avatar && <UserOutlined />}
                    style={{ marginRight: 6 }}
                  />
                  {chip.label}
                </Tag>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* search / dropdown */}
      <Select
        mode="multiple"
        labelInValue
        maxTagCount={0}
        size="large"
        disabled={disabled}
        style={{
          width: "100%",
          minHeight: 44,
          ...style,
        }}
        placeholder={ids.length ? undefined : placeholder}
        value={[]}
        tagRender={() => <></>} // hide built-in tags
        filterOption={false}
        onSearch={debouncedSearch}
        loading={loading}
        notFoundContent={loading ? <Spin size="small" /> : "No users"}
        onChange={(vals: (string | LabeledValue)[]) => {
          const newIds = vals.map((v) =>
            typeof v === "string" ? v : (v.value as string)
          );
          onChange?.(uniq([...ids, ...newIds]));
        }}
        onPopupScroll={(e) => {
          const t = e.currentTarget;
          if (
            t.scrollTop + t.clientHeight >= t.scrollHeight - 20 &&
            hasMore &&
            !loading
          ) {
            setPage((p) => p + 1);
          }
        }}
        dropdownMatchSelectWidth={false}
      >
        {options
          .filter((u) => !ids.includes(u._id))
          .map((u) => (
            <Select.Option key={u._id} value={u._id}>
              <Avatar
                size="small"
                src={u.avatar}
                icon={!u.avatar && <UserOutlined />}
                style={{ marginRight: 8 }}
              />
              {u.name ?? u.username}
            </Select.Option>
          ))}
      </Select>
    </div>
  );
};

export default UsersSelector;
