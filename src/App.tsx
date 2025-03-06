import { MouseEvent, useEffect, useState } from "react";
import "./App.css";
import ServerParameters from "./components/server_parameters/ServerParameters";
import DeviceList from "./components/device_list/DeviceList";
import Chat from "./components/chat/Chat";
import TitleBar from "./components/title_bar/TitleBar";
import { appContext } from "./store";
import AdditionalParameters from "./components/additional_parameters/AdditionalParameters";

function App() {
    const { theme, setTheme, setCommands } = appContext();
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClients, setSelectedClients] = useState<Client[]>([]);
    void setCommands;
    const [chat, setChat] = useState<ChatMessage[]>([]);

    const [x, setX] = useState(400);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const isBoxResizing = (down: boolean) => setIsResizing(down);
    const resizeDeviceListBox = (e: MouseEvent<HTMLDivElement>) => {
        if (isResizing) {
            if (e.clientX + 4 >= 250 && e.clientX + 4 <= 500) setX(e.clientX + 4);
        }
    };

    const selectClient = (client: Client) => {
        if (selectedClients.some((c) => c.id === client.id)) setSelectedClients((cs) => cs.filter((c) => c.id !== client.id));
        else setSelectedClients((c) => [...c, client]);
    };

    useEffect(() => {
        const _theme = JSON.parse(localStorage.getItem("theme") as string);
        const commands = JSON.parse(localStorage.getItem("commands") as string);

        if (!_theme) localStorage.setItem("theme", JSON.stringify(theme));
        else setTheme(_theme);

        if (!commands) localStorage.setItem("commands", JSON.stringify([]));
        else setCommands(commands);
    }, []);

    return (
        <div className={`select-none w-full h-screen overflow-hidden flex flex-col font-alk-sanet ${theme.mode}`}>
            <TitleBar />
            <ServerParameters setClients={setClients} setSelectedClients={setSelectedClients} setChat={setChat} />
            <div className="flex flex-[1] rounded-b-2xl overflow-hidden" onMouseMove={resizeDeviceListBox} onMouseUp={() => isBoxResizing(false)}>
                <DeviceList
                    clients={clients}
                    selectedClients={selectedClients}
                    x={x}
                    isResizing={isResizing}
                    setClients={setClients}
                    setSelectedClients={setSelectedClients}
                    isBoxResizing={isBoxResizing}
                    selectClient={selectClient}
                />
                <Chat
                    selectedClients={selectedClients}
                    chat={chat}
                    setSelectedClients={setSelectedClients}
                    selectClient={selectClient}
                    setChat={setChat}
                />
                <AdditionalParameters />
            </div>
        </div>
    );
}

export default App;
