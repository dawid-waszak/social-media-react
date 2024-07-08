const FetchData = async (url) => {
    try{
    return await fetch(url, {method: 'GET',
        credentials: 'include'})
                    .then(response => {
                        if(response.ok){
                            return response.json();
                        }
                        else if(response.status === 404){
                            console.log("Not found");
                        }
                    })
    }catch{
        console.log("Error");
    }
}

export default FetchData