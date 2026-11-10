// The Nairobi line drawing from the Zana design canvas ("Illustration - Nairobi
// line drawing"): convention centre, clock tower, the Upper Hill towers, an
// acacia and a giraffe, drawn as one ink line. It is copied from the canvas, so
// a change to the drawing starts there.
//
// One colour (currentColor). Lines keep their on-screen width at every size
// (vector-effect, index.css); their opacity gives the drawing depth. The drawing
// is decorative: the heading beside it is the text, so it is hidden from
// assistive technology.

export function NairobiSkyline({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440.5 330"
      preserveAspectRatio="xMidYMax slice"
      className={`skyline ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g strokeWidth={1.8} strokeOpacity={1} strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 320 L106 256 L94 226 M106 256 L126 222 M94 226 L72 218" />
        <path d="M22 214 Q100 192 190 210 Q150 220 100 220 Q50 220 22 214 Z M52 204 Q100 184 156 198" />
        <path d="M200 320 L201 286 M212 320 L213 290 M234 320 L234 290 M246 320 L245 286 M194 274 Q196 260 222 260 Q250 260 252 274 Q250 290 222 290 Q196 290 194 274 Z M244 268 L280 200 L270 194 L238 262 M270 194 Q282 186 292 192 L284 202 Z M274 190 L272 180 M280 188 L280 178 M194 272 L186 298" />
        <path d="M592 148 L632 148 M594 140 L630 140 L630 148 M594 140 L594 148 M600 140 L612 116 L624 140 M612 116 L612 90" />
        <path d="M700 320 C704 266, 706 210, 707 148 L749 148 C750 210, 752 266, 756 320" />
        <path d="M890 320 L890 132 L936 118 L936 320" />
        <path d="M1160 320 L1160 102 L1212 66 L1212 320" />
        <path d="M1224 122 L1244 90 L1264 122 M1244 90 L1244 56" />
        <path d="M1404 320 L1408 268 L1400 246 M1408 268 L1422 244 M1400 246 L1388 240" />
        <path d="M1378 240 Q1404 228 1434 238 Q1418 244 1404 244 Q1390 244 1378 240 Z" />
        <path d="M10 320 L1430 320" />
      </g>
      <g strokeWidth={1.1} strokeOpacity={0.8}>
        <circle cx="212" cy="270" r="2.4" />
        <circle cx="228" cy="268" r="2.4" />
        <circle cx="238" cy="278" r="2.4" />
        <circle cx="220" cy="282" r="2.4" />
        <circle cx="258" cy="246" r="2.4" />
        <circle cx="266" cy="228" r="2.4" />
      </g>
      <g strokeWidth={1.8} strokeOpacity={1}>
        <rect x="310" y="236" width="170" height="84" />
        <rect x="500" y="182" width="34" height="138" />
        <rect x="495" y="174" width="44" height="10" />
        <rect x="552" y="268" width="120" height="52" />
        <rect x="596" y="148" width="32" height="172" />
        <circle cx="612" cy="170" r="9" />
        <ellipse cx="728" cy="143" rx="46" ry="7" />
        <rect x="716" y="124" width="24" height="14" />
        <rect x="722" y="114" width="12" height="10" />
        <rect x="766" y="294" width="104" height="26" />
        <rect x="950" y="262" width="196" height="58" />
        <rect x="1226" y="120" width="36" height="200" />
        <rect x="1276" y="170" width="40" height="150" />
        <rect x="1330" y="94" width="44" height="226" />
        <rect x="1336" y="82" width="32" height="12" />
        <rect x="1342" y="72" width="20" height="10" />
      </g>
      <g strokeWidth={1.6} strokeOpacity={1} strokeLinecap="round" strokeLinejoin="round">
        <path d="M304 236 L486 236 M308 228 L482 228 L482 236 M308 228 L308 236" />
        <path d="M758 296 L818 266 L878 296 Z M818 266 L818 254 M776 306 L860 306" />
        <path d="M944 262 L1152 262" />
        <path d="M1018 262 L1048 244 L1078 262 Z" />
      </g>
      <g strokeWidth={1} strokeOpacity={0.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M326.0 244 L326.0 302 M330.0 244 L330.0 302" />
        <path d="M324.0 244 L332.0 244 M324.0 302 L332.0 302" />
        <path d="M345.14285714285717 244 L345.14285714285717 302 M349.14285714285717 244 L349.14285714285717 302" />
        <path d="M343.14285714285717 244 L351.14285714285717 244 M343.14285714285717 302 L351.14285714285717 302" />
        <path d="M364.2857142857143 244 L364.2857142857143 302 M368.2857142857143 244 L368.2857142857143 302" />
        <path d="M362.2857142857143 244 L370.2857142857143 244 M362.2857142857143 302 L370.2857142857143 302" />
        <path d="M383.42857142857144 244 L383.42857142857144 302 M387.42857142857144 244 L387.42857142857144 302" />
        <path d="M381.42857142857144 244 L389.42857142857144 244 M381.42857142857144 302 L389.42857142857144 302" />
        <path d="M402.57142857142856 244 L402.57142857142856 302 M406.57142857142856 244 L406.57142857142856 302" />
        <path d="M400.57142857142856 244 L408.57142857142856 244 M400.57142857142856 302 L408.57142857142856 302" />
        <path d="M421.7142857142857 244 L421.7142857142857 302 M425.7142857142857 244 L425.7142857142857 302" />
        <path d="M419.7142857142857 244 L427.7142857142857 244 M419.7142857142857 302 L427.7142857142857 302" />
        <path d="M440.8571428571429 244 L440.8571428571429 302 M444.8571428571429 244 L444.8571428571429 302" />
        <path d="M438.8571428571429 244 L446.8571428571429 244 M438.8571428571429 302 L446.8571428571429 302" />
        <path d="M460.0 244 L460.0 302 M464.0 244 L464.0 302" />
        <path d="M458.0 244 L466.0 244 M458.0 302 L466.0 302" />
        <path d="M1022.0 266 L1022.0 316 M1026.0 266 L1026.0 316" />
        <path d="M1020.0 266 L1028.0 266 M1020.0 316 L1028.0 316" />
        <path d="M1034.0 266 L1034.0 316 M1038.0 266 L1038.0 316" />
        <path d="M1032.0 266 L1040.0 266 M1032.0 316 L1040.0 316" />
        <path d="M1046.0 266 L1046.0 316 M1050.0 266 L1050.0 316" />
        <path d="M1044.0 266 L1052.0 266 M1044.0 316 L1052.0 316" />
        <path d="M1058.0 266 L1058.0 316 M1062.0 266 L1062.0 316" />
        <path d="M1056.0 266 L1064.0 266 M1056.0 316 L1064.0 316" />
        <path d="M1070.0 266 L1070.0 316 M1074.0 266 L1074.0 316" />
        <path d="M1068.0 266 L1076.0 266 M1068.0 316 L1076.0 316" />
      </g>
      <g strokeWidth={1} strokeOpacity={0.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M316 302 L474 302 M312 310 L478 310 M308 318 L482 318" />
        <path d="M562 318 L562 298 Q567 290 572 298 L572 318" />
        <path d="M577 318 L577 298 Q582 290 587 298 L587 318" />
        <path d="M592 318 L592 298 Q597 290 602 298 L602 318" />
        <path d="M607 318 L607 298 Q612 290 617 298 L617 318" />
        <path d="M622 318 L622 298 Q627 290 632 298 L632 318" />
        <path d="M637 318 L637 298 Q642 290 647 298 L647 318" />
        <path d="M652 318 L652 298 Q657 290 662 298 L662 318" />
      </g>
      <g strokeWidth={1} strokeOpacity={0.6}>
        <rect x="506" y="186" width="22" height="5" />
        <rect x="605" y="190" width="14" height="10" />
        <rect x="605" y="208" width="14" height="10" />
        <rect x="605" y="226" width="14" height="10" />
        <rect x="605" y="244" width="14" height="10" />
        <rect x="958" y="272" width="8" height="12" />
        <rect x="958" y="294" width="8" height="12" />
        <rect x="976" y="272" width="8" height="12" />
        <rect x="976" y="294" width="8" height="12" />
        <rect x="994" y="272" width="8" height="12" />
        <rect x="994" y="294" width="8" height="12" />
        <rect x="1090" y="272" width="8" height="12" />
        <rect x="1090" y="294" width="8" height="12" />
        <rect x="1108" y="272" width="8" height="12" />
        <rect x="1108" y="294" width="8" height="12" />
        <rect x="1126" y="272" width="8" height="12" />
        <rect x="1126" y="294" width="8" height="12" />
      </g>
      <g strokeWidth={1} strokeOpacity={0.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M504 206 L530 206" />
        <path d="M504 216 L530 216" />
        <path d="M504 226 L530 226" />
        <path d="M504 236 L530 236" />
        <path d="M504 246 L530 246" />
        <path d="M504 256 L530 256" />
        <path d="M504 266 L530 266" />
        <path d="M504 276 L530 276" />
        <path d="M504 286 L530 286" />
        <path d="M504 296 L530 296" />
        <path d="M504 306 L530 306" />
        <path d="M504 316 L530 316" />
        <path d="M894 144 L932 144" />
        <path d="M894 154 L932 154" />
        <path d="M894 164 L932 164" />
        <path d="M894 174 L932 174" />
        <path d="M894 184 L932 184" />
        <path d="M894 194 L932 194" />
        <path d="M894 204 L932 204" />
        <path d="M894 214 L932 214" />
        <path d="M894 224 L932 224" />
        <path d="M894 234 L932 234" />
        <path d="M894 244 L932 244" />
        <path d="M894 254 L932 254" />
        <path d="M894 264 L932 264" />
        <path d="M894 274 L932 274" />
        <path d="M894 284 L932 284" />
        <path d="M894 294 L932 294" />
        <path d="M894 304 L932 304" />
        <path d="M894 314 L932 314" />
        <path d="M1230 137 L1258 137" />
        <path d="M1230 146 L1258 146" />
        <path d="M1230 155 L1258 155" />
        <path d="M1230 164 L1258 164" />
        <path d="M1230 173 L1258 173" />
        <path d="M1230 182 L1258 182" />
        <path d="M1230 191 L1258 191" />
        <path d="M1230 200 L1258 200" />
        <path d="M1230 209 L1258 209" />
        <path d="M1230 218 L1258 218" />
        <path d="M1230 227 L1258 227" />
        <path d="M1230 236 L1258 236" />
        <path d="M1230 245 L1258 245" />
        <path d="M1230 254 L1258 254" />
        <path d="M1230 263 L1258 263" />
        <path d="M1230 272 L1258 272" />
        <path d="M1230 281 L1258 281" />
        <path d="M1230 290 L1258 290" />
        <path d="M1230 299 L1258 299" />
        <path d="M1230 308 L1258 308" />
        <path d="M1334 112 L1370 112" />
        <path d="M1334 122 L1370 122" />
        <path d="M1334 132 L1370 132" />
        <path d="M1334 142 L1370 142" />
        <path d="M1334 152 L1370 152" />
        <path d="M1334 162 L1370 162" />
        <path d="M1334 172 L1370 172" />
        <path d="M1334 182 L1370 182" />
        <path d="M1334 192 L1370 192" />
        <path d="M1334 202 L1370 202" />
        <path d="M1334 212 L1370 212" />
        <path d="M1334 222 L1370 222" />
        <path d="M1334 232 L1370 232" />
        <path d="M1334 242 L1370 242" />
        <path d="M1334 252 L1370 252" />
        <path d="M1334 262 L1370 262" />
        <path d="M1334 272 L1370 272" />
        <path d="M1334 282 L1370 282" />
        <path d="M1334 292 L1370 292" />
        <path d="M1334 302 L1370 302" />
        <path d="M1334 312 L1370 312" />
      </g>
      <g strokeWidth={1} strokeOpacity={0.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M552 278 L672 278" />
        <path d="M713 156 L713 316" />
        <path d="M719 156 L719 316" />
        <path d="M725 156 L725 316" />
        <path d="M731 156 L731 316" />
        <path d="M737 156 L737 316" />
        <path d="M743 156 L743 316" />
        <path d="M1166 102 L1206 74" />
      </g>
      <g strokeWidth={1.3} strokeOpacity={1} strokeLinecap="round" strokeLinejoin="round">
        <path d="M612 170 L612 164 M612 170 L617 172" />
        <path d="M690 146 L702 156 M766 146 L754 156" />
      </g>
      <g strokeWidth={1.4} strokeOpacity={1} strokeLinecap="round" strokeLinejoin="round">
        <path d="M728 114 L728 98" />
        <path d="M420 92 q7 -7 14 0 q7 -7 14 0" />
        <path d="M446 80 q7 -7 14 0 q7 -7 14 0" />
        <path d="M1060 140 q7 -7 14 0 q7 -7 14 0" />
        <path d="M1086 128 q7 -7 14 0 q7 -7 14 0" />
      </g>
      <g strokeWidth={1} strokeOpacity={0.45} strokeLinecap="round" strokeLinejoin="round">
        <path d="M776 296 L776 318" />
        <path d="M792 296 L792 318" />
        <path d="M808 296 L808 318" />
        <path d="M824 296 L824 318" />
        <path d="M840 296 L840 318" />
        <path d="M856 296 L856 318" />
      </g>
      <g strokeWidth={1.1} strokeOpacity={1} strokeLinecap="round" strokeLinejoin="round">
        <path d="M922 120 L922 62 M918 120 L926 120 M919 108 L925 96 M925 108 L919 96 M919 96 L925 84 M925 96 L919 84 M920 84 L924 72 M924 84 L920 72" />
      </g>
      <g strokeWidth={1.5} strokeOpacity={1} strokeLinecap="round" strokeLinejoin="round">
        <path d="M1206 68 L1206 20" />
        <path d="M1198 28 L1214 28" />
        <path d="M1198 38 L1214 38" />
        <path d="M1198 48 L1214 48" />
        <path d="M1276 171 L1296 150 L1316 171 M1281 154 L1296 134 L1311 154 M1281 154 L1311 154" />
        <path d="M1352 72 L1352 48" />
      </g>
      <g strokeWidth={1} strokeOpacity={0.4}>
        <rect x="1164" y="115" width="3.5" height="5" />
        <rect x="1164" y="125" width="3.5" height="5" />
        <rect x="1164" y="135" width="3.5" height="5" />
        <rect x="1164" y="145" width="3.5" height="5" />
        <rect x="1164" y="155" width="3.5" height="5" />
        <rect x="1164" y="165" width="3.5" height="5" />
        <rect x="1164" y="175" width="3.5" height="5" />
        <rect x="1164" y="185" width="3.5" height="5" />
        <rect x="1164" y="195" width="3.5" height="5" />
        <rect x="1164" y="205" width="3.5" height="5" />
        <rect x="1164" y="215" width="3.5" height="5" />
        <rect x="1164" y="225" width="3.5" height="5" />
        <rect x="1164" y="235" width="3.5" height="5" />
        <rect x="1164" y="245" width="3.5" height="5" />
        <rect x="1164" y="255" width="3.5" height="5" />
        <rect x="1164" y="265" width="3.5" height="5" />
        <rect x="1164" y="275" width="3.5" height="5" />
        <rect x="1164" y="285" width="3.5" height="5" />
        <rect x="1164" y="295" width="3.5" height="5" />
        <rect x="1172" y="115" width="3.5" height="5" />
        <rect x="1172" y="125" width="3.5" height="5" />
        <rect x="1172" y="135" width="3.5" height="5" />
        <rect x="1172" y="145" width="3.5" height="5" />
        <rect x="1172" y="155" width="3.5" height="5" />
        <rect x="1172" y="165" width="3.5" height="5" />
        <rect x="1172" y="175" width="3.5" height="5" />
        <rect x="1172" y="185" width="3.5" height="5" />
        <rect x="1172" y="195" width="3.5" height="5" />
        <rect x="1172" y="205" width="3.5" height="5" />
        <rect x="1172" y="215" width="3.5" height="5" />
        <rect x="1172" y="225" width="3.5" height="5" />
        <rect x="1172" y="235" width="3.5" height="5" />
        <rect x="1172" y="245" width="3.5" height="5" />
        <rect x="1172" y="255" width="3.5" height="5" />
        <rect x="1172" y="265" width="3.5" height="5" />
        <rect x="1172" y="275" width="3.5" height="5" />
        <rect x="1172" y="285" width="3.5" height="5" />
        <rect x="1172" y="295" width="3.5" height="5" />
        <rect x="1180" y="115" width="3.5" height="5" />
        <rect x="1180" y="125" width="3.5" height="5" />
        <rect x="1180" y="135" width="3.5" height="5" />
        <rect x="1180" y="145" width="3.5" height="5" />
        <rect x="1180" y="155" width="3.5" height="5" />
        <rect x="1180" y="165" width="3.5" height="5" />
        <rect x="1180" y="175" width="3.5" height="5" />
        <rect x="1180" y="185" width="3.5" height="5" />
        <rect x="1180" y="195" width="3.5" height="5" />
        <rect x="1180" y="205" width="3.5" height="5" />
        <rect x="1180" y="215" width="3.5" height="5" />
        <rect x="1180" y="225" width="3.5" height="5" />
        <rect x="1180" y="235" width="3.5" height="5" />
        <rect x="1180" y="245" width="3.5" height="5" />
        <rect x="1180" y="255" width="3.5" height="5" />
        <rect x="1180" y="265" width="3.5" height="5" />
        <rect x="1180" y="275" width="3.5" height="5" />
        <rect x="1180" y="285" width="3.5" height="5" />
        <rect x="1180" y="295" width="3.5" height="5" />
        <rect x="1188" y="115" width="3.5" height="5" />
        <rect x="1188" y="125" width="3.5" height="5" />
        <rect x="1188" y="135" width="3.5" height="5" />
        <rect x="1188" y="145" width="3.5" height="5" />
        <rect x="1188" y="155" width="3.5" height="5" />
        <rect x="1188" y="165" width="3.5" height="5" />
        <rect x="1188" y="175" width="3.5" height="5" />
        <rect x="1188" y="185" width="3.5" height="5" />
        <rect x="1188" y="195" width="3.5" height="5" />
        <rect x="1188" y="205" width="3.5" height="5" />
        <rect x="1188" y="215" width="3.5" height="5" />
        <rect x="1188" y="225" width="3.5" height="5" />
        <rect x="1188" y="235" width="3.5" height="5" />
        <rect x="1188" y="245" width="3.5" height="5" />
        <rect x="1188" y="255" width="3.5" height="5" />
        <rect x="1188" y="265" width="3.5" height="5" />
        <rect x="1188" y="275" width="3.5" height="5" />
        <rect x="1188" y="285" width="3.5" height="5" />
        <rect x="1188" y="295" width="3.5" height="5" />
        <rect x="1196" y="115" width="3.5" height="5" />
        <rect x="1196" y="125" width="3.5" height="5" />
        <rect x="1196" y="135" width="3.5" height="5" />
        <rect x="1196" y="145" width="3.5" height="5" />
        <rect x="1196" y="155" width="3.5" height="5" />
        <rect x="1196" y="165" width="3.5" height="5" />
        <rect x="1196" y="175" width="3.5" height="5" />
        <rect x="1196" y="185" width="3.5" height="5" />
        <rect x="1196" y="195" width="3.5" height="5" />
        <rect x="1196" y="205" width="3.5" height="5" />
        <rect x="1196" y="215" width="3.5" height="5" />
        <rect x="1196" y="225" width="3.5" height="5" />
        <rect x="1196" y="235" width="3.5" height="5" />
        <rect x="1196" y="245" width="3.5" height="5" />
        <rect x="1196" y="255" width="3.5" height="5" />
        <rect x="1196" y="265" width="3.5" height="5" />
        <rect x="1196" y="275" width="3.5" height="5" />
        <rect x="1196" y="285" width="3.5" height="5" />
        <rect x="1196" y="295" width="3.5" height="5" />
        <rect x="1280" y="179" width="3.5" height="5" />
        <rect x="1280" y="189" width="3.5" height="5" />
        <rect x="1280" y="199" width="3.5" height="5" />
        <rect x="1280" y="209" width="3.5" height="5" />
        <rect x="1280" y="219" width="3.5" height="5" />
        <rect x="1280" y="229" width="3.5" height="5" />
        <rect x="1280" y="239" width="3.5" height="5" />
        <rect x="1280" y="249" width="3.5" height="5" />
        <rect x="1280" y="259" width="3.5" height="5" />
        <rect x="1280" y="269" width="3.5" height="5" />
        <rect x="1280" y="279" width="3.5" height="5" />
        <rect x="1280" y="289" width="3.5" height="5" />
        <rect x="1280" y="299" width="3.5" height="5" />
        <rect x="1288" y="179" width="3.5" height="5" />
        <rect x="1288" y="189" width="3.5" height="5" />
        <rect x="1288" y="199" width="3.5" height="5" />
        <rect x="1288" y="209" width="3.5" height="5" />
        <rect x="1288" y="219" width="3.5" height="5" />
        <rect x="1288" y="229" width="3.5" height="5" />
        <rect x="1288" y="239" width="3.5" height="5" />
        <rect x="1288" y="249" width="3.5" height="5" />
        <rect x="1288" y="259" width="3.5" height="5" />
        <rect x="1288" y="269" width="3.5" height="5" />
        <rect x="1288" y="279" width="3.5" height="5" />
        <rect x="1288" y="289" width="3.5" height="5" />
        <rect x="1288" y="299" width="3.5" height="5" />
        <rect x="1296" y="179" width="3.5" height="5" />
        <rect x="1296" y="189" width="3.5" height="5" />
        <rect x="1296" y="199" width="3.5" height="5" />
        <rect x="1296" y="209" width="3.5" height="5" />
        <rect x="1296" y="219" width="3.5" height="5" />
        <rect x="1296" y="229" width="3.5" height="5" />
        <rect x="1296" y="239" width="3.5" height="5" />
        <rect x="1296" y="249" width="3.5" height="5" />
        <rect x="1296" y="259" width="3.5" height="5" />
        <rect x="1296" y="269" width="3.5" height="5" />
        <rect x="1296" y="279" width="3.5" height="5" />
        <rect x="1296" y="289" width="3.5" height="5" />
        <rect x="1296" y="299" width="3.5" height="5" />
        <rect x="1304" y="179" width="3.5" height="5" />
        <rect x="1304" y="189" width="3.5" height="5" />
        <rect x="1304" y="199" width="3.5" height="5" />
        <rect x="1304" y="209" width="3.5" height="5" />
        <rect x="1304" y="219" width="3.5" height="5" />
        <rect x="1304" y="229" width="3.5" height="5" />
        <rect x="1304" y="239" width="3.5" height="5" />
        <rect x="1304" y="249" width="3.5" height="5" />
        <rect x="1304" y="259" width="3.5" height="5" />
        <rect x="1304" y="269" width="3.5" height="5" />
        <rect x="1304" y="279" width="3.5" height="5" />
        <rect x="1304" y="289" width="3.5" height="5" />
        <rect x="1304" y="299" width="3.5" height="5" />
      </g>
    </svg>
  )
}
