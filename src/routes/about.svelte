<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import { allSettled, fork, serialize } from 'effector';
    import { order, orderSet } from '$features/order';

    export const load: Load = async () => {
        const scope = fork();
        await allSettled(orderSet, { scope, params: 'order from ssr' });
        return {
            props: {
                pageProps: serialize(scope),
            },
        };
    };
</script>

<script lang="ts">
    import {bindStore, provideScope} from '$features/effector/scope';
    export let pageProps = {};

    provideScope(fork({
        values: pageProps
    }));

    const ord = bindStore(order);
</script>

<span>{$ord}</span>
