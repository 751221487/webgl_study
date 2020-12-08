#version 300 es

in vec3 aPos;
in vec2 aTexCoord;

out vec2 TexCoords;

void main()
{
  TexCoords = aTexCoord;
  gl_Position = vec4(aPos, 1.0);
}