#version 300 es

in vec3 aPos;
in vec3 aNormal;
in vec2 aTexCoord;

uniform mat4 lightSpaceMatrix;
uniform mat4 m_model;

void main()
{
    gl_Position = lightSpaceMatrix * m_model * vec4(aPos, 1.0);
}