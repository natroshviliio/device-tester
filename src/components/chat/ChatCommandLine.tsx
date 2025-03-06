import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, Dispatch, FC, KeyboardEvent, SetStateAction, useState } from "react";
import { FaRepeat } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import ChatCommandLineHelp from "./ChatCommandLineHelp";

type ChatCommandLine = {
    commands: Command[];
    selectedClients: Client[];
    setChat: Dispatch<SetStateAction<ChatMessage[]>>;
};

const ChatCommandLine: FC<ChatCommandLine> = ({ commands, selectedClients, setChat }) => {
    const [lastCommand, setLastCommand] = useState<string>("");
    const [command, setCommand] = useState<string>("");
    const [selectedCommandIndex, setSelectedCommandIndex] = useState<number>(0);
    const [showCommands, setShowCommands] = useState<boolean>(false);
    const [commandEscaped, setCommandEscaped] = useState<boolean>(false);

    const [shouldClearCommand, setShouldClearCommand] = useState<boolean>(true);
    const [clearCommandHover, setClearCommandHover] = useState<boolean>(false);
    const toggleClearCommandHover = (bool: boolean) => setClearCommandHover(bool);

    const toggleShouldClearCommand = () => setShouldClearCommand(!shouldClearCommand);

    const [isCommandLineHelp, setIsCommandLineHelp] = useState<boolean>(false);
    const showCommandLineHelp = () => setIsCommandLineHelp(!isCommandLineHelp);

    const sendClientCommand = () => {
        window.ipcRenderer.sendClientCommand({ clientList: selectedClients, command: command });
        setChat((chat) => [
            ...chat,
            { who: "Me", message: command.length > 0 ? command : "ცარიელი შეტყობინება", time: new Date().toLocaleTimeString("it-IT") },
        ]);
        setLastCommand(command);
        shouldClearCommand && setCommand("");
    };

    const handleChangeCommand = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (commands.length > 0) setSelectedCommandIndex(0);
        if (e.target.value.startsWith("@")) {
            const probableCommand = e.target.value.slice(1).toLowerCase();
            if (commands.some((cmd) => cmd.command.toLocaleLowerCase().startsWith(probableCommand))) {
                setSelectedCommandIndex(commands.findIndex((cmd) => cmd.command.toLocaleLowerCase().startsWith(probableCommand)));
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
                setCommand(commands[selectedCommandIndex].command);
            } else if (e.key === "Escape") {
                setShowCommands(false);
                setCommandEscaped(true);
            }
        } else {
            if (command.startsWith("@") && e.key === "Tab") {
                e.preventDefault();
                setShowCommands(true);
                setCommandEscaped(false);
            }
        }

        if (e.key === "Enter" && e.ctrlKey && !e.shiftKey) {
            sendClientCommand();
        } else if (e.key === "Enter" && e.shiftKey && e.ctrlKey) {
            setCommand(lastCommand);
        } else if (e.key === "C" && e.ctrlKey && e.shiftKey) {
            setChat([]);
        } else if (e.ctrlKey && e.shiftKey && e.key === "N") {
            toggleShouldClearCommand();
        }
    };

    const commandClear = {
        animate: { width: "auto", marginLeft: 0, transition: { delay: 1 } },
    };

    return (
        <div className="bg-white dark:bg-neutral-800 flex gap-x-2 flex-[10] px-5 pb-5 relative w-full">
            <AnimatePresence>
                {showCommands && (
                    <motion.div
                        initial={{ opacity: 0, y: -300 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -300 }}
                        transition={{ type: "spring", damping: 18, stiffness: 200 }}
                        className="absolute overflow-hidden shadow-sm rounded-md bottom-[calc(100%+10px)] min-w-[200px] left-[40px] bg-white text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300">
                        <div className="">
                            {commands.map((cmd, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={`px-4 py-2 ${
                                            selectedCommandIndex === i ? "bg-neutral-200 dark:bg-neutral-600" : ""
                                        } hover:bg-neutral-200 dark:hover:bg-neutral-600`}>
                                        {cmd.command}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div
                className="flex w-full h-full relative overflow-hidden"
                onMouseEnter={() => toggleClearCommandHover(true)}
                onMouseLeave={() => toggleClearCommandHover(false)}>
                <AnimatePresence>
                    {clearCommandHover && (
                        <motion.div
                            initial={{ opacity: 0, right: -200 }}
                            animate={{ opacity: 1, right: 15 }}
                            exit={{ opacity: 0, right: -200 }}
                            transition={{ type: "spring" }}
                            whileHover="animate"
                            className="bg-neutral-100 dark:bg-neutral-500 z-[99] text-nowrap w-fit flex items-center p-2 rounded-md shadow absolute bottom-[15px]">
                            <motion.span
                                initial={{ width: "auto", marginLeft: 0 }}
                                animate={{ width: 0, marginLeft: -10 }}
                                variants={commandClear}
                                transition={{ delay: 2 }}
                                className="text-slate-800 dark:text-neutral-300 flex overflow-hidden group-hover:w-auto">
                                გასუფთავების რეჟიმი
                            </motion.span>
                            <input
                                type="checkbox"
                                id="donotclear"
                                className="hidden peer"
                                checked={shouldClearCommand}
                                onChange={toggleShouldClearCommand}
                            />
                            <label
                                htmlFor="donotclear"
                                className="cursor-pointer flex items-center w-12 h-6 bg-neutral-500 dark:bg-neutral-200 group peer-checked:bg-green-500/75 relative px-1 ml-3 rounded-xl after:bg-white dark:after:bg-neutral-600 after:w-4 after:h-4 after:rounded-full after:absolute after:flex peer-checked:after:ml-[calc(100%-24px)] after:transition-all after:duration-300"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <textarea
                    className="border-[1px] border-neutral-300 dark:border-neutral-600 p-3 rounded-md resize-none w-full h-full outline-none flex-[13] text-neutral-700 dark:text-neutral-300"
                    placeholder="ბრძანება. მზა ბრძანებისთვის გამოიყენეთ @. მაგ.: @someCommand"
                    value={command}
                    spellCheck={false}
                    onKeyDown={handleSelectCommand}
                    onChange={handleChangeCommand}></textarea>
            </div>
            <div className="bg-white dark:bg-neutral-800 flex flex-col gap-y-2 p-2 border-[1px] rounded-md border-neutral-300 dark:border-neutral-600 w-[75px]">
                <div className="relative flex w-full h-full">
                    <motion.button
                        whileTap={{ scale: 1.1 }}
                        transition={{ type: "spring", damping: 11, stiffness: 300 }}
                        className="bg-neutral-200/25 hover:bg-neutral-200/30 active:bg-neutral-300/15 text-neutral-700 dark:text-neutral-300 w-full h-full flex items-center justify-center rounded-md text-2xl cursor-pointer"
                        onClick={showCommandLineHelp}>
                        <FiInfo />
                    </motion.button>
                    <AnimatePresence>{isCommandLineHelp && <ChatCommandLineHelp />}</AnimatePresence>
                </div>
                <motion.button
                    whileTap={{ scale: 1.1 }}
                    transition={{ type: "spring", damping: 11, stiffness: 300 }}
                    className="bg-amber-400 hover:bg-amber-400/90 active:bg-amber-500 dark:bg-amber-400/75 dark:hover:bg-amber-400/85 dark:active:bg-amber-400/90 h-full flex items-center justify-center rounded-md text-2xl text-white cursor-pointer"
                    onClick={() => setCommand(lastCommand)}>
                    <FaRepeat />
                </motion.button>
                <motion.button
                    whileTap={{ scale: 1.1 }}
                    transition={{ type: "spring", damping: 11, stiffness: 300 }}
                    className="bg-blue-400 hover:bg-blue-400/90 active:bg-blue-500 dark:bg-blue-400/75 dark:hover:bg-blue-400/85 dark:active:bg-blue-400/90 h-full flex items-center justify-center rounded-md text-2xl text-white cursor-pointer"
                    onClick={sendClientCommand}>
                    <RiSendPlaneFill className="mr-0.5" />
                </motion.button>
            </div>
        </div>
    );
};

export default ChatCommandLine;
