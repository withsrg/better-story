/** The core Shader Mounting class. Pass it a canvas element and a fragment shader to get started. */
export { ShaderMount } from "./shader_mount.ts"

// ----- Warping Distortion ----- //
/** Warp: distortion + swirl + underlying shapes */
export {
    warpFragmentShader,
    PatternShapes,
    type PatternShape,
    type WarpUniforms,
} from "./warp.ts"

// ----- Uniform conversion utils ----- //
export { getShaderColorFromString } from "./get_shader_color_from_string.ts"

export default function A(props) {
    return <div />
}
