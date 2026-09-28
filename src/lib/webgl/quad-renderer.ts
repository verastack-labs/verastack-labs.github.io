// Full-screen triangle.
export const VERTEX_SHADER = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'

export type QuadUniforms = { t: number; m: [number, number]; cs: number }
export type QuadRenderer = {
  render(u: QuadUniforms): void
  resize(width: number, height: number): void
  dispose(): void
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Shader failed: could not create')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader failed: ${log}`)
  }
  return shader
}

// One fragment shader drawn over a full-screen triangle. Throws if WebGL or the shader fails, so
// the caller can fall back to the CSS pattern.
export function createQuadRenderer(canvas: HTMLCanvasElement, fragment: string): QuadRenderer {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
  if (!gl) throw new Error('WebGL unavailable')

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment)
  const program = gl.createProgram()
  if (!program) throw new Error('Shader failed: could not create program')
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Shader failed: ${gl.getProgramInfoLog(program)}`)
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const uR = gl.getUniformLocation(program, 'r')
  const uT = gl.getUniformLocation(program, 't')
  const uM = gl.getUniformLocation(program, 'm')
  const uCs = gl.getUniformLocation(program, 'cs')

  return {
    render({ t, m, cs }) {
      gl.uniform2f(uR, canvas.width, canvas.height)
      gl.uniform1f(uT, t)
      gl.uniform2f(uM, m[0], m[1])
      gl.uniform1f(uCs, cs)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    resize(width, height) {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    },
    dispose() {
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
