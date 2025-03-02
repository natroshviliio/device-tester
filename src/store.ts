import { create } from "zustand";

type AppContext = {
    defaultTitle: string;
    documentTitle: string;
    setDocumentTitle: (title: string) => void;
};

export const appContext = create<AppContext>((set) => ({
    defaultTitle: "Device Tester",
    documentTitle: "Device Tester",
    setDocumentTitle: (title: string) => set({ documentTitle: title }),
}));
