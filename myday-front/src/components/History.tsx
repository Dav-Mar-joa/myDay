import { IHistory } from "@common/Model";
import { useEffect, useState } from "react";
import HistoryMantrasComponent from "./history/HistoryMantras";
import HistoryChartComponent from "./history/HistoryChart";

const fetchHistory = async (): Promise<IHistory[]> => {
    const API_URL = `${window.location.protocol + '//' + window.location.host}`
    const response = await fetch(`${API_URL}/api/user/history`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    });

    if (response.ok) {
        return await response.json() as IHistory[];
    } else {
        throw new Error(`Erreur HTTP : ${response.status}`)
    }
};

const HistoryComponent = () => {

    const [history, setHistory] = useState<IHistory[]>([]);
    const [_, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchHistory();
                setHistory(data);
            } catch (err) {
                setError((err as Error).message);
            }
        };
        loadHistory();
    }, []);

    return (
        <div className="flex flex-col w-full">

            <h1 className="text-2xl font-semibold mb-6">
                Votre historique <span> 30 derniers jours </span>
            </h1>

            <div className="tabs tabs-border pt-4">
                <input type="radio" name="my_tabs_2" className="tab" aria-label="Mantras" defaultChecked />
                <div className="tab-content border-base-300 bg-base-100 p-10"><HistoryMantrasComponent history={history} /></div>

                <input type="radio" name="my_tabs_2" className="tab" aria-label="Emotions" />
                <div className="tab-content border-base-300 bg-base-100 p-10"><HistoryChartComponent history={history} /></div>
            </div>

        </div>);

};

export default HistoryComponent;

