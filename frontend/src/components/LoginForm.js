import React from 'react';
import { Navigate } from "react-router-dom";

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { login: "", password: "" }
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        );
    }
    handleSubmit(event) {
        // let error_txt = 
        this.props.auth.logInFunc(this.state.login, this.state.password)
        this.setState(
            {
                password: "",
                error: ""
            }
        )
        event.preventDefault()
    }

    render() {
        if (this.props.auth.isAuthenticated) {
            return (<Navigate to={this.props.redirectOnSuccess} />)
        }
        return (
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row">
                        <div className="wow fadeInUp" data-wow-delay="0.5s">
                            <div className="bg-light rounded h-100 align-items-center p-5">

                                <form onSubmit={(event) => this.handleSubmit(event)}>
                                    <div className="mb-3">
                                        <label className="form-label border-0" htmlFor="login">Login</label>
                                        <input type="text" className="form-control border-0" id="login" name="login"
                                            value={this.state.login} onChange={(event) => this.handleChange(event)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label border-0" htmlFor="password">Password</label>
                                        <input type="password" className="form-control border-0" id="password" name="password"
                                            value={this.state.password} onChange={(event) => this.handleChange(event)} />
                                    </div>
                                    <div className="col-6">
                                        <button className="btn btn-primary w-50 py-3" type="submit">Submit</button>
                                    </div>
                                    <div className="col-12">
                                        <label>{this.state.error}</label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginForm