"use client"

import { User } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface NewContactSheetProps {
    handleAddContact: (contacts: User[]) => void
}

const NewContactSheet = ({
    handleAddContact
}: NewContactSheetProps) => {
    const [number, setNumber] = useState<string>("")
    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            phoneNumber: '',
            action: 'add'
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = () => {
        const postData = {
            phoneNumber: number,
            action: 'add'
        };
        axios.post('/api/contacts', postData)
            .then((response) => {
                const contact = response.data;
                handleAddContact(contact);
                toast.success("Contact added successfully!");
                setNumber("");
            })
    }


    return (
        <Sheet>
            <SheetTrigger asChild>
                <h4 className="text-[1rem]">New contact</h4>
            </SheetTrigger>
            <SheetContent side={"left"} className="w-[330px] sm:w-[540px] p-0">
                <SheetHeader className="bg-primary">
                    <div className="flex mt-14 mb-3 items-center">
                        <SheetClose asChild>
                            <ArrowLeft className="mr-7 ml-5 cursor-pointer text-white" />
                        </SheetClose>
                        <SheetTitle className="text-white flex items-center justify-center">
                            New Contact
                        </SheetTitle>
                    </div>
                </SheetHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center gap-2 lg:gap-4 w-full"
                >
                    <div>
                        <div className="flex flex-col">
                            <Label className="text-primary text-sm ml-5">
                                Full phone number:
                            </Label>
                        </div>
                        <Input
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            type="tel"
                            placeholder="+1 123 456 7890"
                            className="w-10/12 m-auto border-0 border-b-2 border-gray-400 focus:border-primary "
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            className="m-2 my-6"
                        >New Contact</Button>
                        <Toaster />
                    </div>
                </form>
            </SheetContent>
        </Sheet>

    );
}

export default NewContactSheet;