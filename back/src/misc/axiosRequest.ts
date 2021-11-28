import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import request from 'axios';

async function axiosRequestHandler(
    config: AxiosRequestConfig<any>,
): Promise<{ success: boolean; data?: {}; err?: {} }> {
    // Launch the request
    return axios(config)
        .then((response: AxiosResponse) => {
            // Success
            return { success: true, data: response.data };
        })
        .catch((error) => {
            // Error
            if (request.isAxiosError(error) && error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (request.isAxiosError(error) && error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of AxiosRequest in the backend
                 */
                console.log(error.request);
            } else {
                // Something happened in setting up the request and triggered an Error
                console.log('Error', error.message);
            }
            return { success: false, err: error };
        });
}

export default axiosRequestHandler;
