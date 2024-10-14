import { EditorLayout } from "@/app/preview/editor-layout";
import MessageSender from "@/components/MessageSender";

export default function PageApp(props: any) {
    return (
        <>
            {/* Page app */}

            <EditorLayout />
            <MessageSender {...props} />
        </>
    )
}