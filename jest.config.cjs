/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  // 테스트할 파일 패턴 (tsx 포함 중요)
  testMatch: ['**/__tests__/**/*.(test|spec).[jt]s?(x)', '**/?(*.)+(test|spec).[jt]s?(x)'],

  // ESModule 관련 변환을 ts-jest가 맡도록
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },

  // React Testing Library 쓸 때 DOM 매처(toBeInTheDocument 등)를 globally 쓰기 위해
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 경로 alias(@/components 같은 거) 쓰면 여기에서 매핑
  moduleNameMapper: {
    // 예: "@/components/Button" -> "<rootDir>/src/components/Button"
    '^@/(.*)$': '<rootDir>/src/$1',

    // 스타일/이미지 같은 비JS import 막기 위한 더미 처리 (필요하면 유지)
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};
