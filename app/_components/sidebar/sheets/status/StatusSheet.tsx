import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User } from "@prisma/client";
import { ArrowLeft, Lock } from "lucide-react";
import Image from "next/image";
import StatusSidebarButton from "./StatusSidebarButton";

interface StatusSheetProps {
    user: User
}

const StatusSheet = ({
    user
}: StatusSheetProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image className="hover:cursor-pointer"
                    src={'/images/Status.svg'}
                    alt="Status"
                    width={24}
                    height={24}
                />
            </SheetTrigger>
            <SheetContent side="left" className="w-[370px] p-0">
                <SheetHeader className="bg-primary">
                    <div className="flex mt-14 mb-3 items-center">
                        <SheetClose asChild>
                            <ArrowLeft className="mr-7 ml-5 cursor-pointer text-white" />
                        </SheetClose>
                        <SheetTitle className="text-white flex items-center justify-center">
                            Status
                        </SheetTitle>
                    </div>
                </SheetHeader>

                <StatusSidebarButton
                    user={user}
                />


                <SheetFooter>
                    <div className="flex m-auto mt-6 items-center">
                        <Lock className="m-auto w-4" />
                        <p className="text-[12px] ml-1">Your data is securely stored and private.</p>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default StatusSheet;