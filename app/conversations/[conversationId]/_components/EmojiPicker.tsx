"use client"

import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Smile } from "lucide-react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

const EmojiPicker = ({
    onChange
}: EmojiPickerProps) => {
    return (
        <Popover>
            <PopoverTrigger>
                <Smile
                    className="text-zinc-500 hover:text-zinc-600 transition"
                />
            </PopoverTrigger>
            <PopoverContent
                side="right"
                sideOffset={40}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                        onChange(emoji.native);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

export default EmojiPicker;