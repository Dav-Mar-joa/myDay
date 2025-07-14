import { ContextType } from "@/models/Model";
import { IHistory } from "@common/Model";
import { useOutletContext } from "react-router-dom";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface IProps {
    history: IHistory[]
}

const HistoryChartComponent = (props: IProps) => {

    const { user } = useOutletContext<ContextType>();

    return <div className="w-full h-100">

        <ResponsiveContainer>
            <LineChart data={props.history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`${value} / 5`, name]} />
                <Legend />
                <Line type="monotone" dataKey="feeling1" stroke="#3b82f6" strokeWidth={2} name={user.feelings[0]} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="feeling2" stroke="#8b5cf6" strokeWidth={2} name={user.feelings[1]} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="feeling3" stroke="#f97316" strokeWidth={2} name={user.feelings[2]} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="feeling4" stroke="#10b981" strokeWidth={2} name={user.feelings[3]} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
};

export default HistoryChartComponent;
