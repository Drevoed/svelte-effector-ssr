import {clearNode, createNode, scopeBind, step} from 'effector';
import type { Effect, Event, Scope, Store, Node } from 'effector';
import type {Readable, Writable} from 'svelte/store';
import {readable, writable} from 'svelte/store';
import { getContext, setContext } from 'svelte';

const SCOPE = typeof Symbol !== 'undefined' ? Symbol('scope') : '@@scope';

export const provideScope = (scope: Scope) => {
    const existing = getContext<Writable<Scope> | undefined>(SCOPE)
    if (!existing) {
        setContext(SCOPE, writable(scope));
    } else {
        existing.update((_) => scope)
    }
};

export const getScope = () => getContext<Writable<Scope>>(SCOPE);

function createWatch<T>(
    store: Store<T>,
    fn: (value: T) => any,
    scope?: Scope
) {
    const seq = [step.run({ fn: (value) => fn(value) })];
    if (scope) {
        const node = createNode({ node: seq });
        const id = (store as any).graphite.id;
        const scopeLinks: { [_: string]: Node[] } = (scope as any).additionalLinks;
        const links = scopeLinks[id] || [];
        scopeLinks[id] = links;
        links.push(node);
        return () => {
            const idx = links.indexOf(node);
            if (idx !== -1) links.splice(idx, 1);
            clearNode(node);
        };
    } else {
        const node = createNode({
            node: seq,
            parent: [store],
            family: { owners: store },
        });
        return () => {
            clearNode(node);
        };
    }
}

export const bindStore = <T>(store: Store<T>): Readable<T> => {
    const scope = getScope();
    let res;

    scope.subscribe((scope) => {
        const state = scope.getState(store);
        res = readable(state, (set) => createWatch(store, set, scope));
    })

    return res;
};

type UseEventReturn<E> = E extends Effect<infer P, infer Done>
    ? (params: P) => Promise<Done>
    : E extends Event<infer EP>
        ? (params: EP) => EP
        : never;

export function bindEvent<E>(
    event: E extends Effect<infer P, infer Done> | Event<infer EP> ? E : never,
): UseEventReturn<E> {
    let bound;
    getScope()
        .subscribe((scope) => {
            bound = scopeBind(event as any, { scope })
        });
    return bound as UseEventReturn<E>;
}
