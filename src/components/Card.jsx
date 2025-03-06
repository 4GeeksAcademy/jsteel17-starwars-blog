import React, { useContext, useEffect, useState } from "react";
import { StarWarsContext } from "../store/StarWarsContext";
import { Link } from "react-router-dom";

const Card = ({ item, type }) => {
    const { toggleFavorite, favorites } = useContext(StarWarsContext);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`https://www.swapi.tech/api/${type}/${item.uid}`);
                const data = await response.json();
                setDetails(data.result.properties);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };
        fetchDetails();
    }, [item, type]);

    return (
        <div className="col-md-4 mb-4">
            <div className="card">
                <img src="https://via.placeholder.com/400x200" className="card-img-top" alt={item.name} />
                <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    {details ? (
                        <>
                            {type === "people" && (
                                <>
                                    <p>Gender: {details.gender}</p>
                                    <p>Hair Color: {details.hair_color}</p>
                                    <p>Eye Color: {details.eye_color}</p>
                                </>
                            )}
                            {type === "vehicles" && <p>Model: {details.model}</p>}
                            {type === "planets" && <p>Climate: {details.climate}</p>}
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <Link to={`/${type}/${item.uid}`} className="btn btn-primary">Learn more!</Link>
                    <button className="btn btn-outline-warning ms-2" onClick={() => toggleFavorite(item)}>
                        {favorites.some((fav) => fav.uid === item.uid) ? "★" : "☆"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;