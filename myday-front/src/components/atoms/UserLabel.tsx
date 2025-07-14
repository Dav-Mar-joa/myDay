import { useOutletContext } from "react-router-dom";
import { ContextType } from "../../models/Model";

const UserLabel = () => {

    const { user, loading } = useOutletContext<ContextType>();

    return (
        <>
            {
                loading ? <div className="skeleton h-7 w-50 pb-6 pt-3"></div> :
                    <h1 className="text-4xl text-primary pb-6 pt-3"> Bonjour <span className="font-bold"> {user.username} </span></h1 >
            }
        </>
    );

};

export default UserLabel;