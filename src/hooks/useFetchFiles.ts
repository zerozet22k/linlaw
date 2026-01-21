import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import apiClient from "@/utils/api/apiClient";
import { FileDataAPI } from "@/models/FileModel";
import { SearchState } from "@/contexts/FileContext";
import { message } from "antd";
import { useUser } from "@/hooks/useUser";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";

const PAGE_LIMIT = 24; // 12 is too small for your modal height

export const useFetchFiles = () => {
  const { user, initialLoading: userInitialLoading } = useUser();

  const [files, setFiles] = useState<FileDataAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchState, setSearchState] = useState<SearchState>({
    search: "",
    page: 1,
    type: "",
  });

  const canViewFiles = !!user && hasPermission(user, [APP_PERMISSIONS.VIEW_FILES]);

  // used to ignore stale responses
  const reqSeqRef = useRef(0);

  const fetchFilesInternal = useCallback(async (searchStateData: SearchState, reqId: number) => {
    try {
      const response = await apiClient.post("/data", {
        type: "files",
        searchQuery: searchStateData.search,
        fileType: searchStateData.type,
        page: searchStateData.page,
        limit: PAGE_LIMIT,
      });

      // ignore stale response
      if (reqSeqRef.current !== reqId) return;

      setFiles((prev) =>
        searchStateData.page === 1
          ? response.data.items
          : [...prev, ...response.data.items]
      );

      setHasMore(!!response.data.hasMore);
    } catch (error: any) {
      // ignore stale error
      if (reqSeqRef.current !== reqId) return;

      if (error?.response?.status === 403) {
        message.warning("You do not have permission to view files.");
        setFiles([]);
        setHasMore(false);
      } else {
        message.error("Failed to fetch files.");
      }
      console.error("fetchFilesInternal error:", error);
    } finally {
      // ignore stale completion
      if (reqSeqRef.current !== reqId) return;
      setLoading(false);
    }
  }, []);

  const debouncedFetchPage1 = useMemo(
    () =>
      debounce((searchStateData: SearchState, reqId: number) => {
        void fetchFilesInternal(searchStateData, reqId);
      }, 300),
    [fetchFilesInternal]
  );

  useEffect(() => {
    return () => {
      debouncedFetchPage1.cancel();
    };
  }, [debouncedFetchPage1]);

  useEffect(() => {
    if (userInitialLoading) return;

    if (!user || !canViewFiles) {
      setFiles([]);
      setHasMore(false);
      return;
    }

    // initial load (page 1) debounced
    fetchFiles({ ...searchState, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userInitialLoading, canViewFiles]);

  const fetchFiles = useCallback(
    (searchStateData: SearchState) => {
      if (!user) return;

      if (!hasPermission(user, [APP_PERMISSIONS.VIEW_FILES])) {
        message.warning("You do not have permission to view files.");
        setFiles([]);
        setHasMore(false);
        return;
      }

      setLoading(true);
      setSearchState(searchStateData);

      if (searchStateData.page === 1) {
        setHasMore(true);
      }

      // bump request id (everything older becomes stale)
      const reqId = ++reqSeqRef.current;

      if (searchStateData.page === 1) {
        // search / first page: debounce
        debouncedFetchPage1(searchStateData, reqId);
      } else {
        // pagination: immediate + cancel any pending page1 debounce
        debouncedFetchPage1.cancel();
        void fetchFilesInternal(searchStateData, reqId);
      }
    },
    [debouncedFetchPage1, fetchFilesInternal, user]
  );

  const clearFiles = useCallback(() => {
    debouncedFetchPage1.cancel();
    // invalidate in-flight work
    reqSeqRef.current += 1;

    setFiles([]);
    setHasMore(true);
    setSearchState({ search: "", page: 1, type: "" });
    setLoading(false);
  }, [debouncedFetchPage1]);

  const deleteFile = useCallback(async (fileIds: string[]): Promise<void> => {
    if (!user || !hasPermission(user, [APP_PERMISSIONS.DELETE_FILE])) {
      message.warning("You do not have permission to delete files.");
      return;
    }

    const total = fileIds?.length || 0;
    if (!total) return;

    const key = `delete-progress-${Date.now()}`;
    const okIds: string[] = [];
    const failIds: string[] = [];

    message.open({ key, type: "loading", duration: 0, content: `Deleting 0/${total}…` });

    let done = 0;
    for (const id of fileIds) {
      try {
        await apiClient.delete(`/files/${id}`);
        okIds.push(id);
      } catch (err) {
        console.error("deleteFile error for id:", id, err);
        failIds.push(id);
      } finally {
        done += 1;
        message.open({ key, type: "loading", duration: 0, content: `Deleting ${done}/${total}…` });
      }
    }

    if (okIds.length) {
      setFiles((prev) => prev.filter((f) => !okIds.includes(f._id)));
    }

    if (failIds.length === 0) {
      message.open({ key, type: "success", content: `Deleted ${okIds.length}/${total} file(s).` });
    } else if (okIds.length === 0) {
      message.open({ key, type: "error", content: `Failed to delete ${failIds.length}/${total} file(s).` });
    } else {
      message.open({ key, type: "warning", content: `Deleted ${okIds.length}/${total} file(s). ${failIds.length} failed.` });
    }
  }, [user]);

  const syncFiles = useCallback(async () => {
    if (!user) return;

    const canSync =
      hasPermission(user, [APP_PERMISSIONS.SYNC_FILES]) ||
      hasPermission(user, [APP_PERMISSIONS.VIEW_FILES]);

    if (!canSync) {
      message.warning("You do not have permission to sync files.");
      return;
    }

    setSyncing(true);
    try {
      await apiClient.post("/files/sync");
      fetchFiles({ ...searchState, page: 1 });
      message.success("Files synced successfully.");
    } catch (error) {
      message.error("Failed to sync files.");
      console.error("syncFiles error:", error);
    } finally {
      setSyncing(false);
    }
  }, [searchState, fetchFiles, user]);

  return {
    files,
    setFiles,
    loading,
    syncing,
    hasMore,
    searchState,
    fetchFiles,
    clearFiles,
    deleteFile,
    syncFiles,
  };
};
