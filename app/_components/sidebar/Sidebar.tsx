import { getCurrentUser } from "@/app/_actions/getCurrentUser"
import DesktopSidebarHeader from "./DesktopSidebarHeader"
import getConversations from "@/app/_actions/getConversations"
import ConversationList from "@/app/conversations/_components/ConversationList"

async function Sidebar({ children }: {
    children: React.ReactNode
}) {
    const { currentUserPrisma } = await getCurrentUser()
    const conversations = await getConversations()
    return (
        <div className="h-full w-screen flex">
            <aside className="h-full min-w-[300px]" >
                <DesktopSidebarHeader
                    currentUser={currentUserPrisma}
                />
                <ConversationList
                    conversations={conversations}
                />
            </aside>
            <main className="w-full flex justify-center">
                {children}
            </main>
        </div>
    )
}

export default Sidebar