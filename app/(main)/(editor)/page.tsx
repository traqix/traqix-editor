import { cookies } from "next/headers";
import { Editor } from "@/app/(main)/(editor)/components/editor";

// export const dynamic = 'force-dynamic';

export default function EditorPage() {
  const cookieStore = cookies();
  const layout = cookieStore.get("react-resizable-panels:layout:mail");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <div className="flex-col md:flex">
      <Editor
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={3.6}
      />
    </div>
  );
}
