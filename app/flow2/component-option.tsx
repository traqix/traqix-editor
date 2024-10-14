import { useEffect, useRef } from "react"
import { useDrag } from "react-dnd"


export default function ComponentOption() {

  const componentRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'option',
    // item: { id: node.id, type: node.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // React.useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true })
  // }, [preview])

  useEffect(() => {
    if (componentRef.current) {
      drag(componentRef)
    }
  }, [drag, componentRef])


    return (
        <div
            className="p-2 bg-gray-200 rounded cursor-pointer"
            ref={componentRef}
            key={`as`}
        >
            Configuration Option
        </div>
    )
} 