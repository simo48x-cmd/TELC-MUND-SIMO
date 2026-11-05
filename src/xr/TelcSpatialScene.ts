import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as xb from 'xrblocks';
import { TEIL2_EXAMS, build6RoundsForExam } from '../data/teil2Data';
import { sfx, speakGermanText } from '../services/audioAndAiService';

export class TelcSpatialScene extends xb.Script {
  private arenaGroup = new THREE.Group();
  private ballMesh!: THREE.Mesh;
  private leftPaddle!: THREE.Group;
  private rightPaddle!: THREE.Group;
  private prueferHead!: THREE.Mesh;
  private partnerHead!: THREE.Mesh;

  private activeExamId = 1;
  private activeRoundIdx = 0;
  private rallyPhase = 0;
  private rallySpeed = 2.4;
  private rallyBoostTimer = 0;

  private roundHeaderText?: xb.UIText;
  private roundGermanText?: xb.UIText;
  private roundSlotBadgeText?: xb.UIText;
  private spatialCard?: xb.UICard;

  private materialsToDispose: THREE.Material[] = [];
  private geometriesToDispose: THREE.BufferGeometry[] = [];

  public init(): void {
    this.setupLightingAndEnvironment();
    this.buildPingPongExamArena();
    this.buildSpatialUiCard();
    this.syncExamTopic(this.activeExamId, 0);
  }

  private setupLightingAndEnvironment(): void {
    const renderer = xb.core?.renderer;
    if (renderer instanceof THREE.WebGLRenderer) {
      const gl = renderer.getContext();
      const dbg = gl?.getExtension('WEBGL_debug_renderer_info');
      const unmasked = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      const isSoftwareGl = /SwiftShader|llvmpipe|softpipe/i.test(unmasked);

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      if (isSoftwareGl) {
        renderer.setPixelRatio(1);
        renderer.shadowMap.enabled = false;
      } else {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        try {
          const pmrem = new THREE.PMREMGenerator(renderer);
          const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
          if (xb.core.scene) {
            xb.core.scene.environment = envTex;
          }
          pmrem.dispose();
        } catch {
          // ignore if environment map fails
        }
      }
    }

    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x1e293b, 2.2);
    hemiLight.position.set(0, 3, 0);
    this.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.5);
    keyLight.position.set(1.8, 3.5, 1.5);
    this.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-2.0, 2.2, -2.5);
    this.add(rimLight);
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometriesToDispose.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materialsToDispose.push(mat);
    return mat;
  }

  private buildPingPongExamArena(): void {
    this.arenaGroup.name = 'TELC_PingPong_Arena';
    this.arenaGroup.position.set(0, 0.82, -1.55);
    this.add(this.arenaGroup);

    // 1. Table Top (Emerald Championship Table)
    const tableTopGeo = this.trackGeo(new THREE.BoxGeometry(1.5, 0.04, 0.85));
    const tableTopMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x065f46,
        roughness: 0.35,
        metalness: 0.1
      })
    );
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.xb = { pointerEvents: 'none' };
    this.arenaGroup.add(tableTop);

    // 2. Crisp White Center & Border Lines
    const centerLineGeo = this.trackGeo(new THREE.BoxGeometry(1.48, 0.042, 0.015));
    const whiteLineMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    const centerLine = new THREE.Mesh(centerLineGeo, whiteLineMat);
    centerLine.xb = { pointerEvents: 'none' };
    this.arenaGroup.add(centerLine);

    // 3. Center Net
    const netGeo = this.trackGeo(new THREE.BoxGeometry(0.015, 0.11, 0.87));
    const netMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        transparent: true,
        opacity: 0.75,
        roughness: 0.5
      })
    );
    const netMesh = new THREE.Mesh(netGeo, netMat);
    netMesh.position.set(0, 0.07, 0);
    netMesh.xb = { pointerEvents: 'none' };
    this.arenaGroup.add(netMesh);

    // 4. Four Table Legs
    const legGeo = this.trackGeo(new THREE.CylinderGeometry(0.025, 0.02, 0.78, 12));
    const legMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 })
    );
    const legCoords = [
      [-0.65, -0.4, -0.35],
      [0.65, -0.4, -0.35],
      [-0.65, -0.4, 0.35],
      [0.65, -0.4, 0.35]
    ];
    for (const [lx, ly, lz] of legCoords) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      leg.xb = { pointerEvents: 'none' };
      this.arenaGroup.add(leg);
    }

    // 5. Left Paddle (Mohammed - Emerald/Gold) & Right Paddle (Partner - Indigo)
    this.leftPaddle = this.createPaddle(0x10b981);
    this.leftPaddle.position.set(-0.68, 0.16, 0.12);
    this.arenaGroup.add(this.leftPaddle);

    this.rightPaddle = this.createPaddle(0x6366f1);
    this.rightPaddle.position.set(0.68, 0.16, -0.12);
    this.arenaGroup.add(this.rightPaddle);

    // 6. Golden "Verb-am-Ende" Ping-Pong Ball
    const ballGeo = this.trackGeo(new THREE.SphereGeometry(0.032, 24, 24));
    const ballMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.3
      })
    );
    this.ballMesh = new THREE.Mesh(ballGeo, ballMat);
    this.ballMesh.position.set(0, 0.22, 0);
    this.ballMesh.name = 'PingPongBall';
    this.arenaGroup.add(this.ballMesh);

    // 7. Stylized Prüfer (Examiner) & Partner Busts behind the table
    const torsoGeo = this.trackGeo(new THREE.CapsuleGeometry(0.11, 0.22, 8, 16));
    const headGeo = this.trackGeo(new THREE.SphereGeometry(0.085, 20, 20));

    const prueferMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
    );
    const partnerMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.4 })
    );
    const skinMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.5 })
    );

    const prueferGroup = new THREE.Group();
    prueferGroup.position.set(0, 0.25, -0.68);
    const prueferTorso = new THREE.Mesh(torsoGeo, prueferMat);
    this.prueferHead = new THREE.Mesh(headGeo, skinMat);
    this.prueferHead.position.y = 0.26;
    prueferGroup.add(prueferTorso, this.prueferHead);
    this.arenaGroup.add(prueferGroup);

    const partnerGroup = new THREE.Group();
    partnerGroup.position.set(0.88, 0.18, 0);
    const partnerTorso = new THREE.Mesh(torsoGeo, partnerMat);
    this.partnerHead = new THREE.Mesh(headGeo, skinMat);
    this.partnerHead.position.y = 0.26;
    partnerGroup.add(partnerTorso, this.partnerHead);
    this.arenaGroup.add(partnerGroup);
  }

  private createPaddle(bladeColor: number): THREE.Group {
    const group = new THREE.Group();
    const bladeGeo = this.trackGeo(new THREE.CylinderGeometry(0.085, 0.085, 0.014, 24));
    const bladeMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: bladeColor, roughness: 0.3, metalness: 0.2 })
    );
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.rotation.x = Math.PI / 2;

    const handleGeo = this.trackGeo(new THREE.CylinderGeometry(0.014, 0.018, 0.09, 12));
    const handleMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
    );
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = -0.1;

    group.add(blade, handle);
    group.xb = { pointerEvents: 'none' };
    return group;
  }

  private buildSpatialUiCard(): void {
    try {
      this.roundHeaderText = new xb.UIText({
        text: 'TELC B2 Ping-Pong Spatial Trainer — Thema #1',
        style: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#34d399' }
      });

      this.roundGermanText = new xb.UIText({
        text: 'Der Text befasst sich mit dem Thema „Fast Food“.',
        style: { fontSize: 17, lineHeight: 1.35, textAlign: 'center', color: '#ffffff' }
      });

      this.roundSlotBadgeText = new xb.UIText({
        text: '🎯 SLOT: dass Fast Food sehr schnell geht und im Alltag viel Zeit spart.',
        style: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#fbbf24' }
      });

      const prevBtn = new xb.UIButton({
        label: '◀ Vorherige Runde',
        style: { flexGrow: 1 },
        onClick: () => {
          this.stepRound(-1);
        }
      });

      const speakBtn = new xb.UIButton({
        label: '🔊 Vorlesen (DE)',
        style: { flexGrow: 1 },
        onClick: () => {
          this.speakCurrentRound();
        }
      });

      const nextBtn = new xb.UIButton({
        label: 'Nächste Runde ▶',
        style: { flexGrow: 1 },
        onClick: () => {
          this.stepRound(1);
        }
      });

      this.spatialCard = new xb.UICard({
        size: { width: 0.82, height: 'auto' },
        manipulation: true,
        edge: true,
        style: {
          flexDirection: 'column',
          gap: 12,
          padding: 18,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          borderRadius: 18
        },
        children: [
          this.roundHeaderText,
          this.roundGermanText,
          this.roundSlotBadgeText,
          new xb.UIPanel({
            style: { width: '100%', flexDirection: 'row', gap: 10 },
            children: [prevBtn, speakBtn, nextBtn]
          })
        ]
      });

      this.spatialCard.position.set(0, 1.52, -1.45);
      this.add(this.spatialCard);
    } catch {
      // Fallback if WebXR UI context is not yet initialized
    }
  }

  public syncExamTopic(examId: number, roundIdx = 0): void {
    this.activeExamId = examId;
    const exam = TEIL2_EXAMS.find((e) => e.id === examId) || TEIL2_EXAMS[0];
    const rounds = build6RoundsForExam(exam);
    this.activeRoundIdx = ((roundIdx % rounds.length) + rounds.length) % rounds.length;
    const round = rounds[this.activeRoundIdx];

    if (this.roundHeaderText) {
      this.roundHeaderText.text = `${exam.titleDe} • ${round.titleDe}`;
    }
    if (this.roundGermanText) {
      this.roundGermanText.text = `${round.fixedTemplateBefore}${round.slotContent}${round.fixedTemplateAfter || ''}`;
    }
    if (this.roundSlotBadgeText) {
      this.roundSlotBadgeText.text = `🎯 SLOT (${round.speaker}): ${round.slotContent} ${round.slot2Content ? '+ ' + round.slot2Content : ''}`;
    }

    this.triggerRallyPulse();
  }

  public stepRound(delta: number): void {
    this.syncExamTopic(this.activeExamId, this.activeRoundIdx + delta);
    sfx.playPingPongHit();
  }

  public speakCurrentRound(): void {
    const exam = TEIL2_EXAMS.find((e) => e.id === this.activeExamId) || TEIL2_EXAMS[0];
    const rounds = build6RoundsForExam(exam);
    const round = rounds[this.activeRoundIdx];
    const fullSentence = round.slot2Content
      ? `${round.fixedTemplateBefore}${round.slotContent}${round.fixedTemplateMiddle}${round.slot2Content}${round.fixedTemplateAfter}`
      : `${round.fixedTemplateBefore}${round.slotContent}${round.fixedTemplateAfter}`;
    speakGermanText(fullSentence, 1.0);
  }

  public triggerRallyPulse(): void {
    this.rallyBoostTimer = 1.2;
  }

  public update(): void {
    const dt = typeof xb.getDeltaTime === 'function' ? xb.getDeltaTime() : 0.016;
    const speedMultiplier = this.rallyBoostTimer > 0 ? 2.2 : 1.0;
    if (this.rallyBoostTimer > 0) {
      this.rallyBoostTimer = Math.max(0, this.rallyBoostTimer - dt);
    }

    this.rallyPhase += dt * this.rallySpeed * speedMultiplier;

    if (this.ballMesh) {
      const x = Math.sin(this.rallyPhase) * 0.62;
      const bounce = Math.abs(Math.cos(this.rallyPhase * 2)) * 0.22 + 0.055;
      const z = Math.cos(this.rallyPhase) * 0.12;
      this.ballMesh.position.set(x, bounce, z);
    }

    if (this.leftPaddle && this.rightPaddle) {
      this.leftPaddle.position.y = 0.16 + Math.max(0, -Math.sin(this.rallyPhase)) * 0.08;
      this.leftPaddle.rotation.z = Math.sin(this.rallyPhase) * 0.25;

      this.rightPaddle.position.y = 0.16 + Math.max(0, Math.sin(this.rallyPhase)) * 0.08;
      this.rightPaddle.rotation.z = -Math.sin(this.rallyPhase) * 0.25;
    }

    if (this.prueferHead && this.ballMesh) {
      this.prueferHead.rotation.y = this.ballMesh.position.x * 0.45;
    }
    if (this.partnerHead) {
      this.partnerHead.position.y = 0.26 + Math.sin(this.rallyPhase * 1.5) * 0.015;
    }
  }

  public dispose(): void {
    for (const geo of this.geometriesToDispose) {
      geo.dispose();
    }
    for (const mat of this.materialsToDispose) {
      mat.dispose();
    }
  }
}
