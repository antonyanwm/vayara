import { createMarkerElement } from './util';

interface ScrollTriggerProps {
	element: HTMLElement | string | null;
	start?: number;
	end?: number;
	marker?: boolean;
	markerParent?: HTMLElement;

	once?: boolean;

	onUpdate?: (data: { progress: number; direction: number }) => void;
	onEnter?: (entry: IntersectionObserverEntry) => void;
	onLeave?: (entry: IntersectionObserverEntry) => void;
	onEnterBack?: (entry: IntersectionObserverEntry) => void;
	onLeaveBack?: (entry: IntersectionObserverEntry) => void;
}

class ScrollTrigger {
	private observer: IntersectionObserver | null = null;
	private markers?: { kill: () => void };
	private markerParent?: HTMLElement;

	private targetElement: HTMLElement | null;
	private distanceInnerDocumentMarker!: number;

	private hasEntered!: boolean;

	private once!: boolean;

	private onUpdate?: (data: { progress: number; direction: number }) => void;

	private lastY!: number;
	private elementRect!: DOMRect;

	private startDocumentMarker!: number;
	private endDocumentMarker!: number;

	private selfConfig: {
		direction: number;
		scrollYStart: number;
	};

	private progressCalculationProps: {
		scrollSize: number;
		distanceScroll: number;
	};

	constructor({
		element,
		end = 0,
		start = 0,
		once = false,
		marker = false,
		markerParent,
		onUpdate,
		onEnter,
		onLeave,
		onEnterBack,
		onLeaveBack,
	}: ScrollTriggerProps) {
		this.targetElement = typeof element === 'string' ? document.querySelector(element) : element;

		this.progressCalculationProps = { scrollSize: 1, distanceScroll: 1 };
		this.selfConfig = { direction: 1, scrollYStart: 1 };

		if (markerParent) this.markerParent = markerParent;
		if (!this.targetElement) return;

		this.lastY = 0;
		this.once = once;
		this.hasEntered = false;

		this.onUpdate = onUpdate;

		//! Calculate require all property
		this.startDocumentMarker = window.innerHeight * (start / 100);
		this.endDocumentMarker = window.innerHeight * (end / 100);

		//! Create marker
		if (marker) this.createMarker();

		//! On Update
		if (this.onUpdate) {
			this.elementRect = this.targetElement.getBoundingClientRect();
			this.distanceInnerDocumentMarker = Math.abs(this.startDocumentMarker - this.endDocumentMarker);

			this.progressCalculationProps.scrollSize = this.elementRect.height + this.distanceInnerDocumentMarker;
		}

		(this.observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]!;
				const { isIntersecting, boundingClientRect } = entry;

				//! Get direction
				this.selfConfig.direction = boundingClientRect.y > this.lastY ? 1 : -1;
				this.lastY = boundingClientRect.y;

				if (isIntersecting) {
					this.hasEntered = true;
					this.selfConfig.scrollYStart = boundingClientRect.y + window.scrollY;

					this.progressCalculationProps.distanceScroll = this.startDocumentMarker - this.selfConfig.scrollYStart;

					if (onUpdate) window.addEventListener('scroll', this.scrollProgress);

					(this.selfConfig.direction == 1 ? onEnterBack : onEnter)?.(entry);
				} else if (this.hasEntered) {
					if (onUpdate) window.removeEventListener('scroll', this.scrollProgress);

					if (this.selfConfig.direction == 1) {
						onLeaveBack?.(entry);

						// if (onUpdate) this.scrollProgress(0);
					} else {
						onLeave?.(entry);

						// if (this.once) this.destroy();
						// if (onUpdate) this.scrollProgress(100);
					}
				}
			},
			{
				root: null,
				rootMargin: `-${end}% 0px -${100 - start}% 0px`,
			}
		)),
			this.observer.observe(this.targetElement);
	}

	private scrollProgress = (progress: Event | number): void => {
		requestAnimationFrame(() => {
			if (typeof progress == 'number') {
				this.onUpdate?.({ progress: progress, direction: this.selfConfig.direction });
			} else {
				this.onUpdate?.({ progress: this.calculateProgress(), direction: this.selfConfig.direction });
			}
		});
	};

	private calculateProgress(): number {
		return Math.max(
			0,
			Math.min(
				((window.scrollY + this.progressCalculationProps.distanceScroll) * 100) / this.progressCalculationProps.scrollSize,
				100
			)
		);
	}

	private createMarker(): void {
		this.markers = createMarkerElement({
			documentMarker: this.startDocumentMarker,
			documentMarkerEnd: this.endDocumentMarker,
			targetElement: this.targetElement,
			markerParent: this.markerParent,
		});
	}

	public destroy(): void {
		this.observer?.disconnect();
		this.markers?.kill();
	}
}

const scrollTrigger = (props: ScrollTriggerProps) => {
	const instance = new ScrollTrigger(props);
	return () => instance.destroy();
};
export default scrollTrigger;
