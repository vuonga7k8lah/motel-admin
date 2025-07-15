import axios from "axios";

const fetcher = (url: string): Promise<any> =>
    axios(url).then((res) => res.data);

const swrConfig = {
    fetcher,
    revalidateOnFocus: false,
    refreshInterval: 0,
    shouldRetryOnError: false,
    revalidateOnReconnect: false,
};

export default swrConfig;
