import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation, User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ChannelBoxProps {
    channel: Conversation,
    currentUser: User
}

const ChannelBox = ({
    channel,
    currentUser
}: ChannelBoxProps) => {
    const router = useRouter();

    const handleChannelClick = () => {
        router.push(`/conversations/${channel.id}`);
    }

    return (
        <div
            onClick={handleChannelClick}
            className="
        flex
        flex-col
        w-[112px]
        h-[144.8px]
        m-1
        items-center
        content-center
        border-[1px]
        rounded-xl
        p-2
        justify-center
        cursor-pointer
        ">
            <div className="
            flex
            flex-col
            items-center
            relative
            ">
                <Avatar className="w-16 h-16">
                    <AvatarImage
                        className="object-cover"
                        src={channel.profileImageUrl || undefined}
                    />
                    <AvatarFallback>
                        {channel.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <img src="/images/Verified.svg"
                    className="
                    absolute
                    top-12
                    left-12
                    rounded-full
                    bg-white
                    "
                />
                <h4
                    className="
                    text-[0.8125rem]
                    "
                >
                    {channel.name}
                </h4>
                {(channel.userIds.includes(currentUser.id)) ? (
                    <p className="text-muted-foreground text-[0.875rem]">Unfollow</p>
                ) : (
                    <p className="text-muted-foreground text-[0.875rem]">Follow</p>
                )

                }
            </div>
        </div>
    );
}

export default ChannelBox;