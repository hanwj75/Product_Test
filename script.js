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
    { name: '야스오', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg', msg: '당신은 야스오처럼 날렵하고 고독한 검사의 분위기를 가진 "남챔 상"입니다!' },
    { name: '리 신', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/LeeSin_0.jpg', msg: '당신은 리 신처럼 화려한 기술과 불굴의 의지를 가진 "남챔 상"입니다!' },
    { name: '제드', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg', msg: '당신은 제드처럼 차갑고 치명적인 암살자의 포스를 가진 "남챔 상"입니다!' }
  ],
  female: [
    { name: '아리', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg', msg: '당신은 아리처럼 화려하고 매혹적인 분위기를 가진 "여챔 상"입니다!' },
    { name: '럭스', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg', msg: '당신은 럭스처럼 밝고 긍정적인 에너지가 넘치는 "여챔 상"입니다!' },
    { name: '카이사', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kaisa_0.jpg', msg: '당신은 카이사처럼 신비롭고 강렬한 눈빛을 가진 "여챔 상"입니다!' },
    { name: '이렐리아', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_0.jpg', msg: '당신은 이렐리아처럼 우아하면서도 치명적인 춤사위를 가진 "여챔 상"입니다!' },
    { name: '세라핀', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Seraphine_0.jpg', msg: '당신은 세라핀처럼 사랑스럽고 사람들을 매료시키는 목소리를 가진 "여챔 상"입니다!' }
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
  
  let maleScore = 0
  let femaleScore = 0

  prediction.forEach(p => {
    if (p.className.includes('남') || p.className.toLowerCase().includes('male')) {
      maleScore = p.probability
    } 
    else if (p.className.includes('여') || p.className.toLowerCase().includes('female')) {
      femaleScore = p.probability
    }
  })

  const mValue = Math.round(maleScore * 100)
  const fValue = Math.round(femaleScore * 100)

  if (mValue > fValue) {
    if (!isWebcamActive || champImg.src.includes('placeholder') || champImg.src === '') {
       const randomChamp = champData.male[Math.floor(Math.random() * champData.male.length)]
       champImg.src = randomChamp.img
       resultLabel.textContent = `당신은 "${randomChamp.name}" 상!`
       resultMessage.textContent = randomChamp.msg
    }
    similarityPercent.textContent = mValue
    singleResultBar.className = 'result-bar bar-male'
    singleResultBar.style.width = Math.max(mValue, 5) + '%'
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
  champImg.src = ''
  uploadTabBtn.classList.remove('primary')
  startWebcamBtn.classList.remove('primary')
})

// Champion Picker Logic (Expanded from OP.GG Data)
const champions = {
  TOP: [
    '가렌', '나르', '나서스', '다리우스', '라이즈', '람머스', '럼블', '레넥톤', '렝가', '리븐', '리산드라', '마오카이', '말파이트', '모데카이저', '문도 박사', '볼리베어', '뽀삐', '사이온', '사일러스', '세트', '쉔', '신지드', '아트록스', '아칼리', '야스오', '오공', '오른', '올라프', '요릭', '요네', '우디르', '우르곳', '워윅', '이렐리아', '이즈리얼', '일라오이', '자크', '잭스', '제이스', '초가스', '카밀', '카시오페아', '카르마', '카서스', '카타리나', '케넨', '케이틀린', '케일', '퀸', '클레드', '타릭', '트린다미어', '판테온', '피오라', '하이머딩거', '헤카림'
  ],
  JUNGLE: [
    '그레이브즈', '그라가스', '녹턴', '누누와 윌럼프', '니달리', '람머스', '렉사이', '렝가', '리 신', '릴리아', '마스터 이', '문도 박사', '바이', '벨베스', '볼리베어', '비에고', '뽀삐', '샤코', '세주아니', '쉬바나', '신 짜오', '아무무', '아이번', '엘리스', '오공', '올라프', '워윅', '이벨린', '자르반 4세', '자크', '잭스', '카서스', '카직스', '케인', '킨드레드', '탈리야', '탈론', '트런들', '피들스틱', '헤카림'
  ],
  MID: [
    '가렌', '갈리오', '니코', '다이애나', '라이즈', '럭스', '르블랑', '리산드라', '말자하', '모데카이저', '벡스', '벨코즈', '빅토르', '사일러스', '세라핀', '세트', '스웨인', '신드라', '아리', '아우렐리온 솔', '아지르', '아칼리', '아크샨', '애니', '애니비아', '야스오', '에코', '오리아나', '요네', '이렐리아', '제드', '제라스', '조이', '직스', '카사딘', '카시오페아', '카타리나', '코르키', '탈리야', '탈론', '트위스티드 페이트', '판테온', '피즈'
  ],
  ADC: [
    '드레이븐', '루시안', '미스 포츈', '바루스', '베인', '사미라', '세나', '시비르', '아펠리오스', '애쉬', '이즈리얼', '자야', '제리', '징크스', '진', '카이사', '칼리스타', '코그모', '퀸', '트리스타나', '트위치'
  ],
  SUPPORT: [
    '갈리오', '나미', '노틸러스', '니코', '라칸', '럭스', '레오나', '렐', '르블랑', '룰루', '모르가나', '마오카이', '바드', '벨코즈', '브라움', '브랜드', '블리츠크랭크', '뽀삐', '세나', '세라핀', '소나', '소라카', '스웨인', '쓰레쉬', '아무무', '알리스타', '애쉬', '유미', '자이라', '잔나', '제라스', '질리언', '카르마', '타릭', '파이크'
  ]
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
