import { AnimatePresence, motion } from "motion/react";
import { FC, useEffect, useRef } from "react";
import { BsTrashFill } from "react-icons/bs";

type ChatBody = {
    chat: ChatMessage[];
    clearChat: () => void;
};

const ChatBody: FC<ChatBody> = ({ chat, clearChat }) => {
    const chatRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [chat]);

    return (
        <div className="group border border-neutral-300 dark:border-neutral-600 rounded-md w-full h-[calc(100vh-28rem)] flex flex-col-reverse overflow-y-hidden relative">
            <button
                className="opacity-0 absolute top-[10px] left-[-50px] group-hover:left-[10px] group-hover:opacity-100 transition-all duration-300 flex w-[40px] h-[40px] bg-red-400/75 hover:bg-red-400/90 active:bg-red-500 text-white rounded-md cursor-pointer shadow-sm items-center justify-center"
                onClick={clearChat}>
                <BsTrashFill />
            </button>
            <div className="flex flex-col gap-y-5 w-full h-fit p-3 overflow-x-hidden overflow-y-auto" ref={chatRef}>
                <AnimatePresence>
                    {chat.map((c, i) => {
                        return (
                            <motion.div
                                key={c.who + i}
                                initial={{ opacity: 0, x: c.who === "Me" ? 200 : -200 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: c.who === "Me" ? 200 : -200, transition: { delay: i / 20 } }}
                                transition={{ type: "spring", damping: 13, stiffness: 200 }}
                                className={`flex flex-col w-fit min-w-[150px] max-w-[350px] p-3 pb-1 border-[1px] text-neutral-800 border-slate-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 rounded-md ${
                                    c.who === "Me" ? "ms-auto" : ""
                                }`}>
                                <span className="text-sm font-bold">{c.who}</span>
                                <div className="ml-3 mt-2">{c.message}</div>
                                <div className={`text-[.65rem] text-slate-700 dark:text-neutral-300/50 mt-3 ${c.who !== "Me" ? "ms-auto" : ""}`}>
                                    <i>{c.time}</i>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChatBody;
