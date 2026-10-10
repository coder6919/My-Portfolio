// PixelBox.jsx
// Box and plane meshes whose UVs follow their real size, so a tiled pixel
// texture keeps the same texel density on every face instead of stretching
// one tile across it. `tile` is how many world units one texture repeat spans
// (64px textures at 16 texels/unit -> 4).
import { useEffect, useMemo } from "react";
import * as THREE from "three";

// BoxGeometry face order: +x, -x, +y, -y, +z, -z (4 vertices each).
function scaleBoxUVs(geometry, [w, h, d], tile, grainAlongLongest) {
    const uv = geometry.attributes.uv;
    const faces = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    faces.forEach(([du, dv], face) => {
        // Wood grain runs along u; turn it to follow the board's long side.
        const swap = grainAlongLongest && dv > du;
        for (let i = 0; i < 4; i++) {
            const index = face * 4 + i;
            const u = uv.getX(index);
            const v = uv.getY(index);
            if (swap) uv.setXY(index, (v * dv) / tile, (u * du) / tile);
            else uv.setXY(index, (u * du) / tile, (v * dv) / tile);
        }
    });
    uv.needsUpdate = true;
}

export function PixelBox({ size, material, tile = 4, grain = true, children, ...props }) {
    const [w, h, d] = size;
    const geometry = useMemo(() => {
        const g = new THREE.BoxGeometry(w, h, d);
        scaleBoxUVs(g, [w, h, d], tile, grain);
        return g;
    }, [w, h, d, tile, grain]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return (
        <mesh geometry={geometry} material={material} {...props}>
            {children}
        </mesh>
    );
}

const _up = new THREE.Vector3(0, 1, 0);

/**
 * A square-section bar running from `from` to `to` (lamp arms, chair spokes,
 * rails). `thickness` is the cross-section; the length is the distance.
 */
export function PixelBeam({ from, to, thickness = 0.08, material, ...props }) {
    const [ax, ay, az] = from;
    const [bx, by, bz] = to;
    const { length, position, quaternion } = useMemo(() => {
        const a = new THREE.Vector3(ax, ay, az);
        const b = new THREE.Vector3(bx, by, bz);
        const dir = b.clone().sub(a);
        return {
            length: dir.length(),
            position: a.clone().add(b).multiplyScalar(0.5),
            quaternion: new THREE.Quaternion().setFromUnitVectors(_up, dir.normalize()),
        };
    }, [ax, ay, az, bx, by, bz]);
    return (
        <PixelBox
            size={[thickness, length, thickness]}
            material={material}
            position={position}
            quaternion={quaternion}
            {...props}
        />
    );
}

export function PixelPlane({ size, material, tile = 4, ...props }) {
    const [w, h] = size;
    const geometry = useMemo(() => {
        const g = new THREE.PlaneGeometry(w, h);
        const uv = g.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * h) / tile);
        return g;
    }, [w, h, tile]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return <mesh geometry={geometry} material={material} {...props} />;
}
