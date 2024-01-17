import { User } from "@prisma/client";
import UserBox from "./UserBox";

interface UserListProps {
    contacts: User[];
    handleRemoveContact: (newContacts: User[]) => void;
}

const UserList = ({
    contacts,
    handleRemoveContact
}: UserListProps) => {
    return (
        <div className="
        inset-y-0
        lg:pb-0
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
        block
        w-full
        left-0
        ">
            <div className="px-5">
                <div className="flex-col">
                    {contacts.length > 0 ? (
                        contacts.map((item) => (
                            <UserBox
                                key={item.id}
                                data={item}
                                handleRemoveContact={handleRemoveContact}
                            />
                        ))
                    ) : (
                        <p>No contacts available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserList;