import { GoogleApiLatLngLiteral } from './types';

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export function distanceCompute(pointA: GoogleApiLatLngLiteral, pointB: GoogleApiLatLngLiteral) {
    // Using Haversine formula: https://en.wikipedia.org/wiki/Haversine_formula
    const precision = 1000; // (meters)
    const earthRadiusKm = 6371;
    const latitudeDiff = deg2rad(pointB.lat - pointA.lat);
    const longitudeDiff = deg2rad(pointB.lng - pointA.lng);

    const a =
        Math.sin(latitudeDiff / 2) * Math.sin(latitudeDiff / 2) +
        Math.cos(deg2rad(latitudeDiff)) *
            Math.cos(deg2rad(latitudeDiff)) *
            Math.sin(longitudeDiff / 2) *
            Math.sin(longitudeDiff / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = earthRadiusKm * c; // Distance in km

    return Math.round(d * precision) / precision;
}
