import axios from "axios";

export const useFetch = () => {

    const getData = async (uri: string) => {
        return await axios.get(uri);
    };

    return {
        getData,
    };
};