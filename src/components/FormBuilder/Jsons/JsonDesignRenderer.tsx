"use client";
import React from "react";
import { Modal, Button } from "antd";
import { JsonDesign, ModalBehaviorType, OpenInModalPlacement, RenderSurface } from "@/config/CMS/settings";
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
  surface?: RenderSurface;
  hasBody?: boolean;
  openInModalPlacement?: OpenInModalPlacement;
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
  surface = "body",
  hasBody,
  openInModalPlacement,
}) => {
  const [isModalOpen, setIsModalOpen] = modalState;

  if (modalBehavior[ModalBehaviorType.OPEN_IN_MODAL]) {
    const isHeader = surface === "header";
    const placement: OpenInModalPlacement = openInModalPlacement ?? "body";

    const editButtonHeader = (
      <Button
        type="default"
        size="small"
        onClick={() => setIsModalOpen(true)}
        style={{ margin: 0, padding: "4px 10px" }}
      >
        Edit {label ?? "Section"}
      </Button>
    );

    const editButtonBody = (
      <Button
        type="primary"
        size="middle"
        onClick={() => setIsModalOpen(true)}
        style={{ width: "100%", marginBottom: 16, padding: 12 }}
      >
        Edit {label ?? "Section"}
      </Button>
    );


    if (isHeader) {
      return (
        <>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {editButtonHeader}
            {extra}
          </div>

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


    if (placement === "header") {
      const extraWithEdit = extra ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {extra}
          {editButtonHeader}
        </div>
      ) : (
        editButtonHeader
      );

      const shell =
        design === JsonDesign.NONE
          ? extraWithEdit
          : renderDesign(design, () => null, label, guide, extraWithEdit, style, false);

      return (
        <>
          {shell}

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


    return (
      <>
        {renderDesign(design, () => editButtonBody, label, guide, extra, style, true)}

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

  return renderDesign(design, renderItem, label, guide, extra, style, hasBody);
};

const renderDesign = (
  design: JsonDesign,
  renderItem: () => React.ReactNode,
  label?: string | null,
  guide?: string | null,
  extra?: React.ReactNode,
  style?: React.CSSProperties,
  hasBody?: boolean
) => {
  switch (design) {
    case JsonDesign.FLAT:
      return (
        <JsonFlatCard label={label} guide={guide} extra={extra} style={style} hasBody={hasBody}>
          {renderItem()}
        </JsonFlatCard>
      );

    case JsonDesign.FLAT_OUTSIDE:
      return (
        <JsonFlatOutsideCard label={label} guide={guide} extra={extra} style={style} hasBody={hasBody}>
          {renderItem()}
        </JsonFlatOutsideCard>
      );

    case JsonDesign.PARENT:
      return (
        <JsonParentCard label={label} guide={guide} extra={extra} style={style} hasBody={hasBody}>
          {renderItem()}
        </JsonParentCard>
      );

    case JsonDesign.NONE:
      return <JsonNoneCard>{renderItem()}</JsonNoneCard>;

    case JsonDesign.CARD:
    default:
      return (
        <JsonDefaultCard label={label} guide={guide} extra={extra} style={style} hasBody={hasBody}>
          {renderItem()}
        </JsonDefaultCard>
      );
  }
};

export default JsonDesignRenderer;
