import { motion, Reorder, useDragControls } from "motion/react";
import { FC } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { GoGrabber } from "react-icons/go";

type ChatClient = {
    client: Client;
    selectClient: (client: Client) => void;
};

const ChatClient: FC<ChatClient> = ({ client, selectClient }) => {
    const dragControl = useDragControls();
    return (
        <Reorder.Item value={client} dragListener={false} dragControls={dragControl} transition={{ type: "spring" }}>
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", damping: 14, stiffness: 200 }}
                className="px-2 py-1 border-[1px] border-slate-300 dark:border-neutral-600 w-fit rounded-md bg-white dark:bg-neutral-700 dark:text-neutral-300 flex text-nowrap gap-x-2 items-center">
                <motion.span className="-mr-1 text-lg cursor-pointer" onPointerDown={(e) => dragControl.start(e)}>
                    <GoGrabber />
                </motion.span>
                {client.type}: {client.id}{" "}
                <span className="ml-3 text-[1.2rem] cursor-pointer" onClick={() => selectClient(client)}>
                    <IoCloseOutline />
                </span>
            </motion.div>
        </Reorder.Item>
    );
};

export default ChatClient;
