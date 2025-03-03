import { create } from "zustand";

type Mode = "dark" | "light";
type DesignStyle = "1" | "2";
type Theme = {
    mode: Mode;
    designStyle: DesignStyle;
};

type AppContext = {
    theme: Theme;
    defaultTitle: string;
    documentTitle: string;
    toggleTheme: () => void;
    setDocumentTitle: (title: string) => void;
    setDesignStyle: (styleType: DesignStyle) => void;
};

export const appContext = create<AppContext>((set, get) => ({
    theme: {
        mode: "light",
        designStyle: "1",
    },
    defaultTitle: "Device Tester",
    documentTitle: "Device Tester",
    designStile: 1,
    toggleTheme: () => {
        const { theme } = get();
        set({
            theme: {
                ...theme,
                mode: theme.mode === "light" ? "dark" : "light",
            },
        });
    },
    setDocumentTitle: (title: string) => set({ documentTitle: title }),
    setDesignStyle: (styleType: DesignStyle) => {
        const { theme } = get();
        set({
            theme: {
                ...theme,
                designStyle: styleType,
            },
        });
    },
}));
