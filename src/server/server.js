const express = require('express');
//const http = require('http');
const io = require('socket.io');
const { of, fromEvent } = require('rxjs');
const { switchMap, mergeMap, map, takeUntil, skip, distinctUntilChanged } = require('rxjs/operators');
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// our localhost port
const port = process.env.PORT || 5000;

const app = express();


// Replace with your mongoLab URI
const MONGO_URI = 'mongodb://mmaj:password1@ds145752.mlab.com:45752/taskdb';
if (!MONGO_URI) {
    throw new Error('You must provide a MongoLab URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connection successful")
});

let taskSchema = new Schema({
    timestamp: String,
    name: String
});



let Task = mongoose.model('Task', taskSchema);
// our server instance
const http = require('http').Server(app);



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


const listen = (event) => {
    return connection$.pipe(
        mergeMap(({io, client}) => {
            return fromEvent(client, event).pipe(
                takeUntil(fromEvent(client, 'disconnect')),
                map(data => ({io, client, data}))
            );
        })
    );
};


listen('new').pipe(
    distinctUntilChanged(),
    skip(1)
)
    .subscribe(({io, client, data}) => {
        console.log("new task!");
        console.log(`timestamp: ${data.timestamp}`);
        console.log(`name: ${data.name}`);
        if (data.name.length > 0) {
            let date = new Date(data.timestamp);
            let newTask = new Task({timestamp: date, name:data.name});
            newTask.save(function (err, newTask) {
                if (err) return console.error(err);
            });

            client.broadcast.emit('newTask', newTask)
        }
    });


listen('remove').pipe(
    distinctUntilChanged(),
    skip(1)
)
    .subscribe(({io, client, data}) => {

        if (data.name.length > 0) {
            console.log('removing....');
            console.log(`timestamp: ${data.timestamp}`);
            console.log(`name: ${data.name}`);
            Task.deleteOne({ name: data.name }, function (err) {
                if (err) return console.log(err);
            });



        }
    });



connection$
    .subscribe(({io, client}) => {
        console.log("Connected");
    });
disconnect$.subscribe(() => console.log('Disconnected'));


http.listen(port, () => console.log(`Listening on port ${port}`));