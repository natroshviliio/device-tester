import { appContext } from "../../store";
import { FaRegWindowMinimize } from "react-icons/fa";
import { LuMaximize } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { TbSettings } from "react-icons/tb";

import { motion } from "motion/react";

const TitleBar = () => {
    const { documentTitle } = appContext();

    const minimizeWindow = () => window.ipcRenderer.minimizeWindow();
    const maximizeWindow = () => window.ipcRenderer.maximizeWindow();
    const closeWindow = () => window.ipcRenderer.closeWindow();

    return (
        <div className="flex items-center py-3 bg-white drag px-4 border-b-[0.5px] border-neutral-100 font-bpg-arial">
            <div className="flex items-center">
                <span className="bg-[url('electron-vite.svg')] bg-contain bg-no-repeat w-5 h-5" />
                <span className="mt-1 ml-2 font-bpg-square-banner-caps-2013 text-sm uppercase">{documentTitle}</span>
            </div>
            <div className="flex gap-x-2 items-center ml-auto no-drag h-full">
                <motion.div
                    initial={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1, rotate: 80 }}
                    transition={{ type: "spring" }}
                    whileTap={{ rotate: 120 }}
                    className="flex items-center justify-center rounded-full text-neutral-400 text-2xl mt-[1px]">
                    <TbSettings />
                </motion.div>
                <div className="w-[2px] mx-3 bg-neutral-300 flex h-[70%]" />
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring" }}
                    onClick={minimizeWindow}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-400 hover:bg-slate-400/90 text-slate-100 text-sm">
                    <FaRegWindowMinimize />
                </motion.div>
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring" }}
                    onClick={maximizeWindow}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-400 hover:bg-amber-400/90 text-slate-100">
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
