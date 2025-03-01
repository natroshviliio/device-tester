import { motion } from "motion/react";
import { useState } from "react";

import { CgDropOpacity } from "react-icons/cg";

const ChatCommandLineHelp = () => {
    const [opacity, setOpacity] = useState<number>(1);

    const toggleOpacity = () => setOpacity((opacity) => (opacity === 1 ? 0.5 : 1));

    return (
        <motion.div
            initial={{ opacity: 0, y: "200%" }}
            animate={{ opacity: opacity, y: 0 }}
            whileHover={{ opacity: 1, transition: { delay: 1 } }}
            exit={{ opacity: 0, y: "-200%", transition: { duration: 0.3 } }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0 }}
            drag={true}
            dragMomentum={false}
            className={`w-[800px] p-4 z-[99] shadow-sm rounded-lg absolute cursor-move bg-slate-100 right-[50%] bottom-[calc(100%+20px)] translate-x-[50%] text-start font-bpg-arial`}>
            <div className="text-[1.3rem] flex items-center font-alk-sanet font-bold">
                <span>სწრაფი მოქმედებების ინსტრუქცია</span>
                <motion.span
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className={`ml-auto cursor-pointer ${opacity === 0.5 ? "text-amber-500" : "text-sky-500"}`}
                    onClick={toggleOpacity}>
                    <CgDropOpacity />
                </motion.span>
            </div>
            <div className="mt-4 flex flex-col gap-y-4">
                <span className="flex items-center">
                    მზა ბრძანების ჩასაკოპირებლად ტექსტურ ველში გამოიყენეთ სიმბოლო{" "}
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.8rem] rounded-sm mx-2">@</span>
                </span>
                <span className="flex items-center">
                    მზა ბრძანებების შემოთავაზების გასაუქმებლად{" "}
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">ESC</span>
                </span>
                <span className="items-center">
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.8rem] rounded-sm mr-2">@</span>
                    ჩანაწერის არსებობის შემთხვევაში შემოთავაზებული ბრძანებების გაუქმებიდან მათი ხელახლა გამოტანა შესაძლებელია{" "}
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">TAB</span> ღილაკით
                </span>
                <span className="flex items-center">
                    ბრძანების გასაგზავნად <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">CTRL</span>+
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">ENTER</span>
                </span>
                <span className="flex items-center">
                    ბოლოს გამოყენებული ბრძანების ჩასასმელად{" "}
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">CTRL</span>+
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">SHIFT</span>+
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">ENTER</span>
                </span>
                <span className="flex items-center">
                    ჩატის გასასუფთავებლად <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">CTRL</span>+
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">SHIFT</span>+
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">C</span>
                </span>
                <span className="items-center">
                    ბრძანების გაგზავნის შემდეგ ტექსტური ველის გაწმენდის (დაშვება/გაუქმების) გადასართველად
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">CTRL</span>+
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">SHIFT</span>+
                    <span className="px-2 py-1 bg-slate-800 text-slate-200 text-[.7rem] rounded-sm mx-2">N</span>
                </span>
            </div>
        </motion.div>
    );
};

export default ChatCommandLineHelp;
