/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

class Api {
    constructor () {
        this._getResponse = async (res) => {
            let result = await res.json();

            if (result.statusCode !== 200) {
                let { body } = result;

                throw new Error(body);
            }

            return result;
        };


        this.get = async (endPoint, params = '') => {
            try {
                let apiUrl = `${endPoint}`;
                console.log(`\n : (Api.get) request to ${apiUrl} \n`);

                let res = await fetch(apiUrl, {
                    method: 'GET',
                    // send JWT token to backend server
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                return await this._getResponse(res);
            } catch (e) {
                console.log(`\n : (Api.get) Failed to request api \n`);
                throw e;
            }
        };

        this.post = async (endPoint, data) => {
            try {
                let apiUrl = endPoint;
                console.log(`\n : (Api.post) request to ${apiUrl} \n`);

                let res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(data),
                });

                return await this._getResponse(res);
            } catch (e) {
                console.log(`\n : (Api.post) Failed to request api \n`, e);
                throw e;
            }
        };

        this.put = async (endPoint, data) => {
            try {
                let apiUrl = endPoint;
                console.log(`\n : (Api.put) request to ${apiUrl} \n`);

                let res = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(data),
                });

                return await this._getResponse(res);
            } catch (e) {
                console.log(`\n : (Api.put) Failed to request api \n`);
                throw e;
            }
        };

        this.del = async (endPoint, params = '', data) => {
            try {
                let apiUrl = params === null ? `${endPoint}` : `${endPoint}/${params}`;
                console.log(`\n : (Api.del) request to ${apiUrl} \n`);

                let res = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(data),
                });

                return await this._getResponse(res);
            } catch (e) {
                console.log(`\n : (Api.del) Failed to request api \n`);
                throw e;
            }
        };
    };
};

export { Api };
