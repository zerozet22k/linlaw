import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import ReactCrop, { Crop, makeAspectCrop, centerCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  imageUrl: string;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  aspectRatio?: number;
}

function getInitialCrop(
  displayedWidth: number,
  displayedHeight: number,
  ratio: number
): Crop {
  let newWidth: number;
  let newHeight: number;

  if (ratio < displayedWidth / displayedHeight) {
    newHeight = displayedHeight;
    newWidth = newHeight * ratio;

    if (newWidth > displayedWidth) {
      newWidth = displayedWidth;
      newHeight = newWidth / ratio;
    }
  } else {
    newWidth = displayedWidth;
    newHeight = newWidth / ratio;

    if (newHeight > displayedHeight) {
      newHeight = displayedHeight;
      newWidth = newHeight * ratio;
    }
  }

  const crop = centerCrop(
    makeAspectCrop(
      {
        unit: "px",
        width: newWidth,
        height: newHeight,
      },
      ratio,
      displayedWidth,
      displayedHeight
    ),
    displayedWidth,
    displayedHeight
  );

  return crop;
}

const ImageCropper = forwardRef(
  ({ imageUrl, imageRef, aspectRatio }: ImageCropperProps, ref) => {
    const [crop, setCrop] = useState<Crop & { aspect?: number }>({
      unit: "px",
      width: 100,
      height: 100,
      x: 50,
      y: 50,
      aspect: aspectRatio,
    });

    const [displayedSize, setDisplayedSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget as HTMLImageElement;

      const displayedWidth = img.offsetWidth;
      const displayedHeight = img.offsetHeight;

      setDisplayedSize({ width: displayedWidth, height: displayedHeight });

      const ratio = aspectRatio || displayedWidth / displayedHeight;

      const newCrop = getInitialCrop(displayedWidth, displayedHeight, ratio);

      setCrop({ ...newCrop, aspect: ratio });
    };

    const handleCropChange = (newCrop: Crop) => {
      setCrop((prev) => ({
        ...prev,
        x: Math.min(
          Math.max(newCrop.x, 0),
          displayedSize.width - newCrop.width
        ),
        y: Math.min(
          Math.max(newCrop.y, 0),
          displayedSize.height - newCrop.height
        ),
        width: newCrop.width,
        height: newCrop.height,
      }));
    };

    useImperativeHandle(ref, () => ({
      getCroppedImg: async () => {
        if (!imageRef.current) return null;

        const image = imageRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        const scaleX = image.naturalWidth / displayedSize.width;
        const scaleY = image.naturalHeight / displayedSize.height;

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        try {
          return canvas.toDataURL("image/png");
        } catch (error) {
          console.error("Error exporting cropped image:", error);
          return null;
        }
      },
    }));

    return (
      <div style={{ textAlign: "center" }} ref={containerRef}>
        <ReactCrop
          crop={crop}
          onChange={handleCropChange}
          keepSelection
          minWidth={50}
          minHeight={50}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop Preview"
            crossOrigin="anonymous"
            onLoad={onImageLoad}
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              cursor: "grab",
            }}
          />
        </ReactCrop>
      </div>
    );
  }
);

ImageCropper.displayName = "ImageCropper";

export default ImageCropper;
