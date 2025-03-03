import { VscDebugDisconnect } from "react-icons/vsc";
import { Reorder, useDragControls, motion } from "motion/react";
import { FC } from "react";
import { RxDragHandleDots1 } from "react-icons/rx";

type EachClient = {
    client: Client;
    selectedClients: Client[];
    isResizing: boolean;
    selectClient: (client: Client) => void;
    destroyClient: (client_id: string) => void;
};

const Client: FC<EachClient> = ({ client, selectedClients, isResizing, selectClient, destroyClient }) => {
    const dragControl = useDragControls();

    return (
        <Reorder.Item
            value={client}
            dragListener={false}
            dragControls={dragControl}
            transition={isResizing ? { duration: 0 } : { type: "spring" }}
            className="mt-2">
            <motion.div
                initial={{ opacity: 0, y: -200 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: "-120%" }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className={`border-b h-full flex cursor-pointer font-bpg-square-banner-caps-2013 ${
                    selectedClients.some((c) => c.id === client.id)
                        ? "bg-neutral-300 hover:bg-neutral-300 border-b-neutral-400 text-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-700/75 dark:border-neutral-600 dark:text-neutral-300 relative"
                        : "bg-neutral-50 hover:bg-neutral-100 border-b-neutral-200 text-neutral-800 dark:bg-neutral-700/25 dark:hover:bg-neutral-700/50 dark:text-neutral-400 dark:border-neutral-600 relative"
                }`}>
                <div
                    className="px-2 flex flex-col justify-center h-full text-xl bg-neutral-300/25 dark:bg-neutral-700/25 text-neutral-400/50 dark:text-neutral-600/50"
                    onPointerDown={(e) => dragControl.start(e)}>
                    <RxDragHandleDots1 className="-mb-1" />
                    <RxDragHandleDots1 className="-mb-1" />
                    <RxDragHandleDots1 className="-mb-1" />
                    <RxDragHandleDots1 className="-mb-1" />
                    <RxDragHandleDots1 className="-mb-1" />
                </div>
                <div className="flex-[5] flex flex-col gap-y-1 p-3" onClick={() => selectClient(client)}>
                    <div>ID: {client.id}</div>
                    <div>IP: {client.ip_address}</div>
                    <div>Device: {client.type}</div>
                </div>
                <button
                    className="group absolute h-full top-0 right-0 rounded-l-xl w-[40px] hover:w-full hover:rounded-l-none transition-all duration-300 bg-red-400/90 hover:bg-red-400/75 active:bg-red-600 text-white cursor-pointer flex items-center justify-center text-5xl"
                    onClick={() => destroyClient(client.id)}>
                    <VscDebugDisconnect className="rotate-[-45deg] ml-2 group-hover:rotate-0 transition-all duration-500" />
                </button>
            </motion.div>
        </Reorder.Item>
    );
};

export default Client;
