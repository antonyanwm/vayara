import ScrollInstance from '../ScrollTo';

//! Type scroll
type ScrollDirection = 'vertical' | 'horizontal';

//! Interface Option
interface SmoothOption {
	wrapper?: HTMLElement | Window; //! Container
	content?: HTMLElement; //! Content
	smooth?: number; //! Smooth
	direction?: ScrollDirection; //! Direction
	smoothWheel?: boolean; //! Smooth Scroll
	maxScrollSpeed?: number; //! Max speed
	normalizeSmooth?: boolean; //! Normalize
	subPixelControl?: number;
}

//! Interface Event
interface ScrollEvent {
	scroll: number; //! current position
	velocity: number; //! speed
	direction: number; //! direction
}

type EventCallback = (e: ScrollEvent) => void;

class SmoothScroll {
	private readonly wrapper: Window | HTMLElement;
	private readonly content: HTMLElement;
	private readonly smooth: number;
	private readonly direction: ScrollDirection;
	private readonly smoothWheel: boolean;
	private readonly maxScrollSpeed: number;
	private readonly normalizeSmooth: boolean;
	private documentHeight: number;
	private scrollDirection?: number;

	private targetScroll = 0; //! cell position
	private currentScroll = 0; //! current position
	private lastScroll = 0; //! end position
	private velocity = 0; //! speed
	private isScrolling = false; //! is Animating
	private isStopped = false; //! is Stopped
	private animationFrameId: number | null = null; //! Id Animation
	private lastTime = 0; //! last Time
	private subPixelControl: number = 0; //! Subpixel
	private scrollInstance: ScrollInstance;

	private readonly scrollCallbacks: EventCallback[] = []; //! Lessen Event

	constructor(options: SmoothOption = {}) {
		if (typeof window === 'undefined') {
			throw new Error('SmoothScroll работает только в браузере');
		}
		this.documentHeight = document.documentElement.scrollHeight - window.innerHeight;
		this.wrapper = options.wrapper ?? window;
		this.content = options.content ?? document.documentElement;
		this.smooth = Math.min(1, Math.max(0, options.smooth ?? 0.1)); //! 0-1
		this.direction = options.direction ?? 'vertical';
		this.smoothWheel = options.smoothWheel !== false; //! default true
		this.maxScrollSpeed = options.maxScrollSpeed ?? 100;
		this.normalizeSmooth = options.normalizeSmooth !== false;
		this.subPixelControl = options.subPixelControl ?? 5;

		this.scrollInstance = new ScrollInstance({ target: 0, duration: 200 });

		this.init();
	}

	//! Init
	private init(): void {
		this.currentScroll = this.targetScroll = this.getScroll();
		this.addEventListeners();
		this.start();
	}

	//! Current position get
	private getScroll(): number {
		if (this.isWindow(this.wrapper)) {
			return this.direction === 'vertical' ? window.scrollY : window.scrollX;
		}
		return this.direction === 'vertical' ? (this.wrapper as HTMLElement).scrollTop : (this.wrapper as HTMLElement).scrollLeft;
	}

	//! set position scroll
	private setScroll(value: number): void {
		const maxScroll = this.getMaxScroll();
		value = Math.max(0, Math.min(value, maxScroll));

		if (this.isWindow(this.wrapper)) {
			window.scrollTo({
				top: this.direction === 'vertical' ? value : 0,
				left: this.direction === 'horizontal' ? value : 0,
				behavior: 'instant',
			});
		} else {
			const el = this.wrapper as HTMLElement;
			if (this.direction === 'vertical') {
				el.scrollTop = value;
			} else {
				el.scrollLeft = value;
			}
		}
	}

	//! max position scroll
	private getMaxScroll(): number {
		if (this.isWindow(this.wrapper)) {
			return this.direction === 'vertical'
				? this.content.scrollHeight - window.innerHeight
				: this.content.scrollWidth - window.innerWidth;
		}
		const el = this.wrapper as HTMLElement;
		return this.direction === 'vertical' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
	}

	//! wrapper is window
	private isWindow(el: Window | HTMLElement): el is Window {
		return el === window;
	}
	//! Animate
	private animate = (): void => {
		const realScroll = this.getScroll();
		if (Math.abs(realScroll - this.currentScroll) > this.subPixelControl) {
			this.currentScroll = this.targetScroll = realScroll;
			this.velocity = 0;
			this.stopAnimation();

			return;
		}

		const now = performance.now();
		const deltaTime = Math.min(1000 / 60, now - (this.lastTime || now));
		this.lastTime = now;

		const smoothFactor = this.normalizeSmooth ? 1 - Math.pow(1 - this.smooth, deltaTime / (1000 / 60)) : this.smooth;
		this.lastScroll = this.currentScroll;
		this.currentScroll = this.lerp(this.currentScroll, this.targetScroll, smoothFactor);

		this.velocity = (this.currentScroll - this.lastScroll) * (60 / deltaTime);

		this.setScroll(this.currentScroll);
		this.emitScrollEvent();

		//! scroll direction
		this.scrollDirection = Math.sign(this.velocity);

		const isCloseEnough = Math.abs(this.currentScroll - this.targetScroll) < this.subPixelControl;
		const isSlowEnough = Math.abs(this.velocity) < this.subPixelControl;

		if ((isCloseEnough && isSlowEnough) || this.isStopped) {
			this.scrollInstance.kill();
			if (realScroll <= this.subPixelControl && realScroll !== 0 && this.scrollDirection == -1) {
				this.currentScroll = 0;
				this.scrollInstance.scrollTo();
			} else if (realScroll >= this.documentHeight - this.subPixelControl && this.scrollDirection == 1) {
				this.currentScroll = this.documentHeight;
				this.scrollInstance.scrollTo({ target: this.documentHeight, duration: 200 });
			}

			this.stopAnimation();
		} else {
			this.scrollInstance.kill();

			this.animationFrameId = requestAnimationFrame(this.animate);
		}
	};

	//! Wheel event
	private handleWheel = (e: WheelEvent): void => {
		if (!this.smoothWheel || this.isStopped) return;

		e.preventDefault();
		const delta = this.direction === 'vertical' ? e.deltaY : e.deltaX;
		const scrollAmount = Math.min(Math.abs(delta) * 1.5, this.maxScrollSpeed) * Math.sign(delta);

		this.targetScroll += scrollAmount;
		this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));

		if (!this.isScrolling) {
			this.startAnimation();
		}
	};

	//! Linear interpolation
	private lerp(start: number, end: number, t: number): number {
		return start * (1 - t) + end * t;
	}

	private addEventListeners(): void {
		this.wrapper.addEventListener('wheel', this.handleWheel as EventListener, { passive: false });
		this.wrapper.addEventListener('scroll', this.handleNativeScroll);
		window.addEventListener('resize', this.handleResize, { passive: false });
	}

	private removeEventListeners(): void {
		this.wrapper.removeEventListener('wheel', this.handleWheel as EventListener);
		this.wrapper.removeEventListener('scroll', this.handleNativeScroll);
		window.removeEventListener('resize', this.handleResize);
	}

	private handleResize = (): void => {
		this.documentHeight = document.documentElement.scrollHeight - window.innerHeight;

		const maxScroll = this.getMaxScroll();
		if (this.targetScroll > maxScroll) {
			this.targetScroll = maxScroll;
		}
	};

	//! Native scroll
	private handleNativeScroll = (): void => {
		const newScroll = this.getScroll();
		if (Math.abs(newScroll - this.currentScroll) > 1) {
			this.currentScroll = this.targetScroll = newScroll;
			this.velocity = 0;
			this.stopAnimation();
		}
	};
	//! call scrolling event
	private emitScrollEvent(): void {
		const event: ScrollEvent = {
			scroll: this.currentScroll,
			velocity: this.velocity,
			direction: Math.sign(this.velocity),
		};
		this.scrollCallbacks.forEach((callback) => callback(event));
	}

	//! Start Animation
	private startAnimation(): void {
		if (!this.isScrolling && !this.isStopped) {
			this.isScrolling = true;
			this.lastTime = performance.now();
			this.animationFrameId = requestAnimationFrame(this.animate);
		}
	}

	//! Stop Animate
	private stopAnimation(): void {
		this.isScrolling = false;
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	//! on Event
	public on(event: 'scroll', callback: EventCallback): void {
		this.scrollCallbacks.push(callback);
	}

	//! off Event
	public off(event: 'scroll', callback: EventCallback): void {
		const index = this.scrollCallbacks.indexOf(callback);
		if (index > -1) {
			this.scrollCallbacks.splice(index, 1);
		}
	}

	//! Start
	public start(): void {
		this.isStopped = false;
		this.startAnimation();
	}

	//! Stop
	public stop(): void {
		this.isStopped = true;
		this.stopAnimation();
	}

	//! Remove
	public destroy(): void {
		this.stop();
		this.removeEventListeners();
		this.scrollCallbacks.length = 0;
	}
}

//! Export
export default function createSmoothScroll(options: SmoothOption = {}) {
	if (typeof window === 'undefined') {
		return {
			on: () => {},
			off: () => {},
			scrollTo: () => {},
			decelerateTo: () => {},
			start: () => {},
			stop: () => {},
			destroy: () => {},
		};
	}
	return new SmoothScroll(options);
}
