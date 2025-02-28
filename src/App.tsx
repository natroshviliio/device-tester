import { ChangeEvent, KeyboardEvent, MouseEvent, useState } from "react";
import "./App.css";
import ServerParameters from "./components/server_parameters/ServerParameters";
import DeviceList from "./components/device_list/DeviceList";

import { RiSendPlaneFill } from "react-icons/ri";
import { FiInfo } from "react-icons/fi";
import { FaRepeat } from "react-icons/fa6";

import { AnimatePresence, motion } from "motion/react";

function App() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClients, setSelectedClients] = useState<Client[]>([]);

    const [x, setX] = useState(400);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const isBoxResizing = (down: boolean) => setIsResizing(down);
    const resizeDeviceListBox = (e: MouseEvent<HTMLDivElement>) => {
        if (isResizing) {
            if (e.clientX + 2 >= 250 && e.clientX + 2 <= 500) setX(e.clientX + 2);
        }
    };

    const [command, setCommand] = useState<string>("");
    const [commands, setCommands] = useState<string[]>(["Num:", "Open:", "Message:", "ChangeColor:"]);
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
            }
        }
    };

    return (
        <div className="select-none w-full h-screen flex flex-col font-alk-sanet">
            <ServerParameters setClients={setClients} setSelectedClients={setSelectedClients} />
            <div className="flex flex-[1] bg-white" onMouseMove={resizeDeviceListBox} onMouseUp={() => isBoxResizing(false)}>
                <DeviceList
                    clients={clients}
                    selectedClients={selectedClients}
                    x={x}
                    setClients={setClients}
                    setSelectedClients={setSelectedClients}
                    isBoxResizing={isBoxResizing}
                />
                <div className="flex flex-col flex-[10] bg-white font-bpg-arial">
                    <div className="bg-white flex flex-col flex-[10] gap-y-5 p-5">
                        <div className="border-[1px] border-slate-300 shadow-sm rounded-md w-full h-full flex-[1]"></div>
                        <div className="border-[1px] border-slate-300 shadow-sm rounded-md w-full h-full flex-[10]"></div>
                    </div>
                    <div className="bg-white flex gap-x-2 flex-[3] px-5 pb-5 relative">
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
                                                <div
                                                    key={i}
                                                    className={`px-4 py-2 ${selectedCommandIndex === i ? "bg-slate-200" : ""} hover:bg-slate-200`}>
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
                            placeholder="დაწერეთ ბრძანება. მზა ბრძანებისთვის გამოიყენეთ @. მაგ.: @someCommand"
                            value={command}
                            spellCheck={false}
                            onKeyDown={handleSelectCommand}
                            onChange={handleChangeCommand}></textarea>
                        <div className="bg-white flex flex-col gap-y-2 border-[1px] rounded-md border-slate-300 shadow-sm flex-[1] p-2">
                            <motion.button
                                whileTap={{ scale: 1.1 }}
                                transition={{ type: "spring", damping: 11, stiffness: 300 }}
                                className="bg-slate-200 hover:bg-slate-200/75 active:bg-slate-300 h-full flex items-center justify-center rounded-md text-2xl text-slate-700 cursor-pointer">
                                <FiInfo />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 1.1 }}
                                transition={{ type: "spring", damping: 11, stiffness: 300 }}
                                className="bg-amber-400 hover:bg-amber-400/90 active:bg-amber-500 h-full flex items-center justify-center rounded-md text-2xl text-white cursor-pointer">
                                <FaRepeat />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 1.1 }}
                                transition={{ type: "spring", damping: 11, stiffness: 300 }}
                                className="bg-blue-400 hover:bg-blue-400/90 active:bg-blue-500 h-full flex items-center justify-center rounded-md text-2xl text-white cursor-pointer">
                                <RiSendPlaneFill className="mr-0.5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-[8] bg-white"></div>
            </div>
        </div>
    );
}

export default App;
