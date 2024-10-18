const useApi = "http://203.194.113.18:4100";
const useLocal = "http://localhost:4100";

export function useApiUrl(){
    if (import.meta.env.NODE_ENV === "production"){
        return useApi;
    } else {
        return useLocal;
    }
}