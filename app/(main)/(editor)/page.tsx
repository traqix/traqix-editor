import { cookies } from "next/headers"
import { Editor } from "@/app/(main)/(editor)/components/editor";


export const dynamic = 'force-dynamic';

export default function MailPage() {
    const cookieStore = cookies();
  const layout = cookieStore.get("react-resizable-panels:layout:mail")
  const collapsed = cookieStore.get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  

  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div> */}
      <div className="hiddenn flex-col md:flex">
        <Editor
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={3.6}
        />
      </div>
    </>
  )
}
