import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { User } from "@prisma/client";
import { ArrowLeft, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface StoryViewerProps {
    user: User;
    onClose: () => void;
    onDeleteStory: () => void;
}

const StoryViewer = ({
    user,
    onClose,
    onDeleteStory
}: StoryViewerProps) => {
    const timerInMS = 4000; // duration of story in miliseconds
    const initialDeadline = Date.now() + timerInMS;
    const [deadline, setDeadline] = useState(initialDeadline);
    const [timerRunning, setTimerRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        startResetTimer();
    }, []);

    useEffect(() => {
        let intervalId: any;

        if (timerRunning) {
            intervalId = setInterval(() => {
                const newTimeRemaining = deadline - Date.now();
                const newProgress = Math.round(((timerInMS - newTimeRemaining) / timerInMS) * 100);
                setProgress(newProgress);

                if (newTimeRemaining <= 0) {
                    clearInterval(intervalId);
                    setTimerRunning(false);
                    onClose();
                }
            }, 50); // Update every 50 miliseconds
        }
        // Cleanup on unmount or timer reset
        return () => clearInterval(intervalId);
    }, [deadline, timerRunning])


    const startResetTimer = () => {
        setDeadline(Date.now() + timerInMS);
        setTimerRunning(!timerRunning);
    }

    const handleClose = () => {
        setTimerRunning(false);
        onClose();
    }


    return (
        <>
            {/* Top bar */}
            <div
                className="fixed top-0 left-0 w-screen h-fit flex justify-center items-start z-[20] pb-3 bg-gradient-to-t from-transparent to-black"
            >
                <div className="flex flex-col w-fit pt-4 text-white">
                    <Progress
                        className="w-[500px] h-2"
                        value={progress}
                    />
                    <div className="flex mr-auto mt-4">
                        <Avatar>
                            <AvatarImage src={user.profileImageUrl || undefined} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col ml-3">
                            <p className="text-white text-border">{user.username}</p>
                            <p className="text-white text-muted-foreground text-xs">today</p>
                        </div>
                    </div>
                </div>
                <Trash2
                    className="absolute top-12 right-[320px] text-white text-2xl cursor-pointer"
                    onClick={onDeleteStory}
                />
                <ArrowLeft
                    className="absolute top-4 left-4 text-white text-2xl cursor-pointer"
                    onClick={handleClose}
                />
                <X
                    className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
                    onClick={handleClose}
                />
            </div>
            {/* Story image */}
            <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-cover bg-center z-[10]">
                <img
                    src={user.statusImageUrl || undefined}
                    alt="Story"
                    className="max-w-screen max-h-screen bg-cover bg-center"
                />
                <div className="placeholder-image max-w-screen max-h-screen bg-cover bg-center" />
            </div>

            {/* Background image */}
            <div
                style={{
                    backgroundImage: `url(${user.statusImageUrl})`,
                    filter: 'blur(30px)',
                    width: '109vw',
                    height: '109vh'
                }}
                className="fixed top-[-50px] left-[-50px] bg-cover bg-center z-[5]"
            ></div>

            {/* Backgroundn color while image loads */}
            <div
                style={{
                    backgroundColor: '#000000',
                    filter: 'blur(30px)',
                    width: '109vw',
                    height: '109vh'
                }}
                className="fixed top-[-50px] left-[-50px] bg-cover bg-center z-[1]"
            >

            </div>
        </>
    );
}

export default StoryViewer;