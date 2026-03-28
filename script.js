const THEME_KEY = 'lol_theme_v1'
const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/oiw1LN5GA/'

document.addEventListener('DOMContentLoaded', () => {
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

  // 모든 챔피언 한국어 이름 -> 영문 ID 매핑 (최신 챔피언 포함)
  const champMapping = {
    '가렌': 'Garen', '갈리오': 'Galio', '갱플랭크': 'Gangplank', '그라가스': 'Gragas', '그레이브즈': 'Graves', '나르': 'Gnar', '나미': 'Nami', '나서스': 'Nasus', '노틸러스': 'Nautilus', '녹턴': 'Nocturne', '누누와 윌럼프': 'Nunu', '니달리': 'Nidalee', '니코': 'Neeko', '닐라': 'Nilah', '다리우스': 'Darius', '다이애나': 'Diana', '드레이븐': 'Draven', '라이즈': 'Ryze', '라칸': 'Rakan', '람머스': 'Ramus', '럭스': 'Lux', '럼블': 'Rumble', '레넥톤': 'Renekton', '레오나': 'Leona', '렐': 'Rell', '렝가': 'Rengar', '루시안': 'Lucian', '룰루': 'Lulu', '르블랑': 'Leblanc', '리 신': 'LeeSin', '리븐': 'Riven', '리산드라': 'Lissandra', '릴리아': 'Lillia', '마스터 이': 'MasterYi', '마오카이': 'Maokai', '말자하': 'Malzahar', '말파이트': 'Malphite', '모데카이저': 'Mordekaiser', '모르가나': 'Morgana', '문도 박사': 'DrMundo', '미스 포츈': 'MissFortune', '바드': 'Bard', '바루스': 'Varus', '바이': 'Vi', '베이가': 'Veigar', '베인': 'Vayne', '벨베스': 'Belveth', '벨코즈': 'Velkoz', '볼리베어': 'Volibear', '브라움': 'Braum', '브랜드': 'Brand', '블라디미르': 'Vladimir', '블리츠크랭크': 'Blitzcrank', '비에고': 'Viego', '빅토르': 'Viktor', '뽀삐': 'Poppy', '사미라': 'Samira', '사이온': 'Sion', '사일러스': 'Sylas', '샤코': 'Shaco', '세나': 'Senna', '세라핀': 'Seraphine', '세주아니': 'Sejuani', '세트': 'Sett', '소나': 'Sona', '소라카': 'Soraka', '쉔': 'Shen', '쉬바나': 'Shyvana', '스웨인': 'Swain', '스카너': 'Skarner', '시비르': 'Sivir', '신 짜오': 'XinZhao', '신드라': 'Syndra', '신지드': 'Singed', '쓰레쉬': 'Thresh', '아리': 'Ahri', '아무무': 'Amumu', '아우렐리온 솔': 'AurelionSol', '아이번': 'Ivern', '아지르': 'Azir', '아칼리': 'Akali', '아크샨': 'Akshan', '아트록스': 'Aatrox', '알리스타': 'Alistar', '애니': 'Annie', '애니비아': 'Anivia', '애쉬': 'Ashe', '야스오': 'Yasuo', '에코': 'Ekko', '엘리스': 'Elise', '오공': 'MonkeyKing', '오리아나': 'Orianna', '오른': 'Ornn', '올라프': 'Olaf', '요네': 'Yone', '요릭': 'Yorick', '우디르': 'Udyr', '우르곳': 'Urgot', '워윅': 'Warwick', '유미': 'Yuumi', '이렐리아': 'Irelia', '이벨린': 'Evelynn', '이즈리얼': 'Ezreal', '일라오이': 'Illaoi', '자르반 4세': 'JarvanIV', '자이라': 'Zyra', '자크': 'Zac', '자야': 'Xayah', '잔나': 'Janna', '잭스': 'Jax', '제드': 'Zed', '제라스': 'Xerath', '제리': 'Zeri', '제이스': 'Jayce', '조이': 'Zoe', '직스': 'Ziggs', '진': 'Jhin', '징크스': 'Jinx', '질리언': 'Zilean', '초가스': 'Chogath', '카르마': 'Karma', '카밀': 'Camille', '카사딘': 'Kassadin', '카서스': 'Karthus', '카시오페아': 'Cassiopeia', '카이사': 'Kaisa', '카직스': 'Khazix', '카타리나': 'Katarina', '칼리스타': 'Kalista', '케넨': 'Kennen', '케이틀린': 'Caitlyn', '케인': 'Kayn', '케일': 'Kayle', '코그모': 'KogMaw', '코르키': 'Corki', '퀸': 'Quinn', '클레드': 'Kled', '킨드레드': 'Kindred', '타릭': 'Taric', '탈론': 'Talon', '탈리야': 'Taliyah', '트런들': 'Trundle', '트리스타나': 'Tristana', '트린다미어': 'Tryndamere', '트위스티드 페이트': 'TwistedFate', '트위치': 'Twitch', '판테온': 'Pantheon', '피들스틱': 'Fiddlesticks', '피오라': 'Fiora', '피즈': 'Fizz', '하이머딩거': 'Heimerdinger', '헤카림': 'Hecarim', '크산테': 'Ksante', '브라이어': 'Briar', '나피리': 'Naafiri', '흐웨이': 'Hwei', '스몰더': 'Smolder', '밀리오': 'Milio', '레나타 글라스크': 'Renata', '벨베스': 'Belveth'
  }

  // 성별 분류 데이터 (모든 챔피언)
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
      { name: '우디르', id: 'Udyr' }, { name: '우르곳', id: 'Urgot' }, { name: '워윅', id: 'Warwick' }, { name: '이즈리얼', id: 'Ezreal' },
      { name: '자르반 4세', id: 'JarvanIV' }, { name: '자크', id: 'Zac' }, { name: '잭스', id: 'Jax' }, { name: '제드', id: 'Zed' }, { name: '제라스', id: 'Xerath' },
      { name: '제이스', id: 'Jayce' }, { name: '진', id: 'Jhin' }, { name: '질리언', id: 'Zilean' }, { name: '초가스', id: 'Chogath' }, { name: '카사딘', id: 'Kassadin' },
      { name: '카서스', id: 'Karthus' }, { name: '카직스', id: 'Khazix' }, { name: '케인', id: 'Kayn' }, { name: '코그모', id: 'KogMaw' }, { name: '코르키', id: 'Corki' },
      { name: '클레드', id: 'Kled' }, { name: '킨드레드', id: 'Kindred' }, { name: '타릭', id: 'Taric' }, { name: '탈론', id: 'Talon' }, { name: '트런들', id: 'Trundle' },
      { name: '트린다미어', id: 'Tryndamere' }, { name: '트위스티드 페이트', id: 'TwistedFate' }, { name: '트위치', id: 'Twitch' }, { name: '판테온', id: 'Pantheon' }, { name: '피들스틱', id: 'Fiddlesticks' },
      { name: '피즈', id: 'Fizz' }, { name: '하이머딩거', id: 'Heimerdinger' }, { name: '헤카림', id: 'Hecarim' }, { name: '크산테', id: 'Ksante' }, { name: '흐웨이', id: 'Hwei' }, { name: '스몰더', id: 'Smolder' }
    ],
    female: [
      { name: '나미', id: 'Nami' }, { name: '니달리', id: 'Nidalee' }, { name: '니코', id: 'Neeko' }, { name: '닐라', id: 'Nilah' },
      { name: '다이애나', id: 'Diana' }, { name: '럭스', id: 'Lux' }, { name: '레오나', id: 'Leona' }, { name: '렐', id: 'Rell' }, { name: '룰루', id: 'Lulu' },
      { name: '르블랑', id: 'Leblanc' }, { name: '리산드라', id: 'Lissandra' }, { name: '리븐', id: 'Riven' }, { name: '릴리아', id: 'Lillia' }, { name: '모르가나', id: 'Morgana' },
      { name: '미스 포츈', id: 'MissFortune' }, { name: '벨베스', id: 'Belveth' }, { name: '벡스', id: 'Vex' }, { name: '뽀삐', id: 'Poppy' },
      { name: '사미라', id: 'Samira' }, { name: '세나', id: 'Senna' }, { name: '세라핀', id: 'Seraphine' }, { name: '세주아니', id: 'Sejuani' }, { name: '소나', id: 'Sona' },
      { name: '소라카', id: 'Soraka' }, { name: '쉬바나', id: 'Shyvana' }, { name: '시비르', id: 'Sivir' }, { name: '신드라', id: 'Syndra' }, { name: '아리', id: 'Ahri' },
      { name: '아칼리', id: 'Akali' }, { name: '애니', id: 'Annie' }, { name: '애니비아', id: 'Anivia' }, { name: '애쉬', id: 'Ashe' }, { name: '엘리스', id: 'Elise' },
      { name: '오리아나', id: 'Orianna' }, { name: '유미', id: 'Yuumi' }, { name: '이렐리아', id: 'Irelia' }, { name: '이벨린', id: 'Evelynn' }, { name: '일라오이' , id: 'Illaoi' },
      { name: '자이라', id: 'Zyra' }, { name: '자야', id: 'Xayah' }, { name: '잔나', id: 'Janna' }, { name: '제리', id: 'Zeri' }, { name: '조이', id: 'Zoe' },
      { name: '징크스', id: 'Jinx' }, { name: '카르마', id: 'Karma' }, { name: '카밀', id: 'Camille' }, { name: '카시오페아', id: 'Cassiopeia' }, { name: '카이사', id: 'Kaisa' },
      { name: '카타리나', id: 'Katarina' }, { name: '칼리스타', id: 'Kalista' }, { name: '케이틀린', id: 'Caitlyn' }, { name: '케일', id: 'Kayle' }, { name: '퀸', id: 'Quinn' },
      { name: '트리스타나', id: 'Tristana' }, { name: '피오라', id: 'Fiora' }, { name: '브라이어', id: 'Briar' }, { name: '밀리오', id: 'Milio' }, { name: '레나타 글라스크', id: 'Renata' }
    ]
  }

  function getChampImg(id) {
    if (!id) return 'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Garen.png'
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
      if (p.className.includes('남') || p.className.toLowerCase().includes('male')) maleScore = p.probability
      else if (p.className.includes('여') || p.className.toLowerCase().includes('female')) femaleScore = p.probability
    })
    const mValue = Math.round(maleScore * 100)
    const fValue = Math.round(femaleScore * 100)
    if (mValue > fValue) {
      if (!isWebcamActive || champImg.src === '' || champImg.src.includes('Garen.png')) {
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
      if (!isWebcamActive || champImg.src === '' || champImg.src.includes('Garen.png')) {
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

  // Champion Picker (OP.GG 기반 모든 라인별 전체 챔피언)
  const champions = {
    TOP: [
      '가렌', '나르', '나서스', '다리우스', '라이즈', '럼블', '레넥톤', '렝가', '리븐', '리산드라', '마오카이', '말파이트', '모데카이저', '문도 박사', '볼리베어', '뽀삐', '사이온', '사일러스', '세트', '쉔', '신지드', '아트록스', '아칼리', '야스오', '오공', '오른', '올라프', '요릭', '요네', '우디르', '우르곳', '워윅', '이렐리아', '일라오이', '자크', '잭스', '제이스', '초가스', '카밀', '카르마', '카시오페아', '카타리나', '케넨', '케일', '클레드', '타릭', '트런들', '트린다미어', '판테온', '피오라', '하이머딩거', '헤카림', '크산테', '티모', '베인', '퀸', '그라가스', '말자하'
    ],
    JUNGLE: [
      '그라가스', '그레이브즈', '녹턴', '누누와 윌럼프', '니달리', '람머스', '렉사이', '렝가', '리 신', '릴리아', '마스터 이', '문도 박사', '바이', '벨베스', '볼리베어', '비에고', '뽀삐', '샤코', '세주아니', '쉬바나', '신 짜오', '아무무', '아이번', '엘리스', '오공', '올라프', '워윅', '이벨린', '자르반 4세', '자크', '잭스', '카서스', '카직스', '케인', '킨드레드', '탈리야', '탈론', '트런들', '피들스틱', '헤카림', '브라이어', '다이애나', '럼블', '사일러스', '에코', '제드'
    ],
    MID: [
      '가렌', '갈리오', '니코', '다이애나', '라이즈', '럭스', '르블랑', '리산드라', '말자하', '모데카이저', '벡스', '벨코즈', '빅토르', '사일러스', '세라핀', '세트', '스웨인', '신드라', '아리', '아우렐리온 솔', '아지르', '아칼리', '아크샨', '애니', '애니비아', '야스오', '에코', '오리아나', '요네', '이렐리아', '제드', '제라스', '조이', '직스', '카사딘', '카시오페아', '카타리나', '코르키', '탈리야', '탈론', '트위스티드 페이트', '판테온', '피즈', '흐웨이', '나피리', '트리스타나', '베이가', '이즈리얼'
    ],
    ADC: [
      '드레이븐', '루시안', '미스 포츈', '바루스', '베인', '사미라', '세나', '시비르', '아펠리오스', '애쉬', '이즈리얼', '자야', '제리', '징크스', '진', '카이사', '칼리스타', '코그모', '퀸', '트리스타나', '트위치', '스몰더', '닐라', '직스', '카서스', '세라핀', '야스오'
    ],
    SUPPORT: [
      '갈리오', '나미', '노틸러스', '니코', '라칸', '럭스', '레오나', '렐', '르블랑', '룰루', '모르가나', '마오카이', '바드', '벨코즈', '브라움', '브랜드', '블리츠크랭크', '뽀삐', '세나', '세라핀', '소나', '소라카', '스웨인', '쓰레쉬', '아무무', '알리스타', '애쉬', '유미', '자이라', '잔나', '제라스', '질리언', '카르마', '타릭', '파이크', '하이머딩거', '밀리오', '레나타 글라스크', '샤코', '판테온'
    ]
  }

  async function reroll() {
    if (rerollBtn.disabled) return
    rerollBtn.disabled = true
    statusMsg.textContent = '운명의 챔피언을 찾는 중...'
    const lanes = ['top', 'jungle', 'mid', 'adc', 'support']
    for (let i = 0; i < 15; i++) {
      lanes.forEach(lane => {
        const el = document.getElementById(`${lane}Champ`)
        const imgEl = document.getElementById(`${lane}Img`)
        const list = champions[lane.toUpperCase()]
        const randomName = list[Math.floor(Math.random() * list.length)]
        const champId = champMapping[randomName]
        el.textContent = randomName
        if (champId) imgEl.src = getChampImg(champId)
        el.classList.add('rolling')
      })
      await new Promise(r => setTimeout(r, 70))
    }
    lanes.forEach(lane => {
      const el = document.getElementById(`${lane}Champ`)
      const imgEl = document.getElementById(`${lane}Img`)
      const list = champions[lane.toUpperCase()]
      const finalName = list[Math.floor(Math.random() * list.length)]
      const finalId = champMapping[finalName]
      el.textContent = finalName
      if (finalId) imgEl.src = getChampImg(finalId)
      el.classList.remove('rolling')
    })
    statusMsg.textContent = '챔피언 선택 완료! 전장으로 나가세요.'
    rerollBtn.disabled = false
  }

  async function copyCombination() {
    const top = document.getElementById('topChamp').textContent
    if (top === '?') return alert('먼저 리롤을 눌러주세요!')
    const text = `🎮 오늘의 롤 조합:\nTOP: ${top}\nJUNGLE: ${document.getElementById('jungleChamp').textContent}\nMID: ${document.getElementById('midChamp').textContent}\nADC: ${document.getElementById('adcChamp').textContent}\nSUP: ${document.getElementById('supportChamp').textContent}`
    try { await navigator.clipboard.writeText(text); alert('조합이 복사되었습니다!') }
    catch (err) { alert('복사에 실패했습니다.') }
  }

  rerollBtn.addEventListener('click', reroll)
  copyBtn.addEventListener('click', copyCombination)
})
