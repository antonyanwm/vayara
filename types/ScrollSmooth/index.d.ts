type ScrollDirection = 'vertical' | 'horizontal';
interface SmoothOption {
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
    smooth?: number;
    direction?: ScrollDirection;
    smoothWheel?: boolean;
    maxScrollSpeed?: number;
    normalizeSmooth?: boolean;
    subPixelControl?: number;
}
interface ScrollEvent {
    scroll: number;
    velocity: number;
    direction: number;
}
type EventCallback = (e: ScrollEvent) => void;
declare class SmoothScroll {
    private readonly wrapper;
    private readonly content;
    private readonly smooth;
    private readonly direction;
    private readonly smoothWheel;
    private readonly maxScrollSpeed;
    private readonly normalizeSmooth;
    private documentHeight;
    private scrollDirection?;
    private targetScroll;
    private currentScroll;
    private lastScroll;
    private velocity;
    private isScrolling;
    private isStopped;
    private animationFrameId;
    private lastTime;
    private subPixelControl;
    private scrollInstance;
    private readonly scrollCallbacks;
    constructor(options?: SmoothOption);
    private init;
    private getScroll;
    private setScroll;
    private getMaxScroll;
    private isWindow;
    private animate;
    private handleWheel;
    private lerp;
    private addEventListeners;
    private removeEventListeners;
    private handleResize;
    private handleNativeScroll;
    private emitScrollEvent;
    private startAnimation;
    private stopAnimation;
    on(event: 'scroll', callback: EventCallback): void;
    off(event: 'scroll', callback: EventCallback): void;
    start(): void;
    stop(): void;
    destroy(): void;
}
export default function createSmoothScroll(options?: SmoothOption): SmoothScroll | {
    on: () => void;
    off: () => void;
    scrollTo: () => void;
    decelerateTo: () => void;
    start: () => void;
    stop: () => void;
    destroy: () => void;
};
export {};
