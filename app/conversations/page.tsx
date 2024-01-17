import EmptyState from "@/app/_components/EmptyState";
import { getCurrentUser } from "../_actions/getCurrentUser";

const Conversation = async () => {
    const { currentUserPrisma } = await getCurrentUser();
    return (
        <div className="h-screen bg-gray-200">
            <EmptyState
                currentUser={currentUserPrisma}
            />
        </div>
    );
}

export default Conversation;