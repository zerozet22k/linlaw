"use client";

import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Select, Spin, Tag } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable/SortableTag";
import apiClient from "@/utils/api/apiClient";
import { defaultWrapperStyle } from "../../InputStyle";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { LabeledValue } from "antd/es/select";
/* ---------- helpers ---------- */

const safeArray = (v: unknown): string[] =>
  Array.isArray(v) ? v : v ? [String(v)] : [];

const uniq = (arr: string[]) => Array.from(new Set(arr));

/* ---------- types ---------- */

interface UserAPI {
  _id: string;
  name?: string;
  username: string;
}

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
  /* ----- state ----- */
  const ids = uniq(safeArray(value));
  const [labelCache, setLabelCache] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<UserAPI[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ----- data fetch ----- */
  const fetchUsers = useCallback(
    async (q = "", p = 1, extraIds: string[] = []) => {
      setLoading(true);
      try {
        const { data: res } = await apiClient.post<{
          items: UserAPI[];
          hasMore: boolean;
        }>("/data", {
          type: "users",
          searchQuery: q,
          page: p,
          limit: 10,
          selected: extraIds,
        });
        setOptions((prev) => (p === 1 ? res.items : [...prev, ...res.items]));
        setHasMore(res.hasMore);
        setLabelCache((prev) => {
          const next = { ...prev };
          res.items.forEach((u) => {
            next[u._id] = u.name ?? u.username;
          });
          return next;
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* fill in any missing labels */
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

  /* pagination / infinite scroll */
  useEffect(() => {
    fetchUsers(search, page);
  }, [page, search, fetchUsers]);

  /* ----- drag‑and‑drop ----- */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const from = ids.indexOf(active.id as string);
      const to = ids.indexOf(over.id as string);
      onChange?.(arrayMove(ids, from, to));
    }
  };

  const selected = ids.map((id, i) => ({
    id,
    i,
    label: labelCache[id] ?? id,
  }));

  /* ---------- JSX ---------- */
  return (
    <div style={{ ...defaultWrapperStyle, ...style, display: "block" }}>
      {/* Drag area --------------------------------------------------- */}
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
              gap: 6,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            {selected.map((u) => (
              <SortableItem key={u.id} id={u.id}>
                <Tag
                  style={{ cursor: "grab", padding: "6px", fontSize: 14 }}
                  closable
                  closeIcon={
                    <CloseOutlined
                      style={{ fontSize: 14, opacity: 0.45 }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    />
                  }
                  onClose={() => onChange?.(ids.filter((v) => v !== u.id))}
                >
                  <span style={{ marginRight: 6, opacity: 0.6 }}>
                    {u.i + 1}.
                  </span>
                  {u.label}
                </Tag>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Search + dropdown ------------------------------------------ */}
      <Select
        mode="multiple"
        labelInValue
        size="large"
        // variant="borderless"
        maxTagCount={0}
        tagRender={(_: CustomTagProps) => <></>}
        value={[]}
        placeholder={placeholder}
        disabled={disabled}
        style={{ width: "100%", minWidth: 160 }}
        loading={loading}
        notFoundContent={loading ? <Spin size="small" /> : "No users"}
        filterOption={false}
        popupMatchSelectWidth={false}
        onSearch={debouncedSearch}
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
      >
        {options
          .filter((u) => !ids.includes(u._id))
          .map((u) => (
            <Select.Option key={u._id} value={u._id}>
              {u.name ?? u.username}
            </Select.Option>
          ))}
      </Select>
    </div>
  );
};

export default UsersSelector;
