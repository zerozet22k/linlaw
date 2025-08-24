"use client";
import React from "react";
import { Modal, Button } from "antd";
import { JsonDesign, ModalBehaviorType } from "@/config/CMS/settings";
import JsonFlatCard from "./JsonDesigns/JsonFlatCard";
import JsonFlatOutsideCard from "./JsonDesigns/JsonFlatOutsideCard";
import JsonParentCard from "./JsonDesigns/JsonParentCard";
import JsonDefaultCard from "./JsonDesigns/JsonDefaultCard";
import JsonNoneCard from "./JsonDesigns/JsonNone";

type JsonDesignRendererProps = {
  design: JsonDesign;
  renderItem: () => React.ReactNode;
  label?: string | null;
  guide?: string | null;
  value: any;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  modalBehavior: { [key in ModalBehaviorType]?: boolean };
  modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  zIndex?: number;
};

const JsonDesignRenderer: React.FC<JsonDesignRendererProps> = ({
  design,
  renderItem,
  label,
  guide,
  value,
  extra,
  style = {},
  modalBehavior,
  modalState,
  zIndex,
}) => {
  const [isModalOpen, setIsModalOpen] = modalState;

  // When OPEN_IN_MODAL, render the requested design (FLAT/CARD/etc.)
  // with just an "Edit" button, and show the real fields in a modal.
  if (modalBehavior[ModalBehaviorType.OPEN_IN_MODAL]) {
    const editButton = (
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ width: "100%", marginBottom: 16, padding: 12 }}
      >
        Edit {label ?? "Section"}
      </Button>
    );

    return (
      <>
        {renderDesign(design, () => editButton, label, guide, extra, style)}
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width="90%"
          zIndex={zIndex}
        >
          {renderItem()}
        </Modal>
      </>
    );
  }

  return renderDesign(design, renderItem, label, guide, extra, style);
};

const renderDesign = (
  design: JsonDesign,
  renderItem: () => React.ReactNode,
  label?: string | null,
  guide?: string | null,
  extra?: React.ReactNode,
  style?: React.CSSProperties
) => {
  switch (design) {
    case JsonDesign.FLAT:
      return (
        <JsonFlatCard label={label} guide={guide} extra={extra} style={style}>
          {renderItem()}
        </JsonFlatCard>
      );
    case JsonDesign.FLAT_OUTSIDE:
      return (
        <JsonFlatOutsideCard label={label} guide={guide} extra={extra} style={style}>
          {renderItem()}
        </JsonFlatOutsideCard>
      );
    case JsonDesign.PARENT:
      return (
        <JsonParentCard label={label} guide={guide} extra={extra} style={style}>
          {renderItem()}
        </JsonParentCard>
      );
    case JsonDesign.NONE:
      return <JsonNoneCard>{renderItem()}</JsonNoneCard>;
    case JsonDesign.CARD:
    default:
      return (
        <JsonDefaultCard label={label} guide={guide} extra={extra} style={style}>
          {renderItem()}
        </JsonDefaultCard>
      );
  }
};

export default JsonDesignRenderer;
