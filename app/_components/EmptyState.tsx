import { User } from "@prisma/client";

interface EmptyStateProps {
    currentUser: User
}

const EmptyState = ({ currentUser }: EmptyStateProps) => {
    return (
        <div>TO DO: Empty state!</div>
    );
}

export default EmptyState;