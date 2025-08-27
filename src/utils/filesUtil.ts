import { FileType } from "@/models/FileModel";
import rawRules from "./mime.json";

type Rule = { bucket: string; priority: number; extensions: string[]; patterns?: string[] };

const rules: Rule[] = (rawRules as unknown as Rule[]).slice().sort((a, b) => b.priority - a.priority);

export const BUCKET_TO_FILETYPE: Record<string, FileType> = {
  document: FileType.DOCUMENT,
  spreadsheet: FileType.SPREADSHEET,
  presentation: FileType.PRESENTATION,
  image: FileType.IMAGE,
  audio: FileType.AUDIO,
  video: FileType.VIDEO,
  archive: FileType.ARCHIVE,
  code: FileType.CODE,
  executable: FileType.EXECUTABLE,
  "installer-package": FileType.INSTALLER_PACKAGE,
  "disk-image": FileType.DISK_IMAGE,
  data: FileType.DATA,
  database: FileType.DATABASE,
  "3d-model": FileType.MODEL_3D,
  cad: FileType.CAD,
  font: FileType.FONT,
  ebook: FileType.EBOOK,
  "certificate-key": FileType.CERTIFICATE_KEY,
  email: FileType.EMAIL,
  calendar: FileType.CALENDAR,
  geo: FileType.GEO,
  torrent: FileType.TORRENT,
  unknown: FileType.UNKNOWN,
};

function extractExt(name: string): string | undefined {
  const base = name.split("/").pop() || name;
  const i = base.lastIndexOf(".");
  if (i <= 0) return undefined;
  return base.slice(i + 1).toLowerCase();
}

function bucketForExt(ext: string): string | undefined {
  for (const r of rules) if (r.extensions.includes(ext)) return r.bucket;
  return undefined;
}

export const detectFileType = (fileName: string): FileType => {
  const ext = extractExt(fileName);
  if (!ext) return FileType.UNKNOWN;
  const bucket = bucketForExt(ext) || "unknown";
  return BUCKET_TO_FILETYPE[bucket] ?? FileType.UNKNOWN;
};

export const getFileFolderWithType = (
  rawFilePath?: string
): {
  folder: string;
  fileName: string;
  fileType: FileType;
  filePath: string;
  urlFriendlyFilePath: string;
} => {
  if (!rawFilePath) {
    return { folder: "", fileName: "", fileType: FileType.UNKNOWN, filePath: "", urlFriendlyFilePath: "" };
  }
  const normalizedPath = rawFilePath.replace(/\\/g, "/");
  const lastSlashIndex = normalizedPath.lastIndexOf("/");
  const folder = lastSlashIndex === -1 ? "" : normalizedPath.substring(0, lastSlashIndex) || "/";
  const fileName = lastSlashIndex === -1 ? normalizedPath : normalizedPath.substring(lastSlashIndex + 1);
  const fileType = detectFileType(fileName);
  const urlFriendlyFilePath = encodeURIComponent(normalizedPath);
  return { folder, fileName, fileType, filePath: normalizedPath, urlFriendlyFilePath };
};

export const shortenFileName = (name: string, maxLength = 15) => {
  if (name.length <= maxLength) return name;
  const extIndex = name.lastIndexOf(".");
  const ext = extIndex > 0 ? name.slice(extIndex) : "";
  const baseName = extIndex > 0 ? name.slice(0, extIndex) : name;
  return `${baseName.slice(0, Math.max(1, maxLength - ext.length - 3))}...${ext}`;
};
