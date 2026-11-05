import { CEFRLevel, CertificationExam, StudyDayPlan } from '../types';

export interface PhoneticRule {
  id: string;
  symbol: string;
  titleDe: string;
  ruleDarija: string;
  examples: { word: string; phoneticAr: string; meaningDarija: string; sentenceDe: string }[];
}

export const PHONETICS_RULES_A1: PhoneticRule[] = [
  {
    id: 'ch-soft-hard',
    symbol: 'ch (ich vs. ach)',
    titleDe: 'Weiches „ch“ (nach i, e, ä, ö, ü, ei, eu) vs. Hartes „ch“ (nach a, o, u, au)',
    ruleDarija: 'الـ ch عندها جوج نطقات: خفيفة بحال "ش" منفسة مورا الحروف الرقيقة (ich, sprechen)، وقاصحة بحال "خ" المغربية مورا a, o, u, au (machen, auch, Buch).',
    examples: [
      { word: 'Ich spreche', phoneticAr: 'إيشْ شْبْغِيشِه', meaningDarija: 'أنا كنهضر', sentenceDe: 'Ich spreche jeden Tag Deutsch.' },
      { word: 'wichtig & richtig', phoneticAr: 'فِيشْتِيشْ أُونْد غِيشْتِيشْ', meaningDarija: 'مهم وصحيح', sentenceDe: 'Das Thema ist sehr wichtig.' },
      { word: 'machen & auch', phoneticAr: 'مَاخْن أُونْد آوْخ', meaningDarija: 'يدير / وكذلك', sentenceDe: 'Wir machen das auch zusammen.' }
    ]
  },
  {
    id: 'sch-sp-st',
    symbol: 'sch / sp- / st-',
    titleDe: 'Zischlaute am Wortanfang (sch, sp, st)',
    ruleDarija: 'ملي كتجي sp أو st ف أول الكلمة، ديما كتنطق "شْبـ" و "شْتـ" ماشي "سبـ"! هادي كتعرف بيها الممتحن واش نطقك نقي.',
    examples: [
      { word: 'Sport & spielen', phoneticAr: 'شْبُوغْت أُونْد شْبِيلْن', meaningDarija: 'الرياضة واللعب', sentenceDe: 'In meiner Freizeit treibe ich viel Sport.' },
      { word: 'Studium & Stadt', phoneticAr: 'شْتُودْيُوم أُونْد شْتَات', meaningDarija: 'الدراسة الجامعية والمدينة', sentenceDe: 'Nach meinem Studium der Wirtschaft in meiner Stadt Fès...' },
      { word: 'entscheiden', phoneticAr: 'إِنْتْشَايْدْن', meaningDarija: 'يقرر', sentenceDe: 'Jeder Mensch muss selbst entscheiden.' }
    ]
  },
  {
    id: 'umlaute',
    symbol: 'ä / ö / ü',
    titleDe: 'Die deutschen Umlaute (ä, ö, ü)',
    ruleDarija: 'ä كتنطق بحال "إي" مفتوحة، ö ضم شفايفك بحال غتقول "أو" وقول "إي"، و ü ضم شفايفك بحال كتصفّر وقول "إي" (مهمة بزاف ف für و über و müssen).',
    examples: [
      { word: 'für & über', phoneticAr: 'فِيوغ أُونْد إِيوبَا', meaningDarija: 'من أجل / حول', sentenceDe: 'Wir sprechen heute über ein wichtiges Thema.' },
      { word: 'Lösung & möglich', phoneticAr: 'لُوزُونْغ أُونْد مُوغْلِيشْ', meaningDarija: 'الحل / ممكن', sentenceDe: 'Wir suchen gemeinsam eine gute Lösung.' },
      { word: 'Städte & Länder', phoneticAr: 'شْتِيتِه أُونْد لِينْدَا', meaningDarija: 'المدن والبلدان', sentenceDe: 'Viele Städte in Marokko sind wunderschön.' }
    ]
  },
  {
    id: 'diphthonge',
    symbol: 'ei / ie / eu / äu',
    titleDe: 'Vokalkombinationen (ei = آي | ie = إيي طويلة | eu/äu = أوي)',
    ruleDarija: 'رد البال تقلب ei مع ie! كلمة mein ولا Reise فيها ei كتنطق "آي"، أما كلمة sieben ولاstudieren فيها ie كتنطق "إيي" مجبدة، و eu/äu كتنطق "أُوي".',
    examples: [
      { word: 'eine Reise & meine Meinung', phoneticAr: 'آيْنِه غَايْزِه / مَايْنِه مَايْنُونْغ', meaningDarija: 'رحلة / رأيي الشخصي', sentenceDe: 'Meiner Meinung nach war das eine tolle Reise.' },
      { word: 'viele Vorteile', phoneticAr: 'فِيلِه فُوغْتَايْلِه', meaningDarija: 'بزاف ديال الإيجابيات', sentenceDe: 'Dieses Thema hat viele Vorteile.' },
      { word: 'heute & Leute & Häuser', phoneticAr: 'هُويْتِه / لُويْتِه / هُويْزَا', meaningDarija: 'اليوم / الناس / الديور', sentenceDe: 'Heute nutzen viele Leute das Internet.' }
    ]
  },
  {
    id: 'endungen',
    symbol: '-ig / -lich / -ung / -tion',
    titleDe: 'Wichtige B2-Endungen (-ig, -lich, -ung, -tion)',
    ruleDarija: 'ف آخر الكلمة -ig و -lich كيتنطقو "إيشْ"، و -ung كتنطق "أُونْغ" خفيفة، و -tion كتنطق "تْسْيُون".',
    examples: [
      { word: 'wichtig & günstig & mutig', phoneticAr: 'فِيشْتِيشْ / غِوينْسْتِيشْ', meaningDarija: 'مهم / رخيص / شجاع', sentenceDe: 'Das Angebot ist sehr günstig.' },
      { word: 'Meinung & Erfahrung &Verpflegung', phoneticAr: 'مَايْنُونْغ / إِغْفَاغُونْغ', meaningDarija: 'رأي / تجربة / تموين', sentenceDe: 'Aus meiner persönlichen Erfahrung...' },
      { word: 'Information & Situation & Präsentation', phoneticAr: 'إِنْفُوغْمَاتْسْيُون', meaningDarija: 'معلومة / وضعية / عرض', sentenceDe: 'Welche Informationen hast du noch gefunden?' }
    ]
  }
];

export const VERB_KICK_EXAMPLES_A2 = [
  {
    id: 'vk-1',
    topic: 'Fast Food (#1)',
    mainClauseA1: 'Fast Food spart im Alltag viel Zeit.',
    connector: 'Zuerst wird beschrieben, dass',
    subClauseB2: 'Fast Food im Alltag viel Zeit',
    kickedVerb: 'spart',
    darijaRule: 'الفعل "spart" كان ف المرتبة 2 ف جملة A1، ولكن ملي دخلات "dass" ركلناه لآخر الجملة!'
  },
  {
    id: 'vk-2',
    topic: 'Homeoffice (#34)',
    mainClauseA1: 'Man spart jeden Tag den langen Arbeitsweg.',
    connector: 'Ein großer Vorteil ist, dass',
    subClauseB2: 'man jeden Tag den langen Arbeitsweg',
    kickedVerb: 'spart',
    darijaRule: 'ديما مورا dass حط الفاعل (man) + المكملات + وفالأخير الفعل مصرف (spart).'
  },
  {
    id: 'vk-3',
    topic: 'Zweisprachigkeit (#18)',
    mainClauseA1: 'Viele Menschen sprechen in Marokko Arabisch und Französisch.',
    connector: 'In meiner Heimat Marokko ist es so, dass',
    subClauseB2: 'viele Menschen im Alltag Arabisch und Französisch',
    kickedVerb: 'sprechen',
    darijaRule: 'في الجملة ديال المغرب (Ronde 5)، ديما ختم بالفعل مصرف ف الجمع (sprechen / nutzen / arbeiten).'
  },
  {
    id: 'vk-4',
    topic: 'Rauchen (#4)',
    mainClauseA1: 'Rauchen verursacht gefährliche Krankheiten.',
    connector: 'Ein großer Nachteil ist jedoch, dass',
    subClauseB2: 'Rauchen sehr gefährliche Krankheiten',
    kickedVerb: 'verursacht',
    darijaRule: 'ف السلبية (Ronde 4)، الفعل "verursacht" (كيسبب) كيمشي نيشان للخر قبل النقطة.'
  }
];

export const LEVEL_PROGRESSION_META: Record<CEFRLevel, {
  level: CEFRLevel;
  titleDe: string;
  titleDarija: string;
  daysRange: string;
  badgeColor: string;
  bannerDarija: string;
  skillsUnlocked: string[];
}> = {
  'A0/A1': {
    level: 'A0/A1',
    titleDe: 'Niveau A0/A1: Aussprache, Satzkern & Selbstvorstellung',
    titleDarija: 'المستوى A0/A1: البداية، النطق الصحيح، وتقديم النفس (محمد الجبوري)',
    daysRange: 'الأيام 1 – 12',
    badgeColor: 'emerald',
    bannerDarija: 'أنت دابا فـ Niveau A0/A1: ركّز على النطق السليم، حفظ تقديم محمد الجبوري (فاس + الباك فيزيك + إجازة ف الاقتصاد)، ودوز امتحان A1 باش تطلع لـ A2!',
    skillsUnlocked: [
      'إتقان نطق ch, sch, sp/st, ä/ö/ü بلكنة ألمانية نقية',
      'تقديم محمد الجبوري (22 عام، فاس، إجازة اقتصاد) بلا تردد',
      'تركيب جمل بسيطة (Subjekt + Verb + Objekt) والضمير man',
      'حفظ 50 كلمة أساسية ديال مواضيع الامتحان'
    ]
  },
  'A2': {
    level: 'A2',
    titleDe: 'Niveau A2: Nebensätze (dass/weil), Perfekt & Direkte Fragen',
    titleDarija: 'المستوى A2: ركل الفعل للخر مع dass/weil، الماضي فـ السفر، والأسئلة المباشرة',
    daysRange: 'الأيام 13 – 28',
    badgeColor: 'sky',
    bannerDarija: 'أنت دابا وصلتي لـ Niveau A2 وكتهضر بيه مزيان! تعلم تركل الفعل للخر مع dass فـ الفراغات د البينغ بونغ ودوز امتحان B1!',
    skillsUnlocked: [
      'إتقان قاعدة "dass ... [Verb am Ende]" ف جميع الفراغات الـ 6 ديال Teil 2',
      'الحكي ف الماضي (Perfekt) على رحلة "Bin el Ouidane" بـ 7 أفعال أساسية',
      'طرح أسئلة مباشرة (W-Fragen & Ja/Nein) ف التخطيط ديال Teil 3',
      'فهم واستخراج الفكرة 1 والفكرة 2 من ورقة الامتحان'
    ]
  },
  'B1': {
    level: 'B1',
    titleDe: 'Niveau B1: 6-Runden Ping-Pong, Indirekte Fragen & Konjunktiv II',
    titleDarija: 'المستوى B1: إتقان منهجية البينغ بونغ الكاملة، الأسئلة غير المباشرة والاقتراح اللبق',
    daysRange: 'الأيام 29 – 45',
    badgeColor: 'indigo',
    bannerDarija: 'تبارك الله عليك يا محمد! راك فـ Niveau B1 ووليتي كتلعب 6 د الجولات د البينغ بونغ بطلاقة. دوز امتحان B2 باش توصل للقمة!',
    skillsUnlocked: [
      'لعب الـ 6 جولات ديال Teil 2 كاملة بلا ما تشوف فالورقة ف 25 موضوع',
      'تحويل الأسئلة العادية لـ Indirekte Fragen (Ich möchte wissen, wann/ob...)',
      'استعمال Konjunktiv II للاقتراح الراقي (Wir könnten / Es wäre sinnvoll)',
      'تطبيق خطة 20% قلب الموضوع + 80% الجوكرات ف Teil 3'
    ]
  },
  'B2': {
    level: 'B2',
    titleDe: 'Niveau B2: TELC Vollpunktzahl (60/60), Partner-Rettung & Wirtschaft-Karriere',
    titleDarija: 'المستوى B2 الاحترافي: ضمان 60/60 فـ TELC، إنقاذ البارتنر، والنجاح فـ مقابلة العمل فـ ألمانيا',
    daysRange: 'الأيام 46 – 60',
    badgeColor: 'amber',
    bannerDarija: '🏆 مبروك يا محمد! راك فـ قمة Niveau B2! واجد 100% تجيب 60/60 فـ TELC B2 وتنجح فـ Vorstellungsgespräch بشهادة الاقتصاد ديالك!',
    skillsUnlocked: [
      'إتقان جميع الـ 46 امتحان ديال Teil 2 والـ 48 موضوع ديال Teil 3',
      'تقنية "الأوكسجين" (Partner Rescue) لإنقاذ البارتنر المبلوكي وكسب نقاط إضافية',
      'إتقان الـ 12 سؤال وجواب ديال مقابلة العمل (Vorstellungsgespräch Wirtschaft)',
      'سرعة البديهة والارتجال بالجوكر السحري فـ الجولة 6'
    ]
  }
};

export const LEVEL_CERTIFICATION_EXAMS: CertificationExam[] = [
  {
    id: 'cert-a1-to-a2',
    fromLevel: 'A0/A1',
    toLevel: 'A2',
    titleDe: 'Stufenprüfung 1: Aufstieg von A0/A1 zu Niveau A2',
    titleDarija: 'الامتحان الإشهادي الأول: الانتقال من A0/A1 إلى المستوى A2',
    passingScore: 80,
    certificateBadgeDarija: '🎖️ مبروك يا محمد! راك دابا وصلتي لـ Niveau A1 وكتهضر بيه مزيان 100%! دابا تفتح ليك المستوى الثاني: Niveau A2!',
    questions: [
      {
        id: 'q1-a1',
        promptDe: 'Wie stellt sich Mohammed El Jebouri in Teil 1 korrekt mit Alter, Herkunft und Studium vor?',
        promptDarija: 'كيفاش محمد الجبوري كيقدم راسو فـ البديه بسنو، مدينتو فاس، وشهادتو فـ الاقتصاد؟',
        options: [
          'Ich heiße Mohammed El Jebouri, bin 22 Jahre alt, komme aus Fès in Marokko und habe einen Bachelor in Wirtschaft.',
          'Mein Name Mohammed, habe 22 Jahre von Fès und studieren Wirtschaft.',
          'Ich bin Mohammed aus Fès, 22 Alter, Bachelor Physik.',
          'Heiße Mohammed El Jebouri, kommen aus Marokko 22 Jahre.'
        ],
        correctIndex: 0,
        explanationDarija: 'في الألمانية كنقولو "Ich bin 22 Jahre alt" (ماشي Ich habe) و "habe einen Bachelor in Wirtschaft".'
      },
      {
        id: 'q2-a1',
        promptDe: 'Wie spricht man „Sport“, „Studium“ und „sprechen“ am Wortanfang richtig aus?',
        promptDarija: 'كيفاش كيتنطقو الكلمات لي كيبداو بـ sp و st بحال Sport و Studium و sprechen؟',
        options: [
          'Mit „schp“ und „scht“ (شْبُوغْت / شْتُودْيُوم / شْبْغِيشْن)',
          'Mit „sp“ und „st“ wie im Französischen (سْبُوغْت / سْتُودْيُوم)',
          'Mit „ch“ wie in Buch (خْبُوغْت)',
          'Ohne das „s“ am Anfang'
        ],
        correctIndex: 0,
        explanationDarija: 'كل كلمة ألمانية كتبدا بـ sp أو st كتنطق ديما "شْبـ" و "شْتـ".'
      },
      {
        id: 'q3-a1',
        promptDe: 'Welchen Satz nutzt Mohammed für sein Abitur in Teil 1?',
        promptDarija: 'أشنو هي الجملة الصحيحة باش تقول خديت الباك ف الفيزيك والشيمي؟',
        options: [
          'Ich habe mein Abitur mit dem Schwerpunkt Physik und Chemie gemacht.',
          'Ich mache Abitur in Physik und Chemie morgen.',
          'Meine Abitur war Physik mit Chemie haben.',
          'Ich bin Abitur Schwerpunkt Physik.'
        ],
        correctIndex: 0,
        explanationDarija: 'الجملة الذهبية هي: Ich habe mein Abitur mit dem Schwerpunkt Physik und Chemie gemacht.'
      },
      {
        id: 'q4-a1',
        promptDe: 'Wie lautet der feste erste Satz von Ronde 1 in Teil 2?',
        promptDarija: 'أشنو هي أول جملة فـ الجولة 1 ديال البينغ بونغ باش تقدم اسم الموضوع؟',
        options: [
          'Der Text befasst sich mit dem Thema „...“.',
          'Die Text sprechen mit Thema „...“.',
          'In der Text haben wir Thema „...“.',
          'Thema von Text heißt „...“.'
        ],
        correctIndex: 0,
        explanationDarija: 'العبارة الثابتة ديال B2 هي: Der Text befasst sich mit dem Thema „...“.'
      },
      {
        id: 'q5-a1',
        promptDe: 'Welches Pronomen nutzt man im Deutschen für allgemeine Aussagen („الواحد / الإنسان بصفة عامة“)?',
        promptDarija: 'أشنو هو الضمير لي كنستعملوه ملي كنبغيو نهضرو بصفة عامة ("الواحد يقدر...")؟',
        options: [
          'man (z.B. man spart viel Zeit)',
          'Mann (der Mann)',
          'er',
          'wir immer'
        ],
        correctIndex: 0,
        explanationDarija: 'الضمير "man" بحرف صغير وكيتصرف معاه الفعل بحال er/sie/es (man spart, man kann).'
      }
    ]
  },
  {
    id: 'cert-a2-to-b1',
    fromLevel: 'A2',
    toLevel: 'B1',
    titleDe: 'Stufenprüfung 2: Aufstieg von A2 zu Niveau B1',
    titleDarija: 'الامتحان الإشهادي الثاني: الانتقال من A2 إلى المستوى B1',
    passingScore: 80,
    certificateBadgeDarija: '🎖️ تبارك الله عليك يا محمد! راك دابا طيرتي فـ Niveau A2 (ركل الفعل للخر والماضي Perfekt)! دابا تفتح ليك المستوى الثالث: Niveau B1!',
    questions: [
      {
        id: 'q1-a2',
        promptDe: 'Wohin wandert das konjugierte Verb nach „dass“ oder „weil“ in allen 6 Ping-Pong-Slots?',
        promptDarija: 'فين كيمشي الفعل المصرف ملي كندخلو عليه dass أو weil فـ الفراغات ديال البينغ بونغ؟',
        options: [
          'Ganz ans Ende des Nebensatzes (Verb am Ende)',
          'Direkt hinter „dass“ auf Position 2',
          'Vor das Subjekt an den Anfang',
          'Das Verb fällt komplett weg'
        ],
        correctIndex: 0,
        explanationDarija: 'القاعدة الذهبية رقم 1 فـ المنهجية ديالك: مورا dass ديما الفعل المصرف كيمشي لآخر الجملة قبل النقطة!'
      },
      {
        id: 'q2-a2',
        promptDe: 'Wähle den grammatikalisch richtigen Slot für Thema #1 (Fast Food): „Ein großer Vorteil ist, dass ...“',
        promptDarija: 'اختار التكملة الصحيحة نحوياً للفراغ رقم 4 ديال Fast Food:',
        options: [
          '... Fast Food sehr schnell geht, günstig ist und im Alltag viel Zeit spart.',
          '... Fast Food geht sehr schnell und spart viel Zeit im Alltag.',
          '... spart Fast Food viel Zeit und ist günstig.',
          '... Fast Food viel Zeit sparen im Alltag.'
        ],
        correctIndex: 0,
        explanationDarija: 'تبارك الله! الأفعال المصرفة (geht, ist, spart) كلها مشات للخر ديال كل شطر مورا dass.'
      },
      {
        id: 'q3-a2',
        promptDe: 'Wie erzählt Mohammed im Perfekt richtig von seiner Reise nach Bin el Ouidane (Teil 1)?',
        promptDarija: 'أشنو هي الجملة الصحيحة فـ الماضي (Perfekt) على رحلة بين الويدان؟',
        options: [
          'Letzten Sommer bin ich mit fünf Freunden nach Bin el Ouidane gereist und wir haben ein Haus gemietet.',
          'Letzten Sommer ich habe gereist nach Bin el Ouidane und mieten ein Haus.',
          'Letzten Sommer bin ich reisen und haben gemietet Haus.',
          'Ich war gereist und wir sind gemietet ein Haus.'
        ],
        correctIndex: 0,
        explanationDarija: 'أفعال الحركة بحال reisen/fahren كياخدو sein (bin gereist)، وأفعال بحال mieten/schlafen كياخدو haben (haben gemietet).'
      },
      {
        id: 'q4-a2',
        promptDe: 'Welche Frage stellst du deinem Partner am Ende von Ronde 1, um den Ping-Pong-Ball weiterzugeben?',
        promptDarija: 'أشنو هو السؤال لي كتسول صاحبك فـ آخر الجولة 1 باش دوز ليه النوبة؟',
        options: [
          'Welche Informationen hast du noch gefunden?',
          'Warum sprichst du nicht?',
          'Hast du den Text gelesen oder nein?',
          'Was machen wir am Samstag?'
        ],
        correctIndex: 0,
        explanationDarija: 'هاد السؤال كيخلي الحوار يبان طبيعي 100% وكيعطي الإشارة لصاحبك يبدا الجولة 2.'
      },
      {
        id: 'q5-a2',
        promptDe: 'Welcher Satz leitet in Ronde 5 den Vergleich mit deiner Heimat Marokko ein?',
        promptDarija: 'أشنو هي العبارة الثابتة فـ الجولة 5 باش تربط الموضوع بالمغرب؟',
        options: [
          'In meiner Heimat Marokko ist es so, dass ...',
          'Marokko haben auch dieses Thema, weil ...',
          'Bei uns in Fès machen Leute dass ...',
          'Ich denke Marokko ist gut mit ...'
        ],
        correctIndex: 0,
        explanationDarija: 'العبارة الرسمية فـ منهجيتك هي: In meiner Heimat Marokko ist es so, dass ...'
      }
    ]
  },
  {
    id: 'cert-b1-to-b2',
    fromLevel: 'B1',
    toLevel: 'B2',
    titleDe: 'Stufenprüfung 3: Aufstieg von B1 zu Niveau B2 (Prüfungsreife)',
    titleDarija: 'الامتحان الإشهادي الثالث: الانتقال من B1 إلى المستوى B2 الاحترافي',
    passingScore: 80,
    certificateBadgeDarija: '🎖️ برافو يا محمد! راك دابا شديتي Niveau B1 بإتقان تام! دابا تفتح ليك المستوى الأعلى: Niveau B2 الاحترافي (الطريق إلى 60/60 والعمل فـ ألمانيا)!',
    questions: [
      {
        id: 'q1-b1',
        promptDe: 'Wie verwandelst du die A2-Frage „Wann machen wir das?“ in eine elegante B2-Indirekte Frage für Teil 3?',
        promptDarija: 'كيفاش كتحول السؤال البسيط "Wann machen wir das?" لسؤال غير مباشر راقي ديال B2؟',
        options: [
          'Ich möchte wissen, wann wir die Veranstaltung am besten organisieren sollten.',
          'Ich möchte wissen, wann machen wir die Veranstaltung?',
          'Kannst du sagen, wann sollten wir machen das?',
          'Wann wir machen das, ich frage dich.'
        ],
        correctIndex: 0,
        explanationDarija: 'فـ السؤال غير المباشر (Indirekte Frage)، الفعل المصرف (sollten) كيرجع لآخر الجملة!'
      },
      {
        id: 'q2-b1',
        promptDe: 'Was besagt Prof. Hichams 20% / 80% Regel für Teil 3 (Gemeinsam etwas planen)?',
        promptDarija: 'أشنو كتقول قاعدة الأستاذ هشام (20% / 80%) فـ التخطيط المشترك (Teil 3)؟',
        options: [
          'Die ersten 20% (2 Punkte) müssen direkt zum „Herz des Themas“ passen, die restlichen 80% sind universelle Planungs-Joker (Wann, Wo, Verpflegung, Werbung, Kosten).',
          'Man spricht 20% Deutsch und 80% Englisch.',
          'Man plant nur 20% der Aufgabe und schweigt 80% der Zeit.',
          'Man redet 80% über Teil 1 und 20% über Teil 3.'
        ],
        correctIndex: 0,
        explanationDarija: 'هاد القاعدة هي السر باش ما عمرك تحصل فـ أي موضوع من المواضيع الـ 48 ديال Teil 3!'
      },
      {
        id: 'q3-b1',
        promptDe: 'Wie lautet die feste Eröffnung (Dkhla) für Teil 3 beim Thema „ein Sportfest“?',
        promptDarija: 'أشنو هي الدخلة الثابتة ديال Teil 3 فـ موضوع تنظيم مهرجان رياضي؟',
        options: [
          'Wie du weißt, planen wir ja zusammen ein großes Sportfest. Hast du dir dazu schon ein paar Gedanken gemacht?',
          'Hallo, wir müssen heute Sportfest machen. Was willst du?',
          'Der Text befasst sich mit dem Thema Sportfest. Welche Informationen hast du?',
          'Letzten Sommer bin ich zum Sportfest gereist.'
        ],
        correctIndex: 0,
        explanationDarija: 'الدخلة الثابتة ديال Teil 3 هي: Wie du weißt, planen wir ja zusammen [Projekt]. Hast du dir dazu schon ein paar Gedanken gemacht?'
      },
      {
        id: 'q4-b1',
        promptDe: 'Welche Konjunktiv-II-Struktur bringt in Teil 3 die meisten Punkte für höfliche Vorschläge?',
        promptDarija: 'أشمن صيغة ديال Konjunktiv II كتعطيك أعلى النقط ملي كتبغي تقترح فكرة فـ Teil 3؟',
        options: [
          'Es wäre sehr sinnvoll, wenn wir ... / Ich würde vorschlagen, dass wir ...',
          'Wir machen jetzt das! Du musst das machen!',
          'Ich will machen Plakate.',
          'Machst du Essen und ich mache Musik.'
        ],
        correctIndex: 0,
        explanationDarija: 'الممتحنين ديال TELC B2 كيقيدو مباشرة علامة (+) ملي كيسمعوك كتستعمل "Es wäre sinnvoll, wenn..." و "Ich würde vorschlagen...".'
      },
      {
        id: 'q5-b1',
        promptDe: 'Was ist der „Universal-Joker“ für Ronde 6 in Teil 2, falls du die letzte Idee vergessen hast?',
        promptDarija: 'أشنو هو الجوكر العالمي ديال الجولة 6 فـ Teil 2 إلا نسيتي الفكرة الخاصة بالموضوع؟',
        options: [
          'Das klingt sehr interessant! Ich denke, dass jeder Mensch selbst entscheiden sollte, was für ihn am besten passt, solange man auf eine gesunde Balance im Alltag achtet.',
          'Ich habe keine Ahnung mehr, wir sind fertig.',
          'Wie du weißt, planen wir zusammen eine Party.',
          'Entschuldigung, ich habe den Text vergessen.'
        ],
        correctIndex: 0,
        explanationDarija: 'هاد الجوكر ديال الجولة 6 كيصلح حرفياً لـ 100% من المواضيع الـ 46 وكيسد الحوار بطريقة احترافية!'
      }
    ]
  },
  {
    id: 'cert-b2-master',
    fromLevel: 'B2',
    toLevel: 'B2',
    titleDe: 'TELC B2 Mündlich & Karriere Master-Zertifikat (60/60 Punkte)',
    titleDarija: 'الامتحان النهائي الكبير: شهادة إتقان TELC B2 (60/60) ومقابلة العمل فـ ألمانيا',
    passingScore: 80,
    certificateBadgeDarija: '🏆 ألف مبروك يا محمد الجبوري! حصلتي على شهادة الإتقان الكامل TELC B2 Master Pro (60/60) + جاهزية مقابلة العمل فـ ألمانيا!',
    questions: [
      {
        id: 'q1-b2',
        promptDe: 'Dein Partner schweigt in Teil 3 plötzlich und ist nervös (Blockade). Wie gibst du ihm professionell „Sauerstoff“?',
        promptDarija: 'صاحبك تبلوكا فـ وسط الامتحان وما بقى عارف ما يقول. كيفاش كتعطيه "الأوكسجين" وتربح نتا وياه النقط؟',
        options: [
          'Du stellst ihm eine einfache Auswahlfrage (A oder B): „Was hältst du eigentlich von der Verpflegung? Sollen wir ein Buffet machen oder lieber gemeinsam grillen?“',
          'Du sagst dem Prüfer: „Mein Partner kann kein Deutsch sprechen.“',
          'Du schweigst auch 2 Minuten lang.',
          'Du redest 4 Minuten ohne Punkt und Komma alleine weiter.'
        ],
        correctIndex: 0,
        explanationDarija: 'ملي كتعطي للبارتنر سؤال فيه جوج اختيارات ساهلين (A oder B)، كتفكو من البلوكاج والممتحن كيعطيك العلامة الكاملة فـ التفاعل!'
      },
      {
        id: 'q2-b2',
        promptDe: 'Wie verbindet Mohammed im Vorstellungsgespräch sein Abitur in Physik/Chemie mit seinem Bachelor in Wirtschaft?',
        promptDarija: 'كيفاش محمد كيربط فـ مقابلة العمل ما بين الباك فـ الفيزيك والشيمي والإجازة فـ الاقتصاد؟',
        options: [
          'Durch mein naturwissenschaftliches Abitur in Physik und Chemie habe ich gelernt, komplexe Probleme präzise zu analysieren, und im Wirtschaftsstudium habe ich dieses analytische Denken auf Finanzprozesse und Unternehmenssteuerung übertragen.',
          'Ich habe Physik vergessen und mag jetzt nur noch Geld.',
          'Physik und Wirtschaft haben überhaupt nichts miteinander zu tun.',
          'In Marokko musste ich das einfach so studieren.'
        ],
        correctIndex: 0,
        explanationDarija: 'هاد الجواب كيخلي أي مدير موارد بشرية (HR) فـ ألمانيا ينبهر بيك حيت كيجمع التفكير التحليلي العلمي مع الفهم الاقتصادي!'
      },
      {
        id: 'q3-b2',
        promptDe: 'Welche Struktur nutzt du in Ronde 3 von Teil 2, um deinem Partner zuzustimmen und zum Vorteil überzuleiten?',
        promptDarija: 'أشنو هي العبارة ديال الجولة 3 فـ Teil 2 باش توافق صاحبك وتدوز للإيجابيات؟',
        options: [
          'Das stimmt, das ist ein wichtiger Punkt. Meiner Meinung nach hat dieses Thema viele Vorteile. Ein großer Vorteil ist, dass ...',
          'Nein, das ist falsch. Jetzt sage ich den Vorteil: ...',
          'Im Text steht noch, dass ...',
          'In meiner Heimat Marokko ist es so, dass ...'
        ],
        correctIndex: 0,
        explanationDarija: 'الجولة 3 هي فين كتنتقل من الورقة للرأي الشخصي (Meiner Meinung nach...) وكتعطي الإيجابية.'
      },
      {
        id: 'q4-b2',
        promptDe: 'Was antwortet ein Prüfling auf B2-Niveau, wenn der Prüfer in Teil 1 nach der Reise nach Bin el Ouidane fragt: „Würden Sie diese Reise weiterempfehlen?“',
        promptDarija: 'بأش كتجاوب الممتحن فـ Teil 1 ملي كيسولك: واش تنصح الناس يمشيو لبين الويدان؟',
        options: [
          'Auf jeden Fall! Wer Ruhe sucht, die Natur liebt und gerne Wassersport treibt, für den ist Bin el Ouidane ein absolutes Traumziel in Marokko.',
          'Ja, ist gut.',
          'Vielleicht ja, vielleicht nein.',
          'Ich weiß nicht, ob die Leute Geld haben.'
        ],
        correctIndex: 0,
        explanationDarija: 'جواب غني ومقنع كيضمن ليك 15/15 فـ Teil 1!'
      },
      {
        id: 'q5-b2',
        promptDe: 'Wie schließt ihr Teil 3 (Khatima) beim Thema „Benefiz-Theaterstück (#37)“ perfekt ab?',
        promptDarija: 'كيفاش كتختمو Teil 3 بالخاتمة الثابتة فـ موضوع المسرحية الخيرية؟',
        options: [
          'Super, dann haben wir jetzt alle wichtigen Punkte besprochen und geplant. Ich bin mir sicher: Das wird ein richtig erfolgreiches Benefiz-Theaterstück!',
          'Okay, tschüss, wir gehen jetzt nach Hause.',
          'Wir haben keine Zeit mehr.',
          'Der Text über das Theaterstück war sehr schwer.'
        ],
        correctIndex: 0,
        explanationDarija: 'الخاتمة الثابتة كتجمع النقط كاملين وكتعطي انطباع احترافي للممتحنين!'
      }
    ]
  }
];

export const PLACEMENT_DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-1',
    levelTested: 'A0/A1' as CEFRLevel,
    questionDe: 'Kannst du dich auf Deutsch vorstellen (22 Jahre, Fès, Abitur Physik/Chemie, Bachelor Wirtschaft)?',
    questionDarija: 'واش كتقدر تقدم راسك بالألمانية بطلاقة وتنطق الحروف بحال ch و sch و ü بلا غلطة؟',
    options: [
      { label: 'مازال يلاه بادي، بغيت نبدا من الصفر والنطق (A0/A1)', score: 0 },
      { label: 'كنعرف نقدم راسي ونقرا الجمل البسيطة مزيان', score: 1 }
    ]
  },
  {
    id: 'diag-2',
    levelTested: 'A2' as CEFRLevel,
    questionDe: 'Setzt du nach „dass“ und „weil“ das konjugierte Verb automatisch ans Satzende?',
    questionDarija: 'واش ملي كتقول جملة فيها dass أو weil، كتركل الفعل المصرف لآخر الجملة أوتوماتيكياً؟',
    options: [
      { label: 'مرّة مرّة كننسى الفعل فـ الوسط، خاصني نتدرب عليها (A2)', score: 0 },
      { label: 'نعم، ديما كنحط الفعل المصرف فـ آخر الجملة وكنتقن الماضي Perfekt', score: 1 }
    ]
  },
  {
    id: 'diag-3',
    levelTested: 'B1' as CEFRLevel,
    questionDe: 'Beherrschst du das 6-Runden-Ping-Pong-Template und Indirekte Fragen?',
    questionDarija: 'واش حافظ الـ 6 جولات ديال البينغ بونغ وكتستعمل الأسئلة غير المباشرة و Konjunktiv II؟',
    options: [
      { label: 'باقي كنحفظ فـ القوالب ديال البينغ بونغ والـ 20 نقطة (B1)', score: 0 },
      { label: 'حافظ القوالب، دابا بغيت نضبط الـ 46 امتحان كاملين ومقابلة العمل (B2)', score: 1 }
    ]
  }
];

export const STUDY_PLAN_60_DAYS: StudyDayPlan[] = [
  // Phase 1: A0/A1 (Days 1-12)
  {
    day: 1,
    intenseDay45: 1,
    level: 'A0/A1',
    titleDe: 'Tag 1: Deutsche Phonetik (ch, sch, sp, st) & Selbstvorstellung Mohammed',
    titleDarija: 'اليوم 1: أسرار النطق الألماني + تقديم محمد الجبوري (السن، مدينة فاس، الباك، الإجازة)',
    pronunciationTask: 'تدرب 10 دقايق على نطق ch (ich spreche vs. machen) و sp/st (Sport, Studium, Stadt) بصوت عالي.',
    slotMemoryTask: 'احفظ الفقرة الأولى ديال تقديم محمد الجبوري (22 عام، من فاس، الباك فيزيك وشيمي، إجازة اقتصاد).',
    speakingSimTask: 'سجل صوتك كتقول تقديم محمد الجبوري 3 المرات بلا ما تشوف فالورقة.'
  },
  {
    day: 2,
    intenseDay45: 2,
    level: 'A0/A1',
    titleDe: 'Tag 2: Umlaute (ä, ö, ü) & Hobbys + Karriereziel Deutschland',
    titleDarija: 'اليوم 2: نطق الحروف بالـ Umlaut + الهوايات (الرياضة، الرسم، الألعاب) والهدف المهني',
    pronunciationTask: 'تدرب على نطق für, über, Lösung, möglich, Vorteile, Meinung.',
    slotMemoryTask: 'احفظ الكمالة ديال تقديم محمد (الهوايات: Sport, Zeichnen, Videospiele + حلم الخدمة فـ ألمانيا).',
    speakingSimTask: 'قول التقديم الكامل ديال محمد الجبوري فـ دقيقة وحدة بصوت واضح.'
  },
  {
    day: 3,
    intenseDay45: 3,
    level: 'A0/A1',
    titleDe: 'Tag 3: Satzbau-Kern & Das Pronomen „man“ + Teil 1 Reise-Einstieg',
    titleDarija: 'اليوم 3: تركيب الجملة البسيطة والضمير man + بداية قصة رحلة بين الويدان',
    pronunciationTask: 'نطق الكلمات المفتاحية ديال السفر: Stausee, Berge, Ferienhaus, Landschaft.',
    slotMemoryTask: 'احفظ المرحلة 1 ديال عرض Bin el Ouidane (Wohin, wann & mit wem?).',
    speakingSimTask: 'قدم راسك ودوز نيشان للمرحلة 1 ديال رحلة بين الويدان.'
  },
  {
    day: 4,
    intenseDay45: 4,
    level: 'A0/A1',
    titleDe: 'Tag 4: Teil 1 Bin el Ouidane — Unterkunft, Essen & Natur',
    titleDarija: 'اليوم 4: رحلة بين الويدان — فين باتنا، الفطور البلدي، والطبيعة',
    pronunciationTask: 'نطق Olivenöl, Minztee, wunderschön, beeindruckend, erholsam.',
    slotMemoryTask: 'احفظ المرحلة 2 والمرحلة 4 ديال عرض Bin el Ouidane (الدار المكرية، أتاي وزيت العود، والسبب علاش عجباتك).',
    speakingSimTask: 'عاود قصة السكن والطبيعة فـ بين الويدان بـ 6 جمل مترابطة.'
  },
  {
    day: 5,
    intenseDay45: 5,
    level: 'A0/A1',
    titleDe: 'Tag 5: Teil 1 Bin el Ouidane — Aktivitäten (Jetski, Bootstour, Grillen)',
    titleDarija: 'اليوم 5: أنشطة بين الويدان (الجيتسكي، الباطو، الشواية) + الأسئلة الـ 4 ديال الممتحن',
    pronunciationTask: 'نطق Wassersport, Bootsfahrt, gegrillt, weiterempfehlen.',
    slotMemoryTask: 'احفظ المرحلة 3 ديال العرض + الأجوبة على الـ 4 أسئلة ديال الممتحن فـ Teil 1.',
    speakingSimTask: 'دير محاكاة كاملة ديال Teil 1 (تقديم النفس + بين الويدان + 4 أسئلة) فـ 3 دقايق.'
  },
  {
    day: 6,
    intenseDay45: 6,
    level: 'A0/A1',
    titleDe: 'Tag 6: Teil 1 Backup-Themen (Buch, Film, Ereignis, Person, Hobby)',
    titleDarija: 'اليوم 6: المواضيع الاحتياطية الـ 5 ديال Teil 1 (كتاب، فيلم، حدث التخرج، الوالد، الرياضة)',
    pronunciationTask: 'نطق Bachelorabschluss, Vorbild, Ausdauer, Stressabbau.',
    slotMemoryTask: 'اقرا وافهم القوالب الاحتياطية الـ 5 ديال Teil 1 باش تكون مأمن 100%.',
    speakingSimTask: 'جرب تقدم موضوع احتياطي واحد (حدث التخرج من الإجازة أو الوالد كقدوة).'
  },
  {
    day: 7,
    intenseDay45: 7,
    level: 'A0/A1',
    titleDe: 'Tag 7: Einführung in das 6-Runden Ping-Pong System (Ronde 1 & 2)',
    titleDarija: 'اليوم 7: فهم وحفظ القالب الثابت ديال الجولة 1 والجولة 2 (استخراج الأفكار من الورقة)',
    pronunciationTask: 'نطق: Der Text befasst sich mit dem Thema ... / Zuerst wird beschrieben, dass ...',
    slotMemoryTask: 'احفظ القالب الثابت ديال Ronde 1 و Ronde 2 عن ظهر قلب.',
    speakingSimTask: 'طبق Ronde 1 و Ronde 2 على الموضوع #1 (Fast Food) والموضوع #2 (Hotel Mama).'
  },
  {
    day: 8,
    intenseDay45: 8,
    level: 'A0/A1',
    titleDe: 'Tag 8: Das 6-Runden Ping-Pong System (Ronde 3 & 4 — Vorteil & Nachteil)',
    titleDarija: 'اليوم 8: حفظ القالب الثابت ديال الجولة 3 (الإيجابية) والجولة 4 (السلبية)',
    pronunciationTask: 'نطق: Meiner Meinung nach hat dieses Thema viele Vorteile / Ein großer Nachteil ist jedoch, dass ...',
    slotMemoryTask: 'احفظ القالب الثابت ديال Ronde 3 و Ronde 4.',
    speakingSimTask: 'طبق الجولات 1 تال 4 على المواضيع #3 (Karriere) و #4 (Rauchen).'
  },
  {
    day: 9,
    intenseDay45: 9,
    level: 'A0/A1',
    titleDe: 'Tag 9: Das 6-Runden Ping-Pong System (Ronde 5 Marokko & Ronde 6 Joker)',
    titleDarija: 'اليوم 9: حفظ الجولة 5 (الحال فـ المغرب) والجولة 6 (الجوكر السحري للختام)',
    pronunciationTask: 'نطق: In meiner Heimat Marokko ist es so, dass ... / Wie sieht es in deinem Heimatland aus?',
    slotMemoryTask: 'احفظ القالب الثابت ديال Ronde 5 و Ronde 6 (الجوكر العالمي).',
    speakingSimTask: 'قول القالب الكامل ديال الـ 6 جولات خاوي بلا تردد فـ أقل من دقيقة ونص.'
  },
  {
    day: 10,
    intenseDay45: 10,
    level: 'A0/A1',
    titleDe: 'Tag 10: Teil 3 Grundlagen — Die Dkhla & Khatima Slot-Templates',
    titleDarija: 'اليوم 10: أساسيات البارتي 3 — حفظ الدخلة والخاتمة الثابتة',
    pronunciationTask: 'نطق: Wie du weißt, planen wir ja zusammen ... / Hast du dir dazu schon ein paar Gedanken gemacht?',
    slotMemoryTask: 'احفظ الدخلة (Dkhla) والخاتمة (Khatima) ديال Teil 3.',
    speakingSimTask: 'عمر فراغ الدخلة والخاتمة على 5 مواضيع من الكاتيغوري 1 (الحفلات).'
  },
  {
    day: 11,
    intenseDay45: 11,
    level: 'A0/A1',
    titleDe: 'Tag 11: Teil 3 — Die ersten 10 Universal-Joker (Wann, Wo, Essen, Werbung...)',
    titleDarija: 'اليوم 11: حفظ النقط الـ 10 اللولين من الجوكرات العالمية ديال التخطيط',
    pronunciationTask: 'نطق: Genehmigung, Stadtverwaltung, Aufgabenverteilung, Verpflegung.',
    slotMemoryTask: 'احفظ النقط 1 تال 10 ديال التخطيط بالصيغة البسيطة.',
    speakingSimTask: 'استعمل 5 نقط باش تخطط لمهرجان رياضي (#1 Sportfest).'
  },
  {
    day: 12,
    intenseDay45: 12,
    level: 'A0/A1',
    titleDe: 'Tag 12: A0/A1 Generalprobe & Stufenprüfung 1 (Aufstieg zu A2!)',
    titleDarija: 'اليوم 12: مراجعة شاملة واجتياز الامتحان الإشهادي الأول للانتقال لـ Niveau A2!',
    pronunciationTask: 'مراجعة جميع قواعد النطق الـ 5.',
    slotMemoryTask: 'مراجعة تقديم محمد + رحلة بين الويدان + القالب الثابت ديال الـ 6 جولات.',
    speakingSimTask: 'دوز امتحان المستوى الأول (Stufenprüfung A1 ➔ A2) وشد الشهادة ديالك!'
  },

  // Phase 2: A2 (Days 13-28)
  {
    day: 13,
    intenseDay45: 13,
    level: 'A2',
    titleDe: 'Tag 13: Die goldene „dass“-Regel (Verb-Kick ans Satzende) + Teil 2 #1–#4',
    titleDarija: 'اليوم 13: إتقان ركل الفعل لآخر الجملة مورا dass + حفظ الفراغات ديال المواضيع 1 تال 4',
    pronunciationTask: 'نطق الأفعال فـ آخر الجملة بوضوح: spart, wohnen, verzichtet, verursacht.',
    slotMemoryTask: 'عمر واحفظ الـ 6 فراغات ديال: 1. Fast Food, 2. Hotel Mama, 3. Karriere, 4. Rauchen.',
    speakingSimTask: 'العب البينغ بونغ الصوتي فـ الوضع 1 والوضع 3 على المواضيع 1 تال 4.'
  },
  {
    day: 14,
    intenseDay45: 14,
    level: 'A2',
    titleDe: 'Tag 14: Teil 2 Slot-Meisterschaft #5 bis #8',
    titleDarija: 'اليوم 14: حفظ وتعمير الفراغات ديال المواضيع 5 تال 8 (التسوق، المضادات الحيوية، العطلة، السعادة)',
    pronunciationTask: 'نطق: Einkaufszentren, Antibiotika, Resistenzen, Glückshormone.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 5. Einkaufszentren, 6. Antibiotika, 7. Urlaub am Strand, 8. Glückshormone.',
    speakingSimTask: 'دير رادار سرقة الأفكار من الورقة (الوضع 2) على هاد 4 د المواضيع.'
  },
  {
    day: 15,
    intenseDay45: 15,
    level: 'A2',
    titleDe: 'Tag 15: Teil 2 Slot-Meisterschaft #9 bis #12',
    titleDarija: 'اليوم 15: حفظ وتعمير الفراغات ديال المواضيع 9 تال 12 (الخدمة فـ الصيف، الكذوب، التلفزة، القراية)',
    pronunciationTask: 'نطق: Ferienjob, Taschengeld, Notlüge, Vertrauen, Vorstellungskraft.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 9. Arbeiten im Sommer, 10. Lügen, 11. Fernsehen, 12. Lesen.',
    speakingSimTask: 'اختبر راسك بالضبابية (Active Recall Mode 3) على المواضيع 9 تال 12.'
  },
  {
    day: 16,
    intenseDay45: 16,
    level: 'A2',
    titleDe: 'Tag 16: Teil 2 Slot-Meisterschaft #13 bis #16',
    titleDarija: 'اليوم 16: حفظ الفراغات ديال المواضيع 13 تال 16 (ماركات الحوايج، الماكلة فـ الخدمة، الحيوانات، الموسيقى)',
    pronunciationTask: 'نطق: Markenkleidung, Gruppenzwang, Kantine, Verantwortung, Konzentration.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 13. Markenkleidung, 14. Essen bei der Arbeit, 15. Haustiere, 16. Musik.',
    speakingSimTask: 'كمل الفراغات بصوتك (Voice Mode 4) على المواضيع 13 تال 16.'
  },
  {
    day: 17,
    intenseDay45: 17,
    level: 'A2',
    titleDe: 'Tag 17: Teil 2 Slot-Meisterschaft #17 bis #20',
    titleDarija: 'اليوم 17: حفظ الفراغات ديال المواضيع 17 تال 20 (ألعاب الفيديو، تعدد اللغات، التقاعد، عمليات التجميل)',
    pronunciationTask: 'نطق: Reaktionsfähigkeit, Zweisprachigkeit, Ruhestand, Schönheitsoperationen.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 17. Computerspiele, 18. Zweisprachigkeit, 19. Rente, 20. Schönheits-OPs.',
    speakingSimTask: 'العب محاكاة البينغ بونغ الكاملة على موضوع Zweisprachigkeit (#18) و Computerspiele (#17).'
  },
  {
    day: 18,
    intenseDay45: 18,
    level: 'A2',
    titleDe: 'Tag 18: Teil 2 Slot-Meisterschaft #21 bis #23 + Wiederholung 1–23',
    titleDarija: 'اليوم 18: حفظ الفراغات ديال المواضيع 21 تال 23 (الأبراج، فيسبوك، الصداقة) + مراجعة النصف الأول',
    pronunciationTask: 'نطق: Sternzeichen, soziale Netzwerke, Privatsphäre, oberflächlich.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 21. Sternzeichen, 22. Facebook, 23. Freundschaft.',
    speakingSimTask: 'اختبار عشوائي فـ 5 مواضيع من بين 1 و 23 بلا ما تشوف الحل.'
  },
  {
    day: 19,
    intenseDay45: 19,
    level: 'A2',
    titleDe: 'Tag 19: Teil 3 Universal-Joker 11 bis 20 (Verpflegung bis Sicherheit)',
    titleDarija: 'اليوم 19: حفظ النقط 11 تال 20 ديال التخطيط المشترك (التموين، الأطفال، التصاور، النظافة، السلامة)',
    pronunciationTask: 'نطق: Kinderbetreuung, Mülltrennung, Beschilderung, Erste-Hilfe-Kasten.',
    slotMemoryTask: 'احفظ النقط 11 تال 20 ديال Teil 3.',
    speakingSimTask: 'طبق الـ 20 نقطة على مواضيع الكاتيغوري 1 (1 تال 10: الحفلات والمهرجانات).'
  },
  {
    day: 20,
    intenseDay45: 20,
    level: 'A2',
    titleDe: 'Tag 20: Teil 3 Kategorie 1 (Themen 1–10: Party & Fest)',
    titleDarija: 'اليوم 20: إتقان مواضيع الكاتيغوري 1 (من 1. Sportfest تال 10. Multikulturelles Fest)',
    pronunciationTask: 'نطق: Überraschungsfest, Flohmarkt, Straßenfest, multikulturell.',
    slotMemoryTask: 'احفظ الـ 20% (قلب الموضوع: جوج نقط اللولين) ديال المواضيع 1 تال 10.',
    speakingSimTask: 'خطط بصوت عالي لـ Kochparty (#5) و Straßenfest (#8) من الدخلة تال الخاتمة.'
  },
  {
    day: 21,
    intenseDay45: 21,
    level: 'A2',
    titleDe: 'Tag 21: Teil 2 Slot-Meisterschaft #24 bis #27',
    titleDarija: 'اليوم 21: حفظ الفراغات ديال المواضيع 24 تال 27 (التسوق فالأنترنيت، الكامبينغ، البروتينات، النباتيين)',
    pronunciationTask: 'نطق: Online-Shopping, Versandkosten, Nahrungsergänzungsmittel, vegetarisch.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 24. Einkaufen im Internet, 25. Camping, 26. Nahrungsergänzung, 27. Vegetarisch.',
    speakingSimTask: 'العب البينغ بونغ على المواضيع 24 تال 27 مع التركيز على الفعل فـ آخر الجملة.'
  },
  {
    day: 22,
    intenseDay45: 22,
    level: 'A2',
    titleDe: 'Tag 22: Teil 2 Slot-Meisterschaft #28 bis #31',
    titleDarija: 'اليوم 22: حفظ الفراغات ديال المواضيع 28 تال 31 (الشهرة، الرياضة الخطيرة، الكتب الإلكترونية، الزواج)',
    pronunciationTask: 'نطق: Extremsport, Adrenalin, E-Books, Geduld, Kompromisse.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 28. Berühmt werden, 29. Extremsport, 30. E-Books, 31. Ehe.',
    speakingSimTask: 'اختبر راسك بالـ Active Recall على المواضيع 28 تال 31.'
  },
  {
    day: 23,
    intenseDay45: 23,
    level: 'A2',
    titleDe: 'Tag 23: Teil 2 Slot-Meisterschaft #32 bis #35',
    titleDarija: 'اليوم 23: حفظ الفراغات ديال المواضيع 32 تال 35 (النعاس فـ الخدمة، الأداء بالبطاقة، الهوم أوفيس، السفر للمريخ)',
    pronunciationTask: 'نطق: Mittagsschlaf, Leistungsfähigkeit, Bargeld, Homeoffice, Weltraumforschung.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 32. Schlafen bei der Arbeit, 33. Plastikgeld, 34. Homeoffice, 35. Reise zum Mars.',
    speakingSimTask: 'كمل الفراغات بصوتك فـ موضوع Homeoffice (#34) و Plastikgeld (#33).'
  },
  {
    day: 24,
    intenseDay45: 24,
    level: 'A2',
    titleDe: 'Tag 24: Teil 2 Slot-Meisterschaft #36 bis #39',
    titleDarija: 'اليوم 24: حفظ الفراغات ديال المواضيع 36 تال 39 (حظر الطوموبيلات، التقاعد بـ 63، كاميرات المراقبة، التعارف فـ الأنترنيت)',
    pronunciationTask: 'نطق: Autofreie Innenstadt, Überwachungskameras, Kriminalität, Partnersuche.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 36. Autos verbieten, 37. Rente mit 63, 38. Kameras, 39. Liebe im Internet.',
    speakingSimTask: 'العب البينغ بونغ على المواضيع 36 تال 39.'
  },
  {
    day: 25,
    intenseDay45: 25,
    level: 'A2',
    titleDe: 'Tag 25: Teil 2 Slot-Meisterschaft #40 bis #43',
    titleDarija: 'اليوم 25: حفظ الفراغات ديال المواضيع 40 تال 43 (الزي الموحد، العمل التطوعي، الطب البديل، كراء الحوايج)',
    pronunciationTask: 'نطق: Schuluniform, Ehrenamt, Alternativmedizin, Heilpflanzen, Kleidermiete.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 40. Schuluniform, 41. Freiwilligenarbeit, 42. Alternative Medizin, 43. Kleider mieten.',
    speakingSimTask: 'اختبر راسك بالضبابية والصوت على المواضيع 40 تال 43.'
  },
  {
    day: 26,
    intenseDay45: 26,
    level: 'A2',
    titleDe: 'Tag 26: Teil 2 Slot-Meisterschaft #44 bis #46 (Alle 46 komplett!)',
    titleDarija: 'اليوم 26: ختم جميع مواضيع البارتي 2 (44. الذكاء الاصطناعي، 45. تيك توك، 46. الهجرة للعمل)',
    pronunciationTask: 'نطق: Künstliche Intelligenz, Fachkräftemangel, Bürokratie, Heimweh.',
    slotMemoryTask: 'احفظ الـ 6 فراغات ديال: 44. KI im Alltag, 45. Influencer/TikTok, 46. Auswandern für den Beruf.',
    speakingSimTask: 'مبروك! كملتي الـ 46 امتحان ديال Teil 2! جرب 3 مواضيع عشوائية دابا.'
  },
  {
    day: 27,
    intenseDay45: 27,
    level: 'A2',
    titleDe: 'Tag 27: Teil 3 Kategorie 2 (Themen 11–18: Veranstaltung & Infotag)',
    titleDarija: 'اليوم 27: إتقان مواضيع الكاتيغوري 2 (من 11. Infotag Neue Medien تال 18. Lernen im Alter)',
    pronunciationTask: 'نطق: Softwareseminar, Blutspendeveranstaltung, barrierefrei, Ernährungsberater.',
    slotMemoryTask: 'احفظ الـ 20% (قلب الموضوع) ديال المواضيع 11 تال 18.',
    speakingSimTask: 'خطط لـ Infoveranstaltung Beruf (#14) و Blutspendeveranstaltung (#15).'
  },
  {
    day: 28,
    intenseDay45: 28,
    level: 'A2',
    titleDe: 'Tag 28: A2 Generalprobe & Stufenprüfung 2 (Aufstieg zu B1!)',
    titleDarija: 'اليوم 28: مراجعة شاملة واجتياز الامتحان الإشهادي الثاني للانتقال لـ Niveau B1!',
    pronunciationTask: 'مراجعة النطق السريع للجمل الطويلة مع dass.',
    slotMemoryTask: 'مراجعة سريعة للفراغات ديال المواضيع الـ 46.',
    speakingSimTask: 'دوز امتحان المستوى الثاني (Stufenprüfung A2 ➔ B1) وشد شهادة المستوى B1!'
  },

  // Phase 3: B1 (Days 29-45)
  {
    day: 29,
    intenseDay45: 29,
    level: 'B1',
    titleDe: 'Tag 29: B1/B2 Upgrade — Indirekte Fragen Transformer (W-Fragen & ob-Sätze)',
    titleDarija: 'اليوم 29: تحويل الأسئلة المباشرة لأسئلة غير مباشرة راقية (Ich möchte wissen, wann/ob...)',
    pronunciationTask: 'نطق: Ich möchte gerne wissen, wann ... / Könntest du mir sagen, ob ...',
    slotMemoryTask: 'تدرب على محول الأسئلة غير المباشرة فـ جميع الـ 20 نقطة ديال Teil 3.',
    speakingSimTask: 'حول 10 أسئلة عادية ديال A2 لـ Indirekte Fragen بصوت عالي.'
  },
  {
    day: 30,
    intenseDay45: 30,
    level: 'B1',
    titleDe: 'Tag 30: Konjunktiv II für höfliche Vorschläge & 56 Redemittel',
    titleDarija: 'اليوم 30: إتقان صيغ الاقتراح الراقي بـ Konjunktiv II و 56 عبارة تواصلية',
    pronunciationTask: 'نطق: Wir könnten, wir sollten, es wäre sinnvoll, ich würde vorschlagen.',
    slotMemoryTask: 'احفظ أهم 20 عبارة من لائحة الـ 56 Redemittel ديال الموافقة والاعتراض اللبق.',
    speakingSimTask: 'استعمل 5 عبارات ديال Konjunktiv II فـ محادثة مع المساعد الذكي.'
  },
  {
    day: 31,
    intenseDay45: 31,
    level: 'B1',
    titleDe: 'Tag 31: Teil 3 Kategorie 3 (Themen 19–22: Präsentation in der Klasse)',
    titleDarija: 'اليوم 31: إتقان مواضيع الكاتيغوري 3 (تقديم كتاب، تعلم اللغات، تقديم المغرب ومدينة فاس)',
    pronunciationTask: 'نطق: Buchpräsentation, Tandempartner, Sehenswürdigkeiten, Al-Qarawiyyin.',
    slotMemoryTask: 'احفظ الأسئلة والأجوبة الخاصة بالكاتيغوري 3 + المواضيع 19 تال 22.',
    speakingSimTask: 'خطط لعرض حول مدينة فاس (#22) وعرض حول تعلم اللغات (#20).'
  },
  {
    day: 32,
    intenseDay45: 32,
    level: 'B1',
    titleDe: 'Tag 32: Teil 3 Kategorie 4 (Themen 23–32: Reise & Ausflug)',
    titleDarija: 'اليوم 32: إتقان مواضيع الكاتيغوري 4 (الرحلات والخرجات من 23 تال 32)',
    pronunciationTask: 'نطق: Studienreise, Jugendherberge, Austauschprogramm, Betriebsausflug.',
    slotMemoryTask: 'احفظ قلب الموضوع (20%) ديال المواضيع 23 تال 32.',
    speakingSimTask: 'خطط لـ Reise in ein deutschsprachiges Land (#26) و Betriebsausflug (#30).'
  },
  {
    day: 33,
    intenseDay45: 33,
    level: 'B1',
    titleDe: 'Tag 33: Teil 3 Kategorie 5 Teil A (Themen 33–40: Hilfe, Umzug, Krankenhaus)',
    titleDarija: 'اليوم 33: إتقان مواضيع الكاتيغوري 5 الجزء الأول (من 33. حوار مع مغني تال 40. جارتنا فـ السبيطار)',
    pronunciationTask: 'نطق: Halteverbotszone, Kinderkrankenhaus, Benefiz-Theaterstück, Hochzeitsüberraschung.',
    slotMemoryTask: 'احفظ قلب الموضوع ديال المواضيع 33 تال 40.',
    speakingSimTask: 'خطط لـ Umzug (#34) و Nachbarin im Krankenhaus: Kinder betreuen (#40).'
  },
  {
    day: 34,
    intenseDay45: 34,
    level: 'B1',
    titleDe: 'Tag 34: Teil 3 Kategorie 5 Teil B (Themen 41–48: Spenden, Valentin, Bewerbung)',
    titleDarija: 'اليوم 34: ختم جميع الـ 48 موضوع ديال Teil 3 (من 41. تبرع الكتب تال 48. روض الأطفال)',
    pronunciationTask: 'نطق: Bücherspenden, Vorstellungsgespräch, Genesungskarte, Schreibwettbewerb.',
    slotMemoryTask: 'احفظ قلب الموضوع ديال المواضيع 41 تال 48.',
    speakingSimTask: 'خطط لـ Vorstellungsgespräch üben (#43) و Freund Valentin im Krankenhaus (#45).'
  },
  {
    day: 35,
    intenseDay45: 35,
    level: 'B1',
    titleDe: 'Tag 35: Die 20-Minuten Vorbereitungsraum-Strategie (ورقة الوسخ التفاعلية)',
    titleDarija: 'اليوم 35: التدرب على استغلال الـ 20 دقيقة ديال التحضير بـ تقنية ورقة الوسخ',
    pronunciationTask: 'قراءة الملاحظات المختصرة وتحويلها لجمل كاملة فـ الحين.',
    slotMemoryTask: 'تدرب على تقسيم الـ 20 دقيقة: 10 دقايق لـ Teil 2 (6 فراغات) + 8 دقايق لـ Teil 3 (2 قلب الموضوع + 4 جوكرات) + دقيقتين مراجعة.',
    speakingSimTask: 'جرب التايمر ديال 20 دقيقة فـ المنصة ووجد امتحان كامل فـ الوقت المحدد.'
  },
  {
    day: 36,
    intenseDay45: 36,
    level: 'B1',
    titleDe: 'Tag 36: Speed-Drill Teil 2 (Themen #1 bis #15 ohne Notizen)',
    titleDarija: 'اليوم 36: التمرين السريع على المواضيع 1 تال 15 ديال Teil 2 بلا ورقة',
    pronunciationTask: 'التركيز على الإيقاع الطبيعي وعدم التوقف قبل الفعل فـ آخر الجملة.',
    slotMemoryTask: 'مراجعة الفراغات الـ 6 ديال المواضيع 1 تال 15 فـ الوضع 3 (الضبابية).',
    speakingSimTask: 'العب 3 امتحانات متتابعة مع المساعد الصوتي.'
  },
  {
    day: 37,
    intenseDay45: 37,
    level: 'B1',
    titleDe: 'Tag 37: Speed-Drill Teil 2 (Themen #16 bis #30 ohne Notizen)',
    titleDarija: 'اليوم 37: التمرين السريع على المواضيع 16 تال 30 ديال Teil 2 بلا ورقة',
    pronunciationTask: 'تحسين التنغيم الصوتي فـ طرح الأسئلة فـ آخر كل جولة.',
    slotMemoryTask: 'مراجعة الفراغات الـ 6 ديال المواضيع 16 تال 30 فـ الوضع 3.',
    speakingSimTask: 'العب 3 امتحانات متتابعة فـ الوضع 4 (بالصوت).'
  },
  {
    day: 38,
    intenseDay45: 38,
    level: 'B1',
    titleDe: 'Tag 38: Speed-Drill Teil 2 (Themen #31 bis #46 ohne Notizen)',
    titleDarija: 'اليوم 38: التمرين السريع على المواضيع 31 تال 46 ديال Teil 2 بلا ورقة',
    pronunciationTask: 'نطق المصطلحات الاقتصادية والتقنية (Plastikgeld, Homeoffice, KI, Fachkräfte).',
    slotMemoryTask: 'مراجعة الفراغات الـ 6 ديال المواضيع 31 تال 46 فـ الوضع 3.',
    speakingSimTask: 'العب 3 امتحانات متتابعة فـ الوضع 4 (بالصوت).'
  },
  {
    day: 39,
    intenseDay45: 39,
    level: 'B1',
    titleDe: 'Tag 39: Speed-Drill Teil 3 (Kategorien 1, 2 & 3)',
    titleDarija: 'اليوم 39: التمرين السريع على مواضيع التخطيط (الكاتيغوري 1 و 2 و 3)',
    pronunciationTask: 'ربط الدخلة + 2 نقط قلب الموضوع + 4 جوكرات + الخاتمة بسلاسة.',
    slotMemoryTask: 'مراجعة المواضيع 1 تال 22 ديال Teil 3.',
    speakingSimTask: 'دير 3 محادثات تخطيط كاملة مع المساعد الذكي.'
  },
  {
    day: 40,
    intenseDay45: 40,
    level: 'B1',
    titleDe: 'Tag 40: Speed-Drill Teil 3 (Kategorien 4 & 5)',
    titleDarija: 'اليوم 40: التمرين السريع على مواضيع التخطيط (الكاتيغوري 4 و 5)',
    pronunciationTask: 'استعمال Indirekte Fragen و Konjunktiv II فـ كل جولة.',
    slotMemoryTask: 'مراجعة المواضيع 23 تال 48 ديال Teil 3.',
    speakingSimTask: 'دير 3 محادثات تخطيط كاملة مع المساعد الذكي.'
  },
  {
    day: 41,
    intenseDay45: 41,
    level: 'B1',
    titleDe: 'Tag 41: Partner-Rettungstraining („Sauerstoff geben / الأوكسجين“)',
    titleDarija: 'اليوم 41: تدريب خاص على إنقاذ البارتنر المبلوكي أو الخجول يلا طحتي معاه فـ الامتحان',
    pronunciationTask: 'نطق أسئلة الاختيار السهل: Sollen wir lieber A machen oder findest du B besser?',
    slotMemoryTask: 'احفظ 5 جمل ديال "الأوكسجين" باش تحرك أي بارتنر ساكت.',
    speakingSimTask: 'جرب وضع "البارتنر الخجول" فـ المحاكي الصوتي وأنقذ الحوار!'
  },
  {
    day: 42,
    intenseDay45: 42,
    level: 'B1',
    titleDe: 'Tag 42: Umgang mit einem dominanten Partner (Höflich unterbrechen)',
    titleDarija: 'اليوم 42: كيفاش تقاطع بأدب بارتنر كيهضر بزاف وما كيخليكش تاخد نوبتك',
    pronunciationTask: 'نطق: Da hast du vollkommen recht, und ich möchte dazu noch ergänzen, dass ...',
    slotMemoryTask: 'احفظ 3 عبارات باش تدخل فـ الهضرة بلبق وتضمن حقك فـ النقط.',
    speakingSimTask: 'طبق هاد العبارات فـ محاكاة Teil 2 و Teil 3.'
  },
  {
    day: 43,
    intenseDay45: 43,
    level: 'B1',
    titleDe: 'Tag 43: Komplette Generalprobe 1 (Teil 1 + Teil 2 + Teil 3 unter Echtzeit)',
    titleDarija: 'اليوم 43: امتحان تجريبي كامل رقم 1 بالتايمر الحقيقي (15 دقيقة)',
    pronunciationTask: 'الحفاظ على الهدوء، الابتسامة، ونبرة صوت واثقة.',
    slotMemoryTask: 'اختيار موضوع عشوائي من الـ 46 (Teil 2) وموضوع عشوائي من الـ 48 (Teil 3).',
    speakingSimTask: 'دوز امتحان كامل وشوف التقييم ديال الذكاء الاصطناعي على 60 نقطة.'
  },
  {
    day: 44,
    intenseDay45: 44,
    level: 'B1',
    titleDe: 'Tag 44: Komplette Generalprobe 2 + Fehleranalyse',
    titleDarija: 'اليوم 44: امتحان تجريبي كامل رقم 2 + تصحيح الأخطاء',
    pronunciationTask: 'التركيز على عدم نسيان أي فعل فـ آخر جملة dass.',
    slotMemoryTask: 'مراجعة المواضيع لي جمعو أقل نقط فـ المحاكاة.',
    speakingSimTask: 'دوز امتحان تجريبي ثاني وحاول تفوت 54/60.'
  },
  {
    day: 45,
    intenseDay45: 45,
    level: 'B1',
    titleDe: 'Tag 45: Stufenprüfung 3 (Aufstieg zu B2!) & Abschluss des 45-Tage-Intensivplans',
    titleDarija: 'اليوم 45: اجتياز الامتحان الإشهادي الثالث للوصول لقمة Niveau B2! (نهاية خطة 45 يوم المكثفة)',
    pronunciationTask: 'نطق احترافي بطلاقة B2.',
    slotMemoryTask: 'تثبيت جميع القوالب والفراغات فـ الذاكرة بعيدة المدى.',
    speakingSimTask: 'دوز امتحان المستوى الثالث (Stufenprüfung B1 ➔ B2) واحتفل بالوصول لـ B2!'
  },

  // Phase 4: B2 & Karriere Master (Days 46-60)
  {
    day: 46,
    intenseDay45: 35,
    level: 'B2',
    titleDe: 'Tag 46: Karriere-Start — Selbstpräsentation im deutschen Vorstellungsgespräch (Fragen 1–3)',
    titleDarija: 'اليوم 46: بداية التحضير لمقابلة العمل فـ ألمانيا (تقديم محمد الاقتصادي + الفيزيك + علاش ألمانيا)',
    pronunciationTask: 'نطق: Wirtschaftswissenschaften, analytisches Denken, Unternehmenssteuerung.',
    slotMemoryTask: 'احفظ الأجوبة الاحترافية ديال الأسئلة 1 تال 3 فـ استوديو مقابلة العمل.',
    speakingSimTask: 'جاوب بصوتك على سؤال: Erzählen Sie uns bitte etwas über sich!'
  },
  {
    day: 47,
    intenseDay45: 36,
    level: 'B2',
    titleDe: 'Tag 47: Vorstellungsgespräch Wirtschaft — Stärken, Schwächen & Teamarbeit (Fragen 4–6)',
    titleDarija: 'اليوم 47: مقابلة العمل — نقاط القوة، نقاط الضعف الذكية، والعمل الجماعي (الأسئلة 4 تال 6)',
    pronunciationTask: 'نطق: Zahlenaffinität, Zuverlässigkeit, lösungsorientiert, konstruktiv.',
    slotMemoryTask: 'احفظ الأجوبة ديال الأسئلة 4 تال 6 فـ استوديو مقابلة العمل.',
    speakingSimTask: 'دير محاكاة صوتية مع مدير الموارد البشرية (HR) على نقاط القوة والضعف.'
  },
  {
    day: 48,
    intenseDay45: 37,
    level: 'B2',
    titleDe: 'Tag 48: Vorstellungsgespräch Wirtschaft — Excel/ERP, 5-Jahres-Plan & Gehalt (Fragen 7–9)',
    titleDarija: 'اليوم 48: مقابلة العمل — المهارات التقنية، فين كتشوف راسك من هنا 5 سنين، والصالير (الأسئلة 7 تال 9)',
    pronunciationTask: 'نطق: Datenanalyse, Tabellenkalkulation, Gehaltsvorstellung, Weiterbildung.',
    slotMemoryTask: 'احفظ الأجوبة ديال الأسئلة 7 تال 9 فـ استوديو مقابلة العمل.',
    speakingSimTask: 'جاوب بثقة على سؤال التوقعات المالية (Gehaltsvorstellung).'
  },
  {
    day: 49,
    intenseDay45: 38,
    level: 'B2',
    titleDe: 'Tag 49: Vorstellungsgespräch Wirtschaft — Umzug nach Deutschland & Rückfragen (Fragen 10–12)',
    titleDarija: 'اليوم 49: مقابلة العمل — الاستعداد للانتقال لألمانيا والأسئلة الذكية للمشغل (الأسئلة 10 تال 12)',
    pronunciationTask: 'نطق: Einarbeitungsphase, Unternehmenskultur, Entwicklungsmöglichkeiten.',
    slotMemoryTask: 'احفظ الأجوبة ديال الأسئلة 10 تال 12 وكمل الـ 12 سؤال ديال الخدمة.',
    speakingSimTask: 'دير مقابلة عمل كاملة من السؤال 1 تال 12.'
  },
  {
    day: 50,
    intenseDay45: 39,
    level: 'B2',
    titleDe: 'Tag 50: 3D Spatial XR Prüfungsraum Training & Bioscience Deep-Dive',
    titleDarija: 'اليوم 50: التدرب فـ القاعة ثلاثية الأبعاد (3D XR Prüfungsraum) ومراجعة المواضيع العلمية',
    pronunciationTask: 'نطق المصطلحات العلمية فـ مواضيع Antibiotika (#6) و Glückshormone (#8).',
    slotMemoryTask: 'جرب القاعة ثلاثية الأبعاد وتفاعل مع البطاقات المكانية.',
    speakingSimTask: 'العب جولة بينغ بونغ كاملة داخل قاعة الامتحان ثلاثية الأبعاد.'
  },
  {
    day: 51,
    intenseDay45: 40,
    level: 'B2',
    titleDe: 'Tag 51: Meister-Wiederholung Teil 2 (Die 15 häufigsten Prüfungsthemen)',
    titleDarija: 'اليوم 51: مراجعة مكثفة لأكثر 15 موضوع كيتحطو فـ الامتحان ديال Teil 2',
    pronunciationTask: 'الأداء الصوتي بدون أي ورقة وبسرعة طبيعية.',
    slotMemoryTask: 'مراجعة Fast Food, Hotel Mama, Rauchen, Homeoffice, Plastikgeld, Zweisprachigkeit, KI.',
    speakingSimTask: 'اختبار عشوائي فـ 5 مواضيع متتالية.'
  },
  {
    day: 52,
    intenseDay45: 41,
    level: 'B2',
    titleDe: 'Tag 52: Meister-Wiederholung Teil 3 (Die 15 häufigsten Planungsaufgaben)',
    titleDarija: 'اليوم 52: مراجعة مكثفة لأكثر 15 موضوع كيتحطو فـ التخطيط المشترك Teil 3',
    pronunciationTask: 'التنويع بين الأسئلة غير المباشرة واقتراحات Konjunktiv II.',
    slotMemoryTask: 'مراجعة Sportfest, Überraschungsfest, Infotag Gesundheit, Land vorstellen, Valentin im Krankenhaus.',
    speakingSimTask: 'تخطيط 3 مشاريع كاملة فـ 4 دقايق لكل مشروع.'
  },
  {
    day: 53,
    intenseDay45: 42,
    level: 'B2',
    titleDe: 'Tag 53: Vollständige TELC B2 Simulation #1 (Ziel: 56+ / 60 Punkte)',
    titleDarija: 'اليوم 53: محاكاة رسمية كاملة رقم 1 (الهدف: أكثر من 56 على 60)',
    pronunciationTask: 'مراقبة علامات الترقيم الصوتية والتنفس المريح.',
    slotMemoryTask: 'تطبيق استراتيجية الـ 20 دقيقة د التحضير + 15 دقيقة د الدوزان.',
    speakingSimTask: 'دوز الامتحان الكامل وسجل النقطة فـ لوحة التقدم.'
  },
  {
    day: 54,
    intenseDay45: 42,
    level: 'B2',
    titleDe: 'Tag 54: Vollständige TELC B2 Simulation #2',
    titleDarija: 'اليوم 54: محاكاة رسمية كاملة رقم 2 بمواضيع جديدة',
    pronunciationTask: 'التركيز على تنويع الروابط (Darüber hinaus, Außerdem, Dennoch).',
    slotMemoryTask: 'مراجعة 10 مواضيع من النصف الثاني ديال Teil 2 و Teil 3.',
    speakingSimTask: 'دوز الامتحان الكامل مع المساعد الذكي.'
  },
  {
    day: 55,
    intenseDay45: 43,
    level: 'B2',
    titleDe: 'Tag 55: Vollständige TELC B2 Simulation #3 (Stress-Test)',
    titleDarija: 'اليوم 55: محاكاة رسمية كاملة رقم 3 تحت الضغط',
    pronunciationTask: 'الرد الفوري على أسئلة الممتحن المفاجئة فـ Teil 1 و Teil 2.',
    slotMemoryTask: 'استعمال الجوكر العالمي فـ الجولة 6 وأوكسجين البارتنر فـ Teil 3.',
    speakingSimTask: 'دوز الامتحان فـ أقل وقت تحضير ممكن (10 دقايق فقط).'
  },
  {
    day: 56,
    intenseDay45: 43,
    level: 'B2',
    titleDe: 'Tag 56: Bewerbungs-Generalprobe (Wirtschaft & Finanzen in Deutschland)',
    titleDarija: 'اليوم 56: بروفا كاملة لمقابلة العمل مع شركة ألمانية فـ مجال الاقتصاد',
    pronunciationTask: 'نطق رسمي وهادئ (Sie-Form) طيلة المقابلة.',
    slotMemoryTask: 'مراجعة الـ 12 سؤال وجواب ديال Vorstellungsgespräch.',
    speakingSimTask: 'جاوب على 6 أسئلة عشوائية ديال HR بلا تحضير مسبق.'
  },
  {
    day: 57,
    intenseDay45: 44,
    level: 'B2',
    titleDe: 'Tag 57: Letzter Feinschliff — Teil 1 Perfektion (15/15 Punkte sichern)',
    titleDarija: 'اليوم 57: اللمسات الأخيرة على البارتي 1 (ضمان 15/15 فـ الجيب فـ أول 3 دقايق)',
    pronunciationTask: 'تقديم محمد الجبوري + رحلة بين الويدان بابتسامة وثقة عالية.',
    slotMemoryTask: 'مراجعة الأجوبة الـ 4 ديال الممتحن فـ رحلة بين الويدان.',
    speakingSimTask: 'أداء Teil 1 كامل فـ 2 دقايق ونص.'
  },
  {
    day: 58,
    intenseDay45: 44,
    level: 'B2',
    titleDe: 'Tag 58: Letzter Feinschliff — Teil 2 Ping-Pong (22,5/22,5 Punkte sichern)',
    titleDarija: 'اليوم 58: اللمسات الأخيرة على البارتي 2 (ضمان 22.5/22.5 بمنهجية البينغ بونغ)',
    pronunciationTask: 'التأكد من أن كل جملة dass كتسالي بالفعل مصرف.',
    slotMemoryTask: 'مراجعة سريعة للفراغات لي علمتي عليهم "عاودها ليا".',
    speakingSimTask: 'أداء 6 جولات بينغ بونغ مثالية.'
  },
  {
    day: 59,
    intenseDay45: 45,
    level: 'B2',
    titleDe: 'Tag 59: Letzter Feinschliff — Teil 3 Problemlösung (22,5/22,5 Punkte sichern)',
    titleDarija: 'اليوم 59: اللمسات الأخيرة على البارتي 3 (ضمان 22.5/22.5 بخطة 20% + 80%)',
    pronunciationTask: 'الدخلة + قلب الموضوع + الجوكرات + الخاتمة.',
    slotMemoryTask: 'مراجعة الـ 20 نقطة العالمية والـ 5 كاتيغوريات.',
    speakingSimTask: 'أداء تخطيط مشترك مثالي.'
  },
  {
    day: 60,
    intenseDay45: 45,
    level: 'B2',
    titleDe: 'Tag 60: Das große Finale — TELC B2 Master-Zertifikat (60/60) & Bereit für Deutschland!',
    titleDarija: 'اليوم 60: النهائي الكبير — شهادة الإتقان الكامل TELC B2 (60/60) والانطلاق نحو ألمانيا!',
    pronunciationTask: 'ثقة كاملة فـ النفس وفـ النطق الألماني.',
    slotMemoryTask: 'جميع الـ 46 موضوع ديال Teil 2 والـ 48 موضوع ديال Teil 3 فـ جيبك!',
    speakingSimTask: 'دوز الامتحان الإشهادي الرابع (TELC B2 Master 60/60) وخذ شهادتك النهائية!'
  }
];
