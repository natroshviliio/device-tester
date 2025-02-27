import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args;
        return ipcRenderer.off(channel, ...omit);
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        return ipcRenderer.send(channel, ...omit);
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
    },

    tryConnect: (serverPort: string) => ipcRenderer.invoke("try_connect", serverPort),
    closeServer: () => ipcRenderer.invoke("close_server"),

    onClientListUpdate: (callback: (client: { status: string; client?: Client; client_id?: string }) => void) => {
        ipcRenderer.on("client_list_update", (_, client) => callback(client));
    },

    removeClientListUpdate: () => ipcRenderer.removeAllListeners("client_list_update"),

    destroyClient: (client_id: string) => ipcRenderer.send("client_destroy", client_id),

    // You can expose other APTs you need here.
    // ...
});
