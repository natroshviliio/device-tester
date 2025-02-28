import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

import express from "express";
import http from "http";
import cors from "cors";
import WebSocket, { WebSocketServer } from "ws";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);
void require;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        minWidth: 1280,
        width: 1600,
        height: 900,
        icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    win.setMenuBarVisibility(false);

    // win.webContents.openDevTools();
    // Test active push message to Renderer-process.
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send("main-process-message", new Date().toLocaleString());
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

//mine
const expressServer = express();
expressServer.use(express.urlencoded({ extended: true }));
expressServer.use(express.json());
expressServer.use(cors());

const httpServer = http.createServer(expressServer);
const wss = new WebSocketServer({ server: httpServer });

interface WSocket extends WebSocket {
    client_information: ClientInformation;
}

const Sockets = new Set<WSocket>();

wss.on("connection", (socket: WSocket, req) => {
    const protocol: string[] = socket.protocol.split("|");
    const socket_type = protocol[0];
    const socket_id = protocol[1];
    const socket_ip = req.socket.remoteAddress?.replace(/[:f]/g, "") as string;

    socket.client_information = { socket_id, socket_type, socket_ip };
    win?.webContents.send("client_list_update", { status: "add", client: { id: socket_id, type: socket_type, ip_address: socket_ip } });

    Sockets.add(socket);

    socket.on("message", (data) => {
        win?.webContents.send("client_message_receive", {
            who: socket.client_information.socket_type + " " + socket.client_information.socket_id,
            message: data.toString(),
            time: new Date().toLocaleTimeString("it-IT"),
        });
    });

    socket.on("close", () => {
        Sockets.delete(socket);
        win?.webContents.send("client_list_update", { status: "destroy", client_id: socket.client_information.socket_id });
    });

    socket.on("error", () => {
        win?.webContents.send("client_list_update", { status: "destroy", client_id: socket.client_information.socket_id });
        Sockets.delete(socket);
        socket.close();
    });
});

ipcMain.handle("try_connect", async (_, serverPort: string) => {
    httpServer.listening && httpServer.close();

    try {
        const isPortReady = execSync(`netstat -an | find ":${serverPort} "`).toString();
        if (isPortReady.includes("ESTABLISHED") || isPortReady.includes("TIME_WAIT")) {
            httpServer.listen(serverPort, () => {
                console.log("Server is running on port:", serverPort);
            });
        }
    } catch (err: string | any) {
        if (err.toString().startsWith("Error: Command failed:")) {
            httpServer.listen(serverPort, () => {
                console.log("Server is running on port:", serverPort);
            });
        }
    }

    return httpServer.listening;
});

ipcMain.handle("close_server", async () => {
    Sockets.forEach((socket: WSocket) => {
        socket.close();
        wss.clients.delete(socket);
        Sockets.delete(socket);
    });

    httpServer.close();
    return undefined;
});

ipcMain.on("client_send_command", (_, data: { clientList: Client[]; command: string }) => {
    const clients = data.clientList.map((client) => client.id);
    Sockets.forEach((client) => {
        if (clients.includes(client.client_information.socket_id)) {
            client.send(data.command);
        }
    });
});

ipcMain.on("client_destroy", (_, client_id: string) => {
    Sockets.forEach((socket: WSocket) => {
        if (socket.client_information.socket_id === client_id) {
            socket.terminate();
            wss.clients.delete(socket);
            Sockets.delete(socket);
        }
    });
});

app.whenReady().then(createWindow);
