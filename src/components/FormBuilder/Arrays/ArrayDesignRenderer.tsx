"use client";
import React from "react";
import { ArrayDesign, ModalBehaviorType } from "@/config/CMS/settings";
import ArrayFlatCard from "./ArrayDesigns/ArrayFlatCard";
import ArrayFlatOutsideCard from "./ArrayDesigns/ArrayFlatOutsideCard";
import ArrayParentCard from "./ArrayDesigns/ArrayParentCard";
import ArrayDefaultCard from "./ArrayDesigns/ArrayDefaultCard";
import { Modal, Button } from "antd";

type ArrayDesignRendererProps = {
  design: ArrayDesign;
  label: string;
  arrayValue: any[];
  onAdd: () => void;
  renderItem: (item: any, index: number) => React.ReactNode;
  style?: React.CSSProperties;
  modalBehavior: { [key in ModalBehaviorType]?: boolean };
  modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  zIndex?: number;
};

const ArrayDesignRenderer: React.FC<ArrayDesignRendererProps> = ({
  design,
  label,
  arrayValue,
  onAdd,
  renderItem,
  style = {},
  modalBehavior,
  modalState,
  zIndex,
}) => {
  const [isModalOpen, setIsModalOpen] = modalState;

  if (modalBehavior[ModalBehaviorType.OPEN_IN_MODAL]) {
    return (
      <ArrayParentCard
        label={label}
        onAdd={onAdd}
        showAddButton={true}
        style={style}
      >
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ width: "100%", marginBottom: "16px", padding: "12px" }}
        >
          Edit {label}
        </Button>

        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width="90%"
          zIndex={zIndex}
        >
          {renderDesign(arrayValue, design, label, onAdd, renderItem, style)}
        </Modal>
      </ArrayParentCard>
    );
  }

  return renderDesign(arrayValue, design, label, onAdd, renderItem, style);
};

const renderDesign = (
  arrayValue: any[],
  design: ArrayDesign,
  label: string,
  onAdd: () => void,
  renderItem: (item: any, index: number) => React.ReactNode,
  style: React.CSSProperties
) => {
  switch (design) {
    case ArrayDesign.FLAT:
      return (
        <ArrayFlatCard
          label={label}
          onAdd={onAdd}
          showAddButton={true}
          style={style}
        >
          {arrayValue.map(renderItem)}
        </ArrayFlatCard>
      );

    case ArrayDesign.FLAT_OUTSIDE:
      return (
        <ArrayFlatOutsideCard
          label={label}
          onAdd={onAdd}
          showAddButton={true}
          style={style}
        >
          {arrayValue.map(renderItem)}
        </ArrayFlatOutsideCard>
      );

    case ArrayDesign.PARENT:
      return (
        <ArrayParentCard
          label={label}
          onAdd={onAdd}
          showAddButton={true}
          style={style}
        >
          {arrayValue.map(renderItem)}
        </ArrayParentCard>
      );

    case ArrayDesign.CARD:
    default:
      return (
        <ArrayDefaultCard
          label={label}
          onAdd={onAdd}
          showAddButton={true}
          style={style}
        >
          {arrayValue.map(renderItem)}
        </ArrayDefaultCard>
      );
  }
};

export default ArrayDesignRenderer;
