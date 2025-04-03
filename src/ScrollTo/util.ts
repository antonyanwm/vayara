export type Bezier = [number, number, number, number];

export function cubicBezier(t: number, bezier: Bezier): number {
	const [p1x, p1y, p2x, p2y] = bezier;

	const cx: number = 3 * p1x;
	const bx: number = 3 * (p2x - p1x) - cx;
	const ax: number = 1 - cx - bx;
	const cy: number = 3 * p1y;
	const by: number = 3 * (p2y - p1y) - cy;
	const ay: number = 1 - cy - by;

	function sampleCurveX(t: number): number {
		return ((ax * t + bx) * t + cx) * t;
	}

	function sampleCurveY(t: number): number {
		return ((ay * t + by) * t + cy) * t;
	}

	function solveCurveX(x: number): number {
		let t0: number = x;
		for (let i = 0; i < 8; i++) {
			const x2: number = sampleCurveX(t0) - x;
			if (Math.abs(x2) < 1e-6) return t0;
			const d2: number = (3 * ax * t0 + 2 * bx) * t0 + cx;
			if (Math.abs(d2) < 1e-6) break;
			t0 = t0 - x2 / d2;
		}
		return t0;
	}

	const tAdjusted: number = solveCurveX(t);
	return sampleCurveY(tAdjusted);
}

export const EASE_IN: Bezier = [0.42, 0, 1, 1]; // ease-in
export const EASE_OUT: Bezier = [0, 0, 0.58, 1]; // ease-out
export const EASE_IN_OUT: Bezier = [0.42, 0, 0.58, 1]; // ease-in-out
