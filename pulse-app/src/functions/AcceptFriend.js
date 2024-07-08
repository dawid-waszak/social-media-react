
const AcceptFriend = async (url, id, state) => {
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            friendId: id,
            state: state
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        credentials: 'include'  // Include credentials in the request
    })
    .then((response) => response.json())
    .then((data) => {return data});
}

export default AcceptFriend