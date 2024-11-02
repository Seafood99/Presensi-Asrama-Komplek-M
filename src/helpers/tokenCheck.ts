export async function checkToken(url:string, token:string) {
    const response = await fetch(`${url}/login/hit-token`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if(response.status === 401) {
        return false
    }
    return true
}