'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

// 업무 데이터 타입 선언
import { workData, WorkItem, Category } from '@/data/workData'

// 검색 유틸
import { searchWork } from '@/lib/search'
import { matchIntent } from '@/lib/voice/matchIntent'

// 음성인식 타입 선언
type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (e: SpeechRecognitionEvent) => void;
  onend: (() => void) | null;
  onerror: ((e: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition? : SpeechRecognitionConstructor;
    SpeechRecognition? : SpeechRecognitionConstructor;
  }
}


const categoryColors: Record<Category, string> = {
  '신청하기': '#4CAF50',
  '직원관리': '#2196F3',
  '부담금': '#FF9800',
  '재정지원': '#9C27B0',
  '기타': '#607D8B'
}

const workNoticePopup = {
  workId: 5,
  title: '퇴사 지급신청 안내',
  imageSrc: '/popup01.png',
  fileName: 'popup01.png'
}

export default function Home() {
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | '전체'>('전체')
  const [currentImage, setCurrentImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false); // ✅ 인사말 모달
  const [showWorkNotice, setShowWorkNotice] = useState(false)

  // 음성인식 모달
  const [isVoiceOpen, setIsVoiceOpen] = useState(false)
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [voiceMessage, setVoiceMessage] = useState('대기 중...')
  const recRef = useRef<SpeechRecognition | null>(null)

  const touchStartXRef = useRef<number | null>(null)

  const stopListening = useCallback(() => {
    try { recRef.current?.stop?.() } catch {}
    setListening(false)
    setInterim('')
  }, [])

  const openWorkById = useCallback((matchId: string | number) => {
    const target = workData.find(work => String(work.id) === String(matchId))
    if (!target) {
      setVoiceMessage('찾은 업무가 목록과 일치하지 않습니다.')
      return
    }

    setSelectedCategory(target.category)
    setSelectedWork(target)
    setCurrentImage(0)
    setIsModalOpen(true)
  }, [])

  const handleVoiceQuery = useCallback((spoken: string) => {
    const query = spoken.trim()
    if (!query) return

    const intentResult = matchIntent(query)
    if (intentResult.intent) {
      openWorkById(intentResult.intent.workId)
      setVoiceMessage(`"${query}" → ${intentResult.intent.displayName}`)
      stopListening()
      return
    }

    const { result } = searchWork(query, workData)
    if (result) {
      openWorkById(result.item.id)
      setVoiceMessage(`"${query}" → ${result.item.title}`)
      stopListening()
    } else {
      setVoiceMessage(`"${query}"와 일치하는 업무를 찾지 못했어요.`)
    }
  }, [openWorkById, stopListening])

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

  useEffect(() => {
    if (isVoiceOpen) {
      setVoiceMessage('대기 중...')
      setInterim('')
    }
  }, [isVoiceOpen])

  useEffect(() => {
    setShowWorkNotice(isModalOpen && selectedWork?.id === workNoticePopup.workId)
  }, [isModalOpen, selectedWork?.id])

  // Esc로 모달 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowWorkNotice(false)
        setIsModalOpen(false)
        if (isVoiceOpen) {setIsVoiceOpen (false); stopListening() }
    }
  };
    if (isModalOpen || isVoiceOpen || showWorkNotice) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isModalOpen, isVoiceOpen, showWorkNotice, stopListening])

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
      if (delta > 0) {
        goPrev()
      } else {
        goNext()
      }
    }
    touchStartXRef.current = null
  }

  useEffect(() => {
    const SR = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    setSupported(!!SR)
    if (SR) {
      const rec = new SR()
      rec.lang = 'ko-KR'
      rec.interimResults = true
      rec.continuous = true

      rec.onresult = (e: SpeechRecognitionEvent) => {
        let interimTxt = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = (e.results[i][0]?.transcript || '').trim()
          if (e.results[i].isFinal) {
            setInterim('')
            handleVoiceQuery(t)
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
  }, [handleVoiceQuery])

  const startListening = () => {
    if (!recRef.current) return
    try {
      recRef.current.start()
      setListening(true)
      setInterim('')
      setVoiceMessage('듣는 중...')
    } catch (e) {
      console.warn(e)
    }
  }

  const printWorkNotice = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) return

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${workNoticePopup.title}</title>
          <style>
            body {
              margin: 0;
              padding: 24px;
              display: flex;
              justify-content: center;
              background: #fff;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <img src="${workNoticePopup.imageSrc}" alt="${workNoticePopup.title}" />
          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
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
                <p>안녕하십니까. 근로복지공단 퇴직연금 담당자입니다.</p>
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
            if (e.target === e.currentTarget) {
              setShowWorkNotice(false)
              setIsModalOpen(false)
            }
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
              <button
                className={styles.closeBtn}
                aria-label="닫기"
                onClick={() => {
                  setShowWorkNotice(false)
                  setIsModalOpen(false)
                }}
              >
                ×
              </button>
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
                    안녕하세요. 근로복지공단 퇴직연금 담당자입니다.
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
                    src="/sample_business_card.png"
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

      {showWorkNotice && selectedWork?.id === workNoticePopup.workId && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`${workNoticePopup.title} 팝업 안내`}
          onClick={(e) => { if (e.target === e.currentTarget) setShowWorkNotice(false) }}
        >
          <div className={styles.workNoticeModal}>
            <header className={styles.modalHeader} style={{ borderColor: '#2196F3' }}>
              <span className={styles.detailCategory} style={{ backgroundColor: '#2196F3' }}>
                안내
              </span>
              <h2 className={styles.detailTitle}>{workNoticePopup.title}</h2>
              <button className={styles.closeBtn} aria-label="닫기" onClick={() => setShowWorkNotice(false)}>×</button>
            </header>

            <div className={styles.workNoticeBody}>
              <div className={styles.workNoticeImageFrame}>
                <Image
                  src={workNoticePopup.imageSrc}
                  alt={workNoticePopup.title}
                  width={900}
                  height={600}
                  className={styles.workNoticeImage}
                  priority
                />
              </div>

              <div className={styles.workNoticeActions}>
                <a
                  className={styles.noticeActionBtn}
                  href={workNoticePopup.imageSrc}
                  download={workNoticePopup.fileName}
                >
                  이미지 다운로드
                </a>
                <button className={styles.noticeActionBtn} type="button" onClick={printWorkNotice}>
                  이미지 출력
                </button>
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
                    이렇게 말해보세요! &quot;신규 직원 등록하고 싶어요&quot;, &quot;푸른씨앗 가입하려면?&quot;, &quot;이번달 돈이 안 나갔어요&quot;
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
                    {interim || voiceMessage}
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
