import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useState } from "react";

export function ResponsiveControl() {
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPreviewMode("desktop")}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPreviewMode("tablet")}
      >
        <Tablet className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPreviewMode("mobile")}
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </>
  );
}
