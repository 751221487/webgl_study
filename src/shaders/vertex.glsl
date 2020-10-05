#version 300 es

in vec3 aPos;
in vec3 aNormal;
in vec2 aTexCoord;

uniform mat4 m_model;    
uniform mat4 m_view;    
uniform mat4 m_projection;    

out vec2 v_texCoord;
out vec3 v_normal;
out vec3 FragPos;

void main() {
    // pass the texCoord to the fragment shader
    // The GPU will interpolate this value between points
    v_texCoord = aTexCoord;
    v_normal = mat3(transpose(inverse(m_model))) * aNormal;
    FragPos = vec3(m_model * vec4(aPos, 1.0));
    gl_Position = m_projection * m_view * m_model * vec4(aPos, 1.0);
}