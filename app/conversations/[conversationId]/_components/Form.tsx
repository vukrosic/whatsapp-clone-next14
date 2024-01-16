import { useConversation } from "@/app/_hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import MessageInput from "./MessageInput";
import EmojiPicker from "./EmojiPicker";
import UploadFileButton from "./UploadFileButton";

const Form = () => {
    const { conversationId } = useConversation()
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });
        axios.post('/api/messages', {
            ...data,
            conversationId: conversationId
        })
    }

    const handleEmojiChange = (emojiValue: string) => {
        setValue('message', `${getValues('message')}${emojiValue}`)
    }

    return (
        <div className="
            py-4
            px-4
            bg-white
            border-t
            flex
            items-center
            gap-2
            lg:gap-4
            w-full
        ">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full"
            >
                <EmojiPicker onChange={handleEmojiChange} />

                <UploadFileButton
                    conversationId={conversationId}
                />

                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
            </form>
        </div>
    );
}

export default Form;