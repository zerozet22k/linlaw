"use client";

import { useState, useCallback, useRef } from "react";
import { FileTypeWithEmpty } from "@/models/FileModel";

export const useFileModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileType, setFileType] = useState<FileTypeWithEmpty>("");
  const [modalZIndex, setModalZIndex] = useState(1000);

  const onSelectRef = useRef<((fileUrl: string) => void) | null>(null);

  const openModal = useCallback(
    (
      onSelectFile: (fileUrl: string) => void,
      type: FileTypeWithEmpty = "",
      zIndex = 1000
    ) => {
      onSelectRef.current = onSelectFile;
      setFileType(type);
      setModalZIndex(zIndex);
      setIsModalOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSelectFile = useCallback((fileUrl: string) => {
    onSelectRef.current?.(fileUrl);
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    fileType,
    modalZIndex,
    openModal,
    closeModal,
    handleSelectFile,
  };
};
