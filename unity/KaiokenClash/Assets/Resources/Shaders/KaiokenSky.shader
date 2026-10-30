// Cielo degradado (horizonte, cénit y un sol) sobre una esfera grande vista por dentro.
Shader "Kaioken/Sky"
{
    Properties { _Top ("Cénit", Color) = (0.2,0.5,1,1) _Mid ("Horizonte", Color) = (0.8,0.9,1,1) _Bottom ("Abajo", Color) = (0.6,0.7,0.8,1) _SunDir ("Sol", Vector) = (0.4,0.5,0.3,0) _SunCol ("Color sol", Color) = (1,0.95,0.8,1) }
    SubShader
    {
        Tags { "Queue"="Background" "RenderType"="Background" }
        Cull Front
        ZWrite Off
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            fixed4 _Top, _Mid, _Bottom, _SunCol; float4 _SunDir;
            struct v2f { float4 pos : SV_POSITION; float3 d : TEXCOORD0; };
            v2f vert (appdata_base v) { v2f o; o.pos = UnityObjectToClipPos(v.vertex); o.d = normalize(mul((float3x3)unity_ObjectToWorld, v.vertex.xyz)); return o; }
            fixed4 frag (v2f i) : SV_Target
            {
                float y = i.d.y;
                fixed3 c = y > 0 ? lerp(_Mid.rgb, _Top.rgb, pow(saturate(y), 0.6)) : lerp(_Mid.rgb, _Bottom.rgb, saturate(-y * 3));
                float s = saturate(dot(normalize(i.d), normalize(_SunDir.xyz)));
                c += _SunCol.rgb * (pow(s, 400) * 2 + pow(s, 12) * 0.25);
                return fixed4(c, 1);
            }
            ENDCG
        }
    }
}
