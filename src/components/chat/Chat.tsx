import { Dispatch, FC, SetStateAction, useEffect } from "react";
import ChatClientList from "./ChatClientList";
import ChatBody from "./ChatBody";
import ChatCommandLine from "./ChatCommandLine";
import { appContext } from "../../store";

type Chat = {
    selectedClients: Client[];
    setSelectedClients: Dispatch<SetStateAction<Client[]>>;
    selectClient: (client: Client) => void;
    chat: ChatMessage[];
    setChat: Dispatch<SetStateAction<ChatMessage[]>>;
};

const Chat: FC<Chat> = ({ selectedClients, chat, setSelectedClients, selectClient, setChat }) => {
    const { commands } = appContext();
    const clearChat = () => setChat([]);

    useEffect(() => {
        window.ipcRenderer.onClientMessage((client) => setChat((chat) => [...chat, client]));

        return () => window.ipcRenderer.removeClientMessage();
    });

    return (
        <div className="flex flex-col bg-white dark:bg-neutral-800 font-bpg-arial xl:w-[500px] 2xl:w-[700px] transition-[width] duration-300 border-r border-neutral-200 dark:border-r-neutral-700">
            <div className="bg-white dark:bg-neutral-800 flex flex-col flex-[1] gap-y-5 p-5 w-full">
                <ChatClientList selectedClients={selectedClients} setSelectedClients={setSelectedClients} selectClient={selectClient} />
                <ChatBody chat={chat} clearChat={clearChat} />
            </div>
            <ChatCommandLine commands={commands} selectedClients={selectedClients} setChat={setChat} />
        </div>
    );
};

export default Chat;
