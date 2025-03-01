import { AnimatePresence, motion } from "motion/react";
import { FC } from "react";
import ChatClient from "./ChatClient";

type ChatClientList = {
    selectedClients: Client[];
    selectClient: (client: Client) => void;
};

const ChatClientList: FC<ChatClientList> = ({ selectedClients, selectClient }) => {
    return (
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
    );
};

export default ChatClientList;
