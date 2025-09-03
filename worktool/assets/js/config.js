/**
 * ==========================================
 * 크로스핏판 워크툴 - 설정 파일
 * ==========================================
 * 모든 설정값과 상수들을 중앙에서 관리합니다.
 */

// 🗂 메인 페이지 URL 설정
const DATA_URLS = {
  button1: "worktool/pages/OverviewChart.html",
  button2: "worktool/pages/MonthlyProgress.html", 
  button3: "worktool/pages/RewardPolicy.html",
  button4: "worktool/pages/ComparisonBranch.html",
  button6: "worktool/pages/carryover.html",
  button7: "worktool/pages/noshow.html",
  button8: "worktool/pages/checkdelivery.html"
};

// 🏢 지점별 설정
const BRANCH_CONFIGS = {
  sangmu: {
    id: 'sangmu',
    name: '상무점',
    emoji: '🌿',
    color: 'var(--branch-sangmu)',
    hasToggle: false, // 현재는 단일 URL만
    urls: {
      single: "https://lookerstudio.google.com/embed/reporting/64be6fe1-640e-457b-9108-1c70d60e666e/page/buSUF"
    }
  },
  sinchang: {
    id: 'sinchang', 
    name: '신창점',
    emoji: '💙',
    color: 'var(--branch-sinchang)',
    hasToggle: true, // 전환 기능 있음
    urls: {
      branch: 'https://lookerstudio.google.com/embed/reporting/64be6fe1-640e-457b-9108-1c70d60e666e/page/p_gfze1gk9ud',
      staff: 'https://lookerstudio.google.com/embed/reporting/695906da-94dd-4027-aa85-300c66ba158e/page/eMJQF'
    }
  },
  ochi: {
    id: 'ochi',
    name: '오치점', 
    emoji: '🧡',
    color: 'var(--branch-ochi)',
    hasToggle: false, // 현재는 단일 URL만
    urls: {
      single: "https://lookerstudio.google.com/embed/reporting/64be6fe1-640e-457b-9108-1c70d60e666e/page/p_suzy22l9ud"
    }
  },
  staff: {
    id: 'staff',
    name: '전지점 담당자별 등록률',
    emoji: '👨‍💼', 
    color: 'var(--violet-purple)',
    hasToggle: false, // 단일 URL
    urls: {
      single: 'https://lookerstudio.google.com/embed/reporting/64be6fe1-640e-457b-9108-1c70d60e666e/page/p_d1s8t8pavd'
    }
  }
};

// ⚙️ 애플리케이션 설정
const APP_CONFIG = {
  // 로딩 관련
  loadingDelay: 300, // ms
  scrollDelay: 150, // ms
  
  // 반응형 브레이크포인트
  mobileBreakpoint: 768, // px
  
  // 애니메이션 설정
  transitionDuration: 300, // ms
  
  // 디버그 모드
  debugMode: false, // 개발 시 true로 설정
  
  // 버전 정보
  version: '1.0.0',
  lastUpdated: '2025-01-02'
};

// 🎨 UI 메시지
const UI_MESSAGES = {
  loading: '데이터를 불러오는 중...',
  error: '데이터를 불러올 수 없습니다.',
  success: '성공적으로 로드되었습니다.',
  noData: '표시할 데이터가 없습니다.'
};

// 🔧 유틸리티 함수들
const UTILS = {
  // 디바이스 타입 확인
  isMobile: () => window.innerWidth <= APP_CONFIG.mobileBreakpoint,
  
  // 디버그 로그
  log: (message, type = 'info') => {
    if (APP_CONFIG.debugMode) {
      console[type](`[크로스핏판 워크툴] ${message}`);
    }
  },
  
  // 로딩 상태 표시/숨김
  showLoading: (show = true) => {
    const loader = document.querySelector('.loader');
    const overlay = document.querySelector('.loading-overlay');
    
    if (loader && overlay) {
      loader.style.display = show ? 'block' : 'none';
      overlay.style.display = show ? 'block' : 'none';
    }
  },
  
  // 스크롤 유틸리티
  scrollToElement: (element, offset = 0) => {
    if (UTILS.isMobile()) {
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop = rect.top + scrollTop - offset;
        
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }, APP_CONFIG.scrollDelay);
    }
  }
};

// 🎯 전역 객체로 내보내기 (다른 파일에서 접근 가능)
window.WorktoolConfig = {
  DATA_URLS,
  SUB_BUTTON_CONFIGS,
  BRANCH_CONFIGS,
  APP_CONFIG,
  UI_MESSAGES,
  UTILS
};