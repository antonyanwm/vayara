import { Bezier } from './util';
interface ScrollOptions {
    target?: number | HTMLElement;
    duration?: number;
    ease?: Bezier;
    element?: Window | HTMLElement;
}
declare class ScrollInstance {
    private frameId;
    private element;
    private options;
    constructor(options: ScrollOptions);
    scrollTo(options?: Partial<ScrollOptions>): void;
    kill(): void;
}
export default ScrollInstance;
