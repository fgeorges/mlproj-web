"use strict";

const request = require('request');
const props   = require('./all-properties');

request({
    url: 'http://localhost:8002/manage/v2/databases/Documents/properties?format=json',
    method: 'GET',
    auth: {
        user: 'admin',
        password: 'admin',
        sendImmediately: false
    }
}, (err, resp, body) => {
    if ( err || resp.statusCode !== 200 ) {
        console.dir(err);
        throw new Error('HTTP error');
    }
    if ( ! body ) {
        throw new Error('No content in the HTTP response');
    }
    const olddb = props.dbProps;
    const newdb = Object.keys(JSON.parse(body)).sort();
    console.log('New database properties:');
    console.log(newdb.filter(p => ! olddb.includes(p)));
    console.log('Removed database properties:');
    console.log(newdb.filter(p => ! olddb.includes(p)));
    request({
        url: 'http://localhost:8002/manage/v2/servers/Admin/properties?format=json&group-id=Default',
        method: 'GET',
        auth: {
            user: 'admin',
            password: 'admin',
            sendImmediately: false
        }
    }, (err, resp, body) => {
        if ( err || resp.statusCode !== 200 ) {
            console.dir(err);
            throw new Error('HTTP error');
        }
        if ( ! body ) {
            throw new Error('No content in the HTTP response');
        }
        const oldsrv = props.srvProps;
        const newsrv = Object.keys(JSON.parse(body)).sort();
        console.log('New server properties:');
        console.log(newsrv.filter(p => ! oldsrv.includes(p)));
        console.log('Removed server properties:');
        console.log(newsrv.filter(p => ! oldsrv.includes(p)));
    });
});
