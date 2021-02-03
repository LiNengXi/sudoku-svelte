import { writable } from 'svelte/store';

function fixZero(num) {
    return num < 10 ? `0${ num }` : num;
}

function createUsedTime() {
    const { subscribe, update } = writable();

    let timerID;

    return {
        subscribe,
        start: () => {
            usedTime.stop();

            let startTime = Date.now();

            (function counterDown() {
                let now = Date.now(),
                    timeDiff = now - startTime,
                    h = parseInt(timeDiff / 1000 / 60 / 60 % 24),
                    m = parseInt(timeDiff / 1000 / 60 % 60),
                    s = parseInt(timeDiff / 1000 % 60);
                
                update(() => `${ !h ? '' : fixZero(h) + ' : ' }${ fixZero(m) } : ${ fixZero(s) }`);
    
                timerID = setTimeout(() => {
                    counterDown();
                }, 1000);
            })();
        },
        stop: () => {
            clearTimeout(timerID);
        }
    };
}

export const usedTime = createUsedTime();