const express = require('express');
//const http = require('http');
const io = require('socket.io');
const { of, fromEvent} = require('rxjs');
const {switchMap, mergeMap, map, skip, takeUntil, distinctUntilChanged} = require('rxjs/operators');

// our localhost port
const port = process.env.PORT || 5000;
const app = express();

// our server instance
const http = require('http').Server(app);
http.listen(port, () => console.log(`Listening on port ${port}`));


const io$ = of(io(http));

const connection$ = io$.pipe(
    switchMap(io => {
        return fromEvent(io, 'connection').pipe(
            map(client => ({io, client}))
        );
    })
);

const disconnect$ = connection$.pipe(
    mergeMap(({client}) => {
        return fromEvent(client, 'disconnect').pipe(
            map(() => client)
        );
    })
);



connection$.subscribe(() => console.log('connected'));
disconnect$.subscribe(() => console.log('disconnected'));


