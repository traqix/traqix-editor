"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface ExampleProps {
  mode?: string;
  containerClassName: string;
  contentClassName: string;
  paddingClassName: string;
  children?: React.ReactNode;
}

export default function ResizableComponent({
  mode,
  containerClassName,
  contentClassName,
  paddingClassName,
  children,
}: ExampleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerContentRef = useRef<HTMLDivElement>(null);
  const leftX = useMotionValue(0);
  const rightX = useMotionValue(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const handleLeftRef = useRef<HTMLDivElement>(null);
  const handleRightRef = useRef<HTMLDivElement>(null);
  const lightOnly = false;

  useEffect(() => {
    const observer = new ResizeObserver((x, y) => {
      leftX.set(0);
      rightX.set(0);
    });
    observer.observe(containerRef.current!);
    return () => {
      observer.disconnect();
    };
  }, [leftX, rightX]);

  useEffect(() => {
    if (handleLeftRef.current && handleRightRef.current) {
      handleLeftRef.current.onselectstart = () => false;
      handleRightRef.current.onselectstart = () => false;
    }
  }, []);

  useEffect(() => {
    let newSize = 0
    if (mode == "desktop") {
      newSize = 1280 + 30
    } else if (mode == "tablet") {
      newSize = 768 + 30;
    } else if (mode == "mobile") {
      newSize = 375 + 30;
    }
    if (newSize) {
      setTimeout(() => {
        setWidthResize2(newSize-Math.ceil(newSize/10))
      }, 20);
      setTimeout(() => {
        // widthResize.set(newSize);
        setWidthResize2(newSize)
        setContainerContentWidth(newSize);
      }, 200);
    }
  }, [mode]);

  const [prevLeft, setPrevLeft] = useState<number | null>(null);
  const [prevRight, setPrevRight] = useState<number | null>(null);
  const [changeResizable, setChangeResizable] = useState<string | null>(null);
  const [fisrtClick, setFisrtClick] = useState(false);
  const [containerContentWidth, setContainerContentWidth] = useState(0);

  const [widthResize2, setWidthResize2] = useState<number | undefined>(undefined); // Valor inicial sem "px"
  const widthResize = useTransform([leftX, rightX], ([left, right]) => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    if (!fisrtClick) {
      setFisrtClick(true);
      setContainerContentWidth(containerContentRef.current?.clientWidth ?? 0);
    }

    const initialPointLeft = (containerWidth - containerContentWidth) / 2;
    const initialPointRight = containerWidth - initialPointLeft;

    leftX.set(0);
    rightX.set(0);

    if (prevLeft !== null && prevRight !== null) {
      if (changeResizable == "left") {
        const leftT = initialPointLeft + (left as number);
        const newWidth = containerWidth - leftT * 2;
        if (newWidth < 375) {
          return 375;
        }
        return newWidth;
      }
      if (changeResizable == "right") {
        const rightT = initialPointRight + (right as number);
        const newWidth = (containerWidth - rightT * 2) * -1;
        if (newWidth < 375) {
          return 375;
        }
        return newWidth;
      }
    }

    if (left != prevLeft) {
      setPrevLeft(left as number);
    }
    if (right != prevRight) {
      setPrevRight(right as number);
    }
  });

  const [classPointerEvent, setClassPointerEvent] = useState("")

  return (
    <div
      ref={containerRef}
      className="relative h-full"
    >
      {/* mode:{mode}= */}
      {/* style={{ marginLeft: leftStyle, marginRight: rightStyle }} */}
      <div
        ref={constraintsRef}
        className={clsx("absolute inset-y-0 left-0 right-0 transition-all")}
      >
        <div className={containerClassName}>
          <motion.div
            animate={{ width: widthResize2 }}
            style={{ width: widthResize }}
            transition={{ duration: 0.5, ease: "easeInOut" }} // Duração e tipo de transição
            className={clsx(
              "not-prose relative mx-auto h-full max-w-full overflow-hidden",
            )}
          >
            <div
              className={clsx(
                "h-full overflow-hidden bg-transparent",
              )}
            >
              

              <div
                ref={containerContentRef}
                style={{ backgroundPosition: "10px 10px" }}
                className={clsx(
                  "bg-grid-slate-100 absolute inset-0 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]",
                  !lightOnly &&
                    "dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]",
                )}
              />

              <motion.div
                className={clsx(
                  "not-prose relative mx-auto h-full overflow-hidden rounded-lg px-4",
                )}
              >
                <div
                  className={clsx(
                    "w-full pointer-events-auto relative h-full overflow-auto rounded-lg",
                    paddingClassName,
                    contentClassName,
                    classPointerEvent,
                  )}
                >
                  {children}
                </div>

                <div
                  className={clsx(
                    "absolute inset-0",
                    !lightOnly && "dark:border-white/5",
                  )}
                />
              </motion.div>

              <div className="absolute left-0 top-0 h-full w-full opacity-30 hover:opacity-100 active:opacity-100">
                <motion.div
                  ref={handleLeftRef}
                  drag="x"
                  dragMomentum={false}
                  dragElastic={0}
                  dragConstraints={constraintsRef}
                  style={{ x: leftX }}
                  className="absolute -left-1 top-1/2 z-10 -mt-6 hidden cursor-ew-resize p-2 md:block"
                  onDragStart={() => {
                    setFisrtClick(false);
                    setChangeResizable("left");
                    setClassPointerEvent("!pointer-events-none")
                    document.documentElement.classList.add("dragging-ew");
                  }}
                  onDragEnd={() => {
                    setChangeResizable(null);
                    setClassPointerEvent("")
                    document.documentElement.classList.remove("dragging-ew");
                  }}
                >
                  <div className="h-8 w-[6px] rounded-full bg-slate-500/60" />
                </motion.div>

                <motion.div
                  ref={handleRightRef}
                  drag="x"
                  dragMomentum={false}
                  dragElastic={0}
                  dragConstraints={constraintsRef}
                  style={{ x: rightX }}
                  className="absolute -right-1 top-1/2 z-10 -mt-6 hidden cursor-ew-resize p-2 md:block"
                  onDragStart={() => {
                    setFisrtClick(false);
                    setChangeResizable("right");
                    setClassPointerEvent("!pointer-events-none")
                    document.documentElement.classList.add("dragging-ew");
                  }}
                  onDragEnd={() => {
                    setChangeResizable(null);
                    setClassPointerEvent("")
                    document.documentElement.classList.remove("dragging-ew");
                  }}
                >
                  <div className="h-8 w-[6px] rounded-full bg-slate-500/60" />
                </motion.div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
