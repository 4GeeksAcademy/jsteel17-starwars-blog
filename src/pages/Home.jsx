import React, { useContext } from "react";
import { StarWarsContext } from "../store/StarWarsContext";
import Card from "../components/Card";

const Home = () => {
    const { people, vehicles, planets } = useContext(StarWarsContext);

    // Helper function to render a category of cards
    const renderCardSection = (items, type, title) => (
        <>
            <h2 className="text-danger mt-4">{title}</h2>
            <div className="overflow-auto pb-3">
                <div className="d-flex flex-row flex-nowrap">
                    {items && items.length > 0 ? (
                        items.map(item => <Card key={item.uid} item={item} type={type} />)
                    ) : (
                        <p>Loading {title.toLowerCase()}...</p>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <div className="container mt-4">
            {renderCardSection(people, "people", "Characters")}
            {renderCardSection(vehicles, "vehicles", "Vehicles")}
            {renderCardSection(planets, "planets", "Planets")}
        </div>
    );
};

export default Home;