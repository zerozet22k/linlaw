"use client";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { debounce } from "lodash";
import apiClient from "@/utils/api/apiClient";
import { defaultSelectStyle, defaultWrapperStyle } from "../../InputStyle";

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

interface User {
  _id: string;
  fullName: string;
}

const UserSelector: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Select a user",
  disabled,
  style = {},
}) => {
  const [data, setData] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(
    async (q = "", p = 1) => {
      if (!hasMore && p !== 1) return;
      setLoading(true);
      try {
        const { data: res } = await apiClient.post("/data", {
          type: "users",
          searchQuery: q,
          page: p,
          limit: 10,
        });
        setData((prev) => (p === 1 ? res.items : [...prev, ...res.items]));
        setHasMore(res.hasMore);
      } finally {
        setLoading(false);
      }
    },
    [hasMore]
  );

  const handleSearch = debounce((v: string) => {
    setSearch(v);
    setPage(1);
    fetchUsers(v, 1);
  }, 500);

  useEffect(() => {
    fetchUsers(search, page);
  }, [page, search, fetchUsers]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore && !loading) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Select
        value={value}
        showSearch
        disabled={disabled}
        placeholder={placeholder}
        loading={loading}
        onChange={onChange}
        onSearch={handleSearch}
        filterOption={false}
        notFoundContent={loading ? <Spin size="small" /> : "No users"}
        onPopupScroll={onScroll}
        style={{ ...defaultSelectStyle }}
      >
        {data.map((u) => (
          <Select.Option key={u._id} value={u._id}>
            {u.fullName}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default UserSelector;
