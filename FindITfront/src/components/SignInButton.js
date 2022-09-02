import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import Button from "react-bootstrap/Button";

function handleLogin(instance) {
    instance.loginPopup(loginRequest).catch(e => {
        console.error(e);
    });
}

const clickButton = (instance, user, setLoginrole) => {
	handleLogin(instance)
	localStorage.setItem("loginrole", user)
	setLoginrole(user)
}

/**
 * Renders a button which, when selected, will open a popup for login
 */
export const SignInButton = ({user, setLoginrole, text}) => {
    const { instance } = useMsal();

    return (
        <Button variant="secondary" className="ml-auto" onClick={() => clickButton(instance, user, setLoginrole)}>{text}</Button>
    );
}