// English grammar: So / Neither and Used to / Be used to / Get used to — 50 questions
// from the teacher's "Kahoot uchun 50 ta qiyinroq savol" PDF. Answers follow that PDF's
// key; every choice list is written with the correct option FIRST and shuffled at load
// time (see ./index.ts), so the key is never "always A" on the projector.

/** [prompt, [correct, wrong, wrong, wrong], explanation] */
export type RawPackQuestion = readonly [string, readonly [string, string, string, string], string];

export const SO_NEITHER: readonly RawPackQuestion[] = [
  ["I haven't finished my report. — ___ has Karim.", ['Neither', 'So', "Neither hasn't", "Nor hasn't"], "Inkor gapga Neither + ijobiy yordamchi fe'l bilan javob beriladi. Neither o'zi inkor, shuning uchun \"hasn't\" qo'shilmaydi."],
  ['She was exhausted, and ___.', ['so was her husband', 'so her husband was', 'neither was her husband', 'so did her husband'], "Ijobiy gap, fe'l was: so + was + ega (inversiya)."],
  ["\"I'd love to go abroad.\" — \"___.\"", ['So would I', 'So do I', 'Neither would I', 'So I would'], "I'd = I would, demak javobda ham would: So would I."],
  ["He didn't call, and ___.", ['neither did she', 'so did she', 'neither she did', "nor didn't she"], "Inkor, past simple (didn't) → neither did she."],
  ['My parents have never been to Paris, ___.', ['and neither have I', 'and so have I', 'and neither I have', "and I haven't neither"], "never gapni inkor qiladi, fe'l have → neither have I."],
  ["\"I'm not going to the party.\" — \"___.\"", ['Neither am I', 'So am I', 'Neither do I', 'Nor I am'], "I'm not → Neither am I."],
  ['Tom works hard, and so ___ his sisters.', ['do', 'does', 'did', 'are'], "Present simple, ega his sisters ko'plik → so do."],
  ["\"I can't understand this rule.\" — \"___.\"", ['Neither can I', 'So can I', 'Neither I can', 'Neither do I'], "Modal can't takrorlanadi: Neither can I."],
  ['She will be late, and ___.', ['so will I', 'neither will I', 'so I will', 'so do I'], 'Ijobiy, will → so will I.'],
  ['"I should have studied more." — "___."', ['So should I', 'So did I', 'Neither should I', 'So have I'], "Birinchi yordamchi fe'l should olinadi: So should I."],
  ["He doesn't speak French, ___ his wife.", ['neither does', 'so does', 'neither do', "nor doesn't"], 'Inkor, ega his wife birlik → neither does.'],
  ["\"I've got a headache.\" — \"___.\"", ['So have I', 'So do I', 'Neither have I', 'So I have'], "I've got = I have got → So have I."],
  ["My brother wasn't invited, and ___.", ['neither was I', 'neither were I', 'so was I', 'neither I was'], "Inkor, wasn't, ega I → neither was I."],
  ['"I had better go now." — "___."', ['So had I', 'So did I', 'Neither had I', 'So have I'], 'had better dagi had takrorlanadi: So had I.'],
  ["They didn't win, and we ___ either.", ["didn't", 'did', "don't", "weren't"], "either inkor gap oxirida turadi, inversiyasiz: we didn't either."],
  ['I love jazz, and so ___ my teacher.', ['does', 'do', 'is', 'did'], 'Present simple, my teacher birlik → so does.'],
  ['"I used to smoke." — "___."', ['So did I', 'So used I', 'So do I', 'So was I'], 'used to past simple kabi ishlaydi → So did I.'],
  ['Neither my mother nor my sisters ___ the answer.', ['know', 'knows', 'knowing', 'has known'], "Neither…nor da fe'l yaqinroq egaga moslanadi: my sisters → know."],
  ["\"I'm tired.\" — \"So ___.\"", ['am I', 'do I', 'I am', 'have I'], "I'm → So am I."],
  ['She has seen that film, and so ___.', ['have I', 'do I', 'did I', 'am I'], 'Present perfect, ega I bilan have → so have I.'],
  ["\"I didn't enjoy the trip.\" — \"___.\"", ['Neither did I', 'So did I', 'Neither I did', "Nor I didn't"], "didn't → Neither did I."],
  ["He couldn't open the door, ___.", ['nor could she', 'nor she could', "nor couldn't she", 'so could she'], 'nor ham neither kabi inversiya talab qiladi: nor could she.'],
  ['"I was born in a small town." — "___."', ['So was I', 'So did I', 'So I was', 'Neither was I'], 'Passiv was born → So was I.'],
  ['Not only ___ late, but he also forgot his books.', ['was he', 'he was', 'did he', 'he did be'], 'Gap boshidagi Not only dan keyin inversiya: was he.'],
  ["\"I won't tell anyone.\" — \"___.\"", ['Neither will I', 'So will I', 'Neither do I', 'Nor I will'], "won't = will not → Neither will I."],
];

export const USED_TO: readonly RawPackQuestion[] = [
  ['When I was a child, I ___ in the river every summer.', ['used to swim', 'am used to swim', 'am used to swimming', 'get used swimming'], "O'tmishdagi odat: used to + V1."],
  ["She isn't used to ___ up early.", ['getting', 'get', 'got', 'be getting'], "be used to + V-ing (ko'nikkan bo'lmoq)."],
  ['We will soon get used ___ the new system.', ['to', 'for', 'with', 'of'], 'Doim get used to + ot / V-ing.'],
  ['Did you ___ live in London?', ['use to', 'used to', 'used', 'were used to'], 'Savol va inkorda did + use to (d siz).'],
  ["He ___ spicy food, so he doesn't mind it.", ['is used to eating', 'used to eat', 'gets used eat', 'is used eat'], "Hozirgi ko'nikma: is used to + V-ing."],
  ['I ___ a car, but I sold it.', ['used to have', 'am used to having', 'got used to have', 'use to have'], "O'tmishda bor edi, hozir yo'q: used to + V1."],
  ['It took me a month to get used ___ the noise.', ['to', 'for', 'with', 'of'], 'get used to + ot.'],
  ['This knife is used ___ bread.', ['for cutting', 'to cutting', 'cutting', 'for cut'], 'Bu yerda "ishlatiladi" (passiv): be used for + V-ing — vazifasini bildiradi.'],
  ['People ___ that the Earth was flat.', ['used to believe', 'were used to believe', 'are used to believing', 'get used to believe'], "O'tmishdagi, endi to'g'ri bo'lmagan holat: used to + V1."],
  ["I'm not used to ___ in front of a large audience.", ['speaking', 'speak', 'spoke', 'be spoken'], 'be used to + V-ing.'],
  ['She ___ a shy girl, but now she is very confident.', ['used to be', 'is used to be', 'used to being', 'got used to be'], "O'tmishdagi holat: used to be."],
  ['He never ___ the cold weather in Norway.', ['got used to', 'got used', 'used to', 'was used'], 'get used to + ot; to tushib qolmaydi.'],
  ['Which sentence is correct?', ["I didn't use to like tea.", "I didn't used to like tea.", 'I not used to like tea.', "I wasn't use to like tea."], "didn't dan keyin fe'l asos shaklda: use to."],
  ['After years abroad, he ___ the local customs.', ['had got used to', 'used to', 'was used to get', 'used to getting'], "Ko'nikish jarayoni o'tmishda tugagan: had got used to + ot."],
  ["My grandfather ___ every morning, but now he can't.", ['used to run', 'is used to run', 'used to running', 'got used to run'], "O'tmishdagi odat: used to + V1."],
  ['Are you used ___ on night shifts?', ['to working', 'work', 'to work', 'working'], 'be used to + V-ing → to working.'],
  ['We ___ in a small flat, but we moved last year.', ['used to live', 'are used to living', 'get used to live', 'used living'], "O'tmishda yashardik, endi yo'q: used to live."],
  ["I'm getting used ___ my new job.", ['to', 'for', 'at', 'with'], 'get used to + ot.'],
  ['Which sentence is NOT correct?', ['She is used to play piano.', 'She used to play piano.', 'She is used to playing piano.', 'She got used to playing piano.'], 'be used to dan keyin V1 emas, V-ing keladi — "is used to play" xato.'],
  ['When I first moved here, I ___ the traffic.', ["wasn't used to", "didn't used to", 'am not used to', "don't use to"], "O'tmishda hali ko'nikmagan edim: wasn't used to + ot."],
  ['He ___ be so lazy; now he works day and night.', ['used to', 'is used to', 'gets used to', 'was used'], "O'tmishdagi holat: used to + V1."],
  ["I can't get used to ___ on the left side of the road.", ['driving', 'drive', 'drove', 'be drive'], 'get used to + V-ing.'],
  ['Students ___ their phones in class, but the rule has changed.', ['used to use', 'were used to use', 'used to using', 'are used to use'], "O'tmishdagi odat: used to use."],
  ['She is used to ___ by her fans.', ['being recognized', 'recognize', 'recognizing', 'be recognizing'], "Passiv ko'nikma: be used to + being + V3."],
  ['By next year, you ___ the climate here.', ['will have got used to', 'will used to', 'are used to get', 'will be used to get'], '"By next year" — kelasida tugallangan: will have got used to.'],
];
