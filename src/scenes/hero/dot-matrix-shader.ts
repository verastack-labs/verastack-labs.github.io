// The Signal dot matrix (approved mockup, option B). A grid of dots whose size and brightness
// follow a travelling wave modulated by fbm noise; the pointer ripples the field; crests take the
// signal colour (#D4FF3F); the field is biased right so the headline stays readable.
export const DOT_MATRIX_SHADER = [
  'precision highp float;',
  'uniform vec2 r;',
  'uniform float t;',
  'uniform vec2 m;',
  'uniform float cs;',
  'float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}',
  'float fbm(vec2 p){float v=0.,a=.5;for(int k=0;k<5;k++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
  'void main(){',
  '  vec2 px=gl_FragCoord.xy;vec2 id=floor(px/cs);vec2 f=fract(px/cs)-.5;',
  '  vec2 uv=(id*cs-.5*r)/r.y;',
  '  float nn=fbm(uv*2.2+vec2(t*.07,-t*.03));',
  '  float wv=sin(uv.x*5.-t*.9+nn*5.)*.5+.5;',
  '  float mp=length(uv-m*vec2(r.x/r.y,1.));',
  '  float rip=exp(-mp*4.)*(.6+.4*sin(mp*40.-t*6.));',
  '  float e=clamp(wv*nn*1.7+rip*.8,0.,1.);',
  '  float s=mix(.07,.44,e*e);float d=smoothstep(s,s-.09,length(f));',
  '  vec3 c=mix(vec3(.17,.18,.16),vec3(.831,1.,.247),smoothstep(.55,.92,e))*d;',
  '  float side=smoothstep(-.35,.55,uv.x)*.85+.15;',
  '  c*=side*smoothstep(1.3,.3,abs(uv.y)*1.1);',
  '  gl_FragColor=vec4(c*.9+vec3(.043,.047,.039),1.);',
  '}',
].join('\n')
