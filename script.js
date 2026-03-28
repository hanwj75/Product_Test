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
const singleResultBar = document.getElementById('singleResultBar')
const similarityPercent = document.getElementById('similarityPercent')
const champImg = document.getElementById('champImg')
const retryBtn = document.getElementById('retryBtn')

const startWebcamBtn = document.getElementById('startWebcamBtn')
const uploadTabBtn = document.getElementById('uploadTabBtn')
const webcamContainer = document.getElementById('webcam-container')

let model, webcam, maxPredictions, isWebcamActive = false

// 챔피언 데이터 매칭 (성별 상 대표 챔피언)
const champData = {
  male: [
    { name: '가렌', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Garen_0.jpg', msg: '당신은 가렌처럼 정의롭고 강인한 포스를 가진 "남챔 상"입니다!' },
    { name: '다리우스', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg', msg: '당신은 다리우스처럼 압도적인 위엄과 카리스마를 가진 "남챔 상"입니다!' },
    { name: '야스오', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg', msg: '당신은 야스오처럼 날렵하고 고독한 검사의 분위기를 가진 "남챔 상"입니다!' }
  ],
  female: [
    { name: '아리', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg', msg: '당신은 아리처럼 화려하고 매혹적인 분위기를 가진 "여챔 상"입니다!' },
    { name: '럭스', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg', msg: '당신은 럭스처럼 밝고 긍정적인 에너지가 넘치는 "여챔 상"입니다!' },
    { name: '카이사', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kaisa_0.jpg', msg: '당신은 카이사처럼 신비롭고 강렬한 눈빛을 가진 "여챔 상"입니다!' }
  ]
}

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
  stopWebcam()
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
  } catch (e) {
    console.error('Failed to load model', e)
    alert('AI 모델을 불러오는데 실패했습니다.')
  }
  loadingSpinner.style.display = 'none'
}

// Webcam Logic
async function startWebcam() {
  if (!model) await initModel()
  if (isWebcamActive) return
  
  loadingSpinner.style.display = 'block'
  uploadArea.style.display = 'none'
  webcamContainer.style.display = 'block'
  
  try {
    const flip = true
    webcam = new tmImage.Webcam(400, 400, flip)
    await webcam.setup()
    await webcam.play()
    isWebcamActive = true
    window.requestAnimationFrame(webcamLoop)
    
    webcamContainer.innerHTML = ''
    webcamContainer.appendChild(webcam.canvas)
    startWebcamBtn.classList.add('primary')
    uploadTabBtn.classList.remove('primary')
    resultContainer.style.display = 'block'
  } catch (e) {
    console.error(e)
    alert('웹캠을 시작할 수 없습니다.')
    showUploadTab()
  }
  loadingSpinner.style.display = 'none'
}

function stopWebcam() {
  if (webcam) {
    webcam.stop()
    isWebcamActive = false
    webcamContainer.style.display = 'none'
    startWebcamBtn.classList.remove('primary')
  }
}

async function webcamLoop() {
  if (!isWebcamActive) return
  webcam.update()
  await predict(webcam.canvas)
  window.requestAnimationFrame(webcamLoop)
}

function showUploadTab() {
  stopWebcam()
  uploadArea.style.display = 'flex'
  webcamContainer.style.display = 'none'
  uploadTabBtn.classList.add('primary')
  startWebcamBtn.classList.remove('primary')
}

startWebcamBtn.addEventListener('click', startWebcam)
uploadTabBtn.addEventListener('click', showUploadTab)

// Upload Logic
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
    resultContainer.style.display = 'block'
    predict(previewImg)
  }
  reader.readAsDataURL(file)
}

async function predict(inputElement) {
  if (!model) return
  
  const prediction = await model.predict(inputElement)
  
  // Teachable Machine의 클래스 이름이 다를 수 있으므로 인덱스로 접근하거나 소문자로 비교
  let maleScore = 0
  let femaleScore = 0

  prediction.forEach(p => {
    // 클래스명에서 '남' 또는 'male'이 포함되면 남성으로 판단
    if (p.className.includes('남') || p.className.toLowerCase().includes('male')) {
      maleScore = p.probability
    } 
    // 클래스명에서 '여' 또는 'female'이 포함되면 여성으로 판단
    else if (p.className.includes('여') || p.className.toLowerCase().includes('female')) {
      femaleScore = p.probability
    }
  })

  const mValue = Math.round(maleScore * 100)
  const fValue = Math.round(femaleScore * 100)

  // 더 높은 확률 쪽 선택
  if (mValue > fValue) {
    // 결과가 이미 표시 중이고 웹캠 모드라면 챔피언 이미지가 너무 자주 바뀌지 않도록 처리
    if (!isWebcamActive || champImg.src.includes('placeholder') || champImg.src === '') {
       const randomChamp = champData.male[Math.floor(Math.random() * champData.male.length)]
       champImg.src = randomChamp.img
       resultLabel.textContent = `당신은 "${randomChamp.name}" 상!`
       resultMessage.textContent = randomChamp.msg
    }
    similarityPercent.textContent = mValue
    singleResultBar.className = 'result-bar bar-male'
    singleResultBar.style.width = Math.max(mValue, 5) + '%' // 최소 5%는 보이게
    singleResultBar.textContent = `남챔 상 ${mValue}% 일치`
  } else {
    if (!isWebcamActive || champImg.src.includes('placeholder') || champImg.src === '') {
       const randomChamp = champData.female[Math.floor(Math.random() * champData.female.length)]
       champImg.src = randomChamp.img
       resultLabel.textContent = `당신은 "${randomChamp.name}" 상!`
       resultMessage.textContent = randomChamp.msg
    }
    similarityPercent.textContent = fValue
    singleResultBar.className = 'result-bar bar-female'
    singleResultBar.style.width = Math.max(fValue, 5) + '%'
    singleResultBar.textContent = `여챔 상 ${fValue}% 일치`
  }
}

retryBtn.addEventListener('click', () => {
  stopWebcam()
  previewImg.style.display = 'none'
  uploadPrompt.style.display = 'flex'
  resultContainer.style.display = 'none'
  uploadArea.style.display = 'flex'
  imageUpload.value = ''
  champImg.src = '' // 이미지 초기화
  uploadTabBtn.classList.remove('primary')
  startWebcamBtn.classList.remove('primary')
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
