import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useState } from "react";

interface ResponsiveControlProps {
  setModeResponsive: any
}

export function ResponsiveControl({ setModeResponsive }: ResponsiveControlProps) {
  
  const [disabled, setDisabled] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  useEffect(() => {
    setModeResponsive(previewMode)
    setDisabled(true)
    setTimeout(() => {
      setDisabled(false)
    }, 1000);
  }, [previewMode])
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={() => setPreviewMode("desktop")}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={() => setPreviewMode("tablet")}
      >
        <Tablet className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={() => setPreviewMode("mobile")}
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </>
  );
}
