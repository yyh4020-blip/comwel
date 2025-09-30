export interface WorkItem {
  id: number;
  title: string;
  category: Category;
  icon: string;
  imagePaths: string[];
  description: string;
  menuPath : string;
  shortDesc: string;
  keywords?: string[];  // 음성 검색용 키워드
}

export type Category = '신청하기' | '직원관리' | '부담금' | '재정지원' | '기타';

export const workData: WorkItem[] = [
  {
    id: 1,
    title: '기금제도 푸른씨앗 신청하기',
    category: '신청하기',
    icon: '🌱',
    imagePaths: ['/images/004.jpg', '/images/005.jpg', '/images/006.jpg', '/images/007.jpg', '/images/008.jpg', '/images/009.jpg', '/images/010.jpg', '/images/011.jpg'],
    description: '푸른씨앗 기금제도 가입을 위한 절차 및 필요 서류 안내',
    menuPath: '홈페이지 > 신청하기 > 가입 > 기금제도 신청하기(사업장)',
    shortDesc: '푸른씨앗 신청',
    keywords: ['기금제도', '제도가입', '가입', '제도신청', '신청']
  },
  {
    id: 2,
    title: '신규직원 등록하기',
    category: '직원관리',
    icon: '👤',
    imagePaths: ['/images/013.jpg', '/images/014.jpg', '/images/015.jpg', '/images/016.jpg'],
    description: '신규 직원 등록 절차 및 필수 입력 정보 안내',
    menuPath: '홈페이지 > 신청하기 > 가입자관리',
    shortDesc: '직원 등록',
    keywords: ['신규직원', '직원등록', '등록', '사람추가', '근로자추가']
  },
  {
    id: 3,
    title: '급여변경하기',
    category: '직원관리',
    icon: '💰',
    imagePaths: ['/images/017.jpg'],
    description: '직원 급여 변경 신청 및 처리 절차 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 가입자 연간(예상)임금총액변경',
    shortDesc: '급여 변경',
    keywords: ['급여변경', '연봉변경', '월급변경', '봉급변경', '월급액변경', '연봉액변경', '봉급액변경']
  },
  {
    id: 4,
    title: '퇴사 - 지급신청',
    category: '직원관리',
    icon: '📋',
    imagePaths: ['/images/026.jpg', '/images/027.jpg'],
    description: '퇴직금 지급 신청 절차 및 필요 서류 안내',
    menuPath: '홈페이지 > 신청하기 > 지급 > 퇴직급여 지급신청',
    shortDesc: '퇴사 지급신청',
    keywords: ['퇴사', '퇴직금', '지급신청', '퇴직금신청', '퇴직급여', '퇴직급여신청']
  },
  {
    id: 5,
    title: '퇴사 - 지급신청현황',
    category: '직원관리',
    icon: '📊',
    imagePaths: ['/images/035.jpg', '/images/036.jpg'],
    description: '퇴직금 지급 신청 현황 조회 방법',
    menuPath: '홈페이지 > 조회하기 > 지급',
    shortDesc: '지급신청현황',
    keywords: ['지급신청현황']
  },
  {
    id: 6,
    title: '사용자 납입 희망 금액 수시납부 처리하기',
    category: '부담금',
    icon: '💳',
    imagePaths: ['/images/018.jpg'],
    description: '수시 납부 신청 및 처리 방법 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 부담금 수시납입 > 수시납입신청',
    shortDesc: '수시 납부',
    keywords: ['수시납부', '수시납입', '납입', '납부', '계좌이체']
  },
  {
    id: 7,
    title: '사용자 납입 희망 금액 변경하기',
    category: '부담금',
    icon: '💵',
    imagePaths: ['/images/019.jpg'],
    description: '정기부담금 납입 희망 금액 변경 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 부담금 수시납입 > 정기부담금 납입희망금액 변경신청',
    shortDesc: '납입희망금액 변경',
    keywords: ['납입희망금액변경', '납입희망금액', '납입금액변경', '납입금액', '정기납입금액변경', '정기납입금액']
  },
  {
    id: 8,
    title: '(과거분) 일시전환부담금 납입신청',
    category: '부담금',
    icon: '📅',
    imagePaths: ['/images/023.jpg', '/images/024.jpg'],
    description: '과거분 일시전환부담금 납입 신청 절차',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 일시전환부담금 납입신청',
    shortDesc: '과거분 납입',
    keywords: ['과거분', '일시전환부담금', '일시전환', '과거']
  },
  {
    id: 9,
    title: '(해당기간 ~ 연 1회) 부담금 정산신청하기',
    category: '부담금',
    icon: '📊',
    imagePaths: ['/images/020.jpg', '/images/021.jpg', '/images/022.jpg'],
    description: '연간 부담금 정산 신청 절차 및 기한 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 부담금 정산신청',
    shortDesc: '정산 신청',
    keywords: ['정산신청', '정산', '부담금정산']
  },
  {
    id: 10,
    title: '자동이체관리',
    category: '부담금',
    icon: '🔄',
    imagePaths: ['/images/025.jpg'],
    description: '자동이체 등록, 변경, 해지 방법 안내',
    menuPath: '홈페이지 > 신청하기 > 부담금 > 자동이체관리',
    shortDesc: '자동이체',
    keywords: ['자동이체', '이체관리', '자동', '이체']
  },
  {
    id: 11,
    title: '기타사항 변경 (근로자 정보, 퇴직급여 담당자 변경)',
    category: '기타',
    icon: '✏️',
    imagePaths: ['/images/007.jpg'],
    description: '',
    menuPath: '근로자 정보 변경 : 신청하기 > 가입자 관리\n퇴직급여 담당자 변경 : 신청하기 > 퇴직급여담당자 관리',
    shortDesc: '정보 변경',
    keywords: ['근로자정보변경', '퇴직급여담당자변경', '정보변경', '담당자변경']
  },
  {
    id: 12,
    title: '온라인 신청 현황',
    category: '기타',
    icon: '🖥️',
    imagePaths: ['/images/029.jpg'],
    description: '온라인으로 신청한 업무 처리 현황 조회',
    menuPath: '홈페이지 > 조회하기 > 가입 > 서류등록현황',
    shortDesc: '신청 현황',
    keywords: ['온라인신청현황', '신청현황', '처리현황', '서류등록현황']
  },
  {
    id: 13,
    title: '부담금 납입 안내 (명세서)',
    category: '부담금',
    icon: '📄',
    imagePaths: ['/images/030.jpg'],
    description: '부담금 납입 명세서 조회 및 출력 방법',
    menuPath: '홈페이지 > 조회하기 > 부담금 > 부담금납입 안내',
    shortDesc: '납입 명세서',
    keywords: ['납입안내', '납입명세서', '명세서', '납부명세서']
  },
  {
    id: 14,
    title: '부담금 납입 내역 (기존 납입 내역)',
    category: '부담금',
    icon: '📑',
    imagePaths: ['/images/031.jpg'],
    description: '기존 부담금 납입 내역 조회 방법',
    menuPath: '홈페이지 > 조회하기 > 부담금 > 부담금납입 내역',
    shortDesc: '납입 내역',
    keywords: ['납입내역', '납부내역', '기존납입내역', '기존납부내역']
  },
  {
    id: 15,
    title: '재정지원금 - 지원금 신청결과',
    category: '재정지원',
    icon: '✅',
    imagePaths: ['/images/033.jpg'],
    description: '재정지원금 신청 결과 확인 방법',
    menuPath: '홈페이지 > 조회하기 > 부담금 > 재정지원금 신청결과',
    shortDesc: '신청 결과',
    keywords: ['재정지원금', '지원금신청결과', '신청결과', '지원금결과']
  },
  {
    id: 16,
    title: '재정지원금 - 지원금 지급내역',
    category: '재정지원',
    icon: '💵',
    imagePaths: ['/images/034.jpg'],
    description: '재정지원금 지급 내역 조회 방법',
    menuPath: '홈페이지 > 조회하기 > 부담금 > 재정지원금 지급내역',
    shortDesc: '지급 내역',
    keywords: ['재정지원금', '지원금지급내역', '지원금내역']
  },
  {
    id: 17,
    title: '증명서 발급',
    category: '기타',
    icon: '📜',
    imagePaths: ['/images/038.jpg'],
    description: '각종 증명서 발급 신청 및 출력 방법',
    menuPath: '홈페이지 > 조회하기 > 증명서발급',
    shortDesc: '증명서 발급',
    keywords: ['증명서발급', '증명서', '발급', '명세서', '영수증']
  },
  {
    id: 18,
    title: '서식 자료실',
    category: '기타',
    icon: '📁',
    imagePaths: ['/images/007.jpg'],
    description: '업무별 필요 서식 다운로드 및 작성 방법',
    menuPath: '홈페이지 > 고객센터 > 서식자료실',
    shortDesc: '서식 자료실',
    keywords: ['서식자료실', '서식', '자료실', '양식', '종이서류', '서류']
  }
]