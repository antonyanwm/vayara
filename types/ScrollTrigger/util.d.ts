export declare const createMarkerElement: ({ documentMarker, documentMarkerEnd, targetElement, markerParent, }: {
    documentMarker: number;
    documentMarkerEnd: number;
    targetElement: HTMLElement | null;
    markerParent: HTMLElement | undefined;
}) => {
    kill: () => void;
} | undefined;
