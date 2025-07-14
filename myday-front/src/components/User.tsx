import React, { useState } from "react";
import UserLabel from "./atoms/UserLabel";
import { IRequestFeeling } from "@common/Model";
import { ContextType } from "../models/Model";
import { toast } from 'react-toastify';
import { useOutletContext } from "react-router-dom";


const UserComponent: React.FC = () => {

    //const [feelings, setFeeling] = useState<IFeelings>();

    const { user } = useOutletContext<ContextType>();

    const [comment, setComment] = useState("");

    const [menses, setMenses] = useState<boolean>(false);
    const rating = [0, 0, 0, 0];


    // TODO: Need to update this query
    // const clear = () => {

    //     // Clear input for the rating and update UI
    //     rating[0] = 0;
    //     rating[1] = 0;
    //     rating[2] = 0;
    //     rating[3] = 0;

    //     setComment("");
    //     setMenses(false);
    // }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        rating[index] = Number(e.target.value);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const emotion: IRequestFeeling = {
            feeling1: rating[0],
            feeling2: rating[1],
            feeling3: rating[2],
            feeling4: rating[3],
            phraseGratitude: comment,
            regle: menses
        }

        try {
            const API_URL = `${window.location.protocol + '//' + window.location.host}`
            const response = await fetch(`${API_URL}/api/user/feelings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emotion),
                credentials: 'include'
            });

            if (response.ok) {
                toast.success('Les émotions ont été sauvegardées.')
            }
            else {
                // Toast Failedd 
            }
        } catch (reason) {
            console.error(reason)
        }
    }

    // Emotions
    const emotions = (user ? user.feelings : [] as string[]);
    const emotonsComponents = emotions.map((emotion, index) => {
        return <>
            <div key={emotion} className="flex items-center">
                <span className="w-26 text-xl text-left font-medium mr-6">{emotion}</span>
                <div className="flex-1 join rating rating-xxl">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <input
                            key={`rating-${emotion}-${value}`}
                            type="radio"
                            name={`rating-${emotion}$`}
                            className="mask mask-star-2 bg-orange-400"
                            value={value}
                            onChange={(event) => handleChange(event, index)}
                        />
                    ))}
                </div>
            </div >
        </>
    })
    return (<>
        <div className="flex flex-col w-full">
            <form onSubmit={handleSubmit}>
                <UserLabel />
                <section key='feeling' id='feeling'>
                    <h1 className="text-2xl font-semibold mb-6">
                        Comment te sens-tu aujourd’hui ?
                    </h1>
                    {emotonsComponents}
                </section>


                <section key='gracefull' id="gracefull" className="pt-4">
                    <div className="mt-8">
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Décris ton humeur du jour..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </section>

                <section className="pt-4" id='menses' key='menses'>
                    <label className="label">
                        Regle
                        <input type="checkbox" checked={menses} className="toggle toggle-primary" onChange={(event) => setMenses(event.target.checked)} />
                    </label>
                </section>

                <button type="submit" className="btn btn-primary w-full text-white tracking-wide font-semibold mt-6">
                    Valider
                </button>
            </form>

        </div >
    </>);
}

export default UserComponent;
