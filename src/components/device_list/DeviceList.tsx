import { AnimatePresence } from "motion/react";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import Client from "./Client";

type DeviceList = {
    clients: Client[];
    setClients: Dispatch<SetStateAction<Client[]>>;
    selectClient: (client: Client) => void;
    selectedClients: Client[];
    setSelectedClients: Dispatch<SetStateAction<Client[]>>;
    x: number;
    isBoxResizing: (down: boolean) => void;
};

const DeviceList: FC<DeviceList> = ({ clients, selectedClients, x, setClients, setSelectedClients, isBoxResizing, selectClient }) => {
    const destroyClient = (client_id: string) => {
        window.ipcRenderer.destroyClient(client_id);
        setSelectedClients((sc) => sc.filter((c) => c.id !== client_id));
    };

    useEffect(() => {
        window.ipcRenderer.onClientListUpdate((client: { status: string; client?: Client; client_id?: string }) => {
            if (client.status === "add") setClients((clients) => [...clients, client.client as Client]);
            else if (client.status === "destroy") {
                setClients((clients) => clients.filter((c) => c.id !== client.client_id));
                setSelectedClients((sc) => sc.filter((c) => c.id !== client.client_id));
            }
        });

        return () => window.ipcRenderer.removeClientListUpdate();
    }, []);

    return (
        <div
            className={`min-w-[250px] max-w-[500px] flex overflow-hidden h-[calc(100vh-5rem)] relative shadow-[4px_0px_10px_-8px_gray] z-20`}
            style={{ width: x + "px" }}>
            <div className="w-full flex flex-col overflow-x-hidden hide-scroll relative">
                <div
                    className={`px-2 py-3 shadow-sm text-center sticky top-0 transition-all duration-300 text-nowrap bg-white z-20 ${
                        x < 300 ? "text-[.8rem]" : ""
                    }`}>
                    დაკავშირებული მოწყობილობები
                </div>
                <AnimatePresence>
                    {clients.map((client) => {
                        return (
                            <Client
                                key={client.id}
                                client={client}
                                selectedClients={selectedClients}
                                selectClient={selectClient}
                                destroyClient={destroyClient}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>
            <div className="flex w-1 bg-white cursor-e-resize" onMouseDown={() => isBoxResizing(true)} />
        </div>
    );
};

export default DeviceList;
