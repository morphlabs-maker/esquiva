// Sombreado de anime: dos o tres tonos duros, borde iluminado (rim) y color por vértice para los mundos.
Shader "Kaioken/Toon"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _Rim ("Rim", Range(0,1)) = 0.35
        _Shade ("Sombra", Range(0,1)) = 0.62
        _VC ("Usar color de vértice", Float) = 0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" "Queue"="Geometry" }
        Pass
        {
            Tags { "LightMode"="ForwardBase" }
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_fwdbase
            #pragma multi_compile_fog
            #include "UnityCG.cginc"
            #include "Lighting.cginc"
            #include "AutoLight.cginc"
            fixed4 _Color; float _Rim; float _Shade; float _VC;
            struct appdata { float4 vertex : POSITION; float3 normal : NORMAL; fixed4 color : COLOR; };
            struct v2f { float4 pos : SV_POSITION; float3 n : TEXCOORD0; float3 v : TEXCOORD1; fixed4 col : COLOR; SHADOW_COORDS(2) UNITY_FOG_COORDS(3) };
            v2f vert (appdata i)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(i.vertex);
                o.n = UnityObjectToWorldNormal(i.normal);
                o.v = WorldSpaceViewDir(i.vertex);
                o.col = i.color;
                TRANSFER_SHADOW(o);
                UNITY_TRANSFER_FOG(o, o.pos);
                return o;
            }
            fixed4 frag (v2f i) : SV_Target
            {
                float3 n = normalize(i.n);
                float d = dot(n, normalize(_WorldSpaceLightPos0.xyz));
                float sh = SHADOW_ATTENUATION(i);
                float lit = step(0.05, d * sh);
                float tone = lerp(_Shade, 1.0, lit);
                tone = max(tone, step(0.6, d * sh) * 1.06);
                float rim = pow(1.0 - saturate(dot(n, normalize(i.v))), 4.0) * _Rim * saturate(d + 0.6);
                fixed4 base = _Color * lerp(fixed4(1,1,1,1), i.col, _VC);
                fixed3 amb = ShadeSH9(float4(n, 1)) * 0.35;
                fixed3 c = base.rgb * (tone * _LightColor0.rgb * 0.85 + amb) + rim;
                fixed4 r = fixed4(c, 1);
                UNITY_APPLY_FOG(i.fogCoord, r);
                return r;
            }
            ENDCG
        }
        Pass
        {
            Tags { "LightMode"="ShadowCaster" }
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_shadowcaster
            #include "UnityCG.cginc"
            struct v2f { V2F_SHADOW_CASTER; };
            v2f vert (appdata_base v) { v2f o; TRANSFER_SHADOW_CASTER_NORMALOFFSET(o) return o; }
            float4 frag (v2f i) : SV_Target { SHADOW_CASTER_FRAGMENT(i) }
            ENDCG
        }
    }
    FallBack "Diffuse"
}
