import { of, fromEvent} from 'rxjs';
import { switchMap, map, mergeMap, takeUntil } from 'rxjs/operators';
import io from 'socket.io-client';

const socket$ = of(io());

const connect$ = socket$.pipe(
    switchMap(socket => {
        return fromEvent(socket,'connect').pipe(
            map(() => socket)
        );
    })
);

const disconnect$ = socket$.pipe(
    switchMap(socket => {
        return fromEvent(socket, 'disconnect');
    })
);

export const listen = (event) => {
    console.log(event);
    return connect$.pipe(
        mergeMap(socket => fromEvent(socket,event)),
        takeUntil(disconnect$)
    );
};

export const send = (observable, event) => {
    console.log('send');
    connect$.pipe(
        mergeMap(socket => observable.pipe(
            map(data => ({socket, data}))
        )),
        takeUntil(disconnect$)
    ).subscribe(({socket, data}) => socket.emit(event,data));
};

connect$.subscribe(() => console.log('connected'));
disconnect$.subscribe(() => console.log('disconnected'));