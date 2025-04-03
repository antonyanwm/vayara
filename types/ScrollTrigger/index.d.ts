interface ScrollTriggerProps {
    element: HTMLElement | string | null;
    start?: number;
    end?: number;
    marker?: boolean;
    markerParent?: HTMLElement;
    once?: boolean;
    onUpdate?: (data: {
        progress: number;
        direction: number;
    }) => void;
    onEnter?: (entry: IntersectionObserverEntry) => void;
    onLeave?: (entry: IntersectionObserverEntry) => void;
    onEnterBack?: (entry: IntersectionObserverEntry) => void;
    onLeaveBack?: (entry: IntersectionObserverEntry) => void;
}
declare const scrollTrigger: (props: ScrollTriggerProps) => () => void;
export default scrollTrigger;
