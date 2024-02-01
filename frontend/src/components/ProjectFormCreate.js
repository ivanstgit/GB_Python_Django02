import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useData, DATA_RESOURCES } from '../hooks/DataProvider.js'

const isValidUrl = urlString => {
    let url;
    try {
        url = new URL(urlString);
    }
    catch (e) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

const ProjectFormCreate = (props) => {
    const dataProvider = useData()
    const users = dataProvider.users

    const initState = {
        name: "",
        repo_link: "",
        participants: []
    }

    const [input, setInput] = useState(initState);
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.name !== initState.name && input.repo_link !== initState.repo_link && isValidUrl(input.repo_link)) {
            dataProvider.postOne(DATA_RESOURCES.projects, input)
                .then(res => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        dataProvider.refreshDelayed(DATA_RESOURCES.projects, 500);
                        setSuccess(true)
                    }
                })
        } else {
            console.log(input)
            setError("Invalid input");
        }
    };

    const handleChange = (e) => {
        // console.log(input)
        const { name, multiple, value } = e.target;

        if (multiple) {
            const options = Array.from(e.target.options)
            let selected = options
                .filter(o => o.selected)
                .map(o => o.value);
            setInput((prev) => ({
                ...prev,
                [name]: selected,

            }));
        } else {
            setInput((prev) => ({
                ...prev,
                [name]: value,

            }));
        }

    };

    if (success) {
        return (<Navigate to={props.redirectOnSuccess} />)
    }

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row">
                    <div className="wow fadeInUp" data-wow-delay="0.5s">
                        <div className="bg-light rounded h-100 align-items-center p-5">
                            <form onSubmit={(event) => handleSubmit(event)}>
                                <div className="mb-3">
                                    <label className="form-label border-0" htmlFor="name">Project name</label>
                                    <input type="text" className="form-control border-0 required" id="name" name="name"
                                        onChange={(event) => handleChange(event)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label border-0" htmlFor="repoLink">Repository link</label>
                                    <input type="text" className="form-control border-0" id="repoLink" name="repo_link"
                                        onChange={(event) => handleChange(event)} placeholder="http://" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label border-0" htmlFor="participants">Participants</label>
                                    <select className="form-select border-0"
                                        id="participants"
                                        name="participants"
                                        onChange={handleChange}
                                        multiple
                                    >
                                        {users.map((item) =>
                                            <option key={"User_" + item.username} value={item.username}>{item.first_name + " " + item.last_name}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="form_control col-6">
                                    <button className="btn btn-primary w-50 py-3">Submit</button>
                                </div>
                                <div className="form_control col-6 py-3">
                                    <label className="form-label invalid border-0"> {error} </label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ProjectFormCreate;
