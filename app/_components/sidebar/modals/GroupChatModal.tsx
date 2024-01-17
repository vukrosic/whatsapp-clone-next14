"use client"

import { User } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Select from "../../inputs/Select";


interface GroupChatModalProps {
    isOpen?: boolean;
    onClose: () => void;
    users: User[];
}

const GroupChatModal = ({
    isOpen,
    onClose,
    users
}: GroupChatModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            members: []
        }
    })

    const members = watch('members');

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        const { name, members } = data;
        if (!name || members.length < 3) {
            toast.error('Name can not be empty and there must be 3 or more members!');
            return;
        }
        setIsLoading(true);
        axios.post('/api/conversations', {
            ...data,
            isGroup: true
        })
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => {
                setIsLoading(false);
                setValue('members', []);
                setValue('name', '');
            })
    }


    return (
        <div>
            <Toaster />
            <Dialog open={isOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Create a group chat
                        </DialogTitle>
                        <DialogDescription>
                            Create a chat with 2 or more people.
                        </DialogDescription>
                        <div
                            className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                            onClick={() => onClose()}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="mt-10 flex flex-col gap-y-8">
                                    <Label>Name</Label>
                                    <Input
                                        disabled={isLoading}
                                        id="name"
                                        {...register("name")}
                                    />
                                    <Select
                                        disabled={isLoading}
                                        label={"Members"}
                                        options={users.map((user) => ({
                                            value: user.id,
                                            label: user.username
                                        }))}
                                        onChange={
                                            (value) => {
                                                setValue('members', value, {
                                                    shouldValidate: true
                                                })
                                            }
                                        }
                                        value={members}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-16">
                            <Button
                                disabled={isLoading}
                                type="button"
                                variant={"destructive"}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button>
                                Create
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
}

export default GroupChatModal;