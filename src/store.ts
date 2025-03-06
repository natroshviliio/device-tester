import { create } from "zustand";

type AppContext = {
    theme: Theme;
    defaultTitle: string;
    documentTitle: string;
    commands: Command[];
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    setDocumentTitle: (title: string) => void;
    setDesignStyle: (styleType: DesignStyle) => void;
    setCommands: (commands: Command[], save?: boolean) => Promise<Command[]>;
};

export const appContext = create<AppContext>((set, get) => ({
    theme: {
        mode: "light",
        designStyle: "1",
    },
    defaultTitle: "Device Tester",
    documentTitle: "Device Tester",
    designStile: 1,
    commands: [],
    toggleTheme: () => {
        const { theme } = get();
        const _theme: Theme = {
            ...theme,
            mode: theme.mode === "light" ? "dark" : "light",
        };
        set({ theme: _theme });
        window.localStorage.setItem("theme", JSON.stringify(_theme));
    },
    setTheme: (theme: Theme) => set({ theme }),
    setDocumentTitle: (title: string) => set({ documentTitle: title }),
    setDesignStyle: (styleType: DesignStyle) => {
        const { theme } = get();
        const _theme: Theme = {
            ...theme,
            designStyle: styleType,
        };
        set({ theme: _theme });
        window.localStorage.setItem("theme", JSON.stringify(_theme));
    },
    setCommands: async (commands: Command[], save = false) => {
        set({ commands });
        save && localStorage.setItem("commands", JSON.stringify(commands));

        return commands;
    },
}));
