// materials.js
// Shared materials built on the pixel textures. One instance each, reused by
// every mesh that needs it.
import * as THREE from "three";
import { planks, woodGrain, plaster, weave, quilt, linen, rug } from "./pixelTextures";
import { PALETTE as P } from "./palette";

const standard = (params) => new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, ...params });

let materials = null;

// Built lazily on first use: the textures need a DOM canvas.
export function getMaterials() {
    if (materials) return materials;
    materials = {
        floor: standard({ map: planks("floor"), roughness: 0.85 }),
        wall: standard({ map: plaster(), roughness: 0.95 }),
        ceiling: standard({ color: P.wallDeep, roughness: 1 }),
        deskTop: standard({ map: planks("desk"), roughness: 0.75 }),
        wood: standard({ map: woodGrain("desk"), roughness: 0.8 }),
        woodDark: standard({ map: woodGrain("dark"), roughness: 0.85 }),
        chairFabric: standard({ map: weave(P.navy, P.navyMid, P.navyDeep), roughness: 0.95 }),
        chairShell: standard({ color: "#16141c", roughness: 0.7 }),
        quilt: standard({ map: quilt(), roughness: 0.95 }),
        linen: standard({ map: linen(), roughness: 0.95 }),
        rug: standard({ map: rug(), roughness: 1 }),
    };
    return materials;
}
