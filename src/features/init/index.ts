import { provideScope } from '../effector';
import { fork } from 'effector';
import '../order';

export function initApp() {
    const scope = fork();
    provideScope(scope);
}