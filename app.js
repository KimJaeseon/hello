document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const greetingForm = document.getElementById('greeting-form');
  const nameInput = document.getElementById('name-input');
  const nameError = document.getElementById('name-error');
  const inputScreen = document.getElementById('input-screen');
  const greetingScreen = document.getElementById('greeting-screen');
  const greetingHeading = document.getElementById('greeting-heading');
  const greetingMessage = document.getElementById('greeting-message');
  const backBtn = document.getElementById('back-btn');
  const moodButtons = document.querySelectorAll('.mood-btn');

  // State Variables
  let userName = '';
  let activeMood = 'default';

  // Greeting database categorized by Time and Mood
  const greetings = {
    morning: {
      default: '좋은 아침입니다. 활기차고 기분 좋은 하루를 준비해 보세요.',
      energetic: '좋은 아침! 에너지가 솟구치는 상쾌한 아침이에요. 오늘 하루도 힘차게 파이팅!',
      calm: '차분하고 고요한 아침입니다. 오늘 하루는 서두르지 말고 평온하게 시작해 보세요.',
      professional: '안녕하십니까. 활기찬 아침 시간 되시기 바라며, 오늘 계획하신 모든 일이 원활하게 이루어지기를 기원합니다.'
    },
    afternoon: {
      default: '나른해지기 쉬운 오후 시간입니다. 시원한 물 한 잔 마시며 가벼운 휴식을 취해 보세요.',
      energetic: '즐거운 오후 보내고 계시나요? 넘치는 에너지와 함께 남은 시간도 활기차게 달려봐요!',
      calm: '부드러운 햇살처럼 평온한 오후입니다. 잠시 눈을 감고 깊은 호흡으로 숨을 고르며 여유를 느껴보세요.',
      professional: '바쁘신 일정 중에도 잠시 휴식을 취하시며 편안한 오후 시간을 보내시기를 바랍니다.'
    },
    evening: {
      default: '오늘 하루도 수고 많으셨습니다. 편안하고 따뜻한 저녁 시간 보내세요.',
      energetic: '오늘 하루 참 고생 많았어요! 즐거운 저녁을 맞이하여 기분 좋게 힐링하고 에너지를 충전하세요!',
      calm: '조용히 하루를 매듭짓는 저녁입니다. 오늘 받은 스트레스와 긴장은 모두 내려놓고 차분히 쉬어가세요.',
      professional: '오늘 하루 노고에 깊이 감사드리며, 소중한 분들과 함께 편안하고 유익한 저녁 시간 보내시기 바랍니다.'
    },
    night: {
      default: '오늘 하루의 끝자락이네요. 포근한 밤 보내시고 기분 좋은 꿈을 꾸세요.',
      energetic: '깊은 밤이네요! 남은 하루도 기분 좋게 정리하고, 내일의 새로운 시작을 위해 푹 주무세요!',
      calm: '고요하고 평화로운 밤입니다. 복잡했던 생각들을 비우고 깊고 편안한 숙면을 취하시길 바랍니다.',
      professional: '오늘 하루 수고 많으셨습니다. 편안하고 안락한 밤 되시기를 진심으로 바랍니다.'
    }
  };

  /**
   * Determine the current time of day
   * @returns {string} 'morning' | 'afternoon' | 'evening' | 'night'
   */
  function getTimeOfDay() {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 17) return 'afternoon';
    if (hours >= 17 && hours < 22) return 'evening';
    return 'night';
  }

  /**
   * Dynamic greeting builder
   */
  function renderGreeting() {
    const timeOfDay = getTimeOfDay();
    
    // Set dynamic greeting text
    greetingHeading.textContent = `안녕하세요, ${userName}님!`;
    greetingMessage.textContent = greetings[timeOfDay][activeMood];
  }

  /**
   * Apply mood theme CSS class and adjust button ARIA states
   * @param {string} mood - Selected mood string
   */
  function setMood(mood) {
    activeMood = mood;

    // Reset mood classes on body
    document.body.className = '';
    
    // Add new mood class if not default
    if (mood !== 'default') {
      document.body.classList.add(`mood-${mood}`);
    }

    // Update ARIA states of buttons
    moodButtons.forEach(btn => {
      const isSelected = btn.dataset.mood === mood;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      if (isSelected) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Re-render message for updated tone
    renderGreeting();
  }

  // Handle Form Submission
  greetingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputVal = nameInput.value.trim();

    // 1. Validation check
    if (inputVal === '') {
      nameInput.setAttribute('aria-invalid', 'true');
      nameError.textContent = '⚠️ 이름을 한 글자 이상 입력해 주세요.';
      nameInput.focus();
      return;
    }

    // Clear previous errors
    nameInput.removeAttribute('aria-invalid');
    nameError.textContent = '';
    
    // 2. Set State
    userName = inputVal;
    renderGreeting();

    // 3. Screen transition
    inputScreen.classList.add('hidden');
    greetingScreen.classList.remove('hidden');

    // 4. Critical A11y: Move focus to heading of the new screen
    // This allows screen readers to immediately announce the new screen state
    setTimeout(() => {
      greetingHeading.focus();
    }, 100);
  });

  // Handle "Go Back" button click
  backBtn.addEventListener('click', () => {
    // 1. Screen transition
    greetingScreen.classList.add('hidden');
    inputScreen.classList.remove('hidden');

    // 2. Reset input and mood to default
    nameInput.value = '';
    setMood('default');

    // 3. Critical A11y: Move focus back to the input element so the user can easily restart
    setTimeout(() => {
      nameInput.focus();
    }, 100);
  });

  // Handle Mood Button Clicks
  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      setMood(mood);
    });
  });

  // Basic Keyboard support for input field: pressing enter submits the form (default browser behavior, but ensure A11y is maintained)
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      nameError.textContent = ''; // clear error on fresh submission attempt
    }
  });
});
