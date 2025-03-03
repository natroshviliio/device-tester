import { AnimatePresence, motion, Reorder } from "motion/react";
import { Dispatch, FC, SetStateAction } from "react";
import ChatClient from "./ChatClient";

type ChatClientList = {
    selectedClients: Client[];
    setSelectedClients: Dispatch<SetStateAction<Client[]>>;
    selectClient: (client: Client) => void;
};

const ChatClientList: FC<ChatClientList> = ({ selectedClients, setSelectedClients, selectClient }) => {
    return (
        <Reorder.Group
            axis="x"
            onReorder={setSelectedClients}
            values={selectedClients}
            className="px-2 gap-x-2 border border-neutral-300 dark:border-neutral-600 rounded-md min-w-[200px] max-w-[100%] h-[55px] flex items-center hide-scroll">
            {selectedClients.length > 0 ? (
                <AnimatePresence>
                    {selectedClients.map((c) => {
                        return <ChatClient key={c.id} client={c} selectClient={selectClient} />;
                    })}
                </AnimatePresence>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="px-2 py-1 border-[1px] border-slate-300 dark:border-neutral-600 w-fit rounded-md bg-white dark:bg-neutral-700 dark:text-neutral-300 absolute">
                        ყველა
                    </motion.div>
                </AnimatePresence>
            )}
        </Reorder.Group>
    );
};

export default ChatClientList;
