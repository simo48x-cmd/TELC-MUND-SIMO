export interface SurgicalPaperSlot {
  caseNum: 1 | 2 | 3;
  origSub: string;
  origVerb: string;
  bodyAfterDass: string;
  finalVerb: string;
  dassClauseDe: string;
  arMeaning: string;
  surgicalDetail: string;
}

export interface SurgicalExamPaperData {
  id: number;
  webTitle: string;
  paperTitle: string;
  pdfPage: number;
  originalArticleDe: string;
  slot2_fikra1: SurgicalPaperSlot;
  slot3_fikra2: SurgicalPaperSlot;
  slot4_ijabia: SurgicalPaperSlot;
  slot5_salbia: SurgicalPaperSlot;
  slot6_marokko: {
    universalJokerDe: string;
    universalJokerAr: string;
    specificMoroccoDe: string;
    specificMoroccoAr: string;
  };
}

export const UNIVERSAL_MOROCCO_JOKER = {
  de: 'dieses Thema heute sehr aktuell ist und die Menschen viel darüber sprechen',
  ar: 'هذا الموضوع اليوم راهني ومهم جداً والناس كيهضرو عليه بزاف',
};

export const TEIL2_SURGICAL_PAPER_PART1: Record<number, SurgicalExamPaperData> = {
  1: {
    id: 1,
    webTitle: 'Fast Food kann süchtig machen',
    paperTitle: 'Fast Food kann süchtig machen',
    pdfPage: 16,
    originalArticleDe:
      'Einer neuen US-Studie zufolge machen Hamburger, Pommes & Co. nicht nur dick, sondern auch süchtig. In Tierversuchen fanden Forscher heraus, dass Ratten, die mit sehr fettreichen und zuckerhaltigen Produkten gefüttert wurden, sehr schnell ein zwanghaftes Essverhalten entwickelten. Im Gehirn der Tiere liefen dabei ganz ähnliche Prozesse ab wie bei einer Abhängigkeit von Drogen wie Kokain oder Heroin. Selbst als die Forscher die Ratten mit leichten Stromschlägen bestraften, konnten die Tiere nicht mehr von dem ungesunden Essen lassen. Als man ihnen später wieder gesundes Futter gab, verweigerten sie tagelang die Nahrung. Ernährungsexperten fordern deshalb schon lange eine strengere Kontrolle oder sogar eine Sondersteuer auf ungesunde Fertigprodukte. Viele Verbraucher essen Fast Food jedoch weiterhin gern, weil es im stressigen Alltag viel Zeit spart, überall verfügbar ist und gut schmeckt.',
    slot2_fikra1: {
      caseNum: 1,
      origSub:
        'Ratten, die mit sehr fettreichen und zuckerhaltigen Produkten gefüttert wurden, sehr schnell ein zwanghaftes Essverhalten entwickelten',
      origVerb: 'entwickelten',
      bodyAfterDass:
        'Ratten, die mit sehr fettreichen und zuckerhaltigen Produkten gefüttert wurden, sehr schnell ein zwanghaftes Essverhalten',
      finalVerb: 'entwickelten',
      dassClauseDe:
        'Ratten, die mit sehr fettreichen und zuckerhaltigen Produkten gefüttert wurden, sehr schnell ein zwanghaftes Essverhalten entwickelten',
      arMeaning:
        'الفئران لي توكلو منتجات عامرة بالدهون والسكر طورو دغيا سلوك أكل قهري (إدمان)',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): الجملة كتبدا أصلاً بـ dass فـ السطر 2 ديال الورقة! غير انسخ من Ratten حتى لـ entwickelten وحطها كيما هي بلا ما تبدل حتى حرف.',
    },
    slot3_fikra2: {
      caseNum: 3,
      origSub:
        'Im Gehirn der Tiere liefen dabei ganz ähnliche Prozesse ab wie bei einer Abhängigkeit von Drogen',
      origVerb: 'liefen ... ab',
      bodyAfterDass:
        'im Gehirn der Tiere dabei ganz ähnliche Prozesse wie bei einer Abhängigkeit von Drogen',
      finalVerb: 'abliefen',
      dassClauseDe:
        'im Gehirn der Tiere dabei ganz ähnliche Prozesse wie bei einer Abhängigkeit von Drogen abliefen',
      arMeaning:
        'فـ الدماغ ديال الحيوانات طراو عمليات كتشبه بزاف للإدمان على المخدرات',
      surgicalDetail:
        'الحالة 3 (فعل منفصل): فـ الورقة كاين الفعل المنفصل (liefen ... ab). ملي دخلناها مورا dass جمعناهم بجوج فـ اللخر وولات: abliefen.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'es im stressigen Alltag viel Zeit spart, überall verfügbar ist und gut schmeckt',
      origVerb: 'spart / schmeckt',
      bodyAfterDass:
        'es im stressigen Alltag viel Zeit spart, überall verfügbar ist und gut',
      finalVerb: 'schmeckt',
      dassClauseDe:
        'es im stressigen Alltag viel Zeit spart, überall verfügbar ist und gut schmeckt',
      arMeaning:
        'هاد الماكلة كتربح الوقت فـ الحياة اليومية العامرة بالستريس، متوفرة فين ما كان وكتجي بنينة',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر الأخير ديال الورقة الجملة بادية بـ weil (لأن)، يعني الأفعال (spart, ist, schmeckt) أصلاً مرتبين فـ اللخر! غير حيد weil وحطها مورا dass.',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'konnten die Tiere nicht mehr von dem ungesunden Essen lassen',
      origVerb: 'konnten',
      bodyAfterDass:
        'die Tiere nicht mehr von dem ungesunden Essen lassen',
      finalVerb: 'konnten',
      dassClauseDe:
        'die Tiere nicht mehr von dem ungesunden Essen lassen konnten',
      arMeaning:
        'الحيوانات ما بقاوش قادرين يتخلاو على هاد الماكلة غير الصحية بسبب الإدمان',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل المصرف (konnten) من الوسط ورميناه لآخر الجملة مورا lassen.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'viele junge Leute in großen Städten wie Fès gerne Fast Food essen, aber die Familien zu Hause lieber gesund und frisch kochen',
      specificMoroccoAr:
        'بزاف د الشباب فمدن كبار بحال فاس كيبغيو الفاست فود، ولكن العائلات فالدار كيفضلو يطيبو ماكلة صحية وطازجة',
    },
  },
  2: {
    id: 2,
    webTitle: 'Selbst gekocht schmeckt besser',
    paperTitle: 'Selbst gekocht schmeckt besser',
    pdfPage: 17,
    originalArticleDe:
      'Fertiggerichte sind praktisch: Packung aufreißen, ab in die Mikrowelle und in fünf Minuten steht das Essen auf dem Tisch. Doch immer mehr Menschen kehren zurück an den eigenen Herd. Laut einer aktuellen Umfrage kochen über 60 Prozent der Deutschen wieder regelmäßig selbst, besonders am Wochenende mit Freunden oder der Familie. Wer selbst kocht, weiß ganz genau, welche Zutaten im Topf landen, und vermeidet künstliche Zusatzstoffe, Geschmacksverstärker und versteckten Zucker. Außerdem macht das gemeinsame Schnippeln und Braten in der Küche Spaß und entspannt nach einem langen Arbeitstag. Natürlich kostet das Einkaufen von frischem Gemüse und das Kochen nach Feierabend deutlich mehr Zeit und Mühe als eine Tiefkühlpizza.',
    slot2_fikra1: {
      caseNum: 2,
      origSub: 'immer mehr Menschen kehren zurück an den eigenen Herd',
      origVerb: 'kehren ... zurück',
      bodyAfterDass: 'immer mehr Menschen an den eigenen Herd',
      finalVerb: 'zurückkehren',
      dassClauseDe: 'immer mehr Menschen an den eigenen Herd zurückkehren',
      arMeaning: 'بزاف د الناس ولاو كيرجعو يطيبو فـ كوزينتهم بيديهم',
      surgicalDetail:
        'الحالة 3 (فعل منفصل): فـ الورقة كاين (kehren zurück). جمعناهم فـ آخر الجملة مورا dass وولات: zurückkehren.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'kochen über 60 Prozent der Deutschen wieder regelmäßig selbst',
      origVerb: 'kochen',
      bodyAfterDass: 'über 60 Prozent der Deutschen wieder regelmäßig selbst',
      finalVerb: 'kochen',
      dassClauseDe:
        'über 60 Prozent der Deutschen wieder regelmäßig selbst kochen',
      arMeaning: 'أكثر من 60% ديال الألمان ولاو كيطيبو بانتظام لراسهم',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل المصرف (kochen) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'macht das gemeinsame Schnippeln und Braten in der Küche Spaß und entspannt nach einem langen Arbeitstag',
      origVerb: 'macht / entspannt',
      bodyAfterDass:
        'das gemeinsame Schnippeln und Braten in der Küche Spaß macht und nach einem langen Arbeitstag',
      finalVerb: 'entspannt',
      dassClauseDe:
        'das gemeinsame Schnippeln und Braten in der Küche Spaß macht und nach einem langen Arbeitstag entspannt',
      arMeaning:
        'التقطاع والطياب الجماعي فـ الكوزينة كيمتع وكيريح مور نهار طويل د الخدمة',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): ردينا macht مورا Spaß وخلينا الفعل التاني entspannt فـ آخر الجملة.',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'kostet das Einkaufen von frischem Gemüse und das Kochen nach Feierabend deutlich mehr Zeit und Mühe',
      origVerb: 'kostet',
      bodyAfterDass:
        'das Einkaufen von frischem Gemüse und das Kochen nach Feierabend deutlich mehr Zeit und Mühe',
      finalVerb: 'kostet',
      dassClauseDe:
        'das Einkaufen von frischem Gemüse und das Kochen nach Feierabend deutlich mehr Zeit und Mühe kostet',
      arMeaning:
        'التقدية ديال الخضرة الطرية والطياب مور الخدمة كياخدو وقت ومجهود كثر',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (kostet) من وسط الجملة ورميناه لآخر الجملة مورا Mühe.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'fast alle Familien jeden Tag frisch zu Hause kochen, zum Beispiel Tajine oder Couscous',
      specificMoroccoAr:
        'تقريباً كاع العائلات كيطيبو كل نهار ماكلة طرية فالدار بحال الطاجين أو الكسكسو',
    },
  },
  3: {
    id: 3,
    webTitle: 'Tierversuche: Pro & Contra',
    paperTitle: 'Tierversuche in der Forschung',
    pdfPage: 18,
    originalArticleDe:
      'Jedes Jahr werden in europäischen Laboren Millionen von Mäusen, Ratten, Kaninchen und Affen für wissenschaftliche Experimente eingesetzt. Befürworter aus der Medizin argumentieren, dass man schwere Krankheiten wie Krebs, Alzheimer oder Herzfehler nur an einem lebenden Organismus wirklich erforschen kann. Fast alle wichtigen Medikamente, Impfstoffe und modernen Operationsmethoden wurden mithilfe von Tierversuchen entwickelt, um das Risiko für menschliche Patienten zu minimieren. Tierschützer halten dagegen, dass die Tiere in engen Käfigen enorm leiden, großen Stress erleben und am Ende der Versuche meistens getötet werden. Zudem lassen sich die Ergebnisse von Tieren oft gar nicht eins zu eins auf den Menschen übertragen, weshalb Forscher heute immer stärker mit künstlichen Zellkulturen und Computersimulationen arbeiten.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'jedes Jahr werden in europäischen Laboren Millionen von Mäusen, Ratten, Kaninchen und Affen für wissenschaftliche Experimente eingesetzt',
      origVerb: 'werden',
      bodyAfterDass:
        'jedes Jahr in europäischen Laboren Millionen von Mäusen, Ratten, Kaninchen und Affen für wissenschaftliche Experimente eingesetzt',
      finalVerb: 'werden',
      dassClauseDe:
        'jedes Jahr in europäischen Laboren Millionen von Mäusen, Ratten, Kaninchen und Affen für wissenschaftliche Experimente eingesetzt werden',
      arMeaning:
        'كل عام كيتستعملو ملايين ديال الفئران والأرانب والقردة فـ المختبرات الأوروبية للتجارب العلمية',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل المساعد (werden) من المركز 2 وحطيناه فـ اللخر مورا eingesetzt.',
    },
    slot3_fikra2: {
      caseNum: 1,
      origSub:
        'man schwere Krankheiten wie Krebs, Alzheimer oder Herzfehler nur an einem lebenden Organismus wirklich erforschen kann',
      origVerb: 'kann',
      bodyAfterDass:
        'man schwere Krankheiten wie Krebs, Alzheimer oder Herzfehler nur an einem lebenden Organismus wirklich erforschen',
      finalVerb: 'kann',
      dassClauseDe:
        'man schwere Krankheiten wie Krebs, Alzheimer oder Herzfehler nur an einem lebenden Organismus wirklich erforschen kann',
      arMeaning:
        'الأمراض الصعيبة بحال السرطان والزهايمر يقدرو يتدرسو بصح غير فـ جسم حي',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): الجملة فـ السطر 2 ديال الورقة مكتوبة أصلاً مورا dass والفعل (kann) واجد فـ اللخر! غير انسخها.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'fast alle wichtigen Medikamente, Impfstoffe und modernen Operationsmethoden wurden mithilfe von Tierversuchen entwickelt',
      origVerb: 'wurden',
      bodyAfterDass:
        'fast alle wichtigen Medikamente, Impfstoffe und modernen Operationsmethoden mithilfe von Tierversuchen entwickelt',
      finalVerb: 'wurden',
      dassClauseDe:
        'fast alle wichtigen Medikamente, Impfstoffe und modernen Operationsmethoden mithilfe von Tierversuchen entwickelt wurden',
      arMeaning:
        'تقريباً كاع الأدوية المهمة واللقاحات وطرق العمليات تطورات بفضل التجارب على الحيوانات',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (wurden) من الوسط ورميناه لآخر الجملة مورا entwickelt.',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'die Tiere in engen Käfigen enorm leiden, großen Stress erleben und am Ende der Versuche meistens getötet werden',
      origVerb: 'werden',
      bodyAfterDass:
        'die Tiere in engen Käfigen enorm leiden, großen Stress erleben und am Ende der Versuche meistens getötet',
      finalVerb: 'werden',
      dassClauseDe:
        'die Tiere in engen Käfigen enorm leiden, großen Stress erleben und am Ende der Versuche meistens getötet werden',
      arMeaning:
        'الحيوانات فـ الأقفاص الضيقة كيتعذبو بزاف، كيعيشو ستريس كبير وفـ اللخر كيتقتلو',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): الجملة فـ السطر 6 ديال الورقة بادية أصلاً بـ dass والأفعال (leiden, erleben, getötet werden) واجدين فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'der Tierschutz immer wichtiger wird und Forscher nach modernen Alternativen im Labor suchen',
      specificMoroccoAr:
        'حماية الحيوان غادية وكتولي مهمة والباحثين كيقلبو على بدائل حديثة فالمختبر',
    },
  },
  4: {
    id: 4,
    webTitle: 'Ist „bequemes Essen“ gesund? (Convenience Food)',
    paperTitle: 'Ist „bequemes Essen“ gesund?',
    pdfPage: 19,
    originalArticleDe:
      'Tiefkühlpizza, Dosensuppen, fertige Salate und Mikrowellengerichte – sogenanntes „Convenience Food“ liegt voll im Trend. In vielen Haushalten fehlt unter der Woche schlicht die Zeit, um nach der Arbeit noch stundenlang frisch zu kochen. Für Berufstätige und Singles ist das bequeme Essen aus dem Supermarkt eine enorme Erleichterung, weil die Zubereitung kinderleicht ist und kaum Geschirr schmutzig wird. Ernährungswissenschaftler warnen jedoch davor, sich ausschließlich von Fertigprodukten zu ernähren. Um Geschmack und Haltbarkeit zu garantieren, setzen die Hersteller oft große Mengen an Fett, Salz, Zucker und chemischen Konservierungsstoffen ein, während wichtige Vitamine und Ballaststoffe bei der industriellen Verarbeitung verloren gehen.',
    slot2_fikra1: {
      caseNum: 2,
      origSub: 'sogenanntes „Convenience Food“ liegt voll im Trend',
      origVerb: 'liegt',
      bodyAfterDass: 'sogenanntes „Convenience Food“ voll im Trend',
      finalVerb: 'liegt',
      dassClauseDe: 'sogenanntes „Convenience Food“ voll im Trend liegt',
      arMeaning: 'الماكلة السريعة والواجدة ولات موضة منتشرة بزاف',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (liegt) من الوسط وحطيناه فـ اللخر مورا im Trend.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'in vielen Haushalten fehlt unter der Woche schlicht die Zeit, um nach der Arbeit noch stundenlang frisch zu kochen',
      origVerb: 'fehlt',
      bodyAfterDass:
        'in vielen Haushalten unter der Woche schlicht die Zeit fehlt, um nach der Arbeit noch stundenlang frisch zu',
      finalVerb: 'kochen',
      dassClauseDe:
        'in vielen Haushalten unter der Woche schlicht die Zeit fehlt, um nach der Arbeit noch stundenlang frisch zu kochen',
      arMeaning:
        'فـ بزاف د الديور وسط السيمانة ما كاينش الوقت باش الواحد يطيب ماكلة طرية مور الخدمة',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): ردينا الفعل المصرف (fehlt) لآخر الشطر الأول مورا die Zeit وبقات um ... zu kochen مكملة الجملة.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'die Zubereitung kinderleicht ist und kaum Geschirr schmutzig wird',
      origVerb: 'ist / wird',
      bodyAfterDass:
        'die Zubereitung kinderleicht ist und kaum Geschirr schmutzig',
      finalVerb: 'wird',
      dassClauseDe:
        'die Zubereitung kinderleicht ist und kaum Geschirr schmutzig wird',
      arMeaning: 'التحضير ديالها ساهل بزاف وما كيوسخش الماعن فـ الكوزينة',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 5 ديال الورقة الجملة جاية مورا weil، يعني الأفعال (ist, wird) أصلاً فـ اللخر! غير حيد weil وحطها.',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'wichtige Vitamine und Ballaststoffe bei der industriellen Verarbeitung verloren gehen',
      origVerb: 'gehen',
      bodyAfterDass:
        'wichtige Vitamine und Ballaststoffe bei der industriellen Verarbeitung verloren',
      finalVerb: 'gehen',
      dassClauseDe:
        'wichtige Vitamine und Ballaststoffe bei der industriellen Verarbeitung verloren gehen',
      arMeaning: 'الفيتامينات والألياف المهمة كتضيع فـ التصنيع الغذائي',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر الأخير ديال الورقة الجملة جاية مورا während والفعل (gehen) أصلاً فـ اللخر! غير حيد während وحطها.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'frisches Gemüse und Obst auf dem Markt sehr günstig sind und die Menschen lieber frisch kochen',
      specificMoroccoAr:
        'الخضرة والفواكه الطرية فالسوق رخاص والناس كيفضلو يطيبو طري',
    },
  },
  5: {
    id: 5,
    webTitle: 'Sollen Schönheitsoperationen verboten werden?',
    paperTitle: 'Schönheitsoperationen bei Jugendlichen',
    pdfPage: 20,
    originalArticleDe:
      'Eine kleinere Nase, vollere Lippen oder ein flacher Bauch: Immer mehr Menschen legen sich für ihr Wunsch-Aussehen unters Messer – darunter auch immer mehr Jugendliche unter 18 Jahren. Durch soziale Medien und bearbeitete Fotos von Influencern entsteht schon bei Teenagern ein enormer Druck, einem vermeintlich perfekten Schönheitsideal zu entsprechen. Befürworter sagen, dass ein chirurgischer Eingriff das Selbstbewusstsein stärken kann, wenn jemand extrem unter einem körperlichen Makel wie abstehenden Ohren oder den Folgen eines Unfalls leidet. Mediziner und Politiker fordern hingegen ein gesetzliches Verbot von rein kosmetischen Operationen bei Minderjährigen, weil sich der Körper noch im Wachstum befindet und jede Operation mit Narkose- und Infektionsrisiken sowie hohen Kosten verbunden ist.',
    slot2_fikra1: {
      caseNum: 3,
      origSub:
        'Immer mehr Menschen legen sich für ihr Wunsch-Aussehen unters Messer',
      origVerb: 'legen',
      bodyAfterDass: 'sich immer mehr Menschen für ihr Wunsch-Aussehen unters Messer',
      finalVerb: 'legen',
      dassClauseDe:
        'sich immer mehr Menschen für ihr Wunsch-Aussehen unters Messer legen',
      arMeaning:
        'بزاف د الناس ولاو كيديرو عمليات التجميل باش يوصلو للشكل لي باغيين',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (legen) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'durch soziale Medien und bearbeitete Fotos von Influencern entsteht schon bei Teenagern ein enormer Druck',
      origVerb: 'entsteht',
      bodyAfterDass:
        'durch soziale Medien und bearbeitete Fotos von Influencern schon bei Teenagern ein enormer Druck',
      finalVerb: 'entsteht',
      dassClauseDe:
        'durch soziale Medien und bearbeitete Fotos von Influencern schon bei Teenagern ein enormer Druck entsteht',
      arMeaning:
        'بسبب مواقع التواصل والصور المعدلة ديال المؤثرين كيتخلق ضغط كبير عند المراهقين',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (entsteht) من الوسط ورميناه لآخر الجملة مورا Druck.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'ein chirurgischer Eingriff das Selbstbewusstsein stärken kann, wenn jemand extrem unter einem körperlichen Makel wie abstehenden Ohren oder den Folgen eines Unfalls leidet',
      origVerb: 'kann / leidet',
      bodyAfterDass:
        'ein chirurgischer Eingriff das Selbstbewusstsein stärken kann, wenn jemand extrem unter einem körperlichen Makel',
      finalVerb: 'leidet',
      dassClauseDe:
        'ein chirurgischer Eingriff das Selbstbewusstsein stärken kann, wenn jemand extrem unter einem körperlichen Makel leidet',
      arMeaning:
        'التدخل الجراحي يقدر يقوي الثقة فـ النفس إلا كان الواحد كيعاني بزاف من شي عيب جسدي أو حادثة',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 5 ديال الورقة الجملة بادية أصلاً بـ dass والأفعال (kann / leidet) واجدين فـ اللخر!',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'sich der Körper noch im Wachstum befindet und jede Operation mit Narkose- und Infektionsrisiken sowie hohen Kosten verbunden ist',
      origVerb: 'befindet / ist',
      bodyAfterDass:
        'sich der Körper noch im Wachstum befindet und jede Operation mit Narkose- und Infektionsrisiken sowie hohen Kosten verbunden',
      finalVerb: 'ist',
      dassClauseDe:
        'sich der Körper noch im Wachstum befindet und jede Operation mit Narkose- und Infektionsrisiken sowie hohen Kosten verbunden ist',
      arMeaning:
        'الجسم كيكون مازال فـ طور النمو وكل عملية مرتبطة بمخاطر البنج والتعفنات وتكاليف غالية',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر الأخير الجملة بادية بـ weil، يعني الأفعال (befindet, ist) أصلاً فـ اللخر! غير حيد weil وحطها.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'natürliche Schönheit geschätzt wird und solche Operationen für die meisten Menschen viel zu teuer sind',
      specificMoroccoAr:
        'الجمال الطبيعي كيتقدر وهاد العمليات غالية بزاف على أغلبية الناس',
    },
  },
  6: {
    id: 6,
    webTitle: 'Antibiotika – gibt es Alternativen?',
    paperTitle: 'Antibiotika – Fluch oder Segen?',
    pdfPage: 21,
    originalArticleDe:
      'Seit der Entdeckung des Penicillins gelten Antibiotika als die schärfste Waffe der modernen Medizin gegen bakterielle Infektionen. Sie haben Millionen Menschen das Leben gerettet. Doch heute schlagen Weltgesundheitsorganisation und Ärzte Alarm: Weil Antibiotika jahrzehntelang viel zu häufig und oft auch unnötig bei harmlosen Erkältungen verschrieben wurden, sowie massiv in der Massentierhaltung eingesetzt werden, entwickeln immer mehr Bakterien gefährliche Resistenzen. Die Medikamente verlieren ihre Wirkung. Forscher suchen deshalb intensiv nach natürlichen Alternativen wie Heilpflanzen, ätherischen Ölen oder speziellen Viren, sogenannten Bakteriophagen, die gezielt nur schädliche Bakterien angreifen, ohne die gesunde Darmflora des Patienten zu zerstören.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'gelten Antibiotika als die schärfste Waffe der modernen Medizin gegen bakterielle Infektionen',
      origVerb: 'gelten',
      bodyAfterDass:
        'Antibiotika als die schärfste Waffe der modernen Medizin gegen bakterielle Infektionen',
      finalVerb: 'gelten',
      dassClauseDe:
        'Antibiotika als die schärfste Waffe der modernen Medizin gegen bakterielle Infektionen gelten',
      arMeaning: 'المضادات الحيوية كتعتبر أقوى سلاح فـ الطب الحديث ضد التعفنات البكتيرية',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (gelten) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'Forscher suchen deshalb intensiv nach natürlichen Alternativen wie Heilpflanzen, ätherischen Ölen oder speziellen Viren',
      origVerb: 'suchen',
      bodyAfterDass:
        'Forscher deshalb intensiv nach natürlichen Alternativen wie Heilpflanzen, ätherischen Ölen oder speziellen Viren',
      finalVerb: 'suchen',
      dassClauseDe:
        'Forscher deshalb intensiv nach natürlichen Alternativen wie Heilpflanzen, ätherischen Ölen oder speziellen Viren suchen',
      arMeaning:
        'الباحثين كيقلبو بكثافة على بدائل طبيعية بحال الأعشاب الطبية والزيوت الأساسية',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (suchen) من المركز 2 ورميناه لآخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub: 'Sie haben Millionen Menschen das Leben gerettet',
      origVerb: 'haben',
      bodyAfterDass: 'sie Millionen Menschen das Leben gerettet',
      finalVerb: 'haben',
      dassClauseDe: 'sie Millionen Menschen das Leben gerettet haben',
      arMeaning: 'المضادات الحيوية عتقات حياة ملايين ديال الناس',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل المساعد (haben) من المركز 2 وحطيناه فـ اللخر مورا gerettet.',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'Antibiotika jahrzehntelang viel zu häufig und oft auch unnötig bei harmlosen Erkältungen verschrieben wurden',
      origVerb: 'wurden',
      bodyAfterDass:
        'Antibiotika jahrzehntelang viel zu häufig und oft auch unnötig bei harmlosen Erkältungen verschrieben',
      finalVerb: 'wurden',
      dassClauseDe:
        'Antibiotika jahrzehntelang viel zu häufig und oft auch unnötig bei harmlosen Erkältungen verschrieben wurden',
      arMeaning:
        'المضادات الحيوية تعطات لعقود بكثرة وبلا داعي حتى فـ الرواح العادي وهادشي كيخليها تفقد المفعول ديالها',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 4 ديال الورقة الجملة بادية بـ Weil والفعل (wurden) أصلاً فـ اللخر! غير حيد Weil وحطها.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'viele Menschen bei einer leichten Erkältung zuerst natürliche Hausmittel wie Kräutertee, Honig und Olivenöl nehmen',
      specificMoroccoAr:
        'بزاف د الناس فاش كيضربهم البرد كياخدو بعدا وصفات طبيعية د الدار بحال الأعشاب والعسل وزيت العود',
    },
  },
  7: {
    id: 7,
    webTitle: 'Leistungssport und Gesundheit',
    paperTitle: 'Ist Leistungssport noch gesund?',
    pdfPage: 22,
    originalArticleDe:
      'Regelmäßige Bewegung hält fit, stärkt das Herz-Kreislauf-System und beugt vielen Krankheiten vor. Doch was passiert, wenn Sport zum extremen Beruf wird? Im modernen Hochleistungssport gehen Athleten täglich an ihre absoluten körperlichen und psychischen Grenzen. Um Medaillen zu gewinnen und Sponsoren zufriedenzustellen, trainieren viele Profisportler trotz Schmerzen weiter und nehmen starke Schmerzmittel. Sportmediziner beobachten, dass ehemalige Leistungssportler schon mit 35 oder 40 Jahren oft unter chronischen Gelenkschäden, kaputten Knien und Rückenproblemen leiden. Dennoch fasziniert der Spitzensport Millionen Zuschauer, fördert Disziplin und Teamgeist und bietet talentierten jungen Menschen die Chance auf Ruhm und finanziellen Erfolg.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'im modernen Hochleistungssport gehen Athleten täglich an ihre absoluten körperlichen und psychischen Grenzen',
      origVerb: 'gehen',
      bodyAfterDass:
        'im modernen Hochleistungssport Athleten täglich an ihre absoluten körperlichen und psychischen Grenzen',
      finalVerb: 'gehen',
      dassClauseDe:
        'im modernen Hochleistungssport Athleten täglich an ihre absoluten körperlichen und psychischen Grenzen gehen',
      arMeaning:
        'فـ الرياضة الاحترافية الحديثة الرياضيين كيوصلو كل نهار للحدود القصوى الجسدية والنفسية ديالهم',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (gehen) من الوسط ورميناه لآخر الجملة مورا Grenzen.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'trainieren viele Profisportler trotz Schmerzen weiter und nehmen starke Schmerzmittel',
      origVerb: 'trainieren ... weiter / nehmen',
      bodyAfterDass:
        'viele Profisportler trotz Schmerzen weitertrainieren und starke Schmerzmittel',
      finalVerb: 'nehmen',
      dassClauseDe:
        'viele Profisportler trotz Schmerzen weitertrainieren und starke Schmerzmittel nehmen',
      arMeaning:
        'بزاف د الرياضيين المحترفين كيكملو التداريب واخا فيهم الحريق وكياخدو مسكنات قوية',
      surgicalDetail:
        'الحالة 3 (جمع فعل منفصل + نقل للأخير): جمعنا trainieren ... weiter فـ weitertrainieren ورمينا nehmen لآخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'fasziniert der Spitzensport Millionen Zuschauer, fördert Disziplin und Teamgeist und bietet talentierten jungen Menschen die Chance auf Ruhm und finanziellen Erfolg',
      origVerb: 'fördert / bietet',
      bodyAfterDass:
        'der Spitzensport Disziplin und Teamgeist fördert und talentierten jungen Menschen die Chance auf Ruhm und finanziellen Erfolg',
      finalVerb: 'bietet',
      dassClauseDe:
        'der Spitzensport Disziplin und Teamgeist fördert und talentierten jungen Menschen die Chance auf Ruhm und finanziellen Erfolg bietet',
      arMeaning:
        'رياضة النخبة كتقوي الانضباط وروح الفريق وكتعطي للشباب الموهوبين فرصة للشهرة والنجاح المالي',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): ردينا fördert مورا Teamgeist ورمينا bietet لآخر الجملة.',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'ehemalige Leistungssportler schon mit 35 oder 40 Jahren oft unter chronischen Gelenkschäden, kaputten Knien und Rückenproblemen leiden',
      origVerb: 'leiden',
      bodyAfterDass:
        'ehemalige Leistungssportler schon mit 35 oder 40 Jahren oft unter chronischen Gelenkschäden, kaputten Knien und Rückenproblemen',
      finalVerb: 'leiden',
      dassClauseDe:
        'ehemalige Leistungssportler schon mit 35 oder 40 Jahren oft unter chronischen Gelenkschäden, kaputten Knien und Rückenproblemen leiden',
      arMeaning:
        'الرياضيين المحترفين القدام غير كيوصلو 35 أو 40 عام كيعانيو غالباً من مشاكل مزمنة فـ المفاصل والركابي والظهر',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 6 ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (leiden) واجد فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'Fußball und Laufen sehr beliebt sind und viele Jugendliche davon träumen, Profisportler zu werden',
      specificMoroccoAr:
        'الكورة والجري محبوبين بزاف وبزاف د الشباب كيحلمو يوليو رياضيين محترفين',
    },
  },
  8: {
    id: 8,
    webTitle: 'Gesund durch Lachen / Laufen',
    paperTitle: 'Lachen ist die beste Medizin',
    pdfPage: 23,
    originalArticleDe:
      'Der Volksmund sagt es schon lange, und die moderne Wissenschaft gibt ihm recht: Lachen ist gesund! Wenn wir herzlich lachen, sind über hundert Muskeln im ganzen Körper aktiv, vom Gesicht bis zum Zwerchfell. Die Lunge nimmt deutlich mehr Sauerstoff auf, das Herz schlägt schneller und der Blutdruck sinkt nach kurzer Zeit. Gleichzeitig baut das Gehirn Stresshormone wie Adrenalin und Cortisol ab und schüttet stattdessen Glückshormone – sogenannte Endorphine – aus, die sogar Schmerzen lindern und das Immunsystem stärken können. Kinder lachen noch bis zu 400 Mal am Tag, Erwachsene im stressigen Berufsalltag oft nur noch 15 Mal. Natürlich weisen Ärzte darauf hin, dass Lachtherapien oder Klinik-Clowns eine gute seelische Unterstützung sind, aber bei einer schweren Krankheit keine notwendigen Medikamente ersetzen können.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'die Lunge nimmt deutlich mehr Sauerstoff auf, das Herz schlägt schneller und der Blutdruck sinkt nach kurzer Zeit',
      origVerb: 'nimmt ... auf / sinkt',
      bodyAfterDass:
        'die Lunge beim Lachen deutlich mehr Sauerstoff aufnimmt und der Blutdruck nach kurzer Zeit',
      finalVerb: 'sinkt',
      dassClauseDe:
        'die Lunge beim Lachen deutlich mehr Sauerstoff aufnimmt und der Blutdruck nach kurzer Zeit sinkt',
      arMeaning: 'الرئة كتدخل أوكسجين كثر ملي كنضحكو وضغط الدم كيهبط من بعد وقت قصير',
      surgicalDetail:
        'الحالة 3 (جمع فعل منفصل + فعل فـ اللخر): جمعنا (nimmt ... auf) فـ aufnimmt وخلينا sinkt فـ آخر الجملة.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'Kinder lachen noch bis zu 400 Mal am Tag, Erwachsene im stressigen Berufsalltag oft nur noch 15 Mal',
      origVerb: 'lachen',
      bodyAfterDass:
        'Kinder noch bis zu 400 Mal am Tag lachen, Erwachsene im stressigen Berufsalltag aber oft nur noch 15 Mal',
      finalVerb: 'lachen',
      dassClauseDe:
        'Kinder noch bis zu 400 Mal am Tag lachen, Erwachsene im stressigen Berufsalltag aber oft nur noch 15 Mal lachen',
      arMeaning:
        'الأطفال كيضحكو حتى لـ 400 مرة فـ النهار بينما الكبار فـ ضغط الخدمة كيضحكو غير شي 15 مرة',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): حطينا الفعل (lachen) فـ آخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'die sogar Schmerzen lindern und das Immunsystem stärken können',
      origVerb: 'können',
      bodyAfterDass:
        'Glückshormone beim Lachen sogar Schmerzen lindern und das Immunsystem stärken',
      finalVerb: 'können',
      dassClauseDe:
        'Glückshormone beim Lachen sogar Schmerzen lindern und das Immunsystem stärken können',
      arMeaning: 'هرمونات السعادة ملي كنضحكو كتخفف الآلام وكتقوي جهاز المناعة',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 6 ديال الورقة الجملة الموصولة مسالية أصلاً بـ (lindern und das Immunsystem stärken können)!',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'Lachtherapien oder Klinik-Clowns eine gute seelische Unterstützung sind, aber bei einer schweren Krankheit keine notwendigen Medikamente ersetzen können',
      origVerb: 'können',
      bodyAfterDass:
        'Lachtherapien oder Klinik-Clowns zwar eine gute seelische Unterstützung sind, aber bei einer schweren Krankheit keine notwendigen Medikamente ersetzen',
      finalVerb: 'können',
      dassClauseDe:
        'Lachtherapien oder Klinik-Clowns zwar eine gute seelische Unterstützung sind, aber bei einer schweren Krankheit keine notwendigen Medikamente ersetzen können',
      arMeaning:
        'العلاج بالضحك كيدعم النفسية مزيان، ولكن فـ مرض خطير ما يقدرش يعوض الأدوية الضرورية',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر الأخير ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (können) واجد فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'die Menschen sehr herzlich und humorvoll sind und viel zusammen mit Freunden und der Familie lachen',
      specificMoroccoAr:
        'الناس ضراف ونشاط وكيتجمعو يضحكو بزاف مع الصحاب والعائلة',
    },
  },
  9: {
    id: 9,
    webTitle: 'Solarium im Winter',
    paperTitle: 'Künstliche Sonne im Winter – Solarium',
    pdfPage: 24,
    originalArticleDe:
      'Wenn die Tage im Herbst und Winter kurz, grau und kalt werden, sehnen sich viele Menschen nach Licht und Wärme. Einige gehen deshalb regelmäßig ins Solarium, um auch in der dunklen Jahreszeit eine gebräunte Haut zu behalten und ihre Stimmung zu heben. Betreiber von Sonnenstudios werben damit, dass das warme Licht gegen den sogenannten „Winterblues“ hilft und die Entspannung fördert. Hautärzte und die Weltgesundheitsorganisation warnen jedoch eindringlich vor der künstlichen UV-Strahlung. Die hochdosierten UV-Strahlen auf der Sonnenbank schädigen die Hautzellen tiefgreifend, lassen die Haut viel schneller altern und erhöhen das Risiko, an gefährlichem Hautkrebs zu erkranken, drastisch – besonders bei jungen Menschen unter 18 Jahren.',
    slot2_fikra1: {
      caseNum: 1,
      origSub:
        'die Tage im Herbst und Winter kurz, grau und kalt werden',
      origVerb: 'werden',
      bodyAfterDass:
        'viele Menschen im Herbst und Winter Licht und Wärme suchen, wenn die Tage kurz, grau und kalt',
      finalVerb: 'werden',
      dassClauseDe:
        'viele Menschen im Herbst und Winter Licht und Wärme suchen, wenn die Tage kurz, grau und kalt werden',
      arMeaning:
        'بزاف د الناس كيقلبو على الضو والسخونية فـ الخريف والشتاء ملي كيقصارو الأيام وكيوليو باردين',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): الجملة فـ السطر 1 ديال الورقة بادية بـ Wenn والفعل (werden) واجد فـ اللخر!',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'einige gehen deshalb regelmäßig ins Solarium, um auch in der dunklen Jahreszeit eine gebräunte Haut zu behalten',
      origVerb: 'gehen',
      bodyAfterDass:
        'einige Menschen regelmäßig ins Solarium gehen, um auch in der dunklen Jahreszeit eine gebräunte Haut zu',
      finalVerb: 'behalten',
      dassClauseDe:
        'einige Menschen regelmäßig ins Solarium gehen, um auch in der dunklen Jahreszeit eine gebräunte Haut zu behalten',
      arMeaning: 'بعض الناس كيمشيو بانتظام للسولاريوم باش يحافظو على سمورية الجلد فـ فصل الشتاء',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): ردينا الفعل (gehen) مورا Solarium وبقات um ... zu behalten فـ اللخر.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'das warme Licht gegen den sogenannten „Winterblues“ hilft und die Entspannung fördert',
      origVerb: 'hilft / fördert',
      bodyAfterDass:
        'das warme Licht gegen den sogenannten „Winterblues“ hilft und die Entspannung',
      finalVerb: 'fördert',
      dassClauseDe:
        'das warme Licht gegen den sogenannten „Winterblues“ hilft und die Entspannung fördert',
      arMeaning: 'الضو الدافئ كيعاون ضد كآبة الشتاء وكيشجع على الاسترخاء',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 4 ديال الورقة الجملة مكتوبة أصلاً مورا dass والأفعال (hilft, fördert) واجدين فـ اللخر!',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'die hochdosierten UV-Strahlen auf der Sonnenbank schädigen die Hautzellen tiefgreifend',
      origVerb: 'schädigen',
      bodyAfterDass:
        'die hochdosierten UV-Strahlen auf der Sonnenbank die Hautzellen tiefgreifend',
      finalVerb: 'schädigen',
      dassClauseDe:
        'die hochdosierten UV-Strahlen auf der Sonnenbank die Hautzellen tiefgreifend schädigen',
      arMeaning:
        'أشعة UV القوية فـ السولاريوم كتضر خلايا الجلد بعمق وكتزيد خطر سرطان الجلد',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (schädigen) من الوسط ورميناه لآخر الجملة.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'wir fast das ganze Jahr über echte Sonne haben und deshalb niemand ein Solarium braucht',
      specificMoroccoAr:
        'حنا عندنا الشمس الحقيقية العام كامل تقريباً وعلى داكشي حتى واحد ما كيحتاج السولاريوم',
    },
  },
  10: {
    id: 10,
    webTitle: 'Wie entwickelt sich die Ernährung?',
    paperTitle: 'Wie entwickelt sich unsere Ernährung in der Zukunft?',
    pdfPage: 25,
    originalArticleDe:
      'Die Weltbevölkerung wächst rasant, und gleichzeitig sorgt der Klimawandel für extreme Wetterbedingungen in der Landwirtschaft. Forscher beschäftigen sich deshalb intensiv mit der Frage, was in 20 oder 30 Jahren auf unseren Tellern liegen wird. Klar ist, dass der heutige hohe Fleischkonsum auf Dauer nicht tragbar ist, weil die Viehzucht riesige Mengen an Wasser, Getreide und Land verbraucht und klimaschädliche Gase verursacht. Als Alternativen der Zukunft gelten pflanzliche Fleischersatzprodukte aus Erbsen oder Soja, nährstoffreiche Algen, essbare Insekten sowie im Labor gezüchtetes „In-vitro-Fleisch“. Während eine pflanzenbasierte Ernährung die Umwelt schont und gesund für das Herz ist, stehen viele Verbraucher künstlichem Laborfleisch und Insekten noch mit großer Skepsis und Ekel gegenüber.',
    slot2_fikra1: {
      caseNum: 1,
      origSub:
        'der heutige hohe Fleischkonsum auf Dauer nicht tragbar ist',
      origVerb: 'ist',
      bodyAfterDass: 'der heutige hohe Fleischkonsum auf Dauer nicht tragbar',
      finalVerb: 'ist',
      dassClauseDe: 'der heutige hohe Fleischkonsum auf Dauer nicht tragbar ist',
      arMeaning: 'الاستهلاك العالي ديال اللحم اليوم ما يمكنش يستمر على المدى الطويل',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 4 ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (ist) واجد فـ اللخر!',
    },
    slot3_fikra2: {
      caseNum: 1,
      origSub:
        'die Viehzucht riesige Mengen an Wasser, Getreide und Land verbraucht und klimaschädliche Gase verursacht',
      origVerb: 'verbraucht / verursacht',
      bodyAfterDass:
        'die Viehzucht riesige Mengen an Wasser, Getreide und Land verbraucht und klimaschädliche Gase',
      finalVerb: 'verursacht',
      dassClauseDe:
        'die Viehzucht riesige Mengen an Wasser, Getreide und Land verbraucht und klimaschädliche Gase verursacht',
      arMeaning:
        'تربية المواشي كتستهلك كميات ضخمة ديال الما والحبوب والأرض وكتسبب غازات مضرة بالمناخ',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 5 ديال الورقة الجملة بادية بـ weil، يعني الأفعال (verbraucht, verursacht) واجدين فـ اللخر! غير حيد weil وحطها.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'eine pflanzenbasierte Ernährung die Umwelt schont und gesund für das Herz ist',
      origVerb: 'schont / ist',
      bodyAfterDass:
        'eine pflanzenbasierte Ernährung die Umwelt schont und gesund für das Herz',
      finalVerb: 'ist',
      dassClauseDe:
        'eine pflanzenbasierte Ernährung die Umwelt schont und gesund für das Herz ist',
      arMeaning: 'التغذية النباتية كتحافظ على البيئة وصحية للقلب',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 8 ديال الورقة الجملة بادية بـ Während والأفعال (schont, ist) واجدين فـ اللخر! غير حيد Während وحطها.',
    },
    slot5_salbia: {
      caseNum: 3,
      origSub:
        'stehen viele Verbraucher künstlichem Laborfleisch und Insekten noch mit großer Skepsis und Ekel gegenüber',
      origVerb: 'stehen ... gegenüber',
      bodyAfterDass:
        'viele Verbraucher künstlichem Laborfleisch und Insekten noch mit großer Skepsis und Ekel',
      finalVerb: 'gegenüberstehen',
      dassClauseDe:
        'viele Verbraucher künstlichem Laborfleisch und Insekten noch mit großer Skepsis und Ekel gegenüberstehen',
      arMeaning:
        'بزاف د المستهلكين كيشوفو اللحم المصنع فالمختبر والحشرات بشك وتقزز كبير',
      surgicalDetail:
        'الحالة 3 (فعل منفصل): فـ السطر الأخير كاين الفعل المنفصل (stehen ... gegenüber). جمعناهم فـ اللخر مورا dass وولات: gegenüberstehen.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'unsere traditionelle Küche schon immer viel gesundes Gemüse, Linsen, Kichererbsen und Olivenöl nutzt',
      specificMoroccoAr:
        'الماكلة التقليدية ديالنا من ديما كتستعمل بزاف د الخضرة الصحية والعدس والحمص وزيت العود',
    },
  },
  11: {
    id: 11,
    webTitle: 'Rette Leben mit Blutspende / Organspende',
    paperTitle: 'Blut- und Organspende rettet Leben',
    pdfPage: 26,
    originalArticleDe:
      'Jeden Tag werden in Krankenhäusern tausende Blutkonserven und Spenderorgane für Notoperationen, Unfallopfer und schwer kranke Krebspatienten benötigt. Da man menschliches Blut bis heute nicht künstlich im Labor herstellen kann, ist die Medizin komplett auf freiwillige Spender angewiesen. Eine Blutspende dauert nur etwa eine halbe Stunde, ist für gesunde Erwachsene völlig ungefährlich und beinhaltet gleichzeitig einen kostenlosen Gesundheitscheck des eigenen Blutes. Trotzdem spenden nur rund drei Prozent der Bevölkerung regelmäßig Blut, und auch die Zahl der Organspender ist seit Jahren viel zu niedrig. Viele Menschen haben unbegründete Angst vor Nadeln, fühlen sich nicht ausreichend informiert oder schieben die Entscheidung im Alltag einfach vor sich her.',
    slot2_fikra1: {
      caseNum: 1,
      origSub:
        'man menschliches Blut bis heute nicht künstlich im Labor herstellen kann',
      origVerb: 'kann',
      bodyAfterDass:
        'man menschliches Blut bis heute nicht künstlich im Labor herstellen',
      finalVerb: 'kann',
      dassClauseDe:
        'man menschliches Blut bis heute nicht künstlich im Labor herstellen kann',
      arMeaning: 'دم الإنسان ما يمكنش يتصاوب اصطناعياً فـ المختبر حتى لليوم',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 2 ديال الورقة الجملة بادية بـ Da والفعل (kann) أصلاً فـ اللخر! غير حيد Da وحطها.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'ist die Medizin komplett auf freiwillige Spender angewiesen',
      origVerb: 'ist',
      bodyAfterDass: 'die Medizin komplett auf freiwillige Spender angewiesen',
      finalVerb: 'ist',
      dassClauseDe:
        'die Medizin komplett auf freiwillige Spender angewiesen ist',
      arMeaning: 'الطب معتمد بالكامل على المتبرعين المتطوعين',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (ist) وحطيناه فـ آخر الجملة مورا angewiesen.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'Eine Blutspende dauert nur etwa eine halbe Stunde, ist für gesunde Erwachsene völlig ungefährlich',
      origVerb: 'dauert / ist',
      bodyAfterDass:
        'eine Blutspende nur etwa eine halbe Stunde dauert und für gesunde Erwachsene völlig ungefährlich',
      finalVerb: 'ist',
      dassClauseDe:
        'eine Blutspende nur etwa eine halbe Stunde dauert und für gesunde Erwachsene völlig ungefährlich ist',
      arMeaning:
        'التبرع بالدم كياخد غير نص ساعة وما فيه حتى شي خطر على الكبار لي بصحة مزيانة',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): ردينا dauert مورا Stunde ورمينا ist لآخر الجملة.',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'Viele Menschen haben unbegründete Angst vor Nadeln, fühlen sich nicht ausreichend informiert',
      origVerb: 'haben / fühlen',
      bodyAfterDass:
        'viele Menschen unbegründete Angst vor Nadeln haben oder sich nicht ausreichend informiert',
      finalVerb: 'fühlen',
      dassClauseDe:
        'viele Menschen unbegründete Angst vor Nadeln haben oder sich nicht ausreichend informiert fühlen',
      arMeaning:
        'بزاف د الناس عندهم خوف غير مبرر من الإبرة أو كيحسو بلي ما عندهمش معلومات كافية',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): ردينا haben مورا Nadeln ورمينا fühlen لآخر الجملة.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'es regelmäßig große Aktionen zum Blutspenden gibt und sehr viele Menschen freiwillig spenden',
      specificMoroccoAr:
        'ديما كيدارو حملات كبار ديال التبرع بالدم وبزاف د الناس كيتبرعو عن طواعية',
    },
  },
  12: {
    id: 12,
    webTitle: 'Die Kleinen wollen lernen',
    paperTitle: 'Die Kleinen wollen lernen – Frühförderung im Kindergarten',
    pdfPage: 27,
    originalArticleDe:
      'Englisch ab drei Jahren, Musikunterricht mit vier und erste Programmierkurse vor der Einschulung: Frühkindliche Bildung boomt. Hirnforscher haben herausgefunden, dass kleine Kinder von Natur aus extrem neugierig sind und ihr Gehirn neue Informationen sowie Fremdsprachen so mühelos wie ein Schwamm aufsaugt. Wenn das Lernen im Kindergarten spielerisch über Lieder, Geschichten und Experimente stattfindet, profitieren die Kinder enorm und starten später mit besseren Chancen in die Grundschule. Viele Pädagogen und Kinderärzte warnen jedoch vor übertriebenem Ehrgeiz der Eltern. Wenn schon Vierjährige einen vollen Terminkalender wie Manager haben, geht die unbeschwerte Kindheit verloren, und es fehlt den Kleinen an freier Zeit zum Toben, Spielen und Träumen.',
    slot2_fikra1: {
      caseNum: 1,
      origSub:
        'kleine Kinder von Natur aus extrem neugierig sind und ihr Gehirn neue Informationen sowie Fremdsprachen so mühelos wie ein Schwamm aufsaugt',
      origVerb: 'sind / aufsaugt',
      bodyAfterDass:
        'kleine Kinder von Natur aus extrem neugierig sind und ihr Gehirn neue Informationen sowie Fremdsprachen so mühelos wie ein Schwamm',
      finalVerb: 'aufsaugt',
      dassClauseDe:
        'kleine Kinder von Natur aus extrem neugierig sind und ihr Gehirn neue Informationen sowie Fremdsprachen so mühelos wie ein Schwamm aufsaugt',
      arMeaning:
        'الأطفال الصغار بطبعهم فضوليين بزاف ودماغهم كيشرب المعلومات واللغات الأجنبية بسهولة بحال الإسفنجة',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 2 ديال الورقة الجملة مكتوبة أصلاً مورا dass والأفعال (sind, aufsaugt) واجدين فـ اللخر!',
    },
    slot3_fikra2: {
      caseNum: 1,
      origSub:
        'das Lernen im Kindergarten spielerisch über Lieder, Geschichten und Experimente stattfindet',
      origVerb: 'stattfindet',
      bodyAfterDass:
        'das Lernen im Kindergarten spielerisch über Lieder, Geschichten und Experimente',
      finalVerb: 'stattfindet',
      dassClauseDe:
        'das Lernen im Kindergarten spielerisch über Lieder, Geschichten und Experimente stattfindet',
      arMeaning:
        'التعلم فـ الروض كيدوز بطريقة اللعب عن طريق الأغاني والقصص والتجارب',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 4 ديال الورقة الجملة بادية بـ Wenn والفعل (stattfindet) أصلاً مجموع فـ اللخر! غير حيد Wenn وحطها.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'profitieren die Kinder enorm und starten später mit besseren Chancen in die Grundschule',
      origVerb: 'profitieren / starten',
      bodyAfterDass:
        'die Kinder enorm profitieren und später mit besseren Chancen in die Grundschule',
      finalVerb: 'starten',
      dassClauseDe:
        'die Kinder enorm profitieren und später mit besseren Chancen in die Grundschule starten',
      arMeaning:
        'الأطفال كيستافدو بزاف وكيبداو من بعد فـ المدرسة الابتدائية بحظوظ أحسن',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): خلينا profitieren فـ الشطر الأول ورمينا starten لآخر الجملة.',
    },
    slot5_salbia: {
      caseNum: 3,
      origSub:
        'geht die unbeschwerte Kindheit verloren, und es fehlt den Kleinen an freier Zeit zum Toben, Spielen und Träumen',
      origVerb: 'geht ... verloren / fehlt',
      bodyAfterDass:
        'bei zu viel Druck die unbeschwerte Kindheit verloren geht und es den Kleinen an freier Zeit zum Spielen',
      finalVerb: 'fehlt',
      dassClauseDe:
        'bei zu viel Druck die unbeschwerte Kindheit verloren geht und es den Kleinen an freier Zeit zum Spielen fehlt',
      arMeaning:
        'مع كثرة الضغط كتضيع الطفولة البريئة وكينقص الأطفال الوقت الحر للعب',
      surgicalDetail:
        'الحالة 3 (نقل الفعل للأخير): جمعنا verloren geht ورمينا الفعل (fehlt) لآخر الجملة.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'Kinder schon im Kindergarten neben Arabisch auch Französisch oder Englisch durch Lieder und Spiele lernen',
      specificMoroccoAr:
        'الدراري الصغار من الروض كيتعلمو مع العربية حتى الفرنسية أو الإنجليزية بالأغاني واللعب',
    },
  },
  13: {
    id: 13,
    webTitle: 'Englisch als Weltsprache',
    paperTitle: 'Englisch als Weltsprache – Chance oder Verlust?',
    pdfPage: 28,
    originalArticleDe:
      'Ob in der internationalen Wirtschaft, in der Luftfahrt, im Internet oder in der Wissenschaft: Englisch ist heute unbestritten die wichtigste Weltsprache. Über anderthalb Milliarden Menschen weltweit sprechen Englisch als Muttersprache oder als Fremdsprache. Dank dieser gemeinsamen Sprache können sich Geschäftsleute, Studenten und Reisende aus völlig unterschiedlichen Kulturen problemlos verständigen, ohne erst jahrelang dutzende Sprachen lernen zu müssen. Doch Sprachwissenschaftler sehen diese Entwicklung auch kritisch. Sie beklagen, dass in der deutschen Alltagssprache und in der Werbung immer mehr unnötige englische Wörter – sogenannte Anglizismen – verwendet werden und das Interesse an anderen wichtigen Fremdsprachen wie Französisch, Spanisch oder Italienisch an den Schulen spürbar zurückgeht.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'Englisch ist heute unbestritten die wichtigste Weltsprache',
      origVerb: 'ist',
      bodyAfterDass: 'Englisch heute unbestritten die wichtigste Weltsprache',
      finalVerb: 'ist',
      dassClauseDe:
        'Englisch heute unbestritten die wichtigste Weltsprache ist',
      arMeaning: 'الإنجليزية اليوم بلا نقاش هي أهم لغة عالمية',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (ist) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'über anderthalb Milliarden Menschen weltweit sprechen Englisch als Muttersprache oder als Fremdsprache',
      origVerb: 'sprechen',
      bodyAfterDass:
        'über anderthalb Milliarden Menschen weltweit Englisch als Muttersprache oder als Fremdsprache',
      finalVerb: 'sprechen',
      dassClauseDe:
        'über anderthalb Milliarden Menschen weltweit Englisch als Muttersprache oder als Fremdsprache sprechen',
      arMeaning:
        'أكثر من مليار ونص ديال الناس فـ العالم كيهضرو الإنجليزية كلغة أم أو كلغة أجنبية',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (sprechen) من الوسط ورميناه لآخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'dank dieser gemeinsamen Sprache können sich Geschäftsleute, Studenten und Reisende aus völlig unterschiedlichen Kulturen problemlos verständigen',
      origVerb: 'können',
      bodyAfterDass:
        'sich Geschäftsleute, Studenten und Reisende aus völlig unterschiedlichen Kulturen dank dieser gemeinsamen Sprache problemlos verständigen',
      finalVerb: 'können',
      dassClauseDe:
        'sich Geschäftsleute, Studenten und Reisende aus völlig unterschiedlichen Kulturen dank dieser gemeinsamen Sprache problemlos verständigen können',
      arMeaning:
        'بفضل هاد اللغة المشتركة يقدرو رجال الأعمال والطلبة والمسافرين من ثقافات مختلفة يتفاهمو بلا مشاكل',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل المساعد (können) من المركز 2 ورميناه لآخر الجملة مورا verständigen.',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'das Interesse an anderen wichtigen Fremdsprachen wie Französisch, Spanisch oder Italienisch an den Schulen spürbar zurückgeht',
      origVerb: 'zurückgeht',
      bodyAfterDass:
        'das Interesse an anderen wichtigen Fremdsprachen wie Französisch, Spanisch oder Italienisch an den Schulen spürbar',
      finalVerb: 'zurückgeht',
      dassClauseDe:
        'das Interesse an anderen wichtigen Fremdsprachen wie Französisch, Spanisch oder Italienisch an den Schulen spürbar zurückgeht',
      arMeaning:
        'الاهتمام بلغات أجنبية أخرى مهمة بحال الفرنسية أو الإسبانية كيتراجع بشكل ملحوظ فـ المدارس',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر الأخير ديال الورقة الجملة تابعة لـ dass والفعل (zurückgeht) أصلاً مجموع فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'junge Leute und Studenten heute extrem viel Englisch und Deutsch lernen, um international zu arbeiten',
      specificMoroccoAr:
        'الشباب والطلبة اليوم كيتعلمو الإنجليزية والألمانية بزاف باش يخدمو دولياً',
    },
  },
  14: {
    id: 14,
    webTitle: 'Sind Klassenfahrten noch zeitgemäß?',
    paperTitle: 'Sind Klassenfahrten noch zeitgemäß?',
    pdfPage: 29,
    originalArticleDe:
      'Für die meisten Schüler gehören mehrtägige Klassenfahrten zu den schönsten Erinnerungen ihrer gesamten Schulzeit. Fernab vom normalen Unterricht im Klassenzimmer lernen sich die Jugendlichen und Lehrer von einer ganz anderen Seite kennen. Pädagogen betonen, dass gemeinsame Reisen den Klassenzusammenhalt stärken, die soziale Kompetenz fördern und die Kinder selbstständiger machen. Doch in den letzten Jahren geraten Klassenfahrten immer öfter in die Kritik. Vor allem teure Auslandsreisen mit dem Flugzeug nach London, Rom oder Barcelona belasten nicht nur das Klima, sondern kosten oft mehrere hundert Euro, was sich einkommensschwache Familien kaum noch leisten können. Zudem klagen viele Lehrer über die enorme Verantwortung und den Stress bei der Aufsicht rund um die Uhr.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'für die meisten Schüler gehören mehrtägige Klassenfahrten zu den schönsten Erinnerungen ihrer gesamten Schulzeit',
      origVerb: 'gehören',
      bodyAfterDass:
        'für die meisten Schüler mehrtägige Klassenfahrten zu den schönsten Erinnerungen ihrer gesamten Schulzeit',
      finalVerb: 'gehören',
      dassClauseDe:
        'für die meisten Schüler mehrtägige Klassenfahrten zu den schönsten Erinnerungen ihrer gesamten Schulzeit gehören',
      arMeaning:
        'بالنسبة لأغلبية التلاميذ الرحلات المدرسية كتعتبر من أجمل الذكريات فـ مسارهم الدراسي كامل',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (gehören) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'in den letzten Jahren geraten Klassenfahrten immer öfter in die Kritik',
      origVerb: 'geraten',
      bodyAfterDass:
        'Klassenfahrten in den letzten Jahren immer öfter in die Kritik',
      finalVerb: 'geraten',
      dassClauseDe:
        'Klassenfahrten in den letzten Jahren immer öfter in die Kritik geraten',
      arMeaning: 'فـ السنوات الأخيرة الرحلات المدرسية ولاو كيتعرضو للانتقاد بزاف',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (geraten) من الوسط ورميناه لآخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'gemeinsame Reisen den Klassenzusammenhalt stärken, die soziale Kompetenz fördern und die Kinder selbstständiger machen',
      origVerb: 'stärken / fördern / machen',
      bodyAfterDass:
        'gemeinsame Reisen den Klassenzusammenhalt stärken, die soziale Kompetenz fördern und die Kinder selbstständiger',
      finalVerb: 'machen',
      dassClauseDe:
        'gemeinsame Reisen den Klassenzusammenhalt stärken, die soziale Kompetenz fördern und die Kinder selbstständiger machen',
      arMeaning:
        'الرحلات الجماعية كتقوي التلاحم فـ القسم، وكتطور المهارات الاجتماعية وكترد التلاميذ مستقلين كثر',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 3 ديال الورقة الجملة مكتوبة أصلاً مورا dass والأفعال (stärken, fördern, machen) واجدين فـ اللخر!',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'klagen viele Lehrer über die enorme Verantwortung und den Stress bei der Aufsicht rund um die Uhr',
      origVerb: 'klagen',
      bodyAfterDass:
        'viele Lehrer über die enorme Verantwortung und den Stress bei der Aufsicht rund um die Uhr',
      finalVerb: 'klagen',
      dassClauseDe:
        'viele Lehrer über die enorme Verantwortung und den Stress bei der Aufsicht rund um die Uhr klagen',
      arMeaning:
        'بزاف د الأساتذة كيتشكاو من المسؤولية الكبيرة والستريس ديال الحراسة 24 ساعة على 24',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (klagen) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'Schulen oft günstige Tagesausflüge in historische Städte wie Fès oder in die Natur organisieren',
      specificMoroccoAr:
        'المدارس غالباً كينظمو خرينجات ديال نهار واحد وبثمن رخيص لمدن تاريخية بحال فاس أو للطبيعة',
    },
  },
  15: {
    id: 15,
    webTitle: 'Hausaufgaben – sinnvoll oder nicht?',
    paperTitle: 'Hausaufgaben – sinnvoll oder überflüssig?',
    pdfPage: 30,
    originalArticleDe:
      'Kaum ein Thema sorgt in Familien am Nachmittag für so viel Streit und Tränen wie die täglichen Hausaufgaben. Befürworter argumentieren, dass Schüler den Unterrichtsstoff vom Vormittag zu Hause noch einmal in Ruhe üben und vertiefen müssen, damit das Wissen langfristig im Gedächtnis bleibt. Außerdem lernen die Kinder dadurch Pflichtbewusstsein, Zeitmanagement und selbstständiges Arbeiten. Viele Bildungsforscher bezweifeln jedoch den Nutzen klassischer Hausaufgaben. Studien zeigen, dass vor allem Kinder aus bildungsfernen Familien, deren Eltern am Nachmittag bei schwierigen Aufgaben in Mathematik oder Fremdsprachen nicht helfen können, systematisch benachteiligt werden. Zudem bleibt den Schülern nach einem langen Schultag oft kaum noch Freizeit für Sport, Musik oder Freunde.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'kaum ein Thema sorgt in Familien am Nachmittag für so viel Streit und Tränen wie die täglichen Hausaufgaben',
      origVerb: 'sorgt',
      bodyAfterDass:
        'kaum ein Thema in Familien am Nachmittag für so viel Streit und Tränen wie die täglichen Hausaufgaben',
      finalVerb: 'sorgt',
      dassClauseDe:
        'kaum ein Thema in Familien am Nachmittag für so viel Streit und Tränen wie die täglichen Hausaufgaben sorgt',
      arMeaning:
        'قليل شي موضوع كيخلق الصداع والدموع فـ العائلات فـ العشية قد التمارين المنزلية اليومية',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (sorgt) من الوسط ورميناه لآخر الجملة.',
    },
    slot3_fikra2: {
      caseNum: 1,
      origSub:
        'Schüler den Unterrichtsstoff vom Vormittag zu Hause noch einmal in Ruhe üben und vertiefen müssen',
      origVerb: 'müssen',
      bodyAfterDass:
        'Schüler den Unterrichtsstoff vom Vormittag zu Hause noch einmal in Ruhe üben und vertiefen',
      finalVerb: 'müssen',
      dassClauseDe:
        'Schüler den Unterrichtsstoff vom Vormittag zu Hause noch einmal in Ruhe üben und vertiefen müssen',
      arMeaning:
        'التلاميذ خاصهم يراجعو ويتعمقو فـ الدروس ديال الصباح فـ الدار بهدوء',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 2 ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (müssen) واجد فـ اللخر!',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'lernen die Kinder dadurch Pflichtbewusstsein, Zeitmanagement und selbstständiges Arbeiten',
      origVerb: 'lernen',
      bodyAfterDass:
        'die Kinder dadurch Pflichtbewusstsein, Zeitmanagement und selbstständiges Arbeiten',
      finalVerb: 'lernen',
      dassClauseDe:
        'die Kinder dadurch Pflichtbewusstsein, Zeitmanagement und selbstständiges Arbeiten lernen',
      arMeaning:
        'الأطفال كيتعلمو بفضل التمارين الإحساس بالواجب، تنظيم الوقت والخدمة بوحدهم',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (lernen) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'bleibt den Schülern nach einem langen Schultag oft kaum noch Freizeit für Sport, Musik oder Freunde',
      origVerb: 'bleibt',
      bodyAfterDass:
        'den Schülern nach einem langen Schultag oft kaum noch Freizeit für Sport, Musik oder Freunde',
      finalVerb: 'bleibt',
      dassClauseDe:
        'den Schülern nach einem langen Schultag oft kaum noch Freizeit für Sport, Musik oder Freunde bleibt',
      arMeaning:
        'ما كيبقاش للتلاميذ مور نهار طويل فـ المدرسة وقت حر للرياضة، الموسيقى أو الصحاب',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (bleibt) من الوسط ورميناه لآخر الجملة.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'Schüler traditionell viele Hausaufgaben bekommen, aber heute immer mehr gemeinsam in der Schule geübt wird',
      specificMoroccoAr:
        'التلاميذ كياخدو تمارين بزاف، ولكن دابا ولاو كيخرجوهم كثر فـ القسم',
    },
  },
  16: {
    id: 16,
    webTitle: 'Praktische Lerntipps',
    paperTitle: 'Praktische Lerntipps für Schule und Studium',
    pdfPage: 31,
    originalArticleDe:
      'Viele Schüler und Studenten kennen das Problem: Kurz vor einer wichtigen Prüfung sitzt man stundenlang vor den Büchern, liest denselben Text fünfmal hintereinander und merkt sich trotzdem fast nichts. Lernpsychologen erklären, dass reines stummes Durchlesen eine der ineffektivsten Lernmethoden überhaupt ist. Viel erfolgreicher lernt das menschliche Gehirn, wenn man den Stoff frühzeitig in kleine Portionen aufteilt, eigene Zusammenfassungen mit der Hand schreibt oder den Inhalt einer anderen Person laut erklärt. Ebenso wichtig sind regelmäßige kurze Pausen an der frischen Luft und ausreichend Schlaf, weil das Gehirn neue Vokabeln und Formeln erst nachts im Tiefschlaf fest im Langzeitgedächtnis speichert. Wer dagegen die ganze Nacht vor der Prüfung durchlernt, riskiert am nächsten Tag Konzentrationsprobleme und einen Blackout.',
    slot2_fikra1: {
      caseNum: 1,
      origSub:
        'reines stummes Durchlesen eine der ineffektivsten Lernmethoden überhaupt ist',
      origVerb: 'ist',
      bodyAfterDass:
        'reines stummes Durchlesen eine der ineffektivsten Lernmethoden überhaupt',
      finalVerb: 'ist',
      dassClauseDe:
        'reines stummes Durchlesen eine der ineffektivsten Lernmethoden überhaupt ist',
      arMeaning:
        'القراءة الصامتة بوحدها هي وحدة من أضعف طرق المراجعة على الإطلاق',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 3 ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (ist) واجد فـ اللخر!',
    },
    slot3_fikra2: {
      caseNum: 1,
      origSub:
        'man den Stoff frühzeitig in kleine Portionen aufteilt, eigene Zusammenfassungen mit der Hand schreibt oder den Inhalt einer anderen Person laut erklärt',
      origVerb: 'aufteilt / schreibt / erklärt',
      bodyAfterDass:
        'man den Stoff frühzeitig in kleine Portionen aufteilt, eigene Zusammenfassungen mit der Hand schreibt oder den Inhalt einer anderen Person laut',
      finalVerb: 'erklärt',
      dassClauseDe:
        'man den Stoff frühzeitig in kleine Portionen aufteilt, eigene Zusammenfassungen mit der Hand schreibt oder den Inhalt einer anderen Person laut erklärt',
      arMeaning:
        'الواحد كيقسم الدروس بكري لأجزاء صغار، كيكتب ملخصات بيدو أو كيشرح الدرس بصوت عالي لشي حد آخر',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 4 ديال الورقة الجملة بادية بـ wenn والأفعال (aufteilt, schreibt, erklärt) أصلاً واجدين فـ اللخر!',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'das Gehirn neue Vokabeln und Formeln erst nachts im Tiefschlaf fest im Langzeitgedächtnis speichert',
      origVerb: 'speichert',
      bodyAfterDass:
        'das Gehirn neue Vokabeln und Formeln erst nachts im Tiefschlaf fest im Langzeitgedächtnis',
      finalVerb: 'speichert',
      dassClauseDe:
        'das Gehirn neue Vokabeln und Formeln erst nachts im Tiefschlaf fest im Langzeitgedächtnis speichert',
      arMeaning:
        'الدماغ كيخزن الكلمات والقواعد الجديدة بالليل فـ النعاس العميق داخل الذاكرة الطويلة المدى',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 7 ديال الورقة الجملة بادية بـ weil والفعل (speichert) واجد فـ اللخر! غير حيد weil وحطها.',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'wer dagegen die ganze Nacht vor der Prüfung durchlernt, riskiert am nächsten Tag Konzentrationsprobleme und einen Blackout',
      origVerb: 'riskiert',
      bodyAfterDass:
        'man beim Durchlernen in der Nacht vor der Prüfung am nächsten Tag Konzentrationsprobleme und einen Blackout',
      finalVerb: 'riskiert',
      dassClauseDe:
        'man beim Durchlernen in der Nacht vor der Prüfung am nächsten Tag Konzentrationsprobleme und einen Blackout riskiert',
      arMeaning:
        'الواحد إلا سهر الليل كامل قبل الامتحان كيغامر بمشاكل التركيز ونسيان كلشي نهار الامتحان',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): خذينا الفعل (riskiert) وحطيناه فـ آخر الجملة مورا Blackout.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'Studenten vor den Prüfungen gerne zusammen in der Bibliothek lernen und sich die Regeln gegenseitig erklären',
      specificMoroccoAr:
        'الطلبة قبل الامتحانات كيعجبهم يراجعو مجموعين فالمكتبة ويشرحو القواعد لبعضياتهم',
    },
  },
  17: {
    id: 17,
    webTitle: 'Ganztagsschule',
    paperTitle: 'Ganztagsschule – Modell der Zukunft?',
    pdfPage: 32,
    originalArticleDe:
      'In vielen europäischen Ländern ist die Ganztagsschule längst der Normalfall, und auch in Deutschland werden immer mehr Schulen auf den Ganztagsbetrieb umgestellt. Dort bleiben die Kinder nicht nur bis mittags, sondern bis 16 oder 17 Uhr in der Schule. Nach dem gemeinsamen warmen Mittagessen in der Mensa gibt es am Nachmittag Hausaufgabenbetreuung, Förderunterricht sowie vielfältige Arbeitsgemeinschaften in Sport, Theater, Kunst oder Musik. Besonders für berufstätige Eltern und Alleinerziehende ist dieses Modell eine enorme Entlastung, um Familie und Beruf miteinander zu vereinbaren. Kritiker bemängeln allerdings, dass viele Schulgebäude für den langen Aufenthalt schlecht ausgestattet sind, das Kantinenessen oft wenig abwechslungsreich ist und den Kindern zu wenig unstrukturierte Freizeit in der Familie bleibt.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'auch in Deutschland werden immer mehr Schulen auf den Ganztagsbetrieb umgestellt',
      origVerb: 'werden',
      bodyAfterDass:
        'auch in Deutschland immer mehr Schulen auf den Ganztagsbetrieb umgestellt',
      finalVerb: 'werden',
      dassClauseDe:
        'auch in Deutschland immer mehr Schulen auf den Ganztagsbetrieb umgestellt werden',
      arMeaning:
        'حتى فـ ألمانيا بزاف د المدارس غادية وكتحول لنظام اليوم الكامل',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل المساعد (werden) من الوسط وحطيناه فـ اللخر مورا umgestellt.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'dort bleiben die Kinder nicht nur bis mittags, sondern bis 16 oder 17 Uhr in der Schule',
      origVerb: 'bleiben',
      bodyAfterDass:
        'die Kinder dort nicht nur bis mittags, sondern bis 16 oder 17 Uhr in der Schule',
      finalVerb: 'bleiben',
      dassClauseDe:
        'die Kinder dort nicht nur bis mittags, sondern bis 16 oder 17 Uhr in der Schule bleiben',
      arMeaning:
        'الأطفال كيبقاو تما ماشي غير حتى للظهر ولكن حتى لـ 4 أو 5 د العشية فـ المدرسة',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (bleiben) من المركز 2 ورميناه لآخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'nach dem gemeinsamen warmen Mittagessen in der Mensa gibt es am Nachmittag Hausaufgabenbetreuung, Förderunterricht sowie vielfältige Arbeitsgemeinschaften',
      origVerb: 'gibt',
      bodyAfterDass:
        'es nach dem gemeinsamen warmen Mittagessen in der Mensa am Nachmittag Hausaufgabenbetreuung, Förderunterricht sowie vielfältige Arbeitsgemeinschaften',
      finalVerb: 'gibt',
      dassClauseDe:
        'es nach dem gemeinsamen warmen Mittagessen in der Mensa am Nachmittag Hausaufgabenbetreuung, Förderunterricht sowie vielfältige Arbeitsgemeinschaften gibt',
      arMeaning:
        'مور الغدا السخون فـ المطعم المدرسي كيكون فـ العشية مواكبة فـ التمارين ودروس الدعم وأنشطة رياضية وفنية',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (gibt) من وسط الجملة ورميناه لآخر الجملة.',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'viele Schulgebäude für den langen Aufenthalt schlecht ausgestattet sind, das Kantinenessen oft wenig abwechslungsreich ist und den Kindern zu wenig unstrukturierte Freizeit in der Familie bleibt',
      origVerb: 'sind / ist / bleibt',
      bodyAfterDass:
        'viele Schulgebäude für den langen Aufenthalt schlecht ausgestattet sind und den Kindern zu wenig Freizeit in der Familie',
      finalVerb: 'bleibt',
      dassClauseDe:
        'viele Schulgebäude für den langen Aufenthalt schlecht ausgestattet sind und den Kindern zu wenig Freizeit in der Familie bleibt',
      arMeaning:
        'بزاف د البنايات المدرسية ما مجهزاش مزيان وكيبقى للأطفال وقت حر قليل بزاف مع عائلاتهم',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 7 ديال الورقة الجملة مكتوبة أصلاً مورا dass والأفعال (sind, bleibt) واجدين فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'die meisten Schulen ohnehin vormittags und nachmittags Unterricht haben und viele Schulen eine Kantine anbieten',
      specificMoroccoAr:
        'أغلبية المدارس أصلاً كيقريو فالصباح والعشية وبزاف منهم فيهم مطعم مدرسي',
    },
  },
  18: {
    id: 18,
    webTitle: 'Zweisprachigkeit',
    paperTitle: 'Zweisprachigkeit – ein Gewinn fürs Leben',
    pdfPage: 33,
    originalArticleDe:
      'In einer globalisierten Welt wachsen immer mehr Kinder mit zwei oder sogar drei Sprachen gleichzeitig auf – etwa weil die Eltern aus verschiedenen Ländern stammen oder die Familie im Ausland lebt. Während man früher befürchtete, dass mehrere Sprachen im Kleinkindalter das Gehirn überfordern könnten, weiß die Hirnforschung heute das genaue Gegenteil: Zweisprachigkeit wirkt wie ein tägliches Fitnessprogramm für die grauen Zellen. Bilinguale Menschen können sich oft besser konzentrieren, denken flexibler und lernen später in der Schule weitere Fremdsprachen deutlich leichter. Zudem öffnet die Beherrschung zweier Kulturen und Sprachen hervorragende Türen auf dem internationalen Arbeitsmarkt. Schwierig wird es nur dann, wenn keine der beiden Sprachen richtig gefördert wird und die Kinder die Sprachen im Alltag unkontrolliert mischen.',
    slot2_fikra1: {
      caseNum: 3,
      origSub:
        'in einer globalisierten Welt wachsen immer mehr Kinder mit zwei oder sogar drei Sprachen gleichzeitig auf',
      origVerb: 'wachsen ... auf',
      bodyAfterDass:
        'in einer globalisierten Welt immer mehr Kinder mit zwei oder sogar drei Sprachen gleichzeitig',
      finalVerb: 'aufwachsen',
      dassClauseDe:
        'in einer globalisierten Welt immer mehr Kinder mit zwei oder sogar drei Sprachen gleichzeitig aufwachsen',
      arMeaning:
        'فـ عالم العولمة بزاف د الأطفال كيكبرو بجوج أو حتى ثلاثة د اللغات فـ دقة وحدة',
      surgicalDetail:
        'الحالة 3 (فعل منفصل): فـ الورقة كاين (wachsen ... auf). جمعناهم فـ آخر الجملة مورا dass وولات: aufwachsen.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'Zweisprachigkeit wirkt wie ein tägliches Fitnessprogramm für die grauen Zellen',
      origVerb: 'wirkt',
      bodyAfterDass:
        'Zweisprachigkeit wie ein tägliches Fitnessprogramm für die grauen Zellen',
      finalVerb: 'wirkt',
      dassClauseDe:
        'Zweisprachigkeit wie ein tägliches Fitnessprogramm für die grauen Zellen wirkt',
      arMeaning: 'ثنائية اللغة كتخدم بحال برنامج رياضي يومي لخلايا الدماغ',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (wirkt) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'öffnet die Beherrschung zweier Kulturen und Sprachen hervorragende Türen auf dem internationalen Arbeitsmarkt',
      origVerb: 'öffnet',
      bodyAfterDass:
        'die Beherrschung zweier Kulturen und Sprachen hervorragende Türen auf dem internationalen Arbeitsmarkt',
      finalVerb: 'öffnet',
      dassClauseDe:
        'die Beherrschung zweier Kulturen und Sprachen hervorragende Türen auf dem internationalen Arbeitsmarkt öffnet',
      arMeaning:
        'إتقان جوج ثقافات ولغات كيفتح أبواب واعرة فـ سوق الشغل الدولي',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (öffnet) من الوسط ورميناه لآخر الجملة.',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'keine der beiden Sprachen richtig gefördert wird und die Kinder die Sprachen im Alltag unkontrolliert mischen',
      origVerb: 'wird / mischen',
      bodyAfterDass:
        'es schwierig wird, wenn keine der beiden Sprachen richtig gefördert wird und die Kinder die Sprachen im Alltag unkontrolliert',
      finalVerb: 'mischen',
      dassClauseDe:
        'es schwierig wird, wenn keine der beiden Sprachen richtig gefördert wird und die Kinder die Sprachen im Alltag unkontrolliert mischen',
      arMeaning:
        'الأمر كيولي صعيب إلا ما تقواتش حتى لغة منهم مزيان وولاو الدراري كيخلطو اللغات بلا ضوابط',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر الأخير ديال الورقة الجملة بادية بـ wenn والأفعال (wird, mischen) واجدين فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'Zweisprachigkeit völlig normal ist, weil fast jeder neben Arabisch und Amazigh auch Französisch, Englisch oder Deutsch lernt',
      specificMoroccoAr:
        'تعدد اللغات عادي جداً عندنا حيث كلشي تقريباً كيهضر بالعربية والأمازيغية وكيقرا الفرنسية والإنجليزية أو الألمانية',
    },
  },
  19: {
    id: 19,
    webTitle: 'Die Schuluniform',
    paperTitle: 'Schuluniformen – ja oder nein?',
    pdfPage: 34,
    originalArticleDe:
      'In Großbritannien, Japan oder Australien gehören sie selbstverständlich zum Schulalltag, in Deutschland sind sie dagegen eine seltene Ausnahme: einheitliche Schuluniformen. Befürworter einer Einführung argumentieren, dass an vielen Schulen heute ein harter Markenwahn herrscht. Wer sich keine teuren Sneaker oder Designerjacken leisten kann, wird auf dem Pausenhof schnell ausgegrenzt oder gemobbt. Eine einheitliche Schulkleidung macht soziale Unterschiede zwischen Arm und Reich auf den ersten Blick unsichtbar, stärkt das „Wir-Gefühl“ der Schulgemeinschaft und spart den Eltern viel Geld. Gegner halten jedoch dagegen, dass Uniformen die freie Entfaltung der Persönlichkeit einschränken und Jugendliche gerade in der Pubertät das Recht haben sollten, ihren eigenen Geschmack und Stil durch Kleidung auszudrücken.',
    slot2_fikra1: {
      caseNum: 1,
      origSub: 'an vielen Schulen heute ein harter Markenwahn herrscht',
      origVerb: 'herrscht',
      bodyAfterDass: 'an vielen Schulen heute ein harter Markenwahn',
      finalVerb: 'herrscht',
      dassClauseDe: 'an vielen Schulen heute ein harter Markenwahn herrscht',
      arMeaning: 'فـ بزاف د المدارس اليوم كاين هوس كبير بالماركات الغالية',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 3 ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (herrscht) واجد فـ اللخر!',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'wer sich keine teuren Sneaker oder Designerjacken leisten kann, wird auf dem Pausenhof schnell ausgegrenzt oder gemobbt',
      origVerb: 'wird',
      bodyAfterDass:
        'Schüler ohne teure Markenkleidung auf dem Pausenhof schnell ausgegrenzt oder gemobbt',
      finalVerb: 'werden',
      dassClauseDe:
        'Schüler ohne teure Markenkleidung auf dem Pausenhof schnell ausgegrenzt oder gemobbt werden',
      arMeaning:
        'التلاميذ لي ما عندهمش حوايج الماركات الغالية كيتهمشو أو كيتعرضو للتنمر فـ الساحة',
      surgicalDetail:
        'الحالة 2 (نقل الفعل للأخير): حطينا الفعل المساعد (werden) فـ آخر الجملة مورا gemobbt.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'eine einheitliche Schulkleidung macht soziale Unterschiede zwischen Arm und Reich auf den ersten Blick unsichtbar, stärkt das „Wir-Gefühl“ der Schulgemeinschaft und spart den Eltern viel Geld',
      origVerb: 'macht / stärkt / spart',
      bodyAfterDass:
        'eine einheitliche Schulkleidung soziale Unterschiede zwischen Arm und Reich unsichtbar macht, das „Wir-Gefühl“ stärkt und den Eltern viel Geld',
      finalVerb: 'spart',
      dassClauseDe:
        'eine einheitliche Schulkleidung soziale Unterschiede zwischen Arm und Reich unsichtbar macht, das „Wir-Gefühl“ stärkt und den Eltern viel Geld spart',
      arMeaning:
        'اللباس المدرسي الموحد كيخفي الفوارق الاجتماعية، كيقوي روح الانتماء وكيقتاصد الفلوس على الواليدين',
      surgicalDetail:
        'الحالة 2 (نقل الأفعال للأخير): ردينا macht و stärkt و spart لأواخر الجمل مورا dass.',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'Uniformen die freie Entfaltung der Persönlichkeit einschränken',
      origVerb: 'einschränken',
      bodyAfterDass:
        'Uniformen die freie Entfaltung der Persönlichkeit der Jugendlichen',
      finalVerb: 'einschränken',
      dassClauseDe:
        'Uniformen die freie Entfaltung der Persönlichkeit der Jugendlichen einschränken',
      arMeaning: 'اللباس الموحد كيقيد حرية التعبير عن الشخصية عند الشباب',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 7 ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (einschränken) واجد فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'viele Grundschulen und Privatschulen eine Uniform oder einen Kittel nutzen, damit alle Schüler ordentlich und gleich aussehen',
      specificMoroccoAr:
        'بزاف د المدارس الابتدائية والخاصة كيديرو طابلية أو لباس موحد باش كلشي يبان نقي وبحال بحال',
    },
  },
  20: {
    id: 20,
    webTitle: 'Ist Schulqualität messbar?',
    paperTitle: 'Ist die Qualität von Schulen messbar?',
    pdfPage: 35,
    originalArticleDe:
      'Spätestens seit den internationalen PISA-Studien wird in der Öffentlichkeit heftig darüber diskutiert, wie gut unsere Schulen wirklich sind und wie man „gute Bildung“ objektiv messen kann. Bildungspolitiker setzen dabei vor allem auf zentrale Vergleichsarbeiten, landesweite Prüfungen und Notendurchschnitte. Solche Daten helfen dem Staat zu erkennen, wo es Defizite gibt und welche Schulen dringend mehr Lehrer oder finanzielle Unterstützung brauchen. Viele Lehrer und Erziehungswissenschaftler kritisieren jedoch diesen reinen Zahlenfokus. Sie betonen, dass sich die wahre Qualität einer Schule – nämlich ein gutes Schulklima, soziale Integration, Kreativität, Teamfähigkeit und die individuelle Förderung schwächerer Kinder – in keinem Multiple-Choice-Test der Welt messen lässt.',
    slot2_fikra1: {
      caseNum: 1,
      origSub:
        'wie gut unsere Schulen wirklich sind und wie man „gute Bildung“ objektiv messen kann',
      origVerb: 'sind / kann',
      bodyAfterDass:
        'heftig darüber diskutiert wird, wie gut unsere Schulen wirklich sind und wie man „gute Bildung“ objektiv messen',
      finalVerb: 'kann',
      dassClauseDe:
        'heftig darüber diskutiert wird, wie gut unsere Schulen wirklich sind und wie man „gute Bildung“ objektiv messen kann',
      arMeaning:
        'كاين نقاش قوي على شحال المدارس ديالنا مزيانة وكيفاش نقدرو نقيسو جودة التعليم بموضوعية',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 2 ديال الورقة الجملة مسالية أصلاً بـ (messen kann)!',
    },
    slot3_fikra2: {
      caseNum: 3,
      origSub:
        'Bildungspolitiker setzen dabei vor allem auf zentrale Vergleichsarbeiten, landesweite Prüfungen und Notendurchschnitte',
      origVerb: 'setzen',
      bodyAfterDass:
        'Bildungspolitiker dabei vor allem auf zentrale Vergleichsarbeiten, landesweite Prüfungen und Notendurchschnitte',
      finalVerb: 'setzen',
      dassClauseDe:
        'Bildungspolitiker dabei vor allem auf zentrale Vergleichsarbeiten, landesweite Prüfungen und Notendurchschnitte setzen',
      arMeaning:
        'مسؤولو التعليم كيركزو بالخصوص على الامتحانات الموحدة والمعدلات ديال النقط',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (setzen) من الوسط ورميناه لآخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'welche Schulen dringend mehr Lehrer oder finanzielle Unterstützung brauchen',
      origVerb: 'brauchen',
      bodyAfterDass:
        'der Staat durch solche Daten erkennt, welche Schulen dringend mehr Lehrer oder finanzielle Unterstützung',
      finalVerb: 'brauchen',
      dassClauseDe:
        'der Staat durch solche Daten erkennt, welche Schulen dringend mehr Lehrer oder finanzielle Unterstützung brauchen',
      arMeaning:
        'الدولة كتعرف بفضل هاد الإحصائيات إينا مدارس محتاجة بزاف لأساتذة كثر أو دعم مالي',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 5 ديال الورقة الجملة الفرعية مسالية أصلاً بـ (Unterstützung brauchen)!',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'sich die wahre Qualität einer Schule – nämlich ein gutes Schulklima, soziale Integration, Kreativität, Teamfähigkeit und die individuelle Förderung schwächerer Kinder – in keinem Multiple-Choice-Test der Welt messen lässt',
      origVerb: 'lässt',
      bodyAfterDass:
        'sich die wahre Qualität einer Schule wie Kreativität und Teamfähigkeit in keinem Multiple-Choice-Test der Welt messen',
      finalVerb: 'lässt',
      dassClauseDe:
        'sich die wahre Qualität einer Schule wie Kreativität und Teamfähigkeit in keinem Multiple-Choice-Test der Welt messen lässt',
      arMeaning:
        'الجودة الحقيقية ديال المدرسة بحال الإبداع وروح الفريق ما يمكنش تتقاس فـ أي امتحان ديال الخيارات المتعددة',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر الأخير ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (lässt) واجد فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'die Abiturnoten sehr wichtig für die Universität sind, aber heute auch praktische Projekte gefördert werden',
      specificMoroccoAr:
        'نقط الباك مهمة بزاف للجامعة، ولكن دابا ولاو كيشجعو حتى المشاريع التطبيقية',
    },
  },
  21: {
    id: 21,
    webTitle: 'Soll digitales Unterrichten eingeführt werden?',
    paperTitle: 'Digitales Lernen im Klassenzimmer',
    pdfPage: 36,
    originalArticleDe:
      'Kreidetafel und schwere Schulbücher aus Papier gehören an immer mehr Schulen der Vergangenheit an. Stattdessen arbeiten Schüler heute mit Tablets, Laptops, Lern-Apps und interaktiven Whiteboards. Befürworter der Digitalisierung betonen, dass die Schule junge Menschen auf die moderne Arbeitswelt vorbereiten muss, in der ein sicherer Umgang mit digitalen Medien und Künstlicher Intelligenz längst unverzichtbar ist. Zudem lassen sich komplexe Themen in Physik, Biologie oder Geografie durch 3D-Animationen und Lernvideos viel anschaulicher erklären. Kritiker warnen jedoch davor, dass teure Technik allein noch keinen guten Unterricht macht. Wenn Schüler nur noch auf Bildschirme starren, leiden oft die Handschrift, die Lesekompetenz und die Konzentration, außerdem ist die Ablenkung durch Spiele und soziale Netzwerke groß.',
    slot2_fikra1: {
      caseNum: 3,
      origSub:
        'Kreidetafel und schwere Schulbücher aus Papier gehören an immer mehr Schulen der Vergangenheit an',
      origVerb: 'gehören ... an',
      bodyAfterDass:
        'Kreidetafel und schwere Schulbücher aus Papier an immer mehr Schulen der Vergangenheit',
      finalVerb: 'angehören',
      dassClauseDe:
        'Kreidetafel und schwere Schulbücher aus Papier an immer mehr Schulen der Vergangenheit angehören',
      arMeaning:
        'السبورة د الطباشير والكتوبا الثقال د الورق ولاو من الماضي فـ بزاف د المدارس',
      surgicalDetail:
        'الحالة 3 (فعل منفصل): فـ الورقة كاين (gehören ... an). جمعناهم فـ آخر الجملة مورا dass وولات: angehören.',
    },
    slot3_fikra2: {
      caseNum: 1,
      origSub:
        'die Schule junge Menschen auf die moderne Arbeitswelt vorbereiten muss',
      origVerb: 'muss',
      bodyAfterDass:
        'die Schule junge Menschen auf die moderne Arbeitswelt vorbereiten',
      finalVerb: 'muss',
      dassClauseDe:
        'die Schule junge Menschen auf die moderne Arbeitswelt vorbereiten muss',
      arMeaning: 'المدرسة خاصها توجد الشباب لعالم الشغل الحديث',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 3 ديال الورقة الجملة مكتوبة أصلاً مورا dass والفعل (muss) واجد فـ اللخر!',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'lassen sich komplexe Themen in Physik, Biologie oder Geografie durch 3D-Animationen und Lernvideos viel anschaulicher erklären',
      origVerb: 'lassen',
      bodyAfterDass:
        'sich komplexe Themen in Physik, Biologie oder Geografie durch 3D-Animationen und Lernvideos viel anschaulicher erklären',
      finalVerb: 'lassen',
      dassClauseDe:
        'sich komplexe Themen in Physik, Biologie oder Geografie durch 3D-Animationen und Lernvideos viel anschaulicher erklären lassen',
      arMeaning:
        'المواضيع المعقدة فـ الفيزيك والبيولوجيا كتتشرح بطريقة أوضح بزاف بفضل الفيديوهات والرسوم ثلاثية الأبعاد',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (lassen) من الوسط وحطيناه فـ اللخر مورا erklären.',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'leiden oft die Handschrift, die Lesekompetenz und die Konzentration, außerdem ist die Ablenkung durch Spiele und soziale Netzwerke groß',
      origVerb: 'leiden / ist',
      bodyAfterDass:
        'oft die Handschrift, die Lesekompetenz und die Konzentration leiden und die Ablenkung durch Spiele und soziale Netzwerke groß',
      finalVerb: 'ist',
      dassClauseDe:
        'oft die Handschrift, die Lesekompetenz und die Konzentration leiden und die Ablenkung durch Spiele und soziale Netzwerke groß ist',
      arMeaning:
        'الخط د اليد والقدرة على القراءة والتركيز كيضعافو، والشتات بسبب الألعاب ومواقع التواصل كيكون كبير',
      surgicalDetail:
        'الحالة 2 (نقل الأفعال للأخير): ردينا leiden مورا Konzentration ورمينا ist لآخر الجملة.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'Universitäten und immer mehr Schulen Computer und Online-Plattformen erfolgreich im Unterricht einsetzen',
      specificMoroccoAr:
        'الجامعات وبزاف د المدارس ولاو كيخدمو بالبيسي والمنصات الرقمية بنجاح',
    },
  },
  22: {
    id: 22,
    webTitle: 'Spezielle Schulen (für Hochbegabte)',
    paperTitle: 'Spezielle Schulen für hochbegabte Kinder',
    pdfPage: 37,
    originalArticleDe:
      'Etwa zwei Prozent aller Kinder gelten als hochbegabt – sie verfügen über einen außergewöhnlich hohen Intelligenzquotienten (IQ über 130) und eine enorme Auffassungsgabe in Mathematik, Sprachen, Musik oder Naturwissenschaften. Doch eine Hochbegabung führt in einer normalen Regelschule nicht automatisch zu guten Noten. Im Gegenteil: Weil sich diese Kinder im regulären Unterricht oft extrem langweilen, stören sie manchmal den Unterricht, ziehen sich zurück oder verweigern die Leistung komplett. Befürworter spezieller Schulen und Internate für Hochbegabte betonen, dass die Talente dort in kleinen Klassen individuell gefördert werden und unter Gleichgesinnten ihr volles Potenzial entfalten können. Kritiker befürchten hingegen, dass auf solchen Eliteschulen ein enormer Leistungsdruck herrscht und die Kinder den sozialen Kontakt zu Gleichaltrigen aus dem normalen Alltag verlieren.',
    slot2_fikra1: {
      caseNum: 1,
      origSub:
        'sich diese Kinder im regulären Unterricht oft extrem langweilen',
      origVerb: 'langweilen',
      bodyAfterDass:
        'sich hochbegabte Kinder im regulären Unterricht oft extrem',
      finalVerb: 'langweilen',
      dassClauseDe:
        'sich hochbegabte Kinder im regulären Unterricht oft extrem langweilen',
      arMeaning:
        'الأطفال الموهوبين بزاف غالباً كيجيهم الملل الشديد فـ الأقسام العادية',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 4 ديال الورقة الجملة بادية بـ Weil والفعل (langweilen) أصلاً فـ اللخر! غير حيد Weil وحطها.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'eine Hochbegabung führt in einer normalen Regelschule nicht automatisch zu guten Noten',
      origVerb: 'führt',
      bodyAfterDass:
        'eine Hochbegabung in einer normalen Regelschule nicht automatisch zu guten Noten',
      finalVerb: 'führt',
      dassClauseDe:
        'eine Hochbegabung in einer normalen Regelschule nicht automatisch zu guten Noten führt',
      arMeaning:
        'الموهبة العالية فـ مدرسة عادية ما كتعطيش أوتوماتيكياً نقط مزيانة إلا ما لقاتش مواكبة',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (führt) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 1,
      origSub:
        'die Talente dort in kleinen Klassen individuell gefördert werden und unter Gleichgesinnten ihr volles Potenzial entfalten können',
      origVerb: 'werden / können',
      bodyAfterDass:
        'die Talente dort in kleinen Klassen individuell gefördert werden und unter Gleichgesinnten ihr volles Potenzial entfalten',
      finalVerb: 'können',
      dassClauseDe:
        'die Talente dort in kleinen Klassen individuell gefördert werden und unter Gleichgesinnten ihr volles Potenzial entfalten können',
      arMeaning:
        'المواهب تما كيتدعمو بشكل فردي فـ أقسام صغار وكيقدرو يخرجو كامل القدرات ديالهم',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر 7 ديال الورقة الجملة مكتوبة أصلاً مورا dass والأفعال (werden, können) واجدين فـ اللخر!',
    },
    slot5_salbia: {
      caseNum: 1,
      origSub:
        'auf solchen Eliteschulen ein enormer Leistungsdruck herrscht und die Kinder den sozialen Kontakt zu Gleichaltrigen aus dem normalen Alltag verlieren',
      origVerb: 'herrscht / verlieren',
      bodyAfterDass:
        'auf solchen Eliteschulen ein enormer Leistungsdruck herrscht und die Kinder den sozialen Kontakt zu Gleichaltrigen aus dem normalen Alltag',
      finalVerb: 'verlieren',
      dassClauseDe:
        'auf solchen Eliteschulen ein enormer Leistungsdruck herrscht und die Kinder den sozialen Kontakt zu Gleichaltrigen aus dem normalen Alltag verlieren',
      arMeaning:
        'فـ هاد مدارس النخبة كيكون ضغط كبير بزاف والأطفال كيفقدو التواصل الاجتماعي مع أقرانهم العاديين',
      surgicalDetail:
        'الحالة 1 (جاهزة 100%): فـ السطر الأخير ديال الورقة الجملة مكتوبة أصلاً مورا dass والأفعال (herrscht, verlieren) واجدين فـ اللخر!',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'Schüler mit sehr guten Leistungen in Physik und Mathematik nach dem Abitur oft auf spezielle Ingenieur- oder Wirtschaftshochschulen gehen',
      specificMoroccoAr:
        'التلاميذ المتفوقين فالفيزيك والماط مور الباك كيدخلو لمدارس عليا خاصة بالهندسة أو الاقتصاد',
    },
  },
  23: {
    id: 23,
    webTitle: 'Mehrsprachige Erziehung',
    paperTitle: 'Mehrsprachige Erziehung in der Familie',
    pdfPage: 38,
    originalArticleDe:
      'Wenn Mutter und Vater unterschiedliche Muttersprachen sprechen, stellt sich nach der Geburt eines Kindes sofort die Frage nach der richtigen sprachlichen Erziehung. Sprachwissenschaftler empfehlen in solchen binationalen Familien meistens das bewährte Prinzip „Eine Person – eine Sprache“: Jeder Elternteil spricht mit dem Kind von Anfang an konsequent in seiner eigenen Muttersprache, in der er sich emotional am sichersten fühlt. Auf diese Weise lernen Kinder beide Sprachen ganz natürlich und ohne Akzent nebenbei. Das stärkt nicht nur die Bindung zu den Großeltern und Verwandten in beiden Ländern, sondern bringt den Kindern später in Schule und Beruf enorme Vorteile. Allerdings erfordert eine mehrsprachige Erziehung von den Eltern viel Geduld, Disziplin und Konsequenz über viele Jahre hinweg.',
    slot2_fikra1: {
      caseNum: 2,
      origSub:
        'jeder Elternteil spricht mit dem Kind von Anfang an konsequent in seiner eigenen Muttersprache',
      origVerb: 'spricht',
      bodyAfterDass:
        'jeder Elternteil mit dem Kind von Anfang an konsequent in seiner eigenen Muttersprache',
      finalVerb: 'spricht',
      dassClauseDe:
        'jeder Elternteil mit dem Kind von Anfang an konsequent in seiner eigenen Muttersprache spricht',
      arMeaning:
        'كل طرف من الواليدين كيهضر مع الطفل من البداية بانتظام باللغة الأم ديالو',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (spricht) من الوسط ورميناه لآخر الجملة.',
    },
    slot3_fikra2: {
      caseNum: 2,
      origSub:
        'auf diese Weise lernen Kinder beide Sprachen ganz natürlich und ohne Akzent nebenbei',
      origVerb: 'lernen',
      bodyAfterDass:
        'Kinder auf diese Weise beide Sprachen ganz natürlich und ohne Akzent nebenbei',
      finalVerb: 'lernen',
      dassClauseDe:
        'Kinder auf diese Weise beide Sprachen ganz natürlich und ohne Akzent nebenbei lernen',
      arMeaning:
        'الأطفال بهاد الطريقة كيتعلمو اللغتين بجوج بشكل طبيعي وبلا لكنة',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): خذينا الفعل (lernen) من الوسط وحطيناه فـ آخر الجملة.',
    },
    slot4_ijabia: {
      caseNum: 2,
      origSub:
        'das stärkt nicht nur die Bindung zu den Großeltern und Verwandten in beiden Ländern, sondern bringt den Kindern später in Schule und Beruf enorme Vorteile',
      origVerb: 'stärkt / bringt',
      bodyAfterDass:
        'das nicht nur die Bindung zu den Großeltern in beiden Ländern stärkt, sondern den Kindern später in Schule und Beruf enorme Vorteile',
      finalVerb: 'bringt',
      dassClauseDe:
        'das nicht nur die Bindung zu den Großeltern in beiden Ländern stärkt, sondern den Kindern später in Schule und Beruf enorme Vorteile bringt',
      arMeaning:
        'هادشي ما كيقويش غير العلاقة مع الجدود فـ البلدين، بل كيعطي للدراري امتيازات كبيرة من بعد فـ المدرسة والخدمة',
      surgicalDetail:
        'الحالة 2 (نقل الأفعال للأخير): ردينا stärkt لآخر الشطر الأول ورمينا bringt لآخر الجملة.',
    },
    slot5_salbia: {
      caseNum: 2,
      origSub:
        'erfordert eine mehrsprachige Erziehung von den Eltern viel Geduld, Disziplin und Konsequenz über viele Jahre hinweg',
      origVerb: 'erfordert',
      bodyAfterDass:
        'eine mehrsprachige Erziehung von den Eltern viel Geduld, Disziplin und Konsequenz über viele Jahre hinweg',
      finalVerb: 'erfordert',
      dassClauseDe:
        'eine mehrsprachige Erziehung von den Eltern viel Geduld, Disziplin und Konsequenz über viele Jahre hinweg erfordert',
      arMeaning:
        'التربية المتعددة اللغات كتطلب من الواليدين صبر كبير وانضباط واستمرارية لسنوات طويلة',
      surgicalDetail:
        'الحالة 2 (نقل فعل واحد للأخير): هزينا الفعل (erfordert) من الوسط ورميناه لآخر الجملة.',
    },
    slot6_marokko: {
      universalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
      universalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
      specificMoroccoDe:
        'viele Familien zu Hause mehrere Sprachen nutzen und Kinder schon früh mit Fremdsprachen aufwachsen',
      specificMoroccoAr:
        'بزاف د العائلات كيستعملو عدة لغات فالدار والأطفال كيكبرو مع اللغات الأجنبية من الصغر',
    },
  },
};
