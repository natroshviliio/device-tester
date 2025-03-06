import Commands from "./Commands";

const AdditionalParameters = () => {
    return (
        <div className="flex flex-col flex-[8] bg-white dark:bg-neutral-800 p-3">
            <div className="flex gap-x-3 p-2">
                <Commands />
            </div>
        </div>
    );
};

export default AdditionalParameters;
