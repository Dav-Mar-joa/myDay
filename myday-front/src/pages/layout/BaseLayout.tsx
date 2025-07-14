import React from "react";
import Navbar from "../../components/NavBar";

interface IProps {
    children: React.ReactNode | React.ReactNode[];
    logout: () => void;
}

const BaseLayout = (props: IProps) => {
    return (
        <main className="w-screen h-screen flex flex-col items-center">
            <Navbar logout={props.logout} />
            <div className="w-6/10 pt-6">
                {props.children}
            </div>
        </main>
    );
}

export default BaseLayout;