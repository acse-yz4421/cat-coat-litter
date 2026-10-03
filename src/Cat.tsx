import { useId } from 'react';
import { commonCoat } from './commonCoats';
import { patternName, seeded, type Phenotype } from './genetics';

// Display size and age are independent: parent thumbnails keep adult proportions.
export function Cat({ p: input, seed = 1, small = false, kitten = false }: {
  p: Phenotype; seed?: number; small?: boolean; kitten?: boolean;
}) {
  const allWhite=!!input.whiteCoat;
  const shaded=!allWhite&&!!input.silver&&!!input.shaded&&input.pattern!=='solid';
  const p:Phenotype=allWhite?{...input,base:'black',pattern:'solid',point:false,white:0,silver:false}:shaded?{...input,pattern:'solid'}:input;
  const id = useId().replace(/:/g, '');
  const rng = seeded(seed);
  const flip = rng() < .5;
  const offset = Math.round(rng() * 12 - 6);
  const variant = Math.floor(rng() * 3);
  const sock = 9 + rng() * 8;
  const black = p.pigment==='chocolate' ? p.dilute?'#b9b0ad':'#805845' : p.pigment==='cinnamon' ? p.dilute?'#d5bba2':'#b97848' : p.dilute ? '#89969f' : '#57534f';
  const red = p.dilute ? '#e6c99e' : '#cf8b4d';
  const white = '#fffaf0';
  const ink = '#494139';
  const coat = allWhite ? '#fffaf0' : p.point ? (p.silver?'#eeeef0':'#e9ddc8') : p.silver ? (p.pattern==='solid'&&!shaded?'#92979b':'#edf0ef') : p.base === 'red' ? red : p.pigment==='black'&&!p.dilute&&p.pattern!=='solid' ? '#a18d6b' : black;
  const stripe = p.base === 'red' ? p.dilute ? '#bf986c' : '#925930' : p.pigment==='chocolate' ? p.dilute?'#806b7a':'#4f332b' : p.pigment==='cinnamon' ? p.dilute?'#aa8665':'#764629' : p.dilute ? '#596b7b' : '#302e2b';
  const head = 'M65 72 Q59 51 61 30 Q62 24 68 29 L92 47 Q120 39 148 47 L172 29 Q178 24 179 30 Q181 51 175 72 Q191 95 173 115 Q154 135 120 135 Q86 135 67 115 Q49 95 65 72Z';
  const body = 'M88 116 Q71 128 67 157 Q62 174 68 186 Q78 197 97 187 Q120 197 143 187 Q162 197 172 186 Q178 173 173 157 Q169 128 152 116Z';
  const headTransform = kitten ? 'translate(-12 3) scale(1.1)' : 'translate(7 0) scale(.94)';
  const bodyTransform = kitten ? 'translate(14 39) scale(.88 .79)' : 'translate(0 0)';
  const mirrored = flip ? 'translate(240 0) scale(-1 1)' : undefined;
  const patches = variant === 0
    ? 'M49 32Q90 19 104 59Q112 78 89 88Q66 99 55 75ZM135 102Q158 81 182 105Q193 131 164 140Q139 135 135 102Z'
    : variant === 1
      ? 'M130 26Q168 15 187 52Q187 76 159 85Q133 87 126 65ZM49 94Q66 77 83 94Q101 114 79 136L52 126Z'
      : 'M50 29Q89 26 87 52Q99 64 83 81Q61 82 48 64ZM119 79Q130 64 145 75Q159 87 146 103Q127 111 119 96ZM167 107Q190 97 190 124L153 140Q147 122 167 107Z';
  const bodyPatches = variant === 1
    ? 'M118 113Q155 103 173 133Q174 155 147 163Q124 152 118 113ZM57 159Q91 144 100 168L98 199H54Z'
    : 'M56 119Q91 105 108 127Q121 148 99 160Q81 168 59 151ZM134 152Q160 135 179 158L177 200H139Q123 180 134 152Z';
  return <svg viewBox="0 0 240 210" role="img"
    aria-label={`${kitten ? '幼猫' : '成猫'}：${commonCoat(input).name}，${patternName(input)}`}
    className={small ? 'cat small' : 'cat'}>
    <defs>
      <linearGradient id={`${id}-silver-tip`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={stripe} stopOpacity=".58"/><stop offset=".4" stopColor={stripe} stopOpacity=".22"/><stop offset=".8" stopColor={stripe} stopOpacity="0"/></linearGradient>
      <linearGradient id={`${id}-silver-side`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={stripe} stopOpacity=".38"/><stop offset=".32" stopColor={stripe} stopOpacity=".04"/><stop offset=".68" stopColor={stripe} stopOpacity=".04"/><stop offset="1" stopColor={stripe} stopOpacity=".38"/></linearGradient>
      <linearGradient id={`${id}-ticking`} x1="0" y1="0" x2="1" y2=".8">
        <stop offset="0" stopColor={stripe} stopOpacity=".3"/>
        <stop offset=".45" stopColor={p.silver?'#f2f3f1':p.dilute?'#eee0c9':'#d5aa75'} stopOpacity=".42"/>
        <stop offset="1" stopColor={stripe} stopOpacity=".22"/>
      </linearGradient>
      <radialGradient id={`${id}-warmth`} cx=".5" cy=".85" r=".8">
        <stop offset="0" stopColor={p.silver?'#f2f3f1':p.dilute?'#eee0c9':'#d5aa75'} stopOpacity=".58"/>
        <stop offset="1" stopColor={stripe} stopOpacity=".12"/>
      </radialGradient>
      <clipPath id={`${id}-head`}><path d={head}/></clipPath>
      <clipPath id={`${id}-body`}><path d={body}/></clipPath>
      <clipPath id={`${id}-feet`}><path d="M55 173H100V201H55ZM140 173H182V201H140Z"/></clipPath>
      <clipPath id={`${id}-points`}><path d="M46 20H100L83 74H51ZM140 20H196V73H155Z"/><path d="M86 88Q94 70 120 73Q146 70 154 88Q168 108 149 125Q120 140 91 125Q72 108 86 88Z"/></clipPath>
    </defs>
    <ellipse cx="122" cy="194" rx={kitten ? 62 : 72} ry="6" fill="#65533e" opacity=".1"/>
    <g transform={bodyTransform}>
      <path d="M160 175Q204 190 201 153Q200 142 192 143" fill="none" stroke={p.point ? p.base==='red'?red:black : coat} strokeWidth="16" strokeLinecap="round"/>
      {shaded&&<path d="M160 175Q204 190 201 153Q200 142 192 143" fill="none" stroke={stripe} opacity=".35" strokeWidth="12" strokeLinecap="round"/>}
      {p.pattern!=='solid' && <path d="M191 177l10-5m-9-12 10-3" fill="none" stroke={stripe} strokeWidth="5" strokeLinecap="round"/>}
      <path d={body} fill={coat}/>
      <g clipPath={`url(#${id}-body)`}>
        {shaded&&<g clipPath={p.point?`url(#${id}-feet)`:undefined}><path d={body} fill={`url(#${id}-silver-tip)`}/><path d={body} fill={`url(#${id}-silver-side)`}/></g>}
        {p.base==='tortie' && !p.point && <path d={bodyPatches} fill={red} transform={mirrored}/>}
        {p.point && <path d="M62 169Q81 163 98 176V201H55ZM141 176Q159 163 180 169V201H141Z" fill={p.base==='red'?red:black}/>}
        {p.point && p.base==='tortie' && <path d="M144 177Q156 164 173 169V200H150Z" fill={red} transform={mirrored}/>}
        <g clipPath={p.point?`url(#${id}-feet)`:undefined}>
          {p.pattern==='tabby' && <g fill={stripe} opacity=".8" transform={`translate(0 ${offset*.35})`}>
            <path d="M60 132Q87 132 95 143Q74 140 62 140ZM56 148Q80 147 89 159Q70 154 57 158ZM174 132Q153 133 145 143Q164 140 182 142ZM181 150Q158 148 151 159Q168 153 184 161Z"/>
            {variant!==1 && <path d="M70 169Q85 165 94 173L69 178ZM170 168Q157 165 148 174L175 179Z"/>}
          </g>}
          {p.pattern==='classic' && <g fill={stripe} opacity=".85" transform={mirrored}>
            {/* Broad flank bands with open centers, rather than drawn spirals. */}
            <path fillRule="evenodd" d="M61 132Q83 120 101 137Q114 154 101 176Q85 193 66 178Q50 161 61 132ZM69 141Q61 157 72 172Q83 183 94 170Q104 154 94 142Q83 131 69 141Z"/>
            <path d="M75 149Q84 140 91 151Q97 162 86 170Q77 170 74 159Z"/>
            <path fillRule="evenodd" d="M145 130Q165 119 180 135Q191 159 175 178Q159 190 143 175Q129 155 145 130ZM149 141Q138 157 150 171Q164 181 173 165Q181 149 168 140Q158 133 149 141Z"/>
            <path d="M153 149Q162 141 167 151Q173 161 162 168Q152 165 153 149Z"/>
            <path d="M104 117Q120 128 136 117L130 136Q120 130 110 136ZM112 141Q120 147 128 141L127 169Q120 176 113 169Z"/>
          </g>}
          {p.pattern==='spotted' && <g fill={stripe} opacity=".85" transform={`translate(${offset*.3} 0)`}>
            {[[85,132],[102,143],[78,152],[94,166],[77,179],[119,158],[149,131],[162,145],[144,155],[166,173],[143,180],[120,181]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx={i%2?4:5} ry={i%3?4:6} transform={`rotate(${i*31} ${x} ${y})`}/>)}
          </g>}
          {p.pattern==='ticked' && <g>
            <path d={body} fill={`url(#${id}-ticking)`}/>
            <path d="M91 137Q120 125 149 137L148 193H92Z" fill={`url(#${id}-warmth)`}/>
            <path d="M68 172l17 3m70 0 17-3" stroke={stripe} strokeWidth="3" opacity=".3" strokeLinecap="round"/>
          </g>}
        </g>
        {p.white>=1 && <>
          <path d={`M103 119Q120 128 137 119L132 139L125 145L120 141L113 146L106 136Z`} fill={white}/>
          <path d={`M56 ${190-sock}Q78 ${184-sock} 97 ${190-sock}V201H53ZM143 ${187-sock/2}Q162 ${183-sock/2} 181 ${187-sock/2}V201H141Z`} fill={white}/>
        </>}
        {p.white>=2 && <path d={`M${105+offset} 119Q120 132 ${138+offset} 120Q132 147 147 176L141 199H94Q88 175 101 152Z`} fill={white}/>}
        {p.white>=3 && <><path d="M50 115H190V205H50Z" fill={white}/><path d={variant===1?'M63 127Q83 117 90 135Q91 150 76 152L62 147Z':'M149 145Q175 132 181 157Q177 176 158 170Q143 164 149 145Z'} fill={coat} transform={mirrored}/></>}
      </g>
      <path d={body} fill="none" stroke={ink} strokeWidth="2.4" strokeLinejoin="round"/>
      <path d="M97 160L97 183Q97 190 87 190m56-30v23q0 7 10 7" stroke={ink} strokeWidth="2" opacity=".45" fill="none" strokeLinecap="round"/>
      <path d="M76 183v5m7-4v5m74-6v5m7-4v4" stroke={ink} strokeWidth="1.5" opacity=".35" strokeLinecap="round"/>
    </g>
    <g transform={headTransform}>
      <path d={head} fill={coat}/>
      <g clipPath={`url(#${id}-head)`}>
        {shaded&&<path d={head} fill={`url(#${id}-silver-tip)`} clipPath={p.point?`url(#${id}-points)`:undefined}/>}
        {p.base==='tortie' && !p.point && <path d={patches} fill={red} transform={mirrored}/>}
        {p.point && <g clipPath={`url(#${id}-points)`}>
          <path d={head} fill={p.base==='red'?red:black}/>
          {p.base==='tortie' && <path d={patches} fill={red} transform={mirrored}/>}
        </g>}
        {p.pattern!=='solid' && <g clipPath={p.point?`url(#${id}-points)`:undefined} fill={stripe} opacity={p.pattern==='ticked'?.45:.85}>
          {p.pattern!=='ticked' && <path d="M104 43Q108 52 113 69L120 61L127 69Q132 52 136 43L128 46L125 57L120 52L115 57L112 45Z"/>}
          {p.pattern==='tabby' && <path d="M51 86Q70 82 81 90Q70 94 53 93ZM53 101Q70 95 83 101Q72 105 57 108ZM188 86Q169 82 159 90Q170 94 186 93ZM187 101Q170 95 157 101Q170 105 183 108Z"/>}
          {p.pattern==='classic' && <path d="M61 88Q72 89 80 94M62 101Q71 102 78 107M179 88Q168 89 160 94M178 101Q169 102 162 107M113 76L115 83M127 76L125 83" fill="none" stroke={stripe} strokeWidth="4" strokeLinecap="round"/>}
          {p.pattern==='spotted' && <>{[[74,85],[78,103],[65,96],[166,85],[162,103],[175,96],[113,78],[126,77]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="3" ry={i%2?4:3}/>)}</>}
          {p.pattern==='ticked' && <g>
            <path d={head} fill={`url(#${id}-warmth)`}/>
            <path d="M105 51l9 15 6-7 6 7 9-15M64 94l16 5m80 0 16-5" fill="none" stroke={stripe} strokeWidth="2.5" strokeLinecap="round"/>
          </g>}
        </g>}
        {p.white>=2 && <path d={`M${120+offset} ${p.white===3?47:76}Q${113+offset} 96 96 112Q85 126 78 140H167Q154 119 139 108Q128 94 ${120+offset} ${p.white===3?47:76}Z`} fill={white}/>}
        {p.white>=3 && <path d="M45 93Q70 110 99 107L102 140H43ZM195 93Q170 110 141 107L138 140H197Z" fill={white}/>}
      </g>
      <path d={head} fill="none" stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M68 37L84 50L71 61Q68 48 68 37ZM172 37L156 50L169 61Q172 48 172 37Z" fill="#d6a199"/>
      <g stroke={ink} strokeLinecap="round" fill="none">
        {kitten ? <>
          <ellipse cx="96" cy="94" rx="8" ry="10" fill="#f1dfb1" strokeWidth="1.7"/>
          <ellipse cx="144" cy="94" rx="8" ry="10" fill="#f1dfb1" strokeWidth="1.7"/>
          <ellipse cx="97" cy="95" rx="4.3" ry="7" fill="#353631" stroke="none"/>
          <ellipse cx="143" cy="95" rx="4.3" ry="7" fill="#353631" stroke="none"/>
          <circle cx="99" cy="91" r="2.2" fill="#fffaf0" stroke="none"/><circle cx="145" cy="91" r="2.2" fill="#fffaf0" stroke="none"/>
        </> : <path d="M88 94Q96 85 104 94M136 94Q144 85 152 94" strokeWidth="3"/>}
        <path d="M120 110v5q-6 7-12 0m12 0q6 7 12 0" strokeWidth="2.2"/>
        <path d="M88 110l-18-2m19 8-15 3m78-9 18-2m-19 8 15 3" strokeWidth="1.5" opacity=".5"/>
      </g>
      <path d="M115 106Q120 104 125 106L120 112Z" fill="#bd8d83"/>
    </g>
  </svg>;
}
