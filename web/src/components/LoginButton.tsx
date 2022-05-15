import React from "react";
import { useSanctum } from "react-sanctum";

export const LoginButton = () => {
    const { authenticated, user, signIn } = useSanctum();

    const handleLogin = () => {
        const email = "luke@example.com";
        const password = "example";
        const remember = true;

        signIn(email, password, remember)
            .then(() => window.alert("Signed in!"))
            .catch(() => window.alert("Incorrect email or password"));
    };

    if (authenticated === true) {
        return <h1>Welcome, {user.name}</h1>;
    } else {
        return <button onClick={handleLogin}>Sign in</button>;
    }
};
