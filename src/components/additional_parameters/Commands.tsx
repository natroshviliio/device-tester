import { ChangeEvent, useEffect, useRef, useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { appContext } from "../../store";

import { AnimatePresence, Reorder } from "motion/react";
import Command from "./Command";

const Commands = () => {
    const { commands, setCommands } = appContext();
    const [editableCommand, setEditableCommand] = useState<number>();
    const inputRef = useRef<HTMLInputElement>(null);
    const commandsRef = useRef<HTMLDivElement>(null);

    const selectToEdit = (i: number) => {
        setEditableCommand(i);
    };

    const handleChangeCmd = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        const _cmds = [...commands];
        _cmds[i].command = e.target.value;
        setCommands(_cmds);
    };

    const addNewCommand = () => {
        const generateCommandId = (): number => {
            let cmd_id: number = Math.round(Math.random() * 10000000);
            while (commands.some((c) => c.command_id === cmd_id)) {
                cmd_id = Math.round(Math.random() * 10000000);
            }

            return cmd_id;
        };

        const command_id = generateCommandId();
        const command: Command = {
            command_id,
            command: "",
        };
        if (commands[commands.length - 1]?.command.length > 0) {
            setCommands([...commands, command]).then(() => {
                setEditableCommand(command.command_id);
            });
        }
        if (commands.length === 0) {
            setCommands([...commands, command]).then(() => {
                setEditableCommand(command.command_id);
            });
        }
    };

    const saveCommand = async () => {
        await setCommands(commands, true);
        setEditableCommand(undefined);
    };

    const removeCommand = (i: number) => {
        setCommands(
            commands.filter((_, idx) => idx !== i),
            true
        );
        setEditableCommand(undefined);
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [editableCommand]);

    useEffect(() => {
        if (commandsRef.current) commandsRef.current.scrollTop = commandsRef.current.scrollHeight;
    }, [commands]);
    return (
        <div className="border border-neutral-300 dark:border-neutral-600 flex flex-col text-neutral-800 dark:text-neutral-300 xl:w-[100%] 2xl:w-[90%] mx-auto h-[400px] transition-[width] rounded-md overflow-hidden">
            <div className="text-center py-3 text-lg font-bold">ბრძანებები</div>
            <div className="flex-[13] overflow-y-scroll hide-scroll overflow-x-hidden font-bpg-arial w-full px-2" ref={commandsRef}>
                <Reorder.Group values={commands} onReorder={setCommands} axis="y">
                    <AnimatePresence>
                        {commands.map((cmd, i) => {
                            return (
                                <Command
                                    key={cmd.command_id}
                                    command={cmd}
                                    i={i}
                                    editableCommand={editableCommand}
                                    inputRef={inputRef}
                                    handleChangeCmd={handleChangeCmd}
                                    saveCommand={saveCommand}
                                    removeCommand={removeCommand}
                                    selectToEdit={selectToEdit}
                                />
                            );
                        })}
                    </AnimatePresence>
                </Reorder.Group>
            </div>
            <div className="flex flex-[2] bg-white dark:bg-neutral-700 items-center border-t border-neutral-300 dark:border-neutral-600">
                <button
                    className="px-4 h-full w-full flex items-center justify-center cursor-pointer bg-white hover:bg-neutral-50 active:bg-neutral-100 dark:bg-neutral-600 dark:hover:bg-neutral-500/25 dark:active:bg-neutral-600/25 text-lg"
                    onClick={addNewCommand}>
                    <HiPlus />
                </button>
            </div>
        </div>
    );
};

export default Commands;
