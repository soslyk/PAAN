/**
 * ==========================================
 * 크로스핏판 워크툴 - 메인 애플리케이션
 * ==========================================
 * 애플리케이션 초기화 및 전체 흐름 제어
 */

/**
 * 🚀 애플리케이션 초기화
 */
function initializeApp() {
  const { APP_CONFIG, UTILS } = window.WorktoolConfig;
  const { initializeComponents } = window.WorktoolComponents;
  
  UTILS.log('크로스핏판 워크툴 시작', 'info');
  UTILS.log(`버전: ${APP_CONFIG.version}`, 'info');
  
  try {
    // 컴포넌트 시스템 초기화
    initializeComponents();
    
    // 성공 메시지
    UTILS.log('🎉 크로스핏판 워크툴이 성공적으로 로드되었습니다!', 'info');
    
    // 개발 모드일 때 추가 정보 출력
    if (APP_CONFIG.debugMode) {
      console.table({
        '버전': APP_CONFIG.version,
        '마지막 업데이트': APP_CONFIG.lastUpdated,
        '디바이스': UTILS.isMobile() ? '모바일' : 'PC',
        '화면 크기': `${window.innerWidth} x ${window.innerHeight}`
      });
    }
    
  } catch (error) {
    UTILS.log(`초기화 실패: ${error.message}`, 'error');
    console.error('워크툴 초기화 오류:', error);
  }
}

/**
 * 🎯 윈도우 이벤트 핸들러들
 */
function setupWindowEvents() {
  const { UTILS } = window.WorktoolConfig;
  
  // 리사이즈 이벤트
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      UTILS.log(`화면 크기 변경: ${window.innerWidth} x ${window.innerHeight}`);
      
      // 모바일/PC 모드 변경 감지
      const newIsMobile = UTILS.isMobile();
      if (window.lastIsMobile !== newIsMobile) {
        UTILS.log(`디바이스 모드 변경: ${newIsMobile ? '모바일' : 'PC'}`);
        window.lastIsMobile = newIsMobile;
      }
    }, 250);
  });
  
  // 에러 핸들링
  window.addEventListener('error', (event) => {
    UTILS.log(`JavaScript 에러: ${event.message}`, 'error');
    console.error('전역 에러:', event.error);
  });
  
  // 로드 완료
  window.addEventListener('load', () => {
    UTILS.log('모든 리소스 로드 완료');
  });
}

/**
 * 🔧 유틸리티 함수들
 */
function setupUtilityFunctions() {
  // 콘솔에서 사용할 수 있는 디버그 함수들
  window.worktool = {
    // 현재 상태 출력
    status: () => {
      const { APP_CONFIG } = window.WorktoolConfig;
      console.table({
        '버전': APP_CONFIG.version,
        '디버그 모드': APP_CONFIG.debugMode,
        '현재 페이지': document.title,
        '화면 크기': `${window.innerWidth} x ${window.innerHeight}`,
        '디바이스': window.WorktoolConfig.UTILS.isMobile() ? '모바일' : 'PC'
      });
    },
    
    // 디버그 모드 토글
    toggleDebug: () => {
      window.WorktoolConfig.APP_CONFIG.debugMode = !window.WorktoolConfig.APP_CONFIG.debugMode;
      console.log(`디버그 모드: ${window.WorktoolConfig.APP_CONFIG.debugMode ? 'ON' : 'OFF'}`);
    },
    
    // 버전 정보
    version: () => {
      const { APP_CONFIG } = window.WorktoolConfig;
      console.log(`크로스핏판 워크툴 v${APP_CONFIG.version} (${APP_CONFIG.lastUpdated})`);
    },
    
    // 도움말
    help: () => {
      console.log(`
🔧 크로스핏판 워크툴 콘솔 명령어:

worktool.status()     - 현재 상태 확인
worktool.toggleDebug() - 디버그 모드 토글  
worktool.version()    - 버전 정보
worktool.help()       - 이 도움말

💡 팁: F12 개발자 도구에서 위 명령어들을 사용할 수 있습니다.
      `);
    }
  };
}

/**
 * 📱 모바일 특화 기능들
 */
function setupMobileFeatures() {
  const { UTILS } = window.WorktoolConfig;
  
  if (UTILS.isMobile()) {
    // 모바일에서 더블탭 줌 방지
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    // 모바일에서 가로/세로 모드 변경 감지
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        UTILS.log('화면 방향 변경됨');
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });
    
    UTILS.log('모바일 특화 기능 활성화');
  }
}

/**
 * 🎯 DOM 로드 완료 시 실행
 */
document.addEventListener('DOMContentLoaded', function() {
  // 초기 디바이스 상태 저장
  window.lastIsMobile = window.WorktoolConfig?.UTILS?.isMobile() || false;
  
  // 애플리케이션 초기화
  initializeApp();
  
  // 윈도우 이벤트 설정
  setupWindowEvents();
  
  // 유틸리티 함수 설정
  setupUtilityFunctions();
  
  // 모바일 특화 기능
  setupMobileFeatures();
});

/**
 * 🌍 전역 함수 내보내기
 */
window.WorktoolMain = {
  initializeApp,
  setupWindowEvents,
  setupUtilityFunctions,
  setupMobileFeatures
};