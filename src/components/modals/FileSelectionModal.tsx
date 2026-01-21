"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, List, Card, Spin, Input, Button, Empty, Typography } from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";
import debounce from "lodash/debounce";

import FileUploader from "@/components/FileUploader/FileUploader";
import { FileTypeWithEmpty } from "@/models/FileModel";

const { Text } = Typography;

const LazyImage = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    style={{
      width: "100%",
      height: 150,
      objectFit: "cover",
      borderRadius: 8,
      display: "block",
    }}
  />
);

type FileSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (fileUrl: string) => void;
  fileType?: FileTypeWithEmpty;
  zIndex?: number;
};

const FileSelectionModal = ({
  isOpen,
  onClose,
  onSelectFile,
  fileType = "",
  zIndex = 1000,
}: FileSelectionModalProps) => {
  const { files, loading, hasMore, fetchFiles, clearFiles } = useFile();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Separate "what user is typing" from "what we query with"
  const [searchInput, setSearchInput] = useState("");

  const [localSearchState, setLocalSearchState] = useState({
    search: "",
    page: 1,
    type: fileType,
  });

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

  // Prevent page from jumping multiple times before loading updates
  const pagingRef = useRef(false);

  // ✅ recreate when fileType changes; also force correct type
  const applySearchDebounced = useMemo(
    () =>
      debounce((query: string) => {
        setLocalSearchState((prev) => ({
          ...prev,
          search: query,
          page: 1,
          type: fileType,
        }));

        pagingRef.current = false;

        const el = scrollableContainerRef.current;
        if (el) el.scrollTop = 0;
      }, 300),
    [fileType]
  );

  // ✅ cleanup on unmount
  useEffect(() => {
    return () => {
      applySearchDebounced.cancel();
    };
  }, [applySearchDebounced]);

  // ✅ cancel debounce when modal closes (prevents late updates)
  useEffect(() => {
    if (!isOpen) applySearchDebounced.cancel();
  }, [isOpen, applySearchDebounced]);

  // When modal opens OR fileType changes, reset state properly
  useEffect(() => {
    if (!isOpen) return;

    clearFiles();
    setSearchInput("");
    setLocalSearchState({ search: "", page: 1, type: fileType });
    pagingRef.current = false;

    const el = scrollableContainerRef.current;
    if (el) el.scrollTop = 0;
  }, [isOpen, fileType, clearFiles]);

  // Fetch whenever query state changes (page/search/type)
  useEffect(() => {
    if (!isOpen) return;
    fetchFiles(localSearchState);
  }, [isOpen, localSearchState, fetchFiles]);

  // Release paging gate when a fetch completes
  useEffect(() => {
    if (!loading) pagingRef.current = false;
  }, [loading]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const container = e.currentTarget;

    if (loading || !hasMore) return;
    if (pagingRef.current) return;

    const nearBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - 120;

    if (!nearBottom) return;

    pagingRef.current = true;
    setLocalSearchState((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  return (
    <>
      <Modal
        title={`Select or Upload ${fileType || "File"}`}
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width="80%"
        zIndex={zIndex}
        styles={{
          body: {
            height: "75vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => setIsUploadModalOpen(true)}
          style={{ marginBottom: 16, borderRadius: 8 }}
        >
          Upload File
        </Button>

        <Input
          placeholder={`Search ${fileType || "files"}...`}
          value={searchInput}
          onChange={(e) => {
            const q = e.target.value;
            setSearchInput(q);
            applySearchDebounced(q);
          }}
          size="large"
          style={{ marginBottom: 16, borderRadius: 8 }}
          allowClear
        />

        <div
          ref={scrollableContainerRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 8,
            borderRadius: 8,
          }}
        >
          {files.length === 0 && !loading ? (
            <Empty description={`No ${fileType || "files"} found`} />
          ) : (
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={files}
              rowKey={(file) => file._id ?? file.publicUrl}
              renderItem={(file) => (
                <List.Item>
                  <Card
                    hoverable
                    cover={<LazyImage src={file.publicUrl} alt={file.name} />}
                    onClick={() => onSelectFile(file.publicUrl)}
                    style={{ overflow: "hidden" }}
                  >
                    <Button
                      icon={<EyeOutlined />}
                      shape="circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.publicUrl, "_blank");
                      }}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        border: "none",
                      }}
                    />
                    <Text
                      style={{
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {file.name}
                    </Text>
                  </Card>
                </List.Item>
              )}
            />
          )}

          {loading && (
            <Spin size="large" style={{ display: "block", margin: "16px auto" }} />
          )}

          {!loading && files.length > 0 && !hasMore && (
            <div style={{ textAlign: "center", padding: 12, opacity: 0.65 }}>
              End reached
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title="Upload New File"
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
        width="60%"
        zIndex={zIndex + 10}
        styles={{ body: { height: "auto", overflow: "hidden" } }}
      >
        <FileUploader />
      </Modal>
    </>
  );
};

export default FileSelectionModal;
