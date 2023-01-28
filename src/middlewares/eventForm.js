/**
 * Created by SooMinKim on 2023-01-28
 */
'use strict'

class EventForm {
    constructor () {
        this.makeEventForm = (req, pathParams, queryParams) => {
            try {
                req['pathParameters'] = pathParams ? pathParams : {};
                req['queryStringParameters'] = queryParams ? queryParams : {};

                return req;
            } catch (e) {
                console.log(`\n : (EventForm.makeEventForm) Failed to make event form \n`, e);
                throw e;
            }
        };
    };
};

module.exports = EventForm;
