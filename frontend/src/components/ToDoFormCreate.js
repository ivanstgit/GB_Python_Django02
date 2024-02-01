import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useData, DATA_RESOURCES } from '../hooks/DataProvider.js'

const ToDoFormCreate = (props) => {
    const dataProvider = useData()
    const projects = dataProvider.projects

    const [input, setInput] = useState({
        project: projects[0]?.id,
        content: "",
    });
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.project !== 0 && input.content !== "") {
            dataProvider.postOne(DATA_RESOURCES.todos, input)
                .then(res => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        dataProvider.refreshDelayed(DATA_RESOURCES.todos, 500);
                        setSuccess(true)
                    }
                })
        } else {
            setError("Invalid input");
        }
    };

    const handleChange = (e) => {
        // console.log(input)
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                                    <label className="form-label border-0" htmlFor="project">Project:</label>
                                    <select className="form-select border-0"
                                        id="project"
                                        name="project"
                                        onChange={handleChange}
                                    >
                                        {projects.map((item) =>
                                            <option key={"Project_" + item.id} value={item.id}>{item.name}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label border-0" htmlFor="content">Content:</label>
                                    <textarea className="form-control border-0" rows="5"
                                        id="content"
                                        name="content"
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="form_control col-6">
                                    <button className="btn btn-primary w-50 py-3">Submit</button>
                                    <label> {error} </label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ToDoFormCreate;
