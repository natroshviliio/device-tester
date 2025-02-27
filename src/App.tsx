import { MouseEvent, useEffect, useState } from "react";
import "./App.css";
import ServerParameters from "./components/server_parameters/ServerParameters";

import { VscDebugDisconnect } from "react-icons/vsc";

function App() {
    const [x, setX] = useState(400);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClients, setSelectedClients] = useState<Client[]>([]);

    const isBoxResizing = (down: boolean) => setIsResizing(down);
    const resizeDeviceListBox = (e: MouseEvent<HTMLDivElement>) => {
        if (isResizing) {
            if (e.clientX + 2 >= 250 && e.clientX + 2 <= 500) setX(e.clientX + 2);
        }
    };

    const selectClient = (client: Client) => {
        if (selectedClients.some((c) => c.id === client.id)) setSelectedClients((cs) => cs.filter((c) => c.id !== client.id));
        else setSelectedClients((c) => [...c, client]);
    };

    const destroyClient = (client_id: string) => {
        window.ipcRenderer.destroyClient(client_id);
    };

    useEffect(() => {
        window.ipcRenderer.onClientListUpdate((client: { status: string; client?: Client; client_id?: string }) => {
            if (client.status === "add") setClients((clients) => [...clients, client.client as Client]);
            else if (client.status === "destroy") setClients((clients) => clients.filter((c) => c.id !== client.client_id));
        });

        return () => window.ipcRenderer.removeClientListUpdate();
    }, []);

    return (
        <div className="select-none w-full h-screen flex flex-col font-alk-sanet">
            <ServerParameters setClients={setClients} setSelectedClients={setSelectedClients} />
            <div className="flex flex-[1]" onMouseMove={resizeDeviceListBox} onMouseUp={() => isBoxResizing(false)}>
                <div
                    className={`min-w-[250px] max-w-[500px] flex overflow-hidden h-[calc(100vh-5rem)] relative shadow-[4px_0px_10px_-8px_gray]`}
                    style={{ width: x + "px" }}>
                    <div className="w-full overflow-x-hidden overflow-y-auto">
                        <div className={`px-2 py-3 shadow-sm text-center sticky top-0 bg-white ${x < 300 ? "text-[.8rem]" : ""}`}>
                            დაკავშირებული მოწყობილობები
                        </div>
                        {clients.map((client, i) => {
                            return (
                                <div
                                    key={i}
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
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex w-1 bg-white cursor-e-resize" onMouseDown={() => isBoxResizing(true)} />
                </div>
            </div>
        </div>
    );
}

export default App;
