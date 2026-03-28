const THEME_KEY = 'lol_theme_v1'
const themeBtn = document.getElementById('themeBtn')
const rerollBtn = document.getElementById('rerollBtn')
const copyBtn = document.getElementById('copyBtn')
const toggleContactBtn = document.getElementById('toggleContactBtn')
const contactPanel = document.getElementById('contactPanel')
const statusMsg = document.getElementById('statusMsg')

// Theme Management
let isLightMode = localStorage.getItem(THEME_KEY) === 'light'
if (isLightMode) {
  document.body.classList.add('light-mode')
  themeBtn.textContent = '🌙 다크 모드'
}

themeBtn.addEventListener('click', () => {
  isLightMode = !isLightMode
  document.body.classList.toggle('light-mode', isLightMode)
  localStorage.setItem(THEME_KEY, isLightMode ? 'light' : 'dark')
  themeBtn.textContent = isLightMode ? '🌙 다크 모드' : '☀️ 라이트 모드'
})

// Contact Form Toggle
toggleContactBtn.addEventListener('click', () => {
  const isHidden = contactPanel.style.display === 'none'
  contactPanel.style.display = isHidden ? 'block' : 'none'
  toggleContactBtn.textContent = isHidden ? '❌ 문의 닫기' : '🤝 제휴 문의'
  if (isHidden) {
    contactPanel.scrollIntoView({ behavior: 'smooth' })
  }
})

const champions = {
  TOP: ['가렌', '다리우스', '잭스', '피오라', '카밀', '레넥톤', '아트록스', '오른', '말파이트', '제이스', '갱플랭크', '나르', '퀸', '티모'],
  JUNGLE: ['리 신', '자르반 4세', '카직스', '바이브', '니달리', '엘리스', '세주아니', '잭', '그레이브즈', '킨드레드', '에코', '샤코', '녹턴'],
  MID: ['아리', '야스오', '요네', '제드', '신드라', '오리아나', '빅토르', '르블랑', '카타리나', '아지르', '벡스', '조이', '탈론', '럭스'],
  ADC: ['이즈리얼', '카이사', '베인', '징크스', '루시안', '애쉬', '케이틀린', '사미라', '드레이븐', '바루스', '닐라', '트리스타나', '자야'],
  SUPPORT: ['쓰레쉬', '레오나', '노틸러스', '룰루', '잔나', '소라카', '파이크', '세나', '바드', '라칸', '블리츠크랭크', '유미', '나미']
}

async function reroll() {
  if (rerollBtn.disabled) return
  rerollBtn.disabled = true
  statusMsg.textContent = '운명의 챔피언을 찾는 중...'
  
  const lanes = ['top', 'jungle', 'mid', 'adc', 'support']
  
  // Rolling effect
  for (let i = 0; i < 10; i++) {
    lanes.forEach(lane => {
      const el = document.getElementById(`${lane}Champ`)
      const list = champions[lane.toUpperCase()]
      el.textContent = list[Math.floor(Math.random() * list.length)]
      el.classList.add('rolling')
    })
    await new Promise(r => setTimeout(r, 80))
  }

  // Final selection
  lanes.forEach(lane => {
    const el = document.getElementById(`${lane}Champ`)
    const list = champions[lane.toUpperCase()]
    el.textContent = list[Math.floor(Math.random() * list.length)]
    el.classList.remove('rolling')
  })

  statusMsg.textContent = '챔피언 선택 완료! 전장으로 나가세요.'
  rerollBtn.disabled = false
}

async function copyCombination() {
  const top = document.getElementById('topChamp').textContent
  const jungle = document.getElementById('jungleChamp').textContent
  const mid = document.getElementById('midChamp').textContent
  const adc = document.getElementById('adcChamp').textContent
  const support = document.getElementById('supportChamp').textContent
  
  if (top === '?') {
    alert('먼저 리롤을 눌러주세요!')
    return
  }

  const text = `🎮 오늘의 롤 조합:\nTOP: ${top}\nJUNGLE: ${jungle}\nMID: ${mid}\nADC: ${adc}\nSUP: ${support}`
  
  try {
    await navigator.clipboard.writeText(text)
    alert('조합이 복사되었습니다!')
  } catch (err) {
    alert('복사에 실패했습니다.')
  }
}

rerollBtn.addEventListener('click', reroll)
copyBtn.addEventListener('click', copyCombination)
