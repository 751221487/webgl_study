import Material from '../core/material'
import vertexShader from '../shaders/vertex.glsl'

export default class MPhong extends Material {
  constructor(options = { diffuse, specular }) {
    super()
    this.options = options
    this.vertexShader = vertexShader
    this.fragmentShader = this.fragmentShader()
  }

  fragmentShader() {
    const light = window.scene.lights
    const { diffuse, specular } = this.options
    const diffuseColor = diffuse instanceof Array ? `vec3(${diffuse[0]}, ${diffuse[1]}, ${diffuse[2]})` : `vec3(texture(u_diffuse, v_texCoord))`
    const specularColor = specular instanceof Array ? `vec3(${specular[0]}, ${specular[1]}, ${specular[2]})` : `vec3(texture(u_specular, v_texCoord))`
    return `#version 300 es
      #define SKYLIGHT_COUNT ${light.sky.length}
      #define DIRECTLIGHT_COUNT ${light.direct.length}
      
      precision mediump float;

      in vec2 v_texCoord;
      in vec3 v_normal;
      in vec3 FragPos;

      ${diffuse instanceof Array ? 'uniform vec3 c_diffuse;' : 'uniform sampler2D u_diffuse;'}
      ${specular instanceof Array ? 'uniform vec3 c_specular;' : 'uniform sampler2D u_specular;'}
      
      out vec4 FragColor;

      uniform vec3 viewPos;

      struct DirectLight {
          vec3 direction;
          vec3 color;
      };

      struct PointLight {
          vec3 position;
          vec3 color;  
      };

      uniform vec3 skyLights[SKYLIGHT_COUNT];
      uniform DirectLight directLights[DIRECTLIGHT_COUNT];

      vec3 ambientColor() {
          vec3 result = vec3(0.0, 0.0, 0.0);
          for(int i = 0; i < SKYLIGHT_COUNT; i++) {
            result += ${diffuseColor} * skyLights[i];
          }
          return result;
      }

      vec3 diffuseColor(vec3 norm) {
          vec3 result = vec3(0.0, 0.0, 0.0);
          DirectLight light;
          for(int i = 0; i < DIRECTLIGHT_COUNT; i++) {
              light = directLights[i];
              vec3 lightDir = normalize(-light.direction);
              float diff = max(dot(norm, lightDir), 0.0);
              result += diff * light.color * ${diffuseColor};
          }
          return result;
      }

      vec3 specularColor(vec3 norm) {
          vec3 result = vec3(0.0, 0.0, 0.0);
          DirectLight light;
          for(int i = 0; i < DIRECTLIGHT_COUNT; i++) {
              light = directLights[i];
              vec3 lightDir = normalize(-light.direction);
              vec3 viewDir = normalize(viewPos - FragPos);
              vec3 reflectDir = reflect(-lightDir, norm);
              float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
              result += spec * light.color * ${specularColor};
          }
          return result;
      }

      void main() {
          vec3 norm = normalize(v_normal);
          vec3 ambient = ambientColor();
          vec3 diffuse = diffuseColor(norm);
          vec3 specular = specularColor(norm);
          
          FragColor = vec4(ambient + diffuse + specular , 1.0);
      }
    `
  }

  bindChildUniform() {
    const { diffuse, specular } = this.options
    const lights = window.scene.lights 
    const gl = window.gl

    for(let i = 0; i < lights.sky.length; i++) {
      gl.uniform3fv(gl.getUniformLocation(this.glProgram, `skyLights[${i}]`), lights.sky[i].color)
    }

    for(let i = 0; i < lights.direct.length; i++) {
      gl.uniform3fv(gl.getUniformLocation(this.glProgram, `directLights[${i}].direction`), lights.direct[i].direction)
      gl.uniform3fv(gl.getUniformLocation(this.glProgram, `directLights[${i}].color`), lights.direct[i].color)
    }

    if(diffuse instanceof Array) {
      gl.uniform3fv(gl.getUniformLocation(this.glProgram, "c_diffuse"), diffuse)
    } else {
      this.loadImage(diffuse)
    }

    if(specular instanceof Array) {
      gl.uniform3fv(gl.getUniformLocation(this.glProgram, "c_specular"), specular)
    } else {
      this.loadImage(specular)
    }
  }

}