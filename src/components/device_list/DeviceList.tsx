import { AnimatePresence, Reorder } from "motion/react";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import Client from "./Client";

type DeviceList = {
    clients: Client[];
    selectedClients: Client[];
    x: number;
    isResizing: boolean;
    setClients: Dispatch<SetStateAction<Client[]>>;
    selectClient: (client: Client) => void;
    setSelectedClients: Dispatch<SetStateAction<Client[]>>;
    isBoxResizing: (down: boolean) => void;
};

const DeviceList: FC<DeviceList> = ({ clients, selectedClients, x, isResizing, setClients, setSelectedClients, isBoxResizing, selectClient }) => {
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
            className={`min-w-[250px] max-w-[500px] flex overflow-hidden h-[calc(100vh-7.7rem)] pb-1 relative bg-white dark:bg-neutral-800 border-r border-r-neutral-200 dark:border-neutral-700 z-20`}
            style={{ width: x + "px" }}>
            <Reorder.Group onReorder={setClients} values={clients} axis="y" className="w-full flex flex-col overflow-x-hidden hide-scroll relative">
                <div
                    className={`px-2 py-3 text-center sticky top-0 ease-in-out text-nowrap bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 z-20 `}>
                    <span className={`transition-normal duration-300 ${x < 300 ? "text-[.8rem]" : ""}`}>დაკავშირებული მოწყობილობები</span>
                </div>
                <AnimatePresence>
                    {clients.map((client) => {
                        return (
                            <Client
                                key={client.id}
                                client={client}
                                isResizing={isResizing}
                                selectedClients={selectedClients}
                                selectClient={selectClient}
                                destroyClient={destroyClient}
                            />
                        );
                    })}
                </AnimatePresence>
            </Reorder.Group>
            <div className="flex absolute top-0 right-0 h-full w-2 bg-transparent cursor-e-resize" onMouseDown={() => isBoxResizing(true)} />
        </div>
    );
};

export default DeviceList;
