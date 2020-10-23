#version 300 es

in vec3 aPos;

uniform mat4 m_view;
uniform mat4 m_projection;

out vec3 TexCoords;

void main() {
    TexCoords = aPos;
    vec4 pos = m_projection * m_view * vec4(aPos, 1.0);
    gl_Position = pos.xyww;
}