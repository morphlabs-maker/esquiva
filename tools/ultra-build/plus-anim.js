/* =========================================================
   KAIOKEN CLASH 3.0 — MÁS ARTICULACIONES Y POSES
   Nuevas articulaciones: cadera (hips), muñecas (wrL/wrR) y tobillos (anL/anR).
   Poses nuevas: guardia de combate, gestos, danza de la fusión, telequinesis, saludo, comer, sentarse…
   ========================================================= */
const POSE_ADD={idle:{wrL:[-.15,0,0],wrR:[-.15,0,0]},fly:{anL:[.8,0,0],anR:[.9,0,0],wrL:[.3,0,0],wrR:[.3,0,0]},back:{anL:[-.3,0,0],anR:[-.3,0,0]},
 punchR:{wrR:[.1,0,0],hips:[0,.25,0],anL:[-.2,0,0]},kick:{anR:[.8,0,0],hips:[0,-.2,0]},kickHigh:{anL:[.8,0,0],hips:[0,.3,0]},uppercut:{wrR:[.2,0,0],anL:[.4,0,0]},
 windup:{hips:[0,-.3,0],wrR:[.3,0,0]},guard:{wrL:[-.5,0,0],wrR:[-.5,0,0],anL:[-.2,0,0],anR:[-.2,0,0]},charge:{wrL:[.4,0,.3],wrR:[.4,0,-.3],anL:[0,0,.2],anR:[0,0,-.2]},
 blastR:{wrR:[-1.3,0,0],hips:[0,.2,0]},beamCharge:{wrL:[-.4,0,.6],wrR:[-.4,0,-.6],hips:[0,-.3,0]},beamFire:{wrL:[-1.25,0,0],wrR:[-1.25,0,0],anL:[-.2,0,0]},
 raise:{wrL:[-.6,0,0],wrR:[-.6,0,0]},throw:{wrL:[-.9,0,0],wrR:[-.9,0,0]},hit:{anL:[.3,0,0],anR:[.3,0,0],wrL:[.4,0,0],wrR:[.4,0,0]},knock:{anL:[.6,0,0],anR:[.6,0,0]},
 down:{anL:[.5,0,0],anR:[.5,0,0]},transform:{wrL:[.2,0,.3],wrR:[.2,0,-.3]},victory:{wrR:[-.3,0,0]},duck:{anL:[-.5,0,0],anR:[-.5,0,0]},tired:{wrL:[.3,0,0],wrR:[.3,0,0]}};
for(const k in POSE_ADD)if(POSES[k])Object.assign(POSES[k],POSE_ADD[k]);
Object.assign(POSES,{
 stance:{hips:[0,.4,0],torso:[.18,-.38,0],head:[-.15,-.1,0],shL:[-1.35,0,.25],elL:[-2.0,0,0],wrL:[-.2,0,0],shR:[-.65,0,-.35],elR:[-2.15,0,0],wrR:[-.2,0,0],hipL:[-.55,0,.18],knL:[.65,0,0],anL:[-.25,0,0],hipR:[.35,0,-.16],knR:[.55,0,0],anR:[-.1,0,0]},
 stanceB:{hips:[0,.45,0],torso:[.25,-.42,0],head:[-.2,-.05,0],shL:[-1.5,0,.2],elL:[-2.1,0,0],wrL:[-.3,0,0],shR:[-.7,0,-.3],elR:[-2.3,0,0],wrR:[-.3,0,0],hipL:[-.6,0,.2],knL:[.8,0,0],anL:[-.3,0,0],hipR:[.3,0,-.16],knR:[.7,0,0],anR:[-.2,0,0]},
 taunt:{torso:[.05,.2,0],head:[-.2,-.25,.15],shL:[-.25,0,.25],elL:[-.4,0,0],shR:[-1.5,0,-.15],elR:[-1.3,0,0],wrR:[-1.1,0,0],hipL:[-.2,0,.1],knL:[.25,0,0],hipR:[.1,0,-.1],knR:[.2,0,0]},
 tauntB:{torso:[.05,.2,0],head:[-.2,-.25,.15],shL:[-.25,0,.25],elL:[-.4,0,0],shR:[-1.5,0,-.15],elR:[-2.2,0,0],wrR:[-1.4,0,0],hipL:[-.2,0,.1],knL:[.25,0,0],hipR:[.1,0,-.1],knR:[.2,0,0]},
 crossArms:{torso:[-.05,0,0],head:[-.15,0,0],shL:[-1.25,0,-.4],elL:[-1.55,.4,0],shR:[-1.2,0,.4],elR:[-1.55,-.4,0],hipL:[0,0,.12],knL:[.05,0,0],hipR:[0,0,-.12],knR:[.05,0,0]},
 powerup:{torso:[-.3,0,0],head:[-.65,0,0],shL:[.25,0,.55],elL:[-1.3,0,0],wrL:[.4,0,0],shR:[.25,0,-.55],elR:[-1.3,0,0],wrR:[.4,0,0],hipL:[0,0,.42],knL:[.45,0,0],hipR:[0,0,-.42],knR:[.45,0,0]},
 knuckles:{torso:[.15,0,0],head:[.05,0,0],shL:[-1.1,0,-.3],elL:[-1.5,0,0],wrL:[-.6,0,0],shR:[-1.1,0,.3],elR:[-1.5,0,0],wrR:[-.6,0,0],hipL:[-.1,0,.1],knL:[.2,0,0],hipR:[0,0,-.1],knR:[.2,0,0]},
 point:{torso:[0,.3,0],head:[-.1,-.3,0],shL:[-.3,0,.3],elL:[-.5,0,0],shR:[-1.57,0,-.05],elR:[0,0,0],wrR:[0,0,0],hipL:[-.2,0,.1],knL:[.2,0,0],hipR:[.1,0,-.1],knR:[.2,0,0]},
 lift:{torso:[-.1,.25,0],head:[-.25,-.2,0],shL:[-.5,0,.3],elL:[-1.4,0,0],shR:[-2.4,0,-.15],elR:[-.25,0,0],wrR:[-1.2,0,0],hipL:[-.25,0,.1],knL:[.3,0,0],hipR:[.15,0,-.1],knR:[.25,0,0]},
 wave:{torso:[0,0,.08],head:[-.15,0,-.1],shL:[-.2,0,.2],elL:[-.3,0,0],shR:[-2.7,0,-.35],elR:[-.7,0,0],wrR:[0,0,.4],hipL:[0,0,.1],knL:[.1,0,0],hipR:[0,0,-.1],knR:[.1,0,0]},
 waveB:{torso:[0,0,-.05],head:[-.15,0,.1],shL:[-.2,0,.2],elL:[-.3,0,0],shR:[-2.7,0,-.85],elR:[-.5,0,0],wrR:[0,0,-.4],hipL:[0,0,.1],knL:[.1,0,0],hipR:[0,0,-.1],knR:[.1,0,0]},
 bow:{torso:[1.0,0,0],head:[.25,0,0],shL:[-.1,0,.1],elL:[-.2,0,0],shR:[-.1,0,-.1],elR:[-.2,0,0],hipL:[0,0,.05],knL:[0,0,0],hipR:[0,0,-.05],knR:[0,0,0]},
 sit:{torso:[.1,0,0],head:[-.1,0,0],shL:[-.6,0,.25],elL:[-1.2,0,0],shR:[-.6,0,-.25],elR:[-1.2,0,0],hipL:[-1.55,0,.25],knL:[1.6,0,0],anL:[-.4,0,0],hipR:[-1.55,0,-.25],knR:[1.6,0,0],anR:[-.4,0,0]},
 eat:{torso:[.15,0,0],head:[.05,0,0],shL:[-1.2,0,.25],elL:[-1.6,0,0],shR:[-1.75,0,-.25],elR:[-2.35,0,0],wrR:[-.8,0,0],hipL:[-1.55,0,.25],knL:[1.6,0,0],anL:[-.4,0,0],hipR:[-1.55,0,-.25],knR:[1.6,0,0],anR:[-.4,0,0]},
 eatB:{torso:[.25,0,0],head:[.15,0,0],shL:[-1.2,0,.25],elL:[-1.6,0,0],shR:[-1.2,0,-.2],elR:[-1.4,0,0],wrR:[-.3,0,0],hipL:[-1.55,0,.25],knL:[1.6,0,0],anL:[-.4,0,0],hipR:[-1.55,0,-.25],knR:[1.6,0,0],anR:[-.4,0,0]},
 /* danza de la fusión: «¡Fuuu…!» (A) «…sión…» (B) «¡Ha!» (C). Los que bailan a la derecha usan la versión espejo (…M) */
 fuseA:{hips:[0,0,0],torso:[0,0,.25],head:[0,0,-.2],shL:[-.1,0,1.5],elL:[0,0,0],shR:[-1.3,0,1.05],elR:[-.2,0,0],hipL:[0,0,.15],knL:[.1,0,0],hipR:[-.2,0,-.55],knR:[.9,0,0],anR:[.5,0,0]},
 fuseB:{torso:[.15,0,-.3],head:[0,0,.2],shL:[-1.3,0,-1.05],elL:[-.2,0,0],shR:[-.1,0,-1.5],elR:[0,0,0],hipL:[-.6,0,.35],knL:[1.1,0,0],hipR:[-.5,0,-.2],knR:[1.0,0,0]},
 fuseC:{torso:[0,0,-.4],head:[0,0,.25],shL:[-.4,0,2.3],elL:[-.15,0,0],shR:[-.15,0,-1.2],elR:[0,0,0],wrR:[0,0,-.2],hipL:[0,0,.75],knL:[.1,0,0],anL:[.4,0,0],hipR:[0,0,-.12],knR:[.1,0,0]}});
POSES.fuseAM=mirrorPose(POSES.fuseA);POSES.fuseBM=mirrorPose(POSES.fuseB);POSES.fuseCM=mirrorPose(POSES.fuseC);POSES.stanceM=mirrorPose(POSES.stance);
