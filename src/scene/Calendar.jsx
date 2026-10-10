import { calendarPage } from "./textures/textTextures";
import { useHoverLabel } from "../interactions/hoverLabel";

/**
 * 3D Wall Calendar component
 * Hangs on the back wall to the right of the window
 * Displays October 2026 grid and represents Syed's career experience timeline
 */
function Calendar({ position = [5.95, 5.25, -4.82], onClick = null }) {
    const calendarTexture = calendarPage();
    const hover = useHoverLabel("Calendar", "Experience timeline");

    return (
        <group
            position={position}
            onClick={onClick}
            {...hover}
        >
            {/* Top Wooden Hanging Bar */}
            <mesh position={[0, 0.98, 0.02]} castShadow>
                <boxGeometry args={[1.7, 0.1, 0.08]} />
                <meshStandardMaterial color="#3d2c26" roughness={0.8} />
            </mesh>

            {/* Hanging String Triangle */}
            <mesh position={[0, 1.15, 0.01]}>
                <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} rotation={[0, 0, 0.7]} />
                <meshBasicMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0, 1.15, 0.01]}>
                <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} rotation={[0, 0, -0.7]} />
                <meshBasicMaterial color="#94a3b8" />
            </mesh>

            {/* Calendar Paper Backing */}
            <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[1.6, 1.85, 0.04]} />
                <meshStandardMaterial color="#d6c8aa" roughness={0.9} />
            </mesh>

            {/* Calendar Front Sheet Face */}
            <mesh position={[0, 0, 0.025]}>
                <planeGeometry args={[1.54, 1.78]} />
                {/* Lit like paper, with a little self-illumination so the dates
                    stay readable in the dark room */}
                <meshStandardMaterial
                    map={calendarTexture}
                    emissiveMap={calendarTexture}
                    emissive="#ffffff"
                    emissiveIntensity={0.35}
                    roughness={0.95}
                />
            </mesh>
        </group>
    );
}

export default Calendar;
