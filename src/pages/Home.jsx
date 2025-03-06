import React, { useContext } from "react";
import { StarWarsContext } from "../store/StarWarsContext";
import Card from "../components/Card";

const Home = () => {
    const { people, vehicles, planets } = useContext(StarWarsContext);

    return (
        <div className="container mt-4">
            <h2 className="text-danger">Characters</h2>
            <div className="overflow-auto pb-2">
                <div className="d-flex flex-row">
                    {people.map(p => <Card key={p.uid} item={p} type="people" />)}
                </div>
            </div>
            <h2 className="text-danger mt-4">Vehicles</h2>
            <div className="overflow-auto pb-2">
                <div className="d-flex flex-row">
                    {vehicles.map(v => <Card key={v.uid} item={v} type="vehicles" />)}
                </div>
            </div>
            <h2 className="text-danger mt-4">Planets</h2>
            <div className="overflow-auto pb-2">
                <div className="d-flex flex-row">
                    {planets.map(pl => <Card key={pl.uid} item={pl} type="planets" />)}
                </div>
            </div>
        </div>
    );
};

export default Home;
