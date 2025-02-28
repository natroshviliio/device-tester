import { MouseEvent, useState } from "react";
import "./App.css";
import ServerParameters from "./components/server_parameters/ServerParameters";
import DeviceList from "./components/device_list/DeviceList";
import Chat from "./components/chat/Chat";

function App() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClients, setSelectedClients] = useState<Client[]>([]);
    const [commands, setCommands] = useState<string[]>(["Num:", "Open:", "Message:", "ChangeColor:"]);
    const [chat, setChat] = useState<ChatMessage[]>([]);

    const [x, setX] = useState(400);
    const [isResizing, setIsResizing] = useState<boolean>(false);

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

    return (
        <div className="select-none w-full h-screen flex flex-col font-alk-sanet">
            <ServerParameters setClients={setClients} setSelectedClients={setSelectedClients} setChat={setChat} />
            <div className="flex flex-[1] bg-white" onMouseMove={resizeDeviceListBox} onMouseUp={() => isBoxResizing(false)}>
                <DeviceList
                    clients={clients}
                    selectedClients={selectedClients}
                    x={x}
                    setClients={setClients}
                    setSelectedClients={setSelectedClients}
                    isBoxResizing={isBoxResizing}
                    selectClient={selectClient}
                />
                <Chat selectedClients={selectedClients} commands={commands} chat={chat} selectClient={selectClient} setChat={setChat} />
                <div className="flex flex-col flex-[8] bg-white"></div>
            </div>
        </div>
    );
}

export default App;
