
import React from 'react';
import useMousePosition from '@/hooks/mousePosition';
import { collaboration } from './collaboration'; // Assuming Collaboration is the type of the imported object
import { useReactFlow, useStore } from 'reactflow';

type MousePositionTrackingProps = {
  colab: typeof collaboration;
};

export const MousePositionTracking: React.FC<MousePositionTrackingProps> = ({ colab }) => {
    const flow = useReactFlow();

    // this watches for zooming and the window otherwise moving (i think) so that we keep track of the mouse even in that case
    const z = useStore((s) => s.transform);
    const mousePosition = useMousePosition();

    const flowCords = flow.screenToFlowPosition(mousePosition);
    console.log('flow cords', flowCords);
    colab.currentUser.cursorPos = { x: flowCords.x, y: flowCords.y, lastUpdate: Date.now() };
    return null;
};