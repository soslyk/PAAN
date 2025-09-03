/**
 * ==========================================
 * 크로스핏판 워크툴 - 컴포넌트 모듈 (수정됨)
 * ==========================================
 * 재사용 가능한 UI 컴포넌트들과 관련 함수들
 */

// 🎯 전역 변수들
let currentBranch = null;
let branchModes = {};
let branchSubVisible = false;
let lastSelectedBranchIndex = 0;
let shinIsStaffMode = false;

// 📦 DOM 요소들 (초기화 시 설정됨)
let elements = {};

/**
 * 🚀 DOM 요소 초기화
 */
function initializeElements() {
  const { log } = window.WorktoolConfig.UTILS;

  elements = {
    // 메인 요소들
    dataFrame: document.getElementById("dataFrame"),
    dataFrameContainer: document.getElementById("dataFrameContainer"),

    // 버튼들
    buttons: document.querySelectorAll(".toggle-button"),
    branchButtons: document.querySelectorAll(".branch-toggle-button"),

    // 컨테이너들
    branchSubContainer: document.getElementById("branchSubContainer"),

    // 신창점 전용 요소들
    shinContainer: document.getElementById("shinContainer"),
    shinBranchFrame: document.getElementById("shinBranchFrame"),
    shinStaffFrame: document.getElementById("shinStaffFrame"),
    shinBtn: document.getElementById("shinBtn"),

    // 로딩 요소들
    loader: document.querySelector(".loader"),
    loadingOverlay: document.querySelector(".loading-overlay"),
  };

  // 🔧 DOM 요소 존재 확인
  log(`DOM 요소 확인:`);
  log(`- 메인 버튼: ${elements.buttons.length}개`);
  log(`- 지점 버튼: ${elements.branchButtons.length}개`);
  log(`- 데이터 프레임: ${elements.dataFrame ? '있음' : '없음'}`);
  log(`- 신창점 컨테이너: ${elements.shinContainer ? '있음' : '없음'}`);

  log("DOM 요소 초기화 완료");
}

/**
 * 🔄 iframe 업데이트 함수
 */
function updateFrame(url) {
  const { showLoading, log } = window.WorktoolConfig.UTILS;
  const { loadingDelay } = window.WorktoolConfig.APP_CONFIG;

  if (!elements.dataFrame) {
    log("데이터 프레임을 찾을 수 없습니다!", "error");
    return;
  }

  if (!url) {
    log("URL이 없습니다!", "error");
    return;
  }

  // 동일 URL 재로딩 방지
  if (elements.dataFrame.src === url) {
    log("동일한 URL이므로 로딩하지 않습니다");
    showLoading(false);
    return;
  }

  log(`페이지 로딩 시작: ${url}`);

  // 로딩 시작
  showLoading(true);

  // iframe 로드 완료 이벤트
  elements.dataFrame.onload = function () {
    setTimeout(() => {
      showLoading(false);
      log("페이지 로딩 완료");
    }, loadingDelay);
  };

  // 에러 처리
  elements.dataFrame.onerror = function() {
    showLoading(false);
    log(`페이지 로딩 실패: ${url}`, "error");
  };

  elements.dataFrame.src = url;
}

/**
 * ✨ 버튼 활성화 함수
 */
function activateButton(btn, isMainButton = false) {
  if (isMainButton) {
    elements.buttons.forEach((b) => b.classList.remove("active"));
  } else {
    elements.branchButtons.forEach((b) => b.classList.remove("active"));
  }
  btn.classList.add("active");
}

/**
 * 🔄 신창점 라벨 업데이트
 */
function updateShinLabel() {
  if (elements.shinBtn) {
    elements.shinBtn.innerHTML = shinIsStaffMode
      ? "👨‍💼 담당자 대시보드"
      : "💙 신창점 대시보드";
  }
}

/**
 * 📊 신창점 표시 함수
 */
function showShin() {
  const { log } = window.WorktoolConfig.UTILS;

  if (!elements.shinContainer) {
    log("신창점 컨테이너를 찾을 수 없습니다.", "error");
    return;
  }

  // 신창점 컨테이너 보이기
  elements.shinContainer.hidden = false;
  elements.dataFrame.hidden = true;

  // 컨테이너 스타일 설정
  elements.shinContainer.style.display = "flex";
  elements.shinContainer.style.height = "100%";
  elements.shinContainer.style.flexGrow = "1";
  elements.shinContainer.style.minHeight = "400px";

  // 스택 컨테이너 설정
  const shinStack = elements.shinContainer.querySelector(".shin-stack");
  if (shinStack) {
    shinStack.style.height = "100%";
    shinStack.style.flexGrow = "1";
    shinStack.style.minHeight = "400px";
    shinStack.style.position = "relative";
  }

  // iframe 표시/숨김
  if (elements.shinBranchFrame && elements.shinStaffFrame) {
    elements.shinBranchFrame.hidden = shinIsStaffMode;
    elements.shinStaffFrame.hidden = !shinIsStaffMode;
  }

  // 레이아웃 재계산
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));

    const activeFrame = shinIsStaffMode
      ? elements.shinStaffFrame
      : elements.shinBranchFrame;
    if (activeFrame && shinStack) {
      activeFrame.style.height = "100%";
      activeFrame.style.minHeight = shinStack.offsetHeight + "px";
    }
  }, 100);

  log(`신창점 ${shinIsStaffMode ? "담당자" : "대시보드"} 모드로 표시`);
}

/**
 * 📄 일반 페이지 표시 함수
 */
function showCommon(url) {
  const { log } = window.WorktoolConfig.UTILS;

  if (elements.shinContainer) {
    elements.shinContainer.hidden = true;
    elements.shinContainer.style.display = "none";
  }
  
  if (elements.dataFrame) {
    elements.dataFrame.hidden = false;
    elements.dataFrame.style.display = "block";
  }

  updateFrame(url);
  shinIsStaffMode = false;
  updateShinLabel();

  log(`일반 페이지 표시: ${url}`);
}

/**
 * 🎯 메인 버튼 이벤트 설정
 */
function setupMainButtons() {
  const { DATA_URLS } = window.WorktoolConfig;
  const { scrollToElement, log } = window.WorktoolConfig.UTILS;

  log("메인 버튼 이벤트 설정 시작");

  // 일반 메인 버튼들
  [
    "button1",
    "button2", 
    "button3",
    "button4",
    "button6",
    "button7",
    "button8",
  ].forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener("click", () => {
        log(`메인 버튼 클릭: ${buttonId}`);

        activateButton(button, true);
        
        if (elements.branchSubContainer) {
          elements.branchSubContainer.classList.remove("show");
        }
        branchSubVisible = false;
        
        if (elements.shinContainer) {
          elements.shinContainer.hidden = true;
        }
        if (elements.dataFrame) {
          elements.dataFrame.hidden = false;
        }

        // URL 존재 확인
        if (DATA_URLS[buttonId]) {
          updateFrame(DATA_URLS[buttonId]);
        } else {
          log(`${buttonId}에 대한 URL을 찾을 수 없습니다!`, "error");
        }

        scrollToElement(elements.dataFrameContainer, 10);
      });
      
      log(`${buttonId} 이벤트 등록 완료`);
    } else {
      log(`${buttonId} 버튼을 찾을 수 없습니다!`, "error");
    }
  });

  // 지점 대시보드 버튼 (토글 기능)
  const button5 = document.getElementById("button5");
  if (button5) {
    button5.addEventListener("click", () => {
      log("지점 대시보드 버튼 클릭");

      activateButton(button5, true);

      if (!branchSubVisible) {
        // 서브 버튼 표시
        if (elements.branchSubContainer) {
          elements.branchSubContainer.classList.add("show");
        }
        branchSubVisible = true;

        // 마지막 선택 지점 활성화
        elements.branchButtons.forEach((b, index) => {
          b.classList.remove("active");
          if (index === lastSelectedBranchIndex) {
            b.classList.add("active");
          }
        });

        // 선택된 지점 표시
        const selectedButton = elements.branchButtons[lastSelectedBranchIndex];
        if (selectedButton === elements.shinBtn) {
          showShin();
        } else if (selectedButton && selectedButton.dataset.url) {
          if (elements.shinContainer) elements.shinContainer.hidden = true;
          if (elements.dataFrame) elements.dataFrame.hidden = false;
          updateFrame(selectedButton.dataset.url);
        }

        scrollToElement(elements.branchSubContainer, 10);
      } else {
        // 서브 버튼 숨기기
        if (elements.branchSubContainer) {
          elements.branchSubContainer.classList.remove("show");
        }
        branchSubVisible = false;
        scrollToElement(elements.dataFrameContainer, 10);
      }

      updateShinLabel();
    });
    
    log("button5 이벤트 등록 완료");
  } else {
    log("button5 버튼을 찾을 수 없습니다!", "error");
  }
}

/**
 * 🏢 지점 버튼 이벤트 설정
 */
function setupBranchButtons() {
  const { log } = window.WorktoolConfig.UTILS;

  log("지점 버튼 이벤트 설정 시작");

  elements.branchButtons.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      lastSelectedBranchIndex = index;
      log(`지점 버튼 클릭: ${btn.textContent.trim()}`);

      // 신창점 버튼 특별 처리
      if (btn === elements.shinBtn) {
        if (!elements.shinBtn.classList.contains("active")) {
          activateButton(elements.shinBtn);
          shinIsStaffMode = false;
          updateShinLabel();
          showShin();
          return;
        }

        // 이미 활성화된 신창점 버튼 클릭 시 모드 전환
        shinIsStaffMode = !shinIsStaffMode;
        updateShinLabel();
        showShin();
        return;
      }

      // 일반 지점 버튼 처리
      activateButton(btn);
      if (btn.dataset.url) {
        showCommon(btn.dataset.url);
      } else {
        log("지점 버튼에 URL이 설정되지 않았습니다!", "error");
      }
    });
    
    log(`지점 버튼 ${index + 1} 이벤트 등록 완료`);
  });
}

/**
 * 🔧 누락된 함수 정의 (빈 함수로 에러 방지)
 */
function setupMonthlyButtons() {
  const { log } = window.WorktoolConfig.UTILS;
  log("setupMonthlyButtons: 현재 구현되지 않음");
  // TODO: 추후 월별 버튼 기능이 필요하면 여기에 구현
}

/**
 * 🚀 컴포넌트 시스템 초기화
 */
function initializeComponents() {
  const { DATA_URLS } = window.WorktoolConfig;
  const { log } = window.WorktoolConfig.UTILS;

  log("컴포넌트 시스템 초기화 시작");

  // DOM 요소 초기화
  initializeElements();

  // 이벤트 핸들러 설정
  setupMainButtons();
  setupBranchButtons();
  setupMonthlyButtons(); // 🔧 빈 함수로 에러 방지

  // 초기 페이지 로드
  if (DATA_URLS.button1) {
    updateFrame(DATA_URLS.button1);
  } else {
    log("기본 페이지 URL을 찾을 수 없습니다!", "error");
  }

  // 초기 상태 설정
  shinIsStaffMode = false;
  updateShinLabel();

  log("컴포넌트 시스템 초기화 완료");
}

// 🌍 전역 함수로 내보내기
window.WorktoolComponents = {
  initializeComponents,
  updateFrame,
  activateButton,
  showShin,
  showCommon,
  updateShinLabel,
};