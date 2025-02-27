import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";

const ServerParameters: FC<{ setClients: Dispatch<SetStateAction<Client[]>>; setSelectedClients: Dispatch<SetStateAction<Client[]>> }> = ({
    setClients,
    setSelectedClients,
}) => {
    const [serverPort, setServerPort] = useState<string>("");
    const [serverResponse, setServerResponse] = useState<boolean>();

    const handleChangeServerPort = (e: ChangeEvent<HTMLInputElement>) => {
        setServerPort(e.target.value);
    };
    const tryConnect = () => {
        window.ipcRenderer.tryConnect(serverPort).then((res) => setServerResponse(res));
        document.title = "Device Tester -" + " PORT: " + serverPort;
    };
    const closeServer = () => {
        window.ipcRenderer.closeServer().then((res) => setServerResponse(res));
        setClients([]);
        setSelectedClients([]);
        document.title = "Device Tester";
    };

    return (
        <div className="px-6 py-4 flex flex-col flex-0 gap-y-2 shadow-sm z-30">
            <div className="flex gap-x-2 ms-3 items-center">
                <input
                    className="p-2 rounded-lg border-[1px] outline-none border-slate-400 disabled:text-slate-400"
                    type="number"
                    placeholder="პორტი მაგ.: 5000"
                    disabled={serverResponse}
                    onChange={handleChangeServerPort}
                />
                <button
                    disabled={serverPort.length === 0 || serverPort.match(/[e|-|+]/) ? true : false}
                    className={`px-5 py-2 text-white disabled:bg-emerald-300 cursor-pointer rounded-lg text-lg
                        ${
                            serverResponse
                                ? "bg-red-400 hover:bg-red-400/90 active:bg-red-500"
                                : "bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600"
                        }
                            `}
                    onClick={serverResponse ? closeServer : tryConnect}>
                    {serverResponse ? "დასრულება" : "გაშვება"}
                </button>
                <span className={`ms-auto ${serverResponse ? "text-emerald-600" : "text-red-400"} text-lg font-bold`}>
                    {(serverResponse === true && "სერვერი გაშვებულია") || (serverResponse === false && "პორტი დაკავებულია")}
                </span>
            </div>
        </div>
    );
};

export default ServerParameters;
