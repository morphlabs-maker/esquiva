// Brillo aditivo sin luz (auras, ki, rayos, chispas) con borde suave según el ángulo.
Shader "Kaioken/Additive"
{
    Properties { _Color ("Color", Color) = (1,1,1,1) _Soft ("Borde suave", Range(0,4)) = 1.2 }
    SubShader
    {
        Tags { "RenderType"="Transparent" "Queue"="Transparent" "IgnoreProjector"="True" }
        Blend SrcAlpha One
        ZWrite Off
        Cull Off
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            fixed4 _Color; float _Soft;
            struct appdata { float4 vertex : POSITION; float3 normal : NORMAL; };
            struct v2f { float4 pos : SV_POSITION; float f : TEXCOORD0; };
            v2f vert (appdata v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                float3 n = normalize(UnityObjectToWorldNormal(v.normal));
                float3 vd = normalize(WorldSpaceViewDir(v.vertex));
                o.f = pow(abs(dot(n, vd)), _Soft);
                return o;
            }
            fixed4 frag (v2f i) : SV_Target { return fixed4(_Color.rgb, _Color.a * i.f); }
            ENDCG
        }
    }
}
