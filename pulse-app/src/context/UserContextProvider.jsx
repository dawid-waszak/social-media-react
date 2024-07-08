import React, { createContext, useState } from 'react'

export const UserContext = createContext({
    name: "",
    mail: "",
    handleName: () => {},
    handleMail: () => {},
    updateStorage: () => {},
    loadStorage: () => {}
});

const UserContextProvider = ({children}) => {

    const [name, setName] = useState("");
    const [mail, setMail] = useState("");

    const handleName = (n) => {
        setName(n);
    }

    const handleMail = (m) => {
        setMail(m);
    }

    const updateStorage = (data) => {
        const userData = {
            name: name,
            mail: mail
        }
        window.sessionStorage.setItem("user", JSON.stringify(userData));
    }

    const loadStorage = () => {
        var data = JSON.parse(window.sessionStorage.getItem("user"));
        handleName(data.name);
        handleMail(data.mail);
    }

    const userCtx = {
        name: name,
        mail: mail,
        handleName: handleName,
        handleMail: handleMail,
        updateStorage: updateStorage,
        loadStorage: loadStorage
    }

  return (
    <UserContext.Provider value={userCtx}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider