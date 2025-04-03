import { cubicBezier, Bezier } from './util';

interface ScrollOptions {
	target?: number | HTMLElement;
	duration?: number;
	ease?: Bezier;
	element?: Window | HTMLElement;
}

class ScrollInstance {
	private frameId: number | null = null;
	private element: Window | HTMLElement;
	private options: ScrollOptions;

	constructor(options: ScrollOptions) {
		this.options = options;
		this.element = options.element || window;
	}

	public scrollTo(options?: Partial<ScrollOptions>): void {
		this.kill();

		const mergedOptions = { ...this.options, ...options };
		const { duration = 1000, ease = [0.25, 0.1, 0.25, 1] as Bezier } = mergedOptions;

		const getTargetPosition = (): number => {
			const { target } = mergedOptions;

			if (typeof target === 'number') {
				return target;
			} else if (target instanceof HTMLElement) {
				const elementRect = target.getBoundingClientRect();
				const scrollPosition =
					this.element === window
						? window.pageYOffset || document.documentElement.scrollTop
						: (this.element as HTMLElement).scrollTop;

				return elementRect.top + scrollPosition;
			}

			return 0;
		};

		const getScrollPosition = (): number => {
			return this.element === window
				? window.pageYOffset || document.documentElement.scrollTop
				: (this.element as HTMLElement).scrollTop;
		};

		const setScrollPosition = (position: number): void => {
			if (this.element === window) {
				document.documentElement.scrollTop = position;
				document.body.scrollTop = position;
			} else {
				(this.element as HTMLElement).scrollTop = position;
			}
		};

		const start: number = getScrollPosition();
		const targetPosition: number = getTargetPosition();
		const distance: number = targetPosition - start;
		const startTime: number = performance.now();

		const scroll = (currentTime: number): void => {
			const elapsed: number = currentTime - startTime;
			const progress: number = Math.min(elapsed / duration, 1);
			const easedProgress: number = cubicBezier(progress, ease);
			const newPosition: number = start + distance * easedProgress;

			setScrollPosition(newPosition);

			if (progress < 1) {
				this.frameId = requestAnimationFrame(scroll);
			} else {
				this.frameId = null;
			}
		};

		this.frameId = requestAnimationFrame(scroll);
	}

	public kill(): void {
		if (this.frameId !== null) {
			cancelAnimationFrame(this.frameId);
			this.frameId = null;
		}
	}
}

export default ScrollInstance;
