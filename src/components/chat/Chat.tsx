import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, Dispatch, FC, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { FaRepeat } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import ChatClient from "./ChatClient";

import { BsTrashFill } from "react-icons/bs";

type Chat = {
    selectedClients: Client[];
    commands: string[];
    selectClient: (client: Client) => void;
    chat: ChatMessage[];
    setChat: Dispatch<SetStateAction<ChatMessage[]>>;
};

const Chat: FC<Chat> = ({ selectedClients, commands, chat, selectClient, setChat }) => {
    const [command, setCommand] = useState<string>("");
    const [lastCommand, setLastCommand] = useState<string>("");
    const chatRef = useRef<HTMLDivElement>(null);

    const [selectedCommandIndex, setSelectedCommandIndex] = useState<number>(0);
    const [showCommands, setShowCommands] = useState<boolean>(false);
    const [commandEscaped, setCommandEscaped] = useState<boolean>(false);

    const handleChangeCommand = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (commands.length > 0) setSelectedCommandIndex(0);
        if (e.target.value.startsWith("@")) {
            const probableCommand = e.target.value.slice(1).toLowerCase();
            if (commands.some((cmd) => cmd.toLocaleLowerCase().startsWith(probableCommand))) {
                setSelectedCommandIndex(commands.findIndex((cmd) => cmd.toLocaleLowerCase().startsWith(probableCommand)));
            }
        }
        if (e.target.value.startsWith("@") && !showCommands && !commandEscaped) setShowCommands(true);
        else if (e.target.value === "@" && !showCommands) {
            setShowCommands(true);
            setCommandEscaped(false);
        } else if (!e.target.value.startsWith("@") && showCommands) setShowCommands(false);
        setCommand(e.target.value);
    };
    const handleSelectCommand = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (showCommands) {
            if (e.key === "ArrowDown" && selectedCommandIndex !== commands.length - 1) {
                e.preventDefault();
                setSelectedCommandIndex((cmdIdx) => cmdIdx + 1);
            } else if (e.key === "ArrowUp" && selectedCommandIndex !== 0) {
                e.preventDefault();
                setSelectedCommandIndex((cmdIdx) => cmdIdx - 1);
            } else if (e.key === "Enter") {
                e.preventDefault();
                setShowCommands(false);
                setCommand(commands[selectedCommandIndex]);
            } else if (e.key === "Escape") {
                setShowCommands(false);
                setCommandEscaped(true);
            }
        } else {
            if (command.startsWith("@") && e.key === "Tab") {
                e.preventDefault();
                setShowCommands(true);
                setCommandEscaped(false);
            } else if (e.key === "Enter" && e.ctrlKey && !e.shiftKey) {
                sendClientCommand();
            } else if (e.key === "Enter" && e.shiftKey && e.ctrlKey) {
                setCommand(lastCommand);
            } else if (e.key === "C" && e.ctrlKey && e.shiftKey) setChat([]);
        }
    };

    const sendClientCommand = () => {
        window.ipcRenderer.sendClientCommand({ clientList: selectedClients, command: command });
        setChat((chat) => [...chat, { who: "Me", message: command, time: new Date().toLocaleTimeString("it-IT") }]);
        setLastCommand(command);
        setCommand("");
    };

    const clearChat = () => setChat([]);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [chat]);

    useEffect(() => {
        window.ipcRenderer.onClientMessage((client) => setChat((chat) => [...chat, client]));

        return () => window.ipcRenderer.removeClientMessage();
    });

    return (
        <div className="flex flex-col flex-[9] bg-white font-bpg-arial max-w-[700px]">
            <div className="bg-white flex flex-col flex-[1] gap-y-5 p-5">
                <div className="px-2 gap-x-2 border-[1px] border-slate-300 shadow-sm rounded-md min-w-[200px] max-w-[100%] h-[55px] flex items-center overflow-y-hidden flex-nowrap overflow-x-hidden hide-scroll">
                    {selectedClients.length > 0 ? (
                        <AnimatePresence>
                            {selectedClients.map((c) => {
                                return <ChatClient key={c.type + c.id} client={c} selectClient={selectClient} />;
                            })}
                        </AnimatePresence>
                    ) : (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="px-2 py-1 border-[1px] border-slate-300 w-fit rounded-md bg-white absolute">
                                ყველა
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
                <div className="group border-[1px] border-slate-300 shadow-sm rounded-md w-full h-[calc(100vh-24rem)] flex flex-col-reverse overflow-y-hidden relative">
                    <button
                        className="opacity-0 absolute top-[10px] left-[-50px] group-hover:left-[10px] group-hover:opacity-100 transition-all duration-300 flex w-[40px] h-[40px] bg-red-500 hover:bg-red-500/90 active:bg-red-600 text-white rounded-md cursor-pointer shadow-sm items-center justify-center"
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
                                        className={`flex flex-col w-fit min-w-[150px] max-w-[350px] p-3 pb-1 border-[1px] border-slate-300 rounded-md ${
                                            c.who === "Me" ? "ms-auto" : ""
                                        }`}>
                                        <span className="text-sm font-bold">{c.who}</span>
                                        <div className="ml-3 mt-2">{c.message}</div>
                                        <div className={`text-[.65rem] text-slate-700 mt-3 ${c.who !== "Me" ? "ms-auto" : ""}`}>
                                            <i>{c.time}</i>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className="bg-white flex gap-x-2 flex-[10] px-5 pb-5 relative">
                <AnimatePresence>
                    {showCommands && (
                        <motion.div
                            initial={{ opacity: 0, y: -200 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -200 }}
                            transition={{ type: "spring", damping: 18, stiffness: 200 }}
                            className="absolute overflow-hidden shadow-sm rounded-md bottom-[calc(100%+10px)] left-[40px] bg-white">
                            <div className="">
                                {commands.map((cmd, i) => {
                                    return (
                                        <div key={i} className={`px-4 py-2 ${selectedCommandIndex === i ? "bg-slate-200" : ""} hover:bg-slate-200`}>
                                            {cmd}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <textarea
                    className="border-[1px] border-slate-300 shadow-sm p-3 rounded-md resize-none w-full h-full outline-none flex-[13] text-slate-700"
                    placeholder="ბრძანება. მზა ბრძანებისთვის გამოიყენეთ @. მაგ.: @someCommand"
                    value={command}
                    spellCheck={false}
                    onKeyDown={handleSelectCommand}
                    onChange={handleChangeCommand}></textarea>
                <div className="bg-white flex flex-col gap-y-2 border-[1px] rounded-md border-slate-300 shadow-sm w-[65px] p-2">
                    <motion.button
                        whileTap={{ scale: 1.1 }}
                        transition={{ type: "spring", damping: 11, stiffness: 300 }}
                        className="bg-slate-200 hover:bg-slate-200/75 active:bg-slate-300 h-full flex items-center justify-center rounded-md text-2xl text-slate-700 cursor-pointer">
                        <FiInfo />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 1.1 }}
                        transition={{ type: "spring", damping: 11, stiffness: 300 }}
                        className="bg-amber-400 hover:bg-amber-400/90 active:bg-amber-500 h-full flex items-center justify-center rounded-md text-2xl text-white cursor-pointer"
                        onClick={() => setCommand(lastCommand)}>
                        <FaRepeat />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 1.1 }}
                        transition={{ type: "spring", damping: 11, stiffness: 300 }}
                        className="bg-blue-400 hover:bg-blue-400/90 active:bg-blue-500 h-full flex items-center justify-center rounded-md text-2xl text-white cursor-pointer"
                        onClick={sendClientCommand}>
                        <RiSendPlaneFill className="mr-0.5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
