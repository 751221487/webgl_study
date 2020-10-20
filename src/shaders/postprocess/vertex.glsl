#version 300 es

in vec2 aPos;
in vec2 aTexCoord;

out vec2 TexCoords;

void main()
{
    TexCoords = aTexCoord;
    gl_Position = vec4(aPos.x, aPos.y, 0.0, 1.0); 
}  