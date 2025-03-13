export const getPayload = () =>{
    const token = localStorage.getItem("token") || "";
    return JSON.parse(atob(token.split('.')[1]));
}

export const getRole = () => {
    return getPayload().role;
}

export const getUsername = () => {
    return getPayload().username;
}

export const getId = () => {
    return getPayload().id;
}