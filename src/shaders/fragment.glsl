#version 300 es

precision mediump float;

in vec2 v_texCoord;
in vec3 v_normal;
in vec3 FragPos;

uniform sampler2D u_image;
uniform vec3 viewPos;

out vec4 FragColor;

struct Light {
    vec3 direction;
    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform Light light;

vec3 ambientColor() {
    return vec3(texture(u_image, v_texCoord)) * light.ambient;
}

vec3 diffuseColor(vec3 norm) {
    vec3 lightDir = normalize(-light.direction);
    float diff = max(dot(norm, lightDir), 0.0);
    return diff * light.diffuse * vec3(texture(u_image, v_texCoord));
}

vec3 specularColor(vec3 norm) {
    vec3 lightDir = normalize(-light.direction);
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
    return spec * light.specular;
}

void main() {
    vec3 norm = normalize(v_normal);
    vec3 ambient = ambientColor();
    vec3 diffuse = diffuseColor(norm);
    vec3 specular = specularColor(norm);
    
    FragColor = vec4(ambient + diffuse + specular , 1.0);
}
