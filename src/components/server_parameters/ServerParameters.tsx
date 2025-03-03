import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { appContext } from "../../store";
import { FaPlay, FaStop } from "react-icons/fa";

type ServerParameters = {
    setChat: Dispatch<SetStateAction<ChatMessage[]>>;
    setClients: Dispatch<SetStateAction<Client[]>>;
    setSelectedClients: Dispatch<SetStateAction<Client[]>>;
};

const ServerParameters: FC<ServerParameters> = ({ setChat, setClients, setSelectedClients }) => {
    const { defaultTitle, setDocumentTitle, theme } = appContext();

    const [serverPort, setServerPort] = useState<string>("");
    const [serverResponse, setServerResponse] = useState<boolean>();

    const handleChangeServerPort = (e: ChangeEvent<HTMLInputElement>) => {
        setServerPort(e.target.value);
    };
    const tryConnect = () => {
        window.ipcRenderer.tryConnect(serverPort).then((res) => setServerResponse(res));
        setDocumentTitle(defaultTitle + " - PORT " + serverPort);
    };
    const closeServer = () => {
        window.ipcRenderer.closeServer().then((res) => setServerResponse(res));
        setClients([]);
        setSelectedClients([]);
        setChat([]);
        setDocumentTitle(defaultTitle);
    };

    return (
        <div
            className={`px-6 py-4 flex flex-col flex-0 gap-y-2 border-b border-neutral-200 transition-[border-radius] duration-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 z-30 ${
                theme.designStyle === "2" ? "rounded-t-2xl" : "rounded-0"
            }`}>
            <div className="flex gap-x-2 ms-3 items-center">
                <input
                    className="p-2 rounded-lg border-[1px] outline-none border-neutral-300 dark:border-neutral-700 disabled:text-neutral-400 text-neutral-800 dark:text-neutral-200"
                    type="number"
                    placeholder="პორტი მაგ.: 5000"
                    disabled={serverResponse}
                    onChange={handleChangeServerPort}
                    onKeyDown={(e) => e.key === "Enter" && tryConnect()}
                />
                <button
                    disabled={serverPort.length === 0 || serverPort.match(/[e|-|+]/) ? true : false}
                    className={`px-5 py-2 h-full text-white disabled:bg-neutral-500 cursor-pointer rounded-lg text-lg
                        ${
                            serverResponse
                                ? "bg-red-400 hover:bg-red-400/90 active:bg-red-500"
                                : "bg-emerald-500/75 hover:bg-emerald-400 active:bg-emerald-600"
                        }
                            `}
                    onClick={serverResponse ? closeServer : tryConnect}>
                    {serverResponse ? <FaStop /> : <FaPlay />}
                </button>
                <span className={`ms-auto ${serverResponse ? "text-emerald-600" : "text-red-400"} text-lg font-bold`}>
                    {(serverResponse === true && "სერვერი გაშვებულია") || (serverResponse === false && "პორტი დაკავებულია")}
                </span>
            </div>
        </div>
    );
};

export default ServerParameters;
