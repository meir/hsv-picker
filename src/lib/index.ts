// place files you want to import through the `$lib` alias in this folder.

function map(value: number, x1: number, y1: number, x2: number, y2: number) {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

class Point {
    x = 0;
    y = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distance(point: Point) {
        return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
    }

    degrees(point: Point) {
        const radians = Math.atan2(point.y - this.y, point.x - this.x);
        return radians * 180 / Math.PI;
    }

    setRadius(center: Point, radius: number) {
        const angle = center.degrees(this);
        const x = center.x + Math.cos(angle * Math.PI / 180) * radius;
        const y = center.y + Math.sin(angle * Math.PI / 180) * radius;

        this.x = x;
        this.y = y;
    }

    setAngle(center: Point, angle: number) {
        const radius = center.distance(this);
        const x = center.x + Math.cos(angle * Math.PI / 360) * radius;
        const y = center.y + Math.sin(angle * Math.PI / 360) * radius;

        this.x = x;
        this.y = y;
    }
}

export interface HSVOpts {
    x: number;
    y: number;
    radius: number;
    min_radius?: number;
    v_radius?: number;
}

export interface Location {
    x: number;
    y: number;
}

export interface hsv {
    h: number;
    s: number;
    v: number;
}

export class HSV {
    #center: Point = new Point(0, 0);
    #max_radius: number = 2;
    #min_radius: number = 0;
    #value: Point = new Point(0, 0);

    #v_point: Point = new Point(0, 0);
    #v_radius: number = 2.1;
    
    constructor(opts: HSVOpts) {
        if (opts.min_radius ?? 0 > opts.radius) throw new Error("min_radius cannot be greater than radius")
        if (opts.v_radius && opts.v_radius < opts.radius) throw new Error("v_radius cannot be less than radius")

        this.#center = new Point(opts.x, opts.y);
        this.#max_radius = opts.radius;
        this.#min_radius = opts.min_radius ?? 0;
        this.#value = new Point(opts.x, this.#max_radius);

        this.#v_radius = opts.v_radius ?? opts.radius + 0.1;
        this.#v_point = new Point(opts.x, this.#v_radius);
    }

    get hsv(): hsv {
        const angle = this.#center.degrees(this.#value);
        const distance = this.#center.distance(this.#value);
        const v_angle = this.#center.degrees(this.#v_point);

        const hue = map(angle, -180, 180, 0, 360);
        const saturation = map(distance, this.#min_radius, this.#max_radius, 0, 100);
        let value = map(v_angle, -180, 180, 0, 100);

        return {
            h: hue,
            s: saturation,
            v: value,
        }
    }

    set hsv(hsv: hsv) {
        const angle = map(hsv.h, 0, 360, 0, 360);
        const distance = map(hsv.s, 0, 100, this.#min_radius, this.#max_radius);
        const v_angle = map(hsv.v, 0, 100, 0, 360);

        this.#value.setRadius(this.#center, distance);
        this.#v_point.setRadius(this.#center, this.#v_radius);
        this.#value.setAngle(this.#center, angle);
        this.#v_point.setAngle(this.#center, v_angle);
    }

    #fixPoints() {
        const distance = this.#center.distance(this.#value);
        this.#value.setRadius(this.#center, Math.min(Math.max(this.#min_radius, distance), this.#max_radius));

        this.#v_point.setRadius(this.#center, this.#v_radius);
    }

    set Point(l: Location) {
        this.#value.x = l.x;
        this.#value.y = l.y;
        this.#fixPoints();
    }

    set VPoint(l: Location) {
        this.#v_point.x = l.x;
        this.#v_point.y = l.y;
        this.#fixPoints();
    }

    get Point(): Location {
        return {
            x: this.#value.x,
            y: this.#value.y,
        }
    }

    get VPoint(): Location {
        return {
            x: this.#v_point.x,
            y: this.#v_point.y,
        }
    }
}