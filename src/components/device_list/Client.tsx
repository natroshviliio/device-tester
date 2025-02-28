import { VscDebugDisconnect } from "react-icons/vsc";
import { motion } from "motion/react";
import { FC } from "react";

type EachClient = {
    client: Client;
    selectedClients: Client[];
    selectClient: (client: Client) => void;
    destroyClient: (client_id: string) => void;
};

const Client: FC<EachClient> = ({ client, selectedClients, selectClient, destroyClient }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: "-120%" }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className={`shadow-sm flex mt-2 cursor-pointer ${
                selectedClients.some((c) => c.id === client.id)
                    ? "bg-slate-600 hover:bg-slate-500 relative text-white"
                    : "bg-gray-50 hover:bg-gray-100 relative text-slate-900"
            }`}>
            <div className="flex-[5] flex flex-col gap-y-1 p-3" onClick={() => selectClient(client)}>
                <div>ID: {client.id}</div>
                <div>IP: {client.ip_address}</div>
                <div>Device: {client.type}</div>
            </div>
            <button
                className="group absolute h-full top-0 right-0 rounded-l-xl w-[40px] hover:w-full hover:rounded-l-none transition-all duration-300 bg-red-500/90 hover:bg-red-500/90 active:bg-red-600 text-white cursor-pointer flex items-center justify-center text-5xl"
                onClick={() => destroyClient(client.id)}>
                <VscDebugDisconnect className="rotate-[-45deg] ml-2 group-hover:rotate-0 transition-all duration-500" />
            </button>
        </motion.div>
    );
};

export default Client;
