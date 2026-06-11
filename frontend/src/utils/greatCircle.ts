import {ICoordinates} from "../models/interfaces";

const toRad =
    (deg: number) => (deg * Math.PI) / 180;
const toDeg =
    (rad: number) => (rad * 180) / Math.PI;

export function calculateGreatCircleDistanceKm(start: ICoordinates, end: ICoordinates): number {
    const earthRadiusKm = 6371;
    const lat1 = toRad(start.latitude);
    const lon1 = toRad(start.longitude);
    const lat2 = toRad(end.latitude);
    const lon2 = toRad(end.longitude);

    const a =
        Math.sin((lat2 - lat1) / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2;

    return earthRadiusKm * 2 * Math.asin(Math.sqrt(a));
}

export function interpolateGreatCircle(
    start: ICoordinates,
    end: ICoordinates,
    segments = 64
): ICoordinates[] {
    const lat1 = toRad(start.latitude);
    const lon1 = toRad(start.longitude);
    const lat2 = toRad(end.latitude);
    const lon2 = toRad(end.longitude);

    const d =
        2 *
        Math.asin(
            Math.sqrt(
                Math.sin((lat2 - lat1) / 2) ** 2 +
                Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
            )
        );

    if (d === 0) return [start, end];

    const points: ICoordinates[] = [];

    for (let i = 0; i <= segments; i++) {
        const f = i / segments;

        const A = Math.sin((1 - f) * d) / Math.sin(d);
        const B = Math.sin(f * d) / Math.sin(d);

        const x =
            A * Math.cos(lat1) * Math.cos(lon1) +
            B * Math.cos(lat2) * Math.cos(lon2);
        const y =
            A * Math.cos(lat1) * Math.sin(lon1) +
            B * Math.cos(lat2) * Math.sin(lon2);
        const z =
            A * Math.sin(lat1) +
            B * Math.sin(lat2);

        const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
        const lon = Math.atan2(y, x);

        points.push({
            latitude: toDeg(lat),
            longitude: ((toDeg(lon) + 540) % 360) - 180,
        });
    }

    return points;
}
