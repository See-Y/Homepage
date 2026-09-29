# Demo clone: compact mobile ribbon, header offset, hide phone/BGM bar on phones, hamburger highlight, tour iframe offset.
import sys, re, pathlib
root = pathlib.Path(sys.argv[1])
OLD = '@media (max-width:640px){#mvp-ribbon{font-size:12px;line-height:1.35;padding:6px 10px;height:auto}#mvp-ribbon b{display:inline-block;margin:0 0 2px}}'
NEW = ('@media (max-width:640px){#mvp-ribbon{height:34px;font-size:12px;line-height:34px;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
       '#mvp-ribbon b{font-size:10px;padding:2px 6px;margin-right:6px}#mvp-ribbon a{display:none}#mvp-ribbon .full{display:none}'
       '.header{margin-top:34px!important}.header .header-tel,.header .bap-bar-box{display:none!important}}'
       '@media (min-width:641px){#mvp-ribbon .short{display:none}}')
RIB_OLD = '<b>MVP DEMO</b>MVP용으로 시연하고자 만든 것으로, 실제 홈페이지가 아닙니다. 시행사·분양대행사와 무관합니다.'
RIB_NEW = '<b>MVP DEMO</b><span class="full">MVP용으로 시연하고자 만든 것으로, 실제 홈페이지가 아닙니다. 시행사·분양대행사와 무관합니다.</span><span class="short">시연용 데모 · 실제 홈페이지가 아닙니다</span>'
HAM = ('.hamburger-nav .mvp-tour>a{color:#12B3BE!important;font-weight:700}'
       '.hamburger-nav .mvp-tour>a::after{content:"NEW";display:inline-block;position:static;width:auto;height:auto;margin-left:8px;background:#E0B060;color:#0B1418;font:900 10px/1 "Noto Sans KR","Malgun Gothic",sans-serif;padding:3px 7px;border-radius:999px;letter-spacing:.08em;vertical-align:middle;animation:mvpBob2 1s ease-in-out infinite}'
       '@keyframes mvpBob2{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}')
TOUR_OLD = '@media (max-width:640px){.mvp-tour-wrap{margin-top:124px;height:calc(100vh - 124px)}}'
TOUR_NEW = '@media (max-width:640px){.mvp-tour-wrap{margin-top:88px;height:calc(100dvh - 88px);min-height:420px}}'
changed = []
for p in list(root.glob('*.html')) + list(root.glob('pages/*.html')):
    s = open(p, encoding='utf-8', newline='').read()
    o = s
    if OLD not in s and NEW not in s:
        print('ribbon media rule missing:', p); continue
    s = s.replace(OLD, NEW)
    s = s.replace(RIB_OLD, RIB_NEW)
    if HAM not in s:
        s = s.replace('</style>', HAM + '</style>', 1) if 'id="mvp-attention"' not in s else s.replace('@media (prefers-reduced-motion:reduce){.header-nav .mvp-tour>a', HAM + '@media (prefers-reduced-motion:reduce){.header-nav .mvp-tour>a', 1)
    s = s.replace(TOUR_OLD, TOUR_NEW)
    if s != o:
        open(p, 'w', encoding='utf-8', newline='').write(s)
        changed.append(p.name)
print('changed', len(changed), changed)
print('---- ham')
# Add a mobile hamburger nav (clone of .header-nav > ul, with a plus/minus span like the original mobile site) after </header>.
import sys, re, pathlib
root = pathlib.Path(sys.argv[1])
CSS = ('@media(max-width:750px){.hamburger-nav{top:34px;height:calc(100% - 34px);padding-top:70px}.hamburger-nav>ul>li>a{color:#333}}'
       '.hamburger-nav .mvp-tour>a{color:#12B3BE!important}')
n = 0
for p in list(root.glob('*.html')) + list(root.glob('pages/*.html')):
    s = open(p, encoding='utf-8', newline='').read()
    if 'class="hamburger-nav"' in s: continue
    m = re.search(r'<nav class="header-nav">\s*(<ul>.*?</ul>)\s*</nav>', s, re.S)
    if not m: print('no header-nav', p); continue
    ul = m.group(1)
    ul = re.sub(r'<!--.*?-->', '', ul, flags=re.S)
    # top-level items with a sub list get a +/- indicator span
    def top(mm):
        return mm.group(1) + '<span></span></a>' if '<ul>' in mm.group(0) else mm.group(0)
    ul = re.sub(r'(<li[^>]*><a href="[^"]*">[^<]*)</a>(?=\s*<ul>)', r'\1<span></span></a>', ul)
    nav = '<nav class="hamburger-nav" aria-label="모바일 메뉴">' + ul + '</nav><div class="hamburger-dim"></div>'
    s = s.replace('</header>', '</header>' + nav, 1)
    if CSS not in s:
        s = s.replace('@keyframes mvpBob2', CSS + '@keyframes mvpBob2', 1)
    open(p, 'w', encoding='utf-8', newline='').write(s); n += 1
print('patched', n)
