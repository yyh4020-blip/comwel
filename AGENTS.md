# comwel 프로젝트 개요

## 1. 현재 프로젝트 개발 현황
- App Router 기반 단일 페이지(`src/app/page.tsx`)에서 근로복지공단 업무 가이드를 카드/모달 UI로 제공하며, 카테고리 필터와 슬라이드형 이미지 뷰어가 동작합니다.
- 초기 1회 노출 환영 모달(`sessionStorage` 플래그)과 ESC/바깥 클릭으로 닫히는 업무 상세 모달 등 접근성을 고려한 상호작용이 구현되어 있습니다.
- 업무 데이터(`workData`)는 다수의 이미지 경로와 요약/메뉴 경로를 포함한 하드코딩 배열로 관리되며, `public/images/*.jpg` 및 명함 이미지를 참조합니다.
- `layout.tsx`에서 메타데이터(Open Graph 포함)와 Google Inter 폰트를 적용해 배포용 기본 구성을 커스터마이징했습니다.

## 2. 추가 개발 계획
- **Phase 1 - 요구사항 및 검색 기준 확정:** 검색 대상 필드(`title`, `shortDesc`, `menuPath`, 상세 설명)와 우선순위를 정의하고, 최적 결과 판정 기준(정확 일치 > 부분 일치 > 간단 퍼지 등)을 문서화합니다.
- **Phase 2 - 1차 검색 엔진 직접 구현:** 조사 제거, 소문자화, 간단 퍼지(예: Levenshtein <= 1) 등 전처리 유틸을 작성하고, 순수 JS로 각 문서를 점수화해 최고 점수 한 건만 반환하는 로직을 만듭니다. 오타, 동의어, 복합어 시나리오를 포함한 테스트 케이스를 준비합니다.
- **Phase 3 - 품질 평가 및 확장 판단:** 직접 구현한 검색을 테스트 시나리오로 평가하고 기준 미달 시에만 Lunr.js, MiniSearch, FlexSearch 등을 후보로 비교(번들 크기, 한국어 대응, 튜닝 범위)한 뒤 교체 여부를 결정합니다.
- **Phase 4 - 프런트엔드 통합:** 검색 입력 UI를 추가하고 제출 시 최상위 결과의 업무 카드를 자동 선택해 상세 모달을 즉시 띄웁니다. 결과 없음 안내만 제공하고 하이라이팅 등 부가 기능은 후순위로 둡니다.
- **Phase 5 - 유지보수 체계 정비:** 인덱스 생성 자동화(필요 시)를 준비하고, 검색 품질 기준과 라이브러리 도입 조건, 운영 절차를 `AGENTS.md`와 `README` 등에 문서화합니다.

## 3. 사용 기술 스택
- **프레임워크:** Next.js 15(App Router)
- **라이브러리:** React 19, Next Image 컴포넌트, `next/font`(Inter)
- **언어 및 빌드:** TypeScript, Turbopack 기반 `next dev`
- **스타일:** CSS Modules(`page.module.css`), 전역 CSS(`globals.css`)
- **개발 도구:** ESLint 9(`eslint.config.mjs`), Tailwind CSS 4 및 `@tailwindcss/postcss` 의존성만 설치되어 있으며 현재 CSS 모듈 위주로 사용 중입니다.

## 4. 디렉터리 구조
```
/ (repo root)
├─ AGENTS.md                # 프로젝트 개요 문서 (본 파일)
├─ README.md                # 기본 Next.js 안내
├─ next.config.ts           # 이미지 최적화 설정(원격 패턴 허용)
├─ package.json / package-lock.json
├─ tsconfig.json
├─ public/
│  ├─ 000.jpg, business_card.png, *.svg
│  └─ images/001.jpg ~ 039.jpg 등 업무 안내 이미지
└─ src/app/
   ├─ globals.css
   ├─ layout.tsx            # 메타데이터 및 Inter 폰트 적용
   └─ page.tsx / page.module.css
```

## 5. 커밋 규칙 (기존 로그 기준)
- `type: 설명` 형태의 소문자 영문 타입을 사용하며 `fix:`와 `add:`가 주로 쓰입니다.
- 설명은 영어 한 줄로 간결하게 작성하고 변경 의도를 직설적으로 기술합니다.
- 예시: `fix: update image assets and add menuPath field`, `add: Pop-up upon initial access`
