

const express = require('express');
//const http = require('http');
const io = require('socket.io');
const { of, fromEvent } = require('rxjs');
const { switchMap, mergeMap, map, takeUntil, skip, distinctUntilChanged } = require('rxjs/operators');
const path = require('path');
//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const { Pool, Client } = require('pg');

// our localhost port
const port = process.env.PORT || 5000;
//const localhost = process.env.IP;
const app = express();



// // Replace with your mongoLab URI
// const MONGO_URI = 'mongodb://mmaj:password1@ds145752.mlab.com:45752/taskdb';
// if (!MONGO_URI) {
//     throw new Error('You must provide a MongoLab URI');
// }
//
// mongoose.Promise = global.Promise;
// mongoose.connect(MONGO_URI);
//
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("Database connection successful")
// });

// let taskSchema = new Schema({
//     timestamp: String,
//     name: String
// });
//
// let tempSchema = new Schema({
//
//     temp: Number
//
// });


// let Task = mongoose.model('Task', taskSchema);
//
// let Temp = mongoose.model('Temp', tempSchema);
// our server instance

// const pool = new Pool({
//     user: 'postgres',
//     host: '10.11.12.110',
//     database: 'testdb',
//     password: 'odroid',
//     port: 5432,
// });
//
// pool.query('SELECT vin FROM sensor_data ORDER BY time DESC LIMIT 1', (err, res) => {
//     const vin = res.rows[0];
//  //   console.log(vin);
//     pool.end()
// });


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
		if (data.name.length > 0) {
                	console.log("new task!");
                	console.log(`timestamp: ${data.timestamp}`);
                	console.log(`name: ${data.name}`);
                	let date = new Date(data.timestamp);
                	let newTask = new Task({timestamp: date, name:data.name});
                	newTask.save(function (err, newTask) {
                		if (err) return console.error(err);
                	});
              		client.broadcast.emit('newTask', newTask)
        	}
	});
		
       

// PYTHON GPIO 
//       	const { spawn } = require('child_process');
//      	const pyprog = spawn('python', ['/home/odroid/git/todoApp/src/server/blink.py']);
//
//       	pyprog.stdout.on('data', function(data) {
//               	console.log("Python script executed\n")
//		
//      	});
//
//       	pyprog.stderr.on('data', (data) => {
//               	console.log("Python error: " + data.toString())
//		
//      	});

// C DHT
//	const execFile = require('child_process').execFile;
//
//	var child = execFile("/home/odroid/git/todoApp/src/server/dht", function(error, stdout, stderr){
//		if (stderr.toString()){
//			console.log(stderr.toString())
//		}
//		else{		
//			console.log("No errors!")
//	}
//	});
//
	





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
        //let temp;
        console.log("Connected");

        //clock
        setInterval(function () {
            let time = new Date();
            // console.log(
            //     time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            // );
          //  io.emit('time', new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"));
            io.emit('time', time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
        }, 60000);

        //Voltage
        setInterval(function () {
            const pool = new Pool({
                user: 'acumentrics',
                host: '10.11.12.110',
                database: 'acupdu',
                password: 'acumentrics',
                port: 5432,
            });

            pool.query('SELECT vin FROM sensor_data ORDER BY time DESC LIMIT 1', (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {

                    let vin = res.rows[0].vin;
                    io.emit('vin',vin);
                    pool.end();
                //    console.log(vin);
                }
            })

        },1000);


    });
	
	//Read Temperature every 2 seconds and emit to client
// 	setInterval(function(){
// 		const execFile = require('child_process').execFile;
//
//                 let child = execFile("/home/odroid/git/todoApp/src/server/dht22", function(error, stdout, stderr){
//
//                 if(stdout != 0 ){
// 			let newTemp = new Temp({temp : stdout})
// 			newTemp.save(function(err, newTask){
// 				if (err) return console.error(err);
// 			});
// 			temp = stdout;
// //	               	console.log(stdout)
//
//                 	io.emit('temp', stdout + "°C")
//
// 			}
// 		else{
// //			console.log(temp)
// 			let newTemp = new Temp({ temp:  temp })
// 			newTemp.save(function (err, newTask) {
//               			if (err) return console.error(err);
//
// 		});
//
// 			io.emit('temp', temp + "°C")
// 		}
//
// 	})
//
// 	}, 2050);
//
// });

disconnect$.subscribe(() => console.log('Disconnected'));







app.use(express.static(path.join(__dirname, '../../public')));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

http.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));
