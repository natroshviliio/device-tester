import { Reorder, motion, AnimatePresence, useDragControls } from "motion/react";
import { ChangeEvent, FC, RefObject } from "react";
import { FaCheck } from "react-icons/fa";
import { GoGrabber } from "react-icons/go";
import { HiOutlineMinusSmall } from "react-icons/hi2";

type EachCommand = {
    command: Command;
    editIndex: number | undefined;
    i: number;
    inputRef: RefObject<HTMLInputElement>;
    handleChangeCmd: (e: ChangeEvent<HTMLInputElement>, i: number) => void;
    saveCommand: () => Promise<void>;
    removeCommand: (i: number) => void;
    selectToEdit: (i: number) => void;
};

const Command: FC<EachCommand> = ({ command, editIndex, i, inputRef, handleChangeCmd, saveCommand, removeCommand, selectToEdit }) => {
    const dragControl = useDragControls();

    return (
        <Reorder.Item value={command} dragListener={false} dragControls={dragControl}>
            <motion.div
                className={`pl-3 h-13 flex items-center w-full rounded-md overflow-hidden mt-3 relative pr-0 border-b border-neutral-200 dark:border-neutral-600 transition-colors duration-150 hover:bg-neutral-50/50 dark:hover:bg-neutral-500/25 ${
                    editIndex === i ? "bg-neutral-50 dark:bg-neutral-700/75" : "bg-white dark:bg-neutral-700/50"
                }`}
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "-130%", opacity: 0.5 }}
                transition={{ type: "spring", duration: 0.6 }}>
                <motion.span className="mr-1 mb-0.5 text-lg cursor-pointer" onPointerDown={(e) => dragControl.start(e)}>
                    <GoGrabber />
                </motion.span>
                {editIndex === i ? (
                    <>
                        <motion.input
                            initial={{ paddingLeft: 0 }}
                            animate={{ paddingLeft: "0.75rem" }}
                            transition={{ duration: 0.15 }}
                            type="text"
                            className="outline-none w-full pl-3"
                            value={command.command}
                            spellCheck={false}
                            placeholder="ახალი ბრძანება"
                            onChange={(e) => handleChangeCmd(e, i)}
                            onKeyDown={(e) => (e.key === "Enter" ? (command.command.length > 0 ? saveCommand() : removeCommand(i)) : e)}
                            ref={inputRef}
                        />
                        <AnimatePresence>
                            <motion.button
                                key={"k"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, position: "absolute" }}
                                className="px-4 h-full cursor-pointer right-0 bg-emerald-400 text-white hover:bg-emerald-400/75 active:bg-emerald-500 text-lg border-l border-neutral-200 dark:border-neutral-500"
                                onClick={command.command.length > 0 ? saveCommand : () => removeCommand(i)}>
                                <motion.div key={"b"} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <FaCheck />
                                </motion.div>
                            </motion.button>
                        </AnimatePresence>
                    </>
                ) : (
                    <>
                        <span className="w-full h-full flex items-center" onClick={() => selectToEdit(i)}>
                            {command.command}
                        </span>
                        <AnimatePresence>
                            <motion.button
                                key={"b"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, position: "absolute" }}
                                className="px-4 h-full cursor-pointer right-0 bg-red-400 text-white hover:bg-red-400/75 active:bg-red-500 text-lg border-l border-neutral-200 dark:border-neutral-500"
                                onClick={() => removeCommand(i)}>
                                <motion.div key={"s"} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <HiOutlineMinusSmall />
                                </motion.div>
                            </motion.button>
                        </AnimatePresence>
                    </>
                )}
            </motion.div>
        </Reorder.Item>
    );
};

export default Command;
