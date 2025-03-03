import { appContext } from "../../store";
import { FaRegWindowMinimize } from "react-icons/fa";
import { LuMaximize } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { TbSettings } from "react-icons/tb";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Settings from "./Settings";

const TitleBar = () => {
    const { documentTitle, theme } = appContext();
    const [isSettingsShown, setIsSettingsShown] = useState<boolean>(false);

    const toggleShowSettings = () => setIsSettingsShown(!isSettingsShown);

    const minimizeWindow = () => window.ipcRenderer.minimizeWindow();
    const maximizeWindow = () => window.ipcRenderer.maximizeWindow();
    const closeWindow = () => window.ipcRenderer.closeWindow();

    return (
        <div className={`flex items-center dark:text-neutral-200 font-bpg-arial z-[999] ${theme.designStyle === "2" ? "gap-x-3 mb-2" : ""}`}>
            <div
                className={`flex w-full items-center pl-4 py-3 ${
                    theme.designStyle === "2" ? "rounded-l-full rounded-r-full" : "rounded-tl-2xl"
                } bg-white dark:bg-neutral-800 drag border-b-[0.5px] border-neutral-100 dark:border-neutral-700`}>
                <span className="bg-[url('/electron-vite.svg')] bg-contain bg-no-repeat w-5 h-5" />
                <span className="mt-1 ml-2 font-bpg-square-banner-caps-2013 text-sm uppercase">{documentTitle}</span>
            </div>
            <div
                className={`flex gap-x-2 px-4 items-center ml-auto no-drag h-full bg-white dark:bg-neutral-800 drag border-b-[0.5px] border-neutral-100 dark:border-neutral-700 ${
                    theme.designStyle === "2" ? "rounded-l-full rounded-r-full" : "rounded-tr-2xl"
                }`}>
                <div className="relative">
                    <motion.div
                        initial={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.1, rotate: 80 }}
                        transition={{ type: "spring" }}
                        whileTap={{ rotate: 120 }}
                        className="flex items-center justify-center rounded-full text-neutral-400 text-2xl mt-[1px]"
                        onClick={toggleShowSettings}>
                        <TbSettings />
                    </motion.div>
                    <AnimatePresence>{isSettingsShown && <Settings />}</AnimatePresence>
                </div>
                <div className="w-[2px] mx-3 bg-neutral-300 flex h-[70%]" />
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring" }}
                    onClick={minimizeWindow}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-400 hover:bg-neutral-400/90 text-neutral-100 text-sm">
                    <FaRegWindowMinimize />
                </motion.div>
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring" }}
                    onClick={maximizeWindow}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-400 hover:bg-amber-400/90 dark:bg-amber-400/75 dark:hover:bg-amber-400/85 text-slate-100">
                    <LuMaximize />
                </motion.div>
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring" }}
                    onClick={closeWindow}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-red-400 hover:bg-red-400/90 text-slate-100">
                    <IoCloseSharp />
                </motion.div>
            </div>
        </div>
    );
};

export default TitleBar;
