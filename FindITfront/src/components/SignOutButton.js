import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";

function handleLogout(instance) {
    instance.logoutPopup().catch(e => {
        console.error(e);
    });
}

const clickButton = (instance, setDisplaypage, setLoginrole) => {
	handleLogout(instance)
	setDisplaypage("home")
	localStorage.setItem("loginrole", null)
	localStorage.setItem("shoppingcart", null)
	setLoginrole(null)
}

/**
 * Renders a button which, when selected, will open a popup for logout
 */
export const SignOutButton = ({setDisplaypage, setLoginrole, text}) => {
    const { instance } = useMsal();

    return (
        <Button variant="secondary" className="ml-auto" onClick={() => clickButton(instance, setDisplaypage, setLoginrole)}>{text}</Button>
    );
}
