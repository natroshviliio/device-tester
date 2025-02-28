import { motion } from "motion/react";
import { FC } from "react";
import { IoCloseOutline } from "react-icons/io5";

type ChatClient = {
    client: Client;
    selectClient: (client: Client) => void;
};

const ChatClient: FC<ChatClient> = ({ client, selectClient }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", damping: 14, stiffness: 200 }}
            className="px-2 py-1 border-[1px] border-slate-300 w-fit rounded-md bg-white flex text-nowrap gap-x-2 items-center">
            {client.type}: {client.id}{" "}
            <span className="ml-3 text-[1.2rem] cursor-pointer" onClick={() => selectClient(client)}>
                <IoCloseOutline />
            </span>
        </motion.div>
    );
};

export default ChatClient;
