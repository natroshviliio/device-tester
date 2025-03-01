import { Dispatch, FC, SetStateAction, useEffect } from "react";
import ChatClientList from "./ChatClientList";
import ChatBody from "./ChatBody";
import ChatCommandLine from "./ChatCommandLine";

type Chat = {
    selectedClients: Client[];
    commands: string[];
    selectClient: (client: Client) => void;
    chat: ChatMessage[];
    setChat: Dispatch<SetStateAction<ChatMessage[]>>;
};

const Chat: FC<Chat> = ({ selectedClients, commands, chat, selectClient, setChat }) => {
    const clearChat = () => setChat([]);

    useEffect(() => {
        window.ipcRenderer.onClientMessage((client) => setChat((chat) => [...chat, client]));

        return () => window.ipcRenderer.removeClientMessage();
    });

    return (
        <div className="flex flex-col flex-[9] bg-white font-bpg-arial max-w-[700px]">
            <div className="bg-white flex flex-col flex-[1] gap-y-5 p-5">
                <ChatClientList selectedClients={selectedClients} selectClient={selectClient} />
                <ChatBody chat={chat} clearChat={clearChat} />
            </div>
            <ChatCommandLine commands={commands} selectedClients={selectedClients} setChat={setChat} />
        </div>
    );
};

export default Chat;
