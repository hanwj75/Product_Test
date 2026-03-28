const THEME_KEY = 'lol_theme_v1'
const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/oiw1LN5GA/'

const themeBtn = document.getElementById('themeBtn')
const rerollBtn = document.getElementById('rerollBtn')
const copyBtn = document.getElementById('copyBtn')
const toggleContactBtn = document.getElementById('toggleContactBtn')
const toggleCommunityBtn = document.getElementById('toggleCommunityBtn')
const faceTestBtn = document.getElementById('faceTestBtn')

const contactPanel = document.getElementById('contactPanel')
const communityPanel = document.getElementById('communityPanel')
const faceTestPanel = document.getElementById('faceTestPanel')
const statusMsg = document.getElementById('statusMsg')

// AI Face Test Elements
const imageUpload = document.getElementById('imageUpload')
const uploadArea = document.getElementById('uploadArea')
const previewImg = document.getElementById('previewImg')
const uploadPrompt = document.getElementById('uploadPrompt')
const loadingSpinner = document.getElementById('loadingSpinner')
const resultContainer = document.getElementById('resultContainer')
const resultLabel = document.getElementById('resultLabel')
const resultMessage = document.getElementById('resultMessage')
const maleBar = document.getElementById('maleBar')
const femaleBar = document.getElementById('femaleBar')
const malePercent = document.getElementById('malePercent')
const femalePercent = document.getElementById('femalePercent')
const retryBtn = document.getElementById('retryBtn')

let model, maxPredictions

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

// Panels Toggle
function hideAllPanels() {
  contactPanel.style.display = 'none'
  communityPanel.style.display = 'none'
  faceTestPanel.style.display = 'none'
  toggleContactBtn.textContent = '🤝 제휴 문의'
  toggleCommunityBtn.textContent = '💬 커뮤니티'
  faceTestBtn.textContent = '🎭 챔피언 상 테스트'
}

toggleContactBtn.addEventListener('click', () => {
  const isHidden = contactPanel.style.display === 'none'
  hideAllPanels()
  if (isHidden) {
    contactPanel.style.display = 'block'
    toggleContactBtn.textContent = '❌ 문의 닫기'
    contactPanel.scrollIntoView({ behavior: 'smooth' })
  }
})

toggleCommunityBtn.addEventListener('click', () => {
  const isHidden = communityPanel.style.display === 'none'
  hideAllPanels()
  if (isHidden) {
    communityPanel.style.display = 'block'
    toggleCommunityBtn.textContent = '❌ 커뮤니티 닫기'
    communityPanel.scrollIntoView({ behavior: 'smooth' })
  }
})

faceTestBtn.addEventListener('click', () => {
  const isHidden = faceTestPanel.style.display === 'none'
  hideAllPanels()
  if (isHidden) {
    faceTestPanel.style.display = 'block'
    faceTestBtn.textContent = '❌ 테스트 닫기'
    faceTestPanel.scrollIntoView({ behavior: 'smooth' })
    initModel()
  }
})

// AI Model Logic
async function initModel() {
  if (model) return
  loadingSpinner.style.display = 'block'
  try {
    const modelURL = MODEL_URL + 'model.json'
    const metadataURL = MODEL_URL + 'metadata.json'
    model = await tmImage.load(modelURL, metadataURL)
    maxPredictions = model.getTotalClasses()
    console.log('Model loaded')
  } catch (e) {
    console.error('Failed to load model', e)
    alert('AI 모델을 불러오는데 실패했습니다.')
  }
  loadingSpinner.style.display = 'none'
}

uploadArea.addEventListener('click', () => imageUpload.click())

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault()
  uploadArea.classList.add('dragover')
})

uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'))

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault()
  uploadArea.classList.remove('dragover')
  const files = e.dataTransfer.files
  if (files.length > 0) handleImage(files[0])
})

imageUpload.addEventListener('change', (e) => {
  if (e.target.files.length > 0) handleImage(e.target.files[0])
})

function handleImage(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImg.src = e.target.result
    previewImg.style.display = 'block'
    uploadPrompt.style.display = 'none'
    predict()
  }
  reader.readAsDataURL(file)
}

async function predict() {
  if (!model) await initModel()
  loadingSpinner.style.display = 'block'
  resultContainer.style.display = 'none'

  // Give some time for UI to update
  await new Promise(r => setTimeout(r, 800))

  const prediction = await model.predict(previewImg)
  
  let maleScore = 0
  let femaleScore = 0

  prediction.forEach(p => {
    if (p.className === '남자 챔피언') maleScore = p.probability
    if (p.className === '여자 챔피언') femaleScore = p.probability
  })

  const mValue = Math.round(maleScore * 100)
  const fValue = Math.round(femaleScore * 100)

  malePercent.textContent = mValue
  femalePercent.textContent = fValue
  maleBar.style.width = mValue + '%'
  femaleBar.style.width = fValue + '%'

  if (mValue > fValue) {
    resultLabel.textContent = '강인한 "남자 챔피언" 상!'
    resultMessage.textContent = '당신은 가렌, 다리우스처럼 묵직하고 강인한 포스를 가진 남자 챔피언 상입니다.'
  } else {
    resultLabel.textContent = '아름다운 "여자 챔피언" 상!'
    resultMessage.textContent = '당신은 아리, 럭스처럼 화려하고 매력적인 분위기를 가진 여자 챔피언 상입니다.'
  }

  loadingSpinner.style.display = 'none'
  resultContainer.style.display = 'block'
}

retryBtn.addEventListener('click', () => {
  previewImg.style.display = 'none'
  uploadPrompt.style.display = 'block'
  resultContainer.style.display = 'none'
  imageUpload.value = ''
})

// Champion Picker Logic
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
  
  for (let i = 0; i < 10; i++) {
    lanes.forEach(lane => {
      const el = document.getElementById(`${lane}Champ`)
      const list = champions[lane.toUpperCase()]
      el.textContent = list[Math.floor(Math.random() * list.length)]
      el.classList.add('rolling')
    })
    await new Promise(r => setTimeout(r, 80))
  }

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
