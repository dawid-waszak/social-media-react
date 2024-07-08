const FetchPost = async (url, body) => {
    return await fetch(url, {
        method: "POST",
        body,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        credentials: 'include'  // Include credentials in the request
    })
    .then((response) => response.json())
    .then((data) => {return data});
}

export default FetchPost