'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

type Category = '신청하기' | '직원관리' | '부담금' | '재정지원' | '기타'

interface WorkItem {
  id: number
  title: string
  category: Category
  icon: string
  imagePaths: string[]
  description: string
  menuPath : string
  shortDesc: string
}

// 음성인식 타입 선언
declare global {
  interface Window {
    webkitSpeechRecognition? : any
    SpeechRecognition? : any
  }
}

const workData: WorkItem[] = [
  {
    id: 1,
    title: '기금제도 푸른씨앗 신청하기',
    category: '신청하기',
    icon: '🌱',
    imagePaths: ['/images/004.jpg', '/images/005.jpg', '/images/006.jpg', '/images/007.jpg', '/images/008.jpg', '/images/009.jpg', '/images/010.jpg', '/images/011.jpg'],
    description: '푸른씨앗 기금제도 가입을 위한 절차 및 필요 서류 안내',
    menuPath: '홈페이지 > 신청하기 > 가입 > 기금제도 신청하기(사업장)',
    shortDesc: '푸른씨앗 신청'
  },
  {
    id: 2,
    title: '신규직원 등록하기',
    category: '직원관리',
    icon: '👤',
    imagePaths: ['/images/013.jpg', '/images/014.jpg', '/images/015.jpg', '/images/016.jpg'],
    description: '신규 직원 등록 절차 및 필수 입력 정보 안내',
    menuPath: '홈페이지 > 신청하기 > 가입자관리',
    shortDesc: '직원 등록'
  },
  {
    id: 3,
    title: '급여변경하기',
    category: '직원관리',
    icon: '💰',
    imagePaths: ['/images/017.jpg'],
    description: '직원 급여 변경 신청 및 처리 절차 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 가입자 연간(예상)임금총액변경',
    shortDesc: '급여 변경'
  },
  {
    id: 4,
    title: '퇴사 - 지급신청',
    category: '직원관리',
    icon: '📋',
    imagePaths: ['/images/026.jpg', '/images/027.jpg'],
    description: '퇴직금 지급 신청 절차 및 필요 서류 안내',
    menuPath: '홈페이지 > 신청하기 > 지급 > 퇴직급여 지급신청',
    shortDesc: '퇴사 지급신청'
  },
  {
    id: 5,
    title: '퇴사 - 지급신청현황',
    category: '직원관리',
    icon: '📊',
    imagePaths: ['/images/035.jpg', '/images/036.jpg'],
    description: '퇴직금 지급 신청 현황 조회 방법',
    menuPath: '홈페이지 > 조회하기 > 지급',
    shortDesc: '지급신청현황'
  },
  {
    id: 6,
    title: '사용자 납입 희망 금액 수시납부 처리하기',
    category: '부담금',
    icon: '💳',
    imagePaths: ['/images/018.jpg'],
    description: '수시 납부 신청 및 처리 방법 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 부담금 수시납입 > 수시납입신청',
    shortDesc: '수시 납부'
  },
  {
    id: 7,
    title: '사용자 납입 희망 금액 변경하기',
    category: '부담금',
    icon: '💵',
    imagePaths: ['/images/019.jpg'],
    description: '정기부담금 납입 희망 금액 변경 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 부담금 수시납입 > 정기부담금 납입희망금액 변경신청',
    shortDesc: '납입희망금액 변경'
  },
  {
    id: 8,
    title: '(과거분) 일시전환부담금 납입신청',
    category: '부담금',
    icon: '📅',
    imagePaths: ['/images/023.jpg', '/images/024.jpg'],
    description: '과거분 일시전환부담금 납입 신청 절차',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 일시전환부담금 납입신청',
    shortDesc: '과거분 납입'
  },
  {
    id: 9,
    title: '(해당기간 ~ 연 1회) 부담금 정산신청하기',
    category: '부담금',
    icon: '📊',
    imagePaths: ['/images/020.jpg', '/images/021.jpg', '/images/022.jpg'],
    description: '연간 부담금 정산 신청 절차 및 기한 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 부담금 정산신청',
    shortDesc: '정산 신청'
  },
  {
    id: 10,
    title: '자동이체관리',
    category: '부담금',
    icon: '🔄',
    imagePaths: ['/images/025.jpg'],
    description: '자동이체 등록, 변경, 해지 방법 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 자동이체관리',
    shortDesc: '자동이체'
  },
  {
    id: 11,
    title: '기타사항 변경 (근로자 정보, 퇴직급여 담당자 변경)',
    category: '기타',
    icon: '✏️',
    imagePaths: ['/images/007.jpg'],
    description: '',
    menuPath: '근로자 정보 변경 : 신청하기 > 가입자 관리\n퇴직급여 담당자 변경 : 신청하기 > 퇴직급여담당자 관리',
    shortDesc: '정보 변경'
  },
  {
    id: 12,
    title: '온라인 신청 현황',
    category: '기타',
    icon: '🖥️',
    imagePaths: ['/images/029.jpg'],
    description: '온라인으로 신청한 업무 처리 현황 조회',
    menuPath: '홈페이지 > 조회하기 > 가입 > 서류등록현황',
    shortDesc: '신청 현황'
  },
  {
    id: 13,
    title: '부담금 납입 안내 (명세서)',
    category: '부담금',
    icon: '📄',
    imagePaths: ['/images/030.jpg'],
    description: '부담금 납입 명세서 조회 및 출력 방법',
    menuPath: '홈페이지 > 조회하기 > 부담금 > 부담금납입 안내',
    shortDesc: '납입 명세서'
  },
  {
    id: 14,
    title: '부담금 납입 내역 (기존 납입 내역)',
    category: '부담금',
    icon: '📑',
    imagePaths: ['/images/031.jpg'],
    description: '기존 부담금 납입 내역 조회 방법',
    menuPath: '홈페이지 > 조회하기 > 부담금 > 부담금납입 내역',
    shortDesc: '납입 내역'
  },
  {
    id: 15,
    title: '재정지원금 - 지원금 신청결과',
    category: '재정지원',
    icon: '✅',
    imagePaths: ['/images/033.jpg'],
    description: '재정지원금 신청 결과 확인 방법',
    menuPath: '홈페이지 > 조회하기 > 부담금 > 재정지원금 신청결과',
    shortDesc: '신청 결과'
  },
  {
    id: 16,
    title: '재정지원금 - 지원금 지급내역',
    category: '재정지원',
    icon: '💵',
    imagePaths: ['/images/034.jpg'],
    description: '재정지원금 지급 내역 조회 방법',
    menuPath: '홈페이지 > 조회하기 > 부담금 > 재정지원금 지급내역',
    shortDesc: '지급 내역'
  },
  {
    id: 17,
    title: '증명서 발급',
    category: '기타',
    icon: '📜',
    imagePaths: ['/images/038.jpg'],
    description: '각종 증명서 발급 신청 및 출력 방법',
    menuPath: '홈페이지 > 조회하기 > 증명서발급',
    shortDesc: '증명서 발급'
  },
  {
    id: 18,
    title: '서식 자료실',
    category: '기타',
    icon: '📁',
    imagePaths: ['/images/007.jpg'],
    description: '업무별 필요 서식 다운로드 및 작성 방법',
    menuPath: '홈페이지 > 고객센터 > 서식자료실',
    shortDesc: '서식 자료실'
  }
]

const categoryColors: Record<Category, string> = {
  '신청하기': '#4CAF50',
  '직원관리': '#2196F3',
  '부담금': '#FF9800',
  '재정지원': '#9C27B0',
  '기타': '#607D8B'
}

export default function Home() {
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | '전체'>('전체')
  const [currentImage, setCurrentImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false); // ✅ 인사말 모달

  // 음성인식 모달
  const [isVoiceOpen, setIsVoiceOpen] = useState(false)
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [finals, setFinals] = useState<string[]>([])
  const recRef = useRef<any>(null)

  const touchStartXRef = useRef<number | null>(null)

  // 최초 접속 시 1회만 표시 (세션 기준)
  useEffect(() => {
    const key = 'welcome_shown_v1';
    if (!sessionStorage.getItem(key)) {
      setShowWelcome(true);
      sessionStorage.setItem(key, '1');
    }
  }, []);

  // 선택 변경 시 인덱스 리셋
  useEffect(() => {
    setCurrentImage(0)
  }, [selectedWork?.id])

  // Esc로 모달 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
        if (isVoiceOpen) {setIsVoiceOpen (false); stopListening() }
    }
  };
    if (isModalOpen || isVoiceOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isModalOpen, isVoiceOpen])

  const filteredWorks = useMemo(
    () => selectedCategory === '전체'
      ? workData
      : workData.filter(w => w.category === selectedCategory),
    [selectedCategory]
  )

  const categories: (Category | '전체')[] = ['전체', '신청하기', '직원관리', '부담금', '재정지원', '기타']

  // 캐러셀 계산 (모달 내에서 사용)
  const total = selectedWork ? selectedWork.imagePaths.length : 0
  const hasMultiple = total > 1
  const clampedIndex = total ? Math.min(currentImage, total - 1) : 0
  const currentSrc = total ? selectedWork!.imagePaths[clampedIndex] : null

  const goPrev = () => {
    if (!total) return
    setCurrentImage(i => (i - 1 + total) % total)
  }
  const goNext = () => {
    if (!total) return
    setCurrentImage(i => (i + 1) % total)
  }
  const goTo = (idx: number) => {
    if (!total) return
    setCurrentImage(Math.max(0, Math.min(idx, total - 1)))
  }

  const onKeyDownCarousel: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!hasMultiple) return
    if (e.key === 'ArrowLeft') goPrev()
    if (e.key === 'ArrowRight') goNext()
  }

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartXRef.current = e.touches[0].clientX
  }
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!hasMultiple || touchStartXRef.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartXRef.current
    if (Math.abs(delta) > 40) {
      delta > 0 ? goPrev() : goNext()
    }
    touchStartXRef.current = null
  }

  // 음성인식 준비
  useEffect(() => {
     const SR = window.SpeechRecognition || window.webkitSpeechRecognition
     setSupported(!!SR)
     if (SR) {
      const rec = new SR()
      rec.lang = 'ko-KR'
      rec.interimResults = true
      rec.continuous = true

      rec.onresult = (e: any) => {
        let interimTxt = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = (e.results[i][0]?.transcript || '').trim()
          if (e.results[i].isFinal) {
            setFinals(prev => [...prev, t])
            setInterim('')

            // 최종 문장 처리 이벤트 (여기에 의도 분류 연결하면 됨)
            console.log('[인식된 음성] : ', t)
          } else {
            interimTxt = t
          }
        }
        if (interimTxt) setInterim(interimTxt)
      }

      rec.onend = () => setListening(false)
      rec.onerror = () => setListening(false)

      recRef.current = rec
     }

     return () => {
      try { recRef.current?.stop?.() } catch {}
     }
  }, [])

  const startListening = () => {
    if (!recRef.current) return
    try {
      recRef.current.start()
      setListening(true)
      setInterim('')
      setFinals([])
    } catch (e) {
      console.warn(e)
    }
  }

  const stopListening = () => {
    try { recRef.current?.stop?.() } catch {}
  }

  return (
    <main className={styles.main}>
      {/* ✅ 인사말 모달 */}
      {showWelcome && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="인사말 안내"
          onClick={(e) => { if (e.target === e.currentTarget) setShowWelcome(false); }}
        >
          <div className={styles.welcomeModal}>
            <button
              className={styles.closeBtn}
              aria-label="닫기"
              onClick={() => setShowWelcome(false)}
            >×</button>

            <div className={styles.welcomeCard}>
              <div className={styles.welcomeHeader}>
                <span className={styles.quoteIcon}>❝</span>
                <span className={styles.welcomeTitle}>인사말</span>
                <span className={styles.quoteIcon}>❞</span>
              </div>

              <div className={styles.welcomeBody}>
                <p>안녕하십니까. 근로복지공단 퇴직연금 담당자 <b>윤용현 전문관</b>입니다.</p>
                <p>퇴직연금 관련 행정업무가 처음이신가요? 익숙하지 않은 용어와 복잡한 절차 때문에 막막하셨던 분들을 위해, 부담을 덜어드리고자 이 안내문을 정성껏 준비하였습니다.</p>
                <p>하나하나 차근차근 따라오실 수 있도록, 그림과 실제 예시를 곁들여 <b>‘그림설명서’</b> 형식으로 친절하게 구성했습니다. 이 안내문이 여러분의 소중한 시간을 절약하고, 보다 편안하게 업무를 마치시는 데 작은 도움이 되기를 바랍니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {/* 헤더 */}
        <header className={styles.header}>
          <h1 className={styles.title}>푸른 씨앗 업무 안내 시스템</h1>
          <p className={styles.subtitle}>원하시는 업무를 선택하시면 상세 안내를 확인하실 수 있습니다</p>
        </header>

        {/* 음성으로 찾기 버튼 */}
        <div style={{display: "flex", justifyContent: "center", marginBottom: "1rem"}}>
          <button
            className={styles.voiceBtn ?? `${styles.categoryBtn} ${styles.active}`}
            onClick={() => setIsVoiceOpen(true)}
            aria-haspopup="dialog"
            title="음성으로 원하는 업무 찾기">
              음성으로 업무 찾기
            </button>
        </div>

        {/* 카테고리 필터 */}
        <div className={styles.categoryFilter}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
              style={{
                backgroundColor: selectedCategory === category
                  ? (category === '전체' ? '#333' : categoryColors[category as Category])
                  : 'transparent'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 업무 카드 그리드 */}
        <div className={styles.workGrid}>
          {filteredWorks.map((work) => (
            <button
              key={work.id}
              className={`${styles.workCard} ${selectedWork?.id === work.id && isModalOpen ? styles.selected : ''}`}
              onClick={() => {
                setSelectedWork(work)
                setCurrentImage(0)
                setIsModalOpen(true)
              }}
              style={{ borderColor: selectedWork?.id === work.id && isModalOpen ? categoryColors[work.category] : 'transparent' }}
            >
              <div className={styles.categoryTag} style={{ backgroundColor: categoryColors[work.category] }}>
                {work.category}
              </div>
              <span className={styles.workIcon}>{work.icon}</span>
              <h3 className={styles.workTitle}>{work.shortDesc}</h3>
              <p className={styles.workFullTitle}>{work.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && selectedWork && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            // 배경 클릭 시 닫기 (모달 내부 클릭은 유지)
            if (e.target === e.currentTarget) setIsModalOpen(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedWork.title} 상세 안내`}
        >
          <div className={styles.modal}>
            <header className={styles.modalHeader} style={{ borderColor: categoryColors[selectedWork.category] }}>
              <span className={styles.detailCategory} style={{ backgroundColor: categoryColors[selectedWork.category] }}>
                {selectedWork.category}
              </span>
              <h2 className={styles.detailTitle}>{selectedWork.title}</h2>
              <button className={styles.closeBtn} aria-label="닫기" onClick={() => setIsModalOpen(false)}>×</button>
            </header>

            <div className={styles.modalBody}>
              <p className={styles.detailDescription}>{selectedWork.description}</p>
              {selectedWork.menuPath && (
                <div className={styles.menuPath}>
                  {selectedWork.menuPath}
                </div>
              )}

              <div className={styles.imageContainer}>
                <div
                  className={`${styles.imageWrapper} ${styles.carousel}`}
                  tabIndex={0}
                  onKeyDown={onKeyDownCarousel}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  aria-roledescription="carousel"
                  aria-label={`${selectedWork.title} 이미지 갤러리`}
                >
                  <div className={styles.imagePlaceholder}>
                    {currentSrc ? (
                      <Image
                        key={currentSrc}
                        src={currentSrc}
                        alt={`${selectedWork.title} 안내 이미지 ${clampedIndex + 1}/${total}`}
                        width={900}
                        height={600}
                        className={styles.guideImage}
                        priority
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div style="
                                display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;
                                background:#f5f5f5;color:#666;padding:2rem;text-align:center
                              ">
                                <div style="font-size:3rem;margin-bottom:1rem;">${selectedWork.icon}</div>
                                <h3 style="margin-bottom:1rem;">${selectedWork.title}</h3>
                                <p style="color:#999;">이미지 파일 위치: ${selectedWork.imagePaths.join(', ')}</p>
                                <p style="color:#999;font-size:0.9rem;margin-top:0.5rem;">public 폴더에 해당 이미지를 추가해주세요</p>
                              </div>
                            `
                          }
                        }}
                      />
                    ) : (
                      <div style={{ padding: '2rem', color: '#999', textAlign: 'center' }}>
                        이미지가 없습니다
                      </div>
                    )}

                    {hasMultiple && (
                      <>
                        <button className={`${styles.navBtn} ${styles.prev}`} onClick={goPrev} aria-label="이전 이미지">◀</button>
                        <button className={`${styles.navBtn} ${styles.next}`} onClick={goNext} aria-label="다음 이미지">▶</button>
                      </>
                    )}
                  </div>

                  {hasMultiple && (
                    <div className={styles.dots} role="tablist" aria-label="이미지 선택">
                      {selectedWork.imagePaths.map((_, idx) => (
                        <button
                          key={idx}
                          role="tab"
                          aria-selected={currentImage === idx}
                          aria-label={`${idx + 1}번째 이미지 보기`}
                          className={`${styles.dot} ${currentImage === idx ? styles.activeDot : ''}`}
                          onClick={() => goTo(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.additionalInfo}>
                <div className={styles.infoCard}>
                  <h4>ℹ️ 안내</h4>
                  <p>
                    안녕하세요. 근로복지공단 퇴직연금 담당자 윤용현 전문관입니다.
                  </p>
                  <p>
                    행정 업무가 낯설고 힘드시죠?
                  </p>
                  <p>
                    퇴직연금 업무가 처음이신 분들을 위해
                    복잡한 절차와 용어를 쉽게 풀어냈습니다.
                  </p>
                  <p>
                    업무 편하게 끝내고, 칼퇴하세요!
                    <span style={{ fontSize: '2rem', color: 'red', verticalAlign: 'middle' }}>♥️</span>
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <h4>📞 문의</h4>
                  <Image
                    src="/business_card.png"
                    alt="업무 담당자 명함"
                    width={500}
                    height={250}
                    className={styles.businessCardImg}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 음성인식 모달 */}
      {isVoiceOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="음성으로 원하는 업무 찾기"
          onClick={(e) => { if (e.target === e.currentTarget) {setIsVoiceOpen(false); stopListening() } }}
        >
          <div className={styles.modal} style={{ maxWidth: 640 }}>
            <header className={styles.modalHeader} style={{ borderColor: '#333' }}>
              <h2 className={styles.detailTitle}>음성으로 원하는 업무 찾기</h2>
              <button
                className={styles.closeBtn}
                aria-label="닫기"
                onClick={() => {setIsVoiceOpen(false); stopListening() }}
              >
                ×
              </button>
            </header>

            <div className={styles.modalBody}>
              {!supported ? (
                <div className={styles.infoCard}>
                  <h4>브라우저에서 음성 인식을 지원하지 않아요</h4>
                  <p className="text-sm">크롬/엣지 등 최신 브라우저를 사용해 주세요</p>
                </div>
              ) : (
                <>
                <div className={styles.infoCard}>
                  <p className="text-sm">
                    이렇게 말해보세요! "신규 직원 등록하고 싶어요", "푸른씨앗 가입하려면?", "이번달 돈이 안 나갔어요"
                  </p>
                </div>

                {/* 음성 인식 토글 버튼 (중앙 큰 원형) */}
                <div className={styles.voiceCenter}>
                  <button
                    onClick={listening ? stopListening : startListening}
                    className={`${styles.voiceCircleBtn} ${listening ? styles.listening: styles.idle}`}
                    style={{ marginBottom: '1rem'}}
                  >
                    {listening ? "🛑" : "🎙️"}
                  </button>

                  {/* 인식된 텍스트 화면에 나타내기 */}
                  <div style={{ textAlign: "center", fontSize: "1.1rem", minHeight: 24, color: "#333" }}>
                    {interim || finals.slice(-1)[0] || "대기 중..."}
                  </div>
                </div>

                <div>
                  <p className="text-xs" style={{color: '#888'}}>
                    * 일부 브라우저/기기에서는 마이크 버튼을 눌러야만 인식이 시작됩니다.
                  </p>
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
