import { appContext } from "../../store";
import { IoIosPartlySunny } from "react-icons/io";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { motion } from "motion/react";

const Settings = () => {
    const { theme, toggleTheme, setDesignStyle } = appContext();

    const themeVariantsButton = {
        light: {
            x: 1,
        },
        dark: {
            x: 43,
        },
    };

    const designStyle = {
        "1": {
            left: 0,
        },
        "2": {
            left: "51%",
        },
    };

    const changeDesignStyle = () => {
        const styles = ["1", "2"];
        const currentStyleIndex = styles.findIndex((s) => s === theme.designStyle);
        setDesignStyle(styles[currentStyleIndex === styles.length - 1 ? currentStyleIndex - 1 : currentStyleIndex + 1] as "1");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            className="bg-white dark:bg-neutral-700 rounded-lg shadow-sm absolute top-[calc(100%+40px)] min-w-[300px] left-[50%] translate-x-[-85%] p-3 z-[99]">
            <div className="font-bpg-square-banner-caps-2013 text-neutral-700 dark:text-neutral-300 text-lg">პარამეტრები</div>
            <div className="p-3 pt-5 flex gap-x-3">
                <div
                    className="w-18 h-8 rounded-full border dark:border-neutral-500/50 border-neutral-200 px-1 relative bg-sky-400 dark:bg-sky-800"
                    onClick={toggleTheme}>
                    <motion.div
                        initial={theme.mode}
                        animate={theme.mode}
                        variants={themeVariantsButton}
                        transition={{ type: "spring" }}
                        className="rounded-full absolute top-[50%] translate-y-[-50%] text-xl">
                        {theme.mode === "light" ? (
                            <motion.div key={theme.mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                                <IoIosPartlySunny className="text-yellow-400" />
                            </motion.div>
                        ) : (
                            <motion.div key={theme.mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                                <BsFillMoonStarsFill className="-scale-100 rotate-45 text-orange-300" />
                            </motion.div>
                        )}
                    </motion.div>
                </div>
                <motion.div
                    animate={theme.designStyle}
                    initial={false}
                    onTapStart={() => changeDesignStyle()}
                    className="bg-neutral-200 text-neutral-200 dark:bg-neutral-400 dark:text-neutral-400 shadow-[inset_-1px_1px_5px_1px] dark:shadow-[inset_-1px_2px_3px_2px] shadow-neutral-400 dark:shadow-neutral-800/75 text-sm flex-[1] h-8 grid grid-cols-2 items-center px-3 rounded-full overflow-hidden font-alk-sanet relative">
                    <motion.div
                        variants={designStyle}
                        transition={{ type: "spring", damping: 13, stiffness: 200 }}
                        className="h-full absolute bg-neutral-700 w-[50%] rounded-full top-0 left-0"
                    />
                    <span className="text-start mt-1 z-20">სტილი 1</span>
                    <span className="text-end mt-1 z-20">სტილი 2</span>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Settings;
