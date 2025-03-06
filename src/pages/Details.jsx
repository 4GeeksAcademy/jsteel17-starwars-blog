import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Details = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://www.swapi.tech/api/${type}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.result) {
                    setData(data.result.properties);

                    if (type === "people" && data.result.properties.vehicles?.length > 0) {
                        fetchRelatedData(data.result.properties.vehicles, setVehicles);
                    }
                } else {
                    setData(null);
                }
            })
            .catch((err) => console.error("Error fetching details:", err))
            .finally(() => setLoading(false));
    }, [type, id]);

    const fetchRelatedData = (urls, setState) => {
        if (urls && urls.length > 0) {
            Promise.all(
                urls.map(url =>
                    fetch(url)
                        .then(res => res.json())
                        .then(data => data.result)
                        .catch(err => console.error("Error fetching related data:", err))
                )
            )
                .then(results => setState(results))
                .catch(err => console.error("Error in fetching related data", err));
        }
    };

    if (loading) return <h2 className="text-center mt-5">Loading...</h2>;
    if (!data) return <h2 className="text-center mt-5">No details found.</h2>;

    return (
        <div className="container mt-5">
            <div className="card p-4">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <img
                            src="https://via.placeholder.com/400x200"
                            className="img-fluid rounded mb-4"
                            alt="Placeholder"
                            style={{ maxWidth: "100%" }}
                        />
                    </div>
                    <div className="col-md-8">
                        <h1 className="text-danger">{data.name || "Details"}</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Nulla convallis egestas rhoncus. Donec facilisis fermentum sem,
                            ac viverra ante luctus vel. Donec vel mauris quam. Maecenas dictum risus at ex bibendum.
                        </p>
                    </div>

                    <div className="col-12">
                        <div className="d-flex justify-content-around mt-4 border-top pt-3">
                            {data.height && <p><strong>Height:</strong> {data.height}</p>}
                            {data.mass && <p><strong>Mass:</strong> {data.mass}</p>}
                            {data.birth_year && <p><strong>Birth Year:</strong> {data.birth_year}</p>}
                            {data.gender && <p><strong>Gender:</strong> {data.gender}</p>}
                            {data.hair_color && <p><strong>Hair Color:</strong> {data.hair_color}</p>}
                            {data.eye_color && <p><strong>Eye Color:</strong> {data.eye_color}</p>}
                        </div>
                    </div>

                    {type === "people" && vehicles.length > 0 && (
                        <div className="col-12 mt-4">
                            <h3>Vehicles:</h3>
                            {vehicles.map((vehicle, index) => (
                                <div key={index} className="border-top pt-3">
                                    <p><strong>Name:</strong> {vehicle.name}</p>
                                    <p><strong>Model:</strong> {vehicle.model}</p>
                                    <p><strong>Manufacturer:</strong> {vehicle.manufacturer}</p>
                                    <p><strong>Cost in credits:</strong> {vehicle.cost_in_credits}</p>
                                    <p><strong>Length:</strong> {vehicle.length}</p>
                                    <p><strong>Max speed:</strong> {vehicle.max_atmosphering_speed}</p>
                                    <p><strong>Crew:</strong> {vehicle.crew}</p>
                                    <p><strong>Passengers:</strong> {vehicle.passengers}</p>
                                    <p><strong>Cargo Capacity:</strong> {vehicle.cargo_capacity}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {type === "planets" && (
                        <div className="col-12 mt-4">
                            <div className="d-flex justify-content-around mt-4 border-top pt-3">
                                <p><strong>Name:</strong> {data.name}</p>
                                <p><strong>Diameter:</strong> {data.diameter}</p>
                                <p><strong>Climate:</strong> {data.climate}</p>
                                <p><strong>Gravity:</strong> {data.gravity}</p>
                                <p><strong>Terrain:</strong> {data.terrain}</p>
                                <p><strong>Surface Water:</strong> {data.surface_water}</p>
                                <p><strong>Population:</strong> {data.population}</p>
                            </div>
                        </div>
                    )}

                    {type === "vehicles" && (
                        <div className="col-12 mt-4">
                            <div className="d-flex justify-content-around mt-4 border-top pt-3">
                                <p><strong>Name:</strong> {data.name}</p>
                                <p><strong>Model:</strong> {data.model}</p>
                                <p><strong>Manufacturer:</strong> {data.manufacturer}</p>
                                <p><strong>Cost in credits:</strong> {data.cost_in_credits}</p>
                                <p><strong>Length:</strong> {data.length}</p>
                                <p><strong>Max speed:</strong> {data.max_atmosphering_speed}</p>
                                <p><strong>Crew:</strong> {data.crew}</p>
                                <p><strong>Passengers:</strong> {data.passengers}</p>
                                <p><strong>Cargo Capacity:</strong> {data.cargo_capacity}</p>
                            </div>
                        </div>
                    )}

                    <div className="col-12 text-center mt-3">
                        <button className="btn btn-primary" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;