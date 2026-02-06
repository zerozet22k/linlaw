import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Select, Spin } from "antd";
import { debounce } from "lodash";
import apiClient from "@/utils/api/apiClient";

interface Props<T> {
  type: string;
  valueKey: keyof T;
  labelKey: keyof T;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  selected?: string[];
  onChange?: (value: string) => void;
}

const PublicAPIDynamicDropdown = <T extends Record<string, any>>({
  type,
  valueKey,
  labelKey,
  placeholder = "Select an option",
  disabled = false,
  value,
  selected = [],
  onChange,
}: Props<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  
  const hasMoreRef = useRef(hasMore);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  
  const requestIdRef = useRef(0);

  const fetchData = useCallback(
    async (searchQuery = "", currentPage = 1) => {
      if (currentPage !== 1 && !hasMoreRef.current) return;

      const reqId = ++requestIdRef.current;

      setLoading(true);
      try {
        const response = await apiClient.post(`/data`, {
          type,
          searchQuery,
          page: currentPage,
          limit: 10,
          selected,
        });

        
        if (reqId !== requestIdRef.current) return;

        const items: T[] = response.data.items ?? [];
        const nextHasMore: boolean = !!response.data.hasMore;

        setData((prev) => (currentPage === 1 ? items : [...prev, ...items]));
        setHasMore(nextHasMore);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        
        if (reqId === requestIdRef.current) setLoading(false);
      }
    },
    [type, selected]
  );

  
  const debouncedSearch = useMemo(
    () =>
      debounce((v: string) => {
        setData([]);
        setHasMore(true);
        setPage(1);
        setSearch(v);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  
  useEffect(() => {
    fetchData(search, page);
  }, [fetchData, search, page]);

  
  useEffect(() => {
    setData([]);
    setHasMore(true);
    setPage(1);
  }, [type, selected]);

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      notFoundContent={loading ? <Spin size="small" /> : "No options found"}
      filterOption={false}
      onSearch={debouncedSearch}
      style={{ width: "100%" }}
    >
      {data.map((item) => {
        const optionValue = String(item[valueKey]);
        return (
          <Select.Option key={optionValue} value={optionValue}>
            {String(item[labelKey])}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default PublicAPIDynamicDropdown;
