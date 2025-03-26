"use client";

import { createContext } from "react";
import { FileDataAPI, FileType, FileTypeWithEmpty } from "@/models/FileModel";

export interface UploadedFile {
  name: string;
  url: string;
}

export type SearchState = {
  search: string;
  page: number;
  type: FileTypeWithEmpty;
};

export type PendingItem = {
  file: File;
};

export type FailedFile = {
  file: File;
  error: string;
};

type FileContextProps = {
  firebaseLoading: boolean;
  firebaseReady: boolean;
  checkFirebaseConfig: () => Promise<void>;

  files: FileDataAPI[];
  loading: boolean;
  syncing: boolean;
  hasMore: boolean;
  searchState: SearchState;
  fetchFiles: (searchStateData: SearchState) => void;
  syncFiles: () => void;
  clearFiles: () => void;
  deleteFile: (fileIds: string[]) => Promise<void>;
  uploading: boolean;
  uploadProgress: Record<string, number>;
  uploadedFiles: FileDataAPI[];
  failedFiles: FailedFile[];
  pendingFiles: PendingItem[];
  addPendingFiles: (files: File[]) => void;
  removePendingFile: (file: File) => void;

  isModalOpen: boolean;
  modalZIndex: number;
  openModal: (
    onSelectFile: (fileUrl: string) => void,
    fileType: FileType,
    zIndex?: number
  ) => void;
  closeModal: () => void;
};

export const FileContext = createContext<FileContextProps | null>(null);
