/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
    interface ProcessEnv {
        APP_ROOT: string;
        VITE_PUBLIC: string;
    }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
    ipcRenderer: import("electron").IpcRenderer & {
        tryConnect: (serverPort: string) => Promise<boolean>;
        closeServer: () => Promise<undefined>;

        onClientListUpdate: (client) => void;
        removeClientListUpdate: () => void;

        sendClientCommand: (data: { clientList: Client[]; command: string }) => void;

        onClientMessage: (callback: (client: ChatMessage) => void) => void;
        removeClientMessage: () => void;

        destroyClient: (client_id: string) => void;

        //Window Back

        minimizeWindow: () => void;
        maximizeWindow: () => void;
        closeWindow: () => void;
    };
}

type Client = {
    id: string;
    ip_address: string;
    type: string;
};

type ClientInformation = {
    socket_id: string;
    socket_type: string;
    socket_ip: string;
};

type ChatMessage = {
    who: string;
    message: string;
    time: string;
};
