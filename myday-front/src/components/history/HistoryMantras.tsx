import { IHistory } from "@common/Model";

interface IProps {
    history: IHistory[]
}

const HistoryMantrasComponent = (props: IProps) => {

    const components = props.history.map(history => <div className=" w-full p-4 bg-base-200 rounded-box shadow-md relative mb-2" >
        <p className="text-base-content"> {history.phraseGratitude} </p>
        <span className="text-xs text-base-content/50 absolute bottom-2 right-3">
            {history.date}
        </span>
    </div >)

    return <div className="flex flex-col ">
        {components}
    </div>

};

export default HistoryMantrasComponent;
