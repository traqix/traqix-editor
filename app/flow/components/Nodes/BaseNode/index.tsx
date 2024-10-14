import "./styles.css";

import { ComponentType, memo, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { ReactflowNodeData } from "@/app/flow/data/types";
import { kReactflowLayoutConfig } from "@/app/flow/components/ControlPanel";

export const BaseNode: ComponentType<NodeProps<ReactflowNodeData>> = memo(
  ({ data }) => {
    const { direction, reverseSourceHandles } = kReactflowLayoutConfig.state;
    const isHorizontal = direction === "horizontal";
    const targetHandlesFlexDirection: any = isHorizontal ? "column" : "row";
    const sourceHandlesFlexDirection: any =
      targetHandlesFlexDirection + (reverseSourceHandles ? "-reverse" : "");

    const [selected] = useState()
    const { setSelectedNode } = data

    const handleClick = () => {
      console.log("eeeeeeeeeeee", data)
      setSelectedNode({ data }); // Call the function to set the selected node
    };

    return (
      <>
        <div
        onClick={handleClick} 
          className={`bg-red-400 handles handles-${direction} targets`}
          style={{
            border: selected ? '2px solid blue' : '1px solid grey', padding: '10px', cursor: 'pointer',
            flexDirection: targetHandlesFlexDirection,
          }}
        >
          {data.targetHandles.map((id) => (
            <Handle
              className={`handle handle-${direction}`}
              key={id}
              id={id}
              type="target"
              position={isHorizontal ? Position.Left : Position.Top}
            />
          ))}
        </div>
        <div className="label">{data.id}</div>
        <div
          className={`handles handles-${direction} sources`}
          style={{
            flexDirection: sourceHandlesFlexDirection,
          }}
        >
          {data.sourceHandles.map((id) => (
            <Handle
              className={`handle handle-${direction}`}
              key={id}
              id={id}
              type="source"
              position={isHorizontal ? Position.Right : Position.Bottom}
            />
          ))}
        </div>
      </>
    );
  }
);

BaseNode.displayName = "BaseNode";
