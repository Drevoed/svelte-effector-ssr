<script lang="ts">
	import { goto } from '$app/navigation';
	import {bindEvent, bindStore} from "$features/effector";
	import { order, sleepFx, orderSet } from '$features/order';

	const ord = bindStore(order);
	const sleep = bindEvent(sleepFx);
	const setOrder = bindEvent(orderSet);
</script>

<main class="main">
	<section class="title-section">
		<h1
			class="title"
			on:click={async () => {
					setOrder('Your order!');
					await sleep(5000);
					await goto('/about');
				}
			}
		>
			Click me
			{$ord}
		</h1>
	</section>
</main>

<style>
	.main {
		@apply h-screen flex items-center px-6 lg:px-32 bg-purple-900 text-white;
		cursor: pointer;
	}

	.title-section {
		@apply w-full md:w-9/12 xl:w-8/12;
	}

	.title {
		@apply text-3xl lg:text-5xl font-bold text-pink-500;
	}
</style>
