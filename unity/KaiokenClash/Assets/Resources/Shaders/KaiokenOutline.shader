// Contorno negro de cómic: se dibuja el modelo un poco inflado y por dentro (caras traseras).
Shader "Kaioken/Outline"
{
    Properties { _Color ("Color", Color) = (0,0,0,1) _Width ("Grosor", Float) = 0.012 }
    SubShader
    {
        Tags { "RenderType"="Opaque" "Queue"="Geometry+1" }
        Pass
        {
            Cull Front
            ZWrite On
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            fixed4 _Color; float _Width;
            struct appdata { float4 vertex : POSITION; float3 normal : NORMAL; };
            struct v2f { float4 pos : SV_POSITION; };
            v2f vert (appdata v)
            {
                v2f o;
                float3 wp = mul(unity_ObjectToWorld, v.vertex).xyz;
                float3 wn = normalize(UnityObjectToWorldNormal(v.normal));
                o.pos = UnityWorldToClipPos(wp + wn * _Width);
                return o;
            }
            fixed4 frag (v2f i) : SV_Target { return _Color; }
            ENDCG
        }
    }
}
