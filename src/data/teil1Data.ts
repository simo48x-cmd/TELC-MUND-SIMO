import { Teil1BackupTemplate, Teil1QA, Teil1Step } from '../types';

export const MOHAMMED_PROFILE = {
  fullName: 'Mohammed El Jebouri',
  age: 22,
  city: 'Fès, Marokko',
  abitur: 'Physik und Chemie',
  bachelor: 'Wirtschaft (Economics)',
  hobbiesDe: ['Sport treiben', 'Zeichnen', 'Videospiele spielen'],
  goalDe: 'In Deutschland arbeiten, sich beruflich weiterentwickeln und die beste Version seiner selbst werden',
  vorstellungGerman:
    'Hallo! Mein Name ist Mohammed El Jebouri, ich bin zweiundzwanzig Jahre alt und komme aus Fès, Marokko. Nach meinem Abitur in Physik und Chemie habe ich Wirtschaft studiert und meinen Bachelor gemacht. In meiner Freizeit mache ich gerne Sport, zeichne und spiele Videospiele. Mein Ziel ist es, nach Deutschland zu gehen, dort zu arbeiten und mich weiterzuentwickeln, um die beste Version meiner selbst zu werden.',
  introGerman:
    'Hallo! Mein Name ist Mohammed El Jebouri, ich bin zweiundzwanzig Jahre alt und komme aus Fès, Marokko. Nach meinem Abitur in Physik und Chemie habe ich Wirtschaft studiert und meinen Bachelor gemacht. In meiner Freizeit mache ich gerne Sport, zeichne und spiele Videospiele. Mein Ziel ist es, nach Deutschland zu gehen, dort zu arbeiten und mich weiterzuentwickeln, um die beste Version meiner selbst zu werden.',
  vorstellungDarija:
    'أهلاً! سميتي محمد الجبوري، عندي 22 عام وجيت من فاس، المغرب. من بعد الباك ديالي فالفيزيك والشيمي، قريت الاقتصاد (Wirtschaft) وخديت الباشلور ديالي. فوقت الفراغ ديالي كيعجبني ندير السبور، نرسم ونلعب ألعاب الفيديو. الهدف ديالي هو نمشي لألمانيا، نخدم تماك ونطور راسي باش نولي أحسن نسخة من نفسي.',
  introDarija:
    'أهلاً! سميتي محمد الجبوري، عندي 22 عام وجيت من فاس، المغرب. من بعد الباك ديالي فالفيزيك والشيمي، قريت الاقتصاد (Wirtschaft) وخديت الباشلور ديالي. فوقت الفراغ ديالي كيعجبني ندير السبور، نرسم ونلعب ألعاب الفيديو. الهدف ديالي هو نمشي لألمانيا، نخدم تماك ونطور راسي باش نولي أحسن نسخة من نفسي.',
  vorstellungSlots: [
    { label: 'Name & Alter', value: 'Mohammed El Jebouri • zweiundzwanzig Jahre alt' },
    { label: 'Herkunft', value: 'Fès, Marokko' },
    { label: 'Bildung', value: 'Abitur in Physik und Chemie ➔ Bachelor in Wirtschaft' },
    { label: 'Freizeit', value: 'Sport, Zeichnen und Videospiele' },
    { label: 'Karriereziel', value: 'nach Deutschland gehen, arbeiten und mich weiterentwickeln' },
  ],
};

export const BIN_EL_OUIDANE_STEPS: Teil1Step[] = [
  {
    stepNumber: 1,
    titleSpin: '1. Lbidaya (Einleitung)',
    titleDe: 'Einleitung & Reiseziel vorstellen',
    germanText:
      'Ich möchte heute über eine Reise sprechen, die für mich sehr schön war. Letztes Jahr bin ich nach Bin el Ouidane gereist. Das ist ein kleines und ruhiges Dorf in den Bergen von Marokko, das einen großen See hat.',
    darijaText:
      'بغيت نهضر اليوم على واحد السفر لي كان زوين بزاف بالنسبة ليا. العام لي فات، سافرت لبين الويدان. هي واحد القرية صغيرة وهادئة فجبال د المغرب، لي فيها واحد البحيرة كبيرة.',
    highlightedSlots: ['eine Reise', 'Bin el Ouidane', 'ein kleines und ruhiges Dorf in den Bergen von Marokko'],
  },
  {
    stepNumber: 2,
    titleSpin: '2. 3lach mchiti l tmak? (Warum?)',
    titleDe: 'Grund der Reise & Begleitung',
    germanText:
      'In meinem Alltag habe ich oft viel Stress, weil ich viel lerne und arbeite. Ich brauchte dringend eine Pause. Deshalb bin ich mit zwei guten Freunden dorthin gefahren, um mich zu entspannen und die Natur zu genießen.',
    darijaText:
      'فحياتي اليومية كيكون عندي ستريس بزاف، حيث كنقرا وكنخدم بزاف. كنت محتاج بزربة لشي استراحة. على داكشي مشيت لتماك مع جوج صحابي باش نرتاح ونستمتع بالطبيعة.',
    highlightedSlots: ['viel Stress', 'eine Pause', 'mit zwei guten Freunden', 'um mich zu entspannen'],
  },
  {
    stepNumber: 3,
    titleSpin: '3. Chno drti tmak? (Aktivitäten im Perfekt)',
    titleDe: 'Aktivitäten am See & in den Bergen',
    germanText:
      'Die Zeit dort war fantastisch. Wir haben in einem kleinen Haus am See geschlafen. Morgens haben wir zusammen gefrühstückt. Tagsüber haben wir ein kleines Boot gemietet und sind auf dem See gefahren. Danach sind wir in den Bergen spazieren gegangen. Abends haben wir draußen gegrillt.',
    darijaText:
      'الوقت تماك كان واعر. نعسنا فواحد الدار صغيرة حدا البحيرة. فالصباح فطرنا مجموعين. فالنهار كرينا فلوكة صغيرة ودرنا فالبحيرة. من بعد تمشينا فالجبال. فالعشية شوينا الماكلة على برا.',
    highlightedSlots: [
      'haben ... geschlafen',
      'haben ... gefrühstückt',
      'haben ... gemietet',
      'sind ... gefahren',
      'sind ... spazieren gegangen',
      'haben ... gegrillt',
    ],
  },
  {
    stepNumber: 4,
    titleSpin: '4. Lkholasa w Nnihaya (Fazit)',
    titleDe: 'Fazit, Empfehlung & Überleitung zu Fragen',
    germanText:
      'Diese Reise war perfekt, um neue Energie zu bekommen. Die Landschaft war sehr schön und die Menschen waren sehr freundlich. Ich kann diesen Ort jedem empfehlen. Das war meine Präsentation. Haben Sie noch Fragen?',
    darijaText:
      'هاد السفر كان مثالي باش ناخد طاقة جديدة. الطبيعة كانت زوينة بزاف والناس كانو ضرافات. كنقدر ننصح بهاد البلاصة لأي واحد. هادي هي البريزونطاسيون ديالي. واش عندكم شي أسئلة؟',
    highlightedSlots: ['neue Energie zu bekommen', 'sehr freundlich', 'jedem empfehlen', 'Haben Sie noch Fragen?'],
  },
];

export const BIN_EL_OUIDANE_QA: Teil1QA[] = [
  {
    id: 1,
    questionDe: 'Wie lange warst du dort?',
    questionDarija: 'شحال د الوقت جلستي تماك؟',
    answerDe: 'Ich war für drei Tage dort. Das war genau richtig.',
    answerDarija: 'جلست تماك 3 أيام. كانت هي هاديك.',
  },
  {
    id: 2,
    questionDe: 'War die Reise teuer?',
    questionDarija: 'واش السفر كان غالي؟',
    answerDe: 'Nein, nicht sehr teuer. Wir haben das Haus und das Essen zusammen bezahlt.',
    answerDarija: 'لا، ماشي غالي بزاف. خلصنا الدار والماكلة مجموعين.',
  },
  {
    id: 3,
    questionDe: 'Was hat dir dort am besten gefallen?',
    questionDarija: 'شنو لي عجبك تماك كثر حاجة؟',
    answerDe: 'Am besten hat mir die Bootstour auf dem ruhigen See gefallen.',
    answerDarija: 'أحسن حاجة عجباتني هي الجولة بالفلوكة فالبحيرة الهادئة.',
  },
  {
    id: 4,
    questionDe: 'Würdest du noch einmal dorthin fahren?',
    questionDarija: 'واش تقدر تمشي لتماك مرة أخرى؟',
    answerDe: 'Ja, auf jeden Fall! Nächstes Jahr möchte ich wieder mit meinen Freunden dorthin fahren.',
    answerDarija: 'آه ضروري! العام الجاي بغيت نمشي لتماك عاوتاني مع صحابي.',
  },
];

export const BIN_EL_OUIDANE_QAS = BIN_EL_OUIDANE_QA;

export const TEIL1_BACKUP_TEMPLATES: Teil1BackupTemplate[] = [
  {
    id: 'buch',
    topicNameDe: 'Ein Buch, das ich gelesen habe',
    topicNameDarija: 'كتاب قريتو وعجبني (احتياطي 1)',
    slotDefaultValue: 'Rich Dad Poor Dad von Robert Kiyosaki',
    einleitungDe:
      'Ich möchte heute über ein Buch sprechen, das mich sehr beeindruckt hat. Das Buch heißt „[SLOT]“.',
    warumDe:
      'Da ich Wirtschaft studiert habe, interessiere ich mich sehr für Finanzen und persönliche Weiterentwicklung. Ein guter Freund aus Fès hat mir dieses Buch empfohlen.',
    detailsDe:
      'In diesem Buch erklärt der Autor auf einfache Weise, wie man klug mit Geld umgeht, spart und investiert. Ich habe das Buch letzten Sommer gelesen und mir viele wichtige Notizen gemacht.',
    fazitDe:
      'Dieses Buch hat meine Denkweise über Wirtschaft und Karriere positiv verändert. Ich kann es jedem empfehlen. Haben Sie noch Fragen?',
    darijaSummary:
      'منهجية جاهزة لأي كتاب: غير بدل سمية الكتاب فـ [SLOT] وربطها بدراستك ديال الاقتصاد (Wirtschaft).',
  },
  {
    id: 'film',
    topicNameDe: 'Ein Film, den ich gesehen habe',
    topicNameDarija: 'فيلم تفرجت فيه (احتياطي 2)',
    slotDefaultValue: 'Das Streben nach Glück (The Pursuit of Happyness)',
    einleitungDe:
      'Ich möchte heute über einen Film sprechen, der mich tief berührt hat. Der Film heißt „[SLOT]“.',
    warumDe:
      'Ich habe diesen Film am Wochenende mit meinen Freunden angeschaut, weil ich motivierende Geschichten über Erfolg und Ausdauer sehr mag.',
    detailsDe:
      'Der Film handelt von einem Vater, der trotz großer finanzieller Probleme niemals aufgibt und am Ende eine erfolgreiche Karriere in der Wirtschaft aufbaut. Die Schauspieler waren hervorragend.',
    fazitDe:
      'Dieser Film hat mir gezeigt, dass man mit Disziplin und harter Arbeit jedes Ziel erreichen kann. Haben Sie noch Fragen?',
    darijaSummary:
      'منهجية جاهزة لأي فيلم: كتهضر على قصة كفاح ونجاح فالمجال المهني بـ جمل بسيطة فـ Perfekt.',
  },
  {
    id: 'ereignis',
    topicNameDe: 'Ein wichtiges Ereignis in meinem Leben',
    topicNameDarija: 'حدث مهم فحياتي — التخرج د الباشلور (احتياطي 3)',
    slotDefaultValue: 'mein Bachelor-Abschluss in Wirtschaft in Fès',
    einleitungDe:
      'Ich möchte heute über ein wichtiges Ereignis in meinem Leben sprechen, das ich nie vergessen werde. Das war [SLOT].',
    warumDe:
      'Nach meinem Abitur in Physik und Chemie habe ich drei Jahre lang intensiv an der Universität gelernt, um dieses Ziel zu erreichen.',
    detailsDe:
      'Am Tag der Abschlussfeier war meine ganze Familie dabei. Wir haben zusammen Fotos gemacht, zu Hause traditionell mit Tajine gefeiert und über meine Zukunftspläne in Deutschland gesprochen.',
    fazitDe:
      'Dieser Tag hat mir viel Selbstvertrauen gegeben und mir den Weg für meine Karriere in Deutschland geöffnet. Haben Sie noch Fragen?',
    darijaSummary:
      'أحسن حدث تهضر عليه هو نهار شديتي الباشلور ديالك فالاقتصاد فـ فاس وفرحتي مع العائلة.',
  },
  {
    id: 'person',
    topicNameDe: 'Eine wichtige Person in meinem Leben',
    topicNameDarija: 'شخص مهم فحياتي (احتياطي 4)',
    slotDefaultValue: 'mein Vater und Mentor',
    einleitungDe:
      'Ich möchte heute über eine Person sprechen, die in meinem Leben eine sehr große Rolle spielt. Das ist [SLOT].',
    warumDe:
      'Er hat mich schon seit meiner Schulzeit im Abitur und während meines Wirtschaftsstudiums immer unterstützt und motiviert.',
    detailsDe:
      'Immer wenn ich vor einer schweren Prüfung oder Entscheidung stand, hat er mir ruhig zugehört und mir kluge Ratschläge gegeben. Von ihm habe ich Pünktlichkeit, Ehrlichkeit und Disziplin gelernt.',
    fazitDe:
      'Ohne seine Unterstützung wäre ich heute nicht so zielstrebig. Er ist mein größtes Vorbild. Haben Sie noch Fragen?',
    darijaSummary:
      'منهجية واجدة على الأب أو قدوة فحياتك لي علمك الانضباط وشجعك تقرا الألمانية.',
  },
  {
    id: 'hobby',
    topicNameDe: 'Mein Lieblingshobby (Zeichnen & Sport)',
    topicNameDarija: 'الهواية المفضلة ديالي — الرسم والسبور (احتياطي 5)',
    slotDefaultValue: 'das Zeichnen und der regelmäßige Sport',
    einleitungDe:
      'Ich möchte heute über ein Hobby sprechen, das mir im Alltag sehr viel Freude macht. Das ist [SLOT].',
    warumDe:
      'Neben meinem Studium und dem Deutschlernen brauche ich einen kreativen und sportlichen Ausgleich, um den Kopf freizubekommen.',
    detailsDe:
      'Dreimal pro Woche mache ich Sport und am Abend zeichne ich gerne Skizzen oder spiele eine Runde Videospiele mit Freunden. Beim Zeichnen vergesse ich die Zeit und trainiere meine Geduld.',
    fazitDe:
      'Dieses Hobby hält mich körperlich und geistig fit und gibt mir jeden Tag neue Konzentration. Haben Sie noch Fragen?',
    darijaSummary:
      'منهجية مباشرة من البروفيل ديالك: السبور، الرسم وألعاب الفيديو كوسيلة للراحة والتركيز.',
  },
];
