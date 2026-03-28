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

// 챔피언 데이터 매칭 (LoL 모든 챔피언 성별 분류)
const champData = {
  male: [
    { name: '가렌', id: 'Garen' }, { name: '갈리오', id: 'Galio' }, { name: '갱플랭크', id: 'Gangplank' }, { name: '그라가스', id: 'Gragas' }, { name: '그레이브즈', id: 'Graves' },
    { name: '나서스', id: 'Nasus' }, { name: '노틸러스', id: 'Nautilus' }, { name: '녹턴', id: 'Nocturne' }, { name: '누누와 윌럼프', id: 'Nunu' }, { name: '다리우스', id: 'Darius' },
    { name: '라이즈', id: 'Ryze' }, { name: '라칸', id: 'Rakan' }, { name: '람머스', id: 'Ramus' }, { name: '럼블', id: 'Rumble' }, { name: '레넥톤', id: 'Renekton' },
    { name: '렝가', id: 'Rengar' }, { name: '루시안', id: 'Lucian' }, { name: '리 신', id: 'LeeSin' }, { name: '마스터 이', id: 'MasterYi' }, { name: '마오카이', id: 'Maokai' },
    { name: '말자하', id: 'Malzahar' }, { name: '말파이트', id: 'Malphite' }, { name: '모데카이저', id: 'Mordekaiser' }, { name: '문도 박사', id: 'DrMundo' }, { name: '바드', id: 'Bard' },
    { name: '바루스', id: 'Varus' }, { name: '바이', id: 'Vi' }, { name: '베이가', id: 'Veigar' }, { name: '벨코즈', id: 'Velkoz' }, { name: '볼리베어', id: 'Volibear' },
    { name: '브라움', id: 'Braum' }, { name: '브랜드', id: 'Brand' }, { name: '블라디미르', id: 'Vladimir' }, { name: '블리츠크랭크', id: 'Blitzcrank' }, { name: '비에고', id: 'Viego' },
    { name: '빅토르', id: 'Viktor' }, { name: '사이온', id: 'Sion' }, { name: '사일러스', id: 'Sylas' }, { name: '샤코', id: 'Shaco' }, { name: '세트', id: 'Sett' },
    { name: '쉔', id: 'Shen' }, { name: '스웨인', id: 'Swain' }, { name: '스카너', id: 'Skarner' }, { name: '신 짜오', id: 'XinZhao' }, { name: '신지드', id: 'Singed' },
    { name: '쓰레쉬', id: 'Thresh' }, { name: '아무무', id: 'Amumu' }, { name: '아우렐리온 솔', id: 'AurelionSol' }, { name: '아이번', id: 'Ivern' }, { name: '아지르', id: 'Azir' },
    { name: '아크샨', id: 'Akshan' }, { name: '아트록스', id: 'Aatrox' }, { name: '알리스타', id: 'Alistar' }, { name: '야스오', id: 'Yasuo' }, { name: '에코', id: 'Ekko' },
    { name: '오공', id: 'MonkeyKing' }, { name: '오른', id: 'Ornn' }, { name: '올라프', id: 'Olaf' }, { name: '요네', id: 'Yone' }, { name: '요릭', id: 'Yorick' },
    { name: '우디르', id: 'Udyr' }, { name: '우르곳', id: 'Urgot' }, { name: '워윅', id: 'Warwick' }, { name: '윌럼프', id: 'Nunu' }, { name: '이즈리얼', id: 'Ezreal' },
    { name: '자르반 4세', id: 'JarvanIV' }, { name: '자크', id: 'Zac' }, { name: '잭스', id: 'Jax' }, { name: '제드', id: 'Zed' }, { name: '제라스', id: 'Xerath' },
    { name: '제이스', id: 'Jayce' }, { name: '진', id: 'Jhin' }, { name: '질리언', id: 'Zilean' }, { name: '초가스', id: 'Chogath' }, { name: '카사딘', id: 'Kassadin' },
    { name: '카서스', id: 'Karthus' }, { name: '카직스', id: 'Khazix' }, { name: '케인', id: 'Kayn' }, { name: '코그모', id: 'KogMaw' }, { name: '코르키', id: 'Corki' },
    { name: '클레드', id: 'Kled' }, { name: '킨드레드', id: 'Kindred' }, { name: '타릭', id: 'Taric' }, { name: '탈론', id: 'Talon' }, { name: '트런들', id: 'Trundle' },
    { name: '트린다미어', id: 'Tryndamere' }, { name: '트위스티드 페이트', id: 'TwistedFate' }, { name: '트위치', id: 'Twitch' }, { name: '판테온', id: 'Pantheon' }, { name: '피들스틱', id: 'Fiddlesticks' },
    { name: '피즈', id: 'Fizz' }, { name: '하이머딩거', id: 'Heimerdinger' }, { name: '헤카림', id: 'Hecarim' }
  ],
  female: [
    { name: '나미', id: 'Nami' }, { name: '나르', id: 'Gnar' }, { name: '니달리', id: 'Nidalee' }, { name: '니코', id: 'Neeko' }, { name: '닐라', id: 'Nilah' },
    { name: '다이애나', id: 'Diana' }, { name: '럭스', id: 'Lux' }, { name: '레오나', id: 'Leona' }, { name: '렐', id: 'Rell' }, { name: '룰루', id: 'Lulu' },
    { name: '르블랑', id: 'Leblanc' }, { name: '리산드라', id: 'Lissandra' }, { name: '리븐', id: 'Riven' }, { name: '릴리아', id: 'Lillia' }, { name: '모르가나', id: 'Morgana' },
    { name: '미스 포츈', id: 'MissFortune' }, { name: '바이브', id: 'Vi' }, { name: '벨베스', id: 'Belveth' }, { name: '벡스', id: 'Vex' }, { name: '뽀삐', id: 'Poppy' },
    { name: '사미라', id: 'Samira' }, { name: '세나', id: 'Senna' }, { name: '세라핀', id: 'Seraphine' }, { name: '세주아니', id: 'Sejuani' }, { name: '소나', id: 'Sona' },
    { name: '소라카', id: 'Soraka' }, { name: '쉬바나', id: 'Shyvana' }, { name: '시비르', id: 'Sivir' }, { name: '신드라', id: 'Syndra' }, { name: '아리', id: 'Ahri' },
    { name: '아칼리', id: 'Akali' }, { name: '애니', id: 'Annie' }, { name: '애니비아', id: 'Anivia' }, { name: '애쉬', id: 'Ashe' }, { name: '엘리스', id: 'Elise' },
    { name: '오리아나', id: 'Orianna' }, { name: '유미', id: 'Yuumi' }, { name: '이렐리아', id: 'Irelia' }, { name: '이벨린', id: 'Evelynn' }, { name: '일라오이' , id: 'Illaoi' },
    { name: '자이라', id: 'Zyra' }, { name: '자야', id: 'Xayah' }, { name: '잔나', id: 'Janna' }, { name: '제리', id: 'Zeri' }, { name: '조이', id: 'Zoe' },
    { name: '징크스', id: 'Jinx' }, { name: '카르마', id: 'Karma' }, { name: '카미유', id: 'Camille' }, { name: '카시오페아', id: 'Cassiopeia' }, { name: '카이사', id: 'Kaisa' },
    { name: '카타리나', id: 'Katarina' }, { name: '칼리스타', id: 'Kalista' }, { name: '케이틀린', id: 'Caitlyn' }, { name: '케일', id: 'Kayle' }, { name: '퀸', id: 'Quinn' },
    { name: '트리스타나', id: 'Tristana' }, { name: '피오라', id: 'Fiora' }
  ]
}

// 챔피언 이미지 URL 생성 함수 (Data Dragon)
function getChampImg(id) {
  return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${id}.png`
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
       champImg.src = getChampImg(randomChamp.id)
       resultLabel.textContent = `당신은 "${randomChamp.name}" 상!`
       resultMessage.textContent = `당신은 ${randomChamp.name}처럼 강인하고 독보적인 분위기를 가진 남챔 상입니다.`
    }
    similarityPercent.textContent = mValue
    singleResultBar.className = 'result-bar bar-male'
    singleResultBar.style.width = Math.max(mValue, 5) + '%'
    singleResultBar.textContent = `남챔 상 ${mValue}% 일치`
  } else {
    if (!isWebcamActive || champImg.src.includes('placeholder') || champImg.src === '') {
       const randomChamp = champData.female[Math.floor(Math.random() * champData.female.length)]
       champImg.src = getChampImg(randomChamp.id)
       resultLabel.textContent = `당신은 "${randomChamp.name}" 상!`
       resultMessage.textContent = `당신은 ${randomChamp.name}처럼 매력적이고 화려한 분위기를 가진 여챔 상입니다.`
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

// Champion Picker Logic
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
