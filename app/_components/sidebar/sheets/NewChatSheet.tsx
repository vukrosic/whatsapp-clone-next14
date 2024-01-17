"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import NewContactSheet from "./NewContactSheet";
import UserList from "../../UserList";
import GroupChatModal from "../modals/GroupChatModal";

interface NewChatSheetProps {
    currentUser: User & {
        following: User[]
    }
}

const NewChatSheet = ({
    currentUser
}: NewChatSheetProps) => {
    const [searchText, setSearchText] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [contacts, setContacts] = useState<User[]>([])

    useEffect(() => {
        if (currentUser?.following !== undefined) {
            setContacts(currentUser.following)
        }
    }, [currentUser])

    const handleAddContact = (contacts: User[]) => {
        setContacts(contacts)
    }

    const handleRemoveContact = (newContacts: User[]) => {
        setContacts(newContacts)
    }


    return (
        <div>
            {(currentUser !== undefined) &&
                <GroupChatModal
                    users={currentUser.following}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            }

            <Sheet>
                <SheetTrigger asChild>
                    <button className="flex items-center">
                        <Image className="hover:cursor-pointer"
                            src={"/images/NewChat.svg"}
                            alt="New Chat"
                            width={24}
                            height={24}
                        />
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[330px] sm:w-[540px] p-0 overflow-y-auto">
                    <SheetHeader className="bg-primary">
                        <div className="flex mt-14 mb-3 items-center">
                            <SheetClose asChild>
                                <ArrowLeft className="mr-7 ml-5 cursor-pointer text-white" />
                            </SheetClose>
                            <SheetTitle className="text-white flex items-center justify-center">
                                New Chat
                            </SheetTitle>
                        </div>
                    </SheetHeader>
                    <ScrollArea>
                        <div className="space-y-2 flex">
                            <div className="flex bg-gray-100 w-11/12 m-auto rounded-xl mt-2 ml-3">
                                <button onClick={() => setSearchText("")}>
                                    <ArrowLeft className="text-primary mr-7 ml-5" />
                                </button>
                                <Input
                                    placeholder="Search name or number"
                                    className="bg-transparent border-0"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="flex m-6 relative items-center">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src="/images/Group.svg" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 text-left">
                                <NewContactSheet
                                    handleAddContact={handleAddContact}
                                />
                            </div>
                        </button>

                        <button
                            className="flex m-6 relative items-center"
                            onClick={() => setIsModalOpen(true)}>
                            <Avatar className="w-12 h-12">
                                <AvatarImage
                                    src="/images/Community.svg"
                                />
                                <AvatarFallback>GR</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 text-left">
                                <h4 className="text-[1rem]">New group</h4>
                            </div>
                        </button>

                        <div className="ml-12 my-5 text-primary font-light">CONTACTS</div>

                        <UserList
                            contacts={contacts}
                            handleRemoveContact={handleRemoveContact}
                        />
                    </ScrollArea>
                </SheetContent>
            </Sheet>

        </div>
    );
}

export default NewChatSheet;