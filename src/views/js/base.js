/**
 * Created by SooMinKim on 2023-01-21
 */
'use strict'

class Base {
    constructor () {
        this.getErrorMsg = (message) => {
            message = JSON.parse(message);

            return `에러 코드: ${message.errorCode}\n에러메세지: ${message.message}`;
        };
    };
};

export { Base };
