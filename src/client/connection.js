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


connect$.subscribe(() => console.log('connected'));
disconnect$.subscribe(() => console.log('disconnected'));