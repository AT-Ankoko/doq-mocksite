<template>
  <v-container fluid class="pa-0 fill-height">
    <div class="d-flex fill-height bg-grey-lighten-4">
      <!-- 왼쪽: 플로우차트 & 시나리오 선택 -->
      <div class="workflow-sidebar bg-white border-e overflow-y-auto">
        <div class="px-6 py-4 border-b">
          <h2 class="text-h6 font-weight-bold text-grey-darken-4">워크플로우</h2>
          <p class="text-caption text-grey-darken-1 mt-1">대화 흐름도</p>
        </div>

        <!-- 시나리오 선택 탭 -->
        <div class="px-6 py-4 border-b bg-grey-lighten-4">
          <div class="d-flex flex-column ga-2">
            <v-btn
              v-for="(scenario, idx) in scenarios"
              :key="idx"
              @click="loadScenario(idx)"
              :variant="currentScenario === idx ? 'flat' : 'outlined'"
              :color="currentScenario === idx ? 'blue' : 'grey'"
              class="text-left justify-start pa-3"
              height="auto"
            >
              <div class="d-flex align-start ga-2 w-100">
                <v-icon 
                  :color="currentScenario === idx ? 'blue-darken-2' : 'grey'"
                  size="small"
                  class="mt-1"
                >
                  mdi-chevron-right
                </v-icon>
                <div class="flex-grow-1">
                  <div 
                    :class="[
                      'text-body-2 font-weight-bold',
                      currentScenario === idx ? 'text-blue-darken-4' : 'text-grey-darken-3'
                    ]"
                  >
                    {{ scenario.title }}
                  </div>
                  <div class="text-caption text-grey-darken-1 mt-1">
                    {{ scenario.description }}
                  </div>
                </div>
              </div>
            </v-btn>
          </div>
        </div>

        <!-- 플로우 블록 -->
        <div class="px-6 py-6 d-flex flex-column ga-3">
          <template v-for="(step, idx) in scenarios[currentScenario].steps" :key="step.id">
            <v-btn
              @click="handleStepClick(step.id)"
              :variant="selectedStep === step.id ? 'elevated' : 'flat'"
              :color="step.color.replace('bg-', '')"
              class="text-left justify-start pa-4 text-white"
              height="auto"
              :elevation="selectedStep === step.id ? 8 : 2"
            >
              <div class="w-100">
                <div class="d-flex align-center ga-2 mb-1">
                  <div class="step-number bg-white bg-opacity-30 rounded-circle d-flex align-center justify-center">
                    <span class="text-caption font-weight-bold">{{ idx + 1 }}</span>
                  </div>
                  <div class="text-body-2 font-weight-bold">{{ step.label }}</div>
                </div>
                <div class="text-caption opacity-90 ml-8">{{ step.subtitle }}</div>
              </div>
            </v-btn>
            
            <!-- 연결선 -->
            <div v-if="idx < scenarios[currentScenario].steps.length - 1" class="d-flex justify-center py-1">
              <div class="connector-line bg-grey-lighten-1"></div>
            </div>
          </template>
        </div>
      </div>

      <!-- 중앙: 채팅 영역 -->
      <div class="chat-area d-flex flex-column flex-grow-1">
        <!-- 헤더 -->
        <div class="bg-white border-b px-6 py-4 d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <v-avatar color="blue-darken-2" size="40" rounded="lg">
              <v-icon color="white" size="24">mdi-file-document-outline</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h6 font-weight-bold text-grey-darken-4">DoQ</h1>
              <p class="text-caption text-grey-darken-1">용역계약서 작성 도우미</p>
            </div>
          </div>
          <div class="text-body-2">
            <span class="font-weight-medium text-grey-darken-3">{{ scenarios[currentScenario].name }}</span>
            <span class="text-grey ml-2">• {{ scenarios[currentScenario].title }}</span>
          </div>
        </div>

        <!-- 메시지 영역 -->
        <div class="messages-container flex-grow-1 overflow-y-auto px-6 py-6" ref="messagesContainer">
          <div class="d-flex flex-column ga-4">
            <div
              v-for="(msg, idx) in messages"
              :key="idx"
              :class="['d-flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
            >
              <div
                :class="[
                  'message-bubble pa-4',
                  msg.role === 'user' ? 'bg-blue-darken-2 text-white' : 'bg-white border'
                ]"
              >
                <p class="text-body-2 message-text">{{ msg.content }}</p>
                
                <div v-if="msg.options" class="mt-3 d-flex flex-column ga-2">
                  <v-btn
                    v-for="(option, optIdx) in msg.options"
                    :key="optIdx"
                    @click="handleOptionClick(option)"
                    variant="outlined"
                    color="grey-darken-1"
                    class="text-left justify-start text-body-2"
                    height="auto"
                  >
                    {{ optIdx + 1 }}. {{ option }}
                  </v-btn>
                </div>
                
                <div v-if="msg.confirmed" class="mt-2 d-flex align-center ga-1 text-green-darken-2">
                  <v-icon size="16" color="green-darken-2">mdi-check</v-icon>
                  <span class="text-caption font-weight-medium">조항 확정됨</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 입력 영역 -->
        <div class="bg-white border-t px-6 py-4">
          <div class="d-flex ga-3 mx-auto" style="max-width: 1024px;">
            <v-text-field
              v-model="inputValue"
              @keypress.enter="handleSend"
              placeholder="메시지를 입력하세요..."
              variant="outlined"
              density="comfortable"
              hide-details
              class="flex-grow-1"
            ></v-text-field>
            <v-btn
              @click="handleSend"
              color="blue-darken-2"
              size="large"
              icon
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 문서 미리보기 -->
      <div class="preview-sidebar bg-white border-s d-flex flex-column">
        <div class="px-6 py-4 border-b">
          <h2 class="text-h6 font-weight-bold text-grey-darken-4">계약서 미리보기</h2>
          <p class="text-caption text-grey-darken-1 mt-1">실시간으로 업데이트됩니다</p>
        </div>
        
        <div class="flex-grow-1 overflow-y-auto px-6 py-6">
          <div class="d-flex flex-column ga-6 text-body-2">
            <div class="text-center pb-4 border-b">
              <h3 class="text-h5 font-weight-bold text-grey-darken-4">용역 계약서</h3>
            </div>

            <div>
              <p class="text-grey-darken-2 text-justify">
                의뢰인(이하 "갑")과 작업자(이하 "을")는 다음과 같이 용역 계약을 체결한다.
              </p>
            </div>

            <div class="d-flex flex-column ga-4">
              <div>
                <h4 class="font-weight-bold text-grey-darken-4 mb-2">제1조 (목적)</h4>
                <p class="text-grey-darken-2 text-justify">
                  본 계약은 갑이 을에게 의뢰한 용역의 수행에 관한 제반사항을 정함을 목적으로 한다.
                </p>
              </div>

              <div>
                <h4 class="font-weight-bold text-grey-darken-4 mb-2">제2조 (용역의 내용)</h4>
                <p class="text-grey-darken-2 text-justify">
                  {{ contractData.workContent || '(작성 중)' }}
                </p>
              </div>

              <div :class="contractData.period ? 'bg-yellow-lighten-4 pa-3 rounded' : ''">
                <h4 class="font-weight-bold text-grey-darken-4 mb-2">제3조 (용역 기간)</h4>
                <p class="text-grey-darken-2 text-justify">
                  {{ contractData.period || '(작성 중)' }}
                </p>
              </div>

              <div>
                <h4 class="font-weight-bold text-grey-darken-4 mb-2">제4조 (계약 대금)</h4>
                <p class="text-grey-darken-2 text-justify">
                  {{ contractData.payment || '(작성 중)' }}
                </p>
              </div>

              <div :class="contractData.copyright ? 'bg-yellow-lighten-4 pa-3 rounded' : ''">
                <h4 class="font-weight-bold text-grey-darken-4 mb-2">제5조 (지식재산권)</h4>
                <p class="text-grey-darken-2 text-justify">
                  {{ contractData.copyright || '(작성 중)' }}
                </p>
              </div>

              <div>
                <h4 class="font-weight-bold text-grey-darken-4 mb-2">제6조 (기타사항)</h4>
                <p class="text-grey-darken-2 text-justify">
                  본 계약서에 명시되지 않은 사항은 관련 법령 및 상관례에 따른다.
                </p>
              </div>
            </div>

            <div class="pt-8 d-flex flex-column ga-4 text-center border-t">
              <p class="text-grey-darken-2">20__년 __월 __일</p>
              <div class="d-flex flex-column ga-2">
                <p class="text-grey-darken-3 font-weight-medium">갑 (의뢰인): _______________ (인)</p>
                <p class="text-grey-darken-3 font-weight-medium">을 (작업자): _______________ (인)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

const emit = defineEmits(['hide-appbar', 'start-survey', 'restart-survey', 'continue-survey']);

const messages = ref([]);
const inputValue = ref('');
const currentScenario = ref(0);
const selectedStep = ref(null);
const contractData = ref({});
const messagesContainer = ref(null);

const scenarios = ref([
  // 시나리오 1: 명확한 자연어 제시
  {
    name: '시나리오 1',
    title: '명확한 자연어 제시',
    description: '사용자가 구체적인 날짜나 정보를 명확하게 제공',
    steps: [
      { id: 1, type: 'start', label: 'AI 조항 질문', subtitle: '작업 기간은?', color: 'blue' },
      { id: 2, type: 'user', label: 'User 명확한 응답', subtitle: '11/1 ~ 11/14', color: 'green' },
      { id: 3, type: 'ai', label: 'AI 변환 및 확인', subtitle: '맞으신가요?', color: 'purple' },
      { id: 4, type: 'user', label: 'User 수락', subtitle: '네, 맞아요', color: 'green' },
      { id: 5, type: 'end', label: '조항 확정', subtitle: '완료', color: 'teal-darken-2' }
    ],
    messages: [
      { role: 'ai', content: '안녕하세요, DoQ입니다. 계약서 초안 작성을 시작하겠습니다. 먼저, 용역(작업) 기간은 언제인가요?', stepId: 1 },
      { role: 'user', content: '11월 1일부터 11월 14일까지요.', stepId: 2 },
      { role: 'ai', content: '네. 제3조 (용역 기간) 항목에 "2024년 11월 1일부터 2024년 11월 14일까지 (총 14일)"로 명시합니다. 이 내용이 맞으신가요?', needsConfirm: true, stepId: 3 },
      { role: 'user', content: '네, 맞아요.', stepId: 4 },
      { role: 'ai', content: '좋습니다. \'용역 기간\' 조항이 확정되었습니다. 다음으로, 계약 \'대금\'은 얼마로 정하셨나요?', confirmed: true, stepId: 5 }
    ],
    contractUpdate: { period: '2024년 11월 1일부터 2024년 11월 14일까지 (총 14일)' }
  },
  // 시나리오 2: 모호한 응답
  {
    name: '시나리오 2',
    title: '모호한 응답',
    description: '사용자가 모호한 답변을 하여 명확화 필요',
    steps: [
      { id: 1, type: 'start', label: 'AI 조항 질문', subtitle: '작업 기간은?', color: 'blue' },
      { id: 2, type: 'user', label: 'User 모호한 응답', subtitle: '2주 정도...', color: 'yellow-darken-2' },
      { id: 3, type: 'ai', label: 'AI 다지선다 제공', subtitle: '옵션 선택', color: 'purple' },
      { id: 4, type: 'user', label: 'User 옵션 선택', subtitle: '2번 선택', color: 'green' },
      { id: 5, type: 'end', label: '조항 확정', subtitle: '완료', color: 'teal-darken-2' }
    ],
    messages: [
      { role: 'ai', content: '안녕하세요, DoQ입니다. 계약서 초안 작성을 시작하겠습니다. 먼저, 용역(작업) 기간은 언제인가요?', stepId: 1 },
      { role: 'user', content: '음... 다음 주부터 한 2주 정도 걸릴 것 같아요.', stepId: 2 },
      { 
        role: 'ai', 
        content: '\'2주\'의 기준을 명확히 하는 것이 좋습니다. 다음 중 어떤 것을 의미하시나요?',
        options: [
          '계약 체결일(오늘)로부터 14일',
          '작업 착수일(다음 주 월요일)로부터 14일',
          '기타 (직접 입력)'
        ],
        stepId: 3
      },
      { role: 'user', content: '2번으로 할게요.', stepId: 4 },
      { role: 'ai', content: '알겠습니다. 제3조 (용역 기간) 항목에 "작업 착수일(YYYY년 MM월 DD일)로부터 14일"로 명시합니다. 조항이 확정되었습니다. 다음으로, 계약 \'대금\'은 얼마로 정하셨나요?', confirmed: true, stepId: 5 }
    ],
    contractUpdate: { period: '작업 착수일(YYYY년 MM월 DD일)로부터 14일' }
  },
  // 시나리오 3: 용어 질문
  {
    name: '시나리오 3',
    title: '용어 질문',
    description: '사용자가 용어나 개념에 대해 질문',
    steps: [
      { id: 1, type: 'start', label: 'AI 조항 질문', subtitle: '저작권은?', color: 'blue' },
      { id: 2, type: 'user', label: 'User 용어 질문', subtitle: '그게 뭐예요?', color: 'orange' },
      { id: 3, type: 'ai', label: 'AI 용어 설명', subtitle: '개념 안내', color: 'pink' },
      { id: 4, type: 'ai', label: 'AI 질문 재제시', subtitle: '다시 질문', color: 'purple' },
      { id: 5, type: 'user', label: 'User 옵션 선택', subtitle: '1번 선택', color: 'green' },
      { id: 6, type: 'end', label: '조항 확정', subtitle: '완료', color: 'teal-darken-2' }
    ],
    messages: [
      { role: 'ai', content: '이어서 지식재산권(저작권) 귀속 조항을 정하겠습니다. 작업하신 산출물의 저작권은 누가 가지게 되나요?', stepId: 1 },
      { role: 'user', content: '\'저작권 귀속\'이 정확히 무슨 뜻이에요?', stepId: 2 },
      { role: 'ai', content: '\'저작권 귀속\'이란, 완성된 작업물(예: 디자인 시안, 코드)을 법적으로 소유하고 자유롭게 사용할 수 있는 권리가 누구에게 있는지를 정하는 것입니다.', stepId: 3 },
      { 
        role: 'ai', 
        content: '다시 질문드립니다. 완성된 작업물의 저작권은 누가 가지게 되나요?',
        options: [
          '의뢰인 (돈을 주는 사람)',
          '작업자 (본인)',
          '공동 소유'
        ],
        stepId: 4
      },
      { role: 'user', content: '아, 이해했어요. 1번, 의뢰인이 갖는 걸로 해주세요.', stepId: 5 },
      { role: 'ai', content: '네. "모든 산출물의 지식재산권은 \'의뢰인(갑)\'에게 귀속된다"로 명시합니다. 조항이 확정되었습니다. 다음으로...', confirmed: true, stepId: 6 }
    ],
    contractUpdate: { copyright: '모든 산출물의 지식재산권은 \'의뢰인(갑)\'에게 귀속됨' }
  }
]);


// ----- 라이프 사이클 ----- //
onMounted(() => {
  emit('hide-appbar');
  loadScenario(0);
});

onUnmounted(() => {

});


// ----- 함수 정의 ----- //
const loadScenario = (index) => {
  messages.value = [...scenarios.value[index].messages];
  contractData.value = { ...contractData.value, ...scenarios.value[index].contractUpdate };
  currentScenario.value = index;
  selectedStep.value = null;
};

const handleStepClick = (stepId) => {
  selectedStep.value = stepId;
  const filteredMessages = scenarios.value[currentScenario.value].messages.filter(
    msg => msg.stepId <= stepId
  );
  messages.value = [...filteredMessages];
};

const handleSend = () => {
  if (!inputValue.value.trim()) return;
  
  const newMessage = { role: 'user', content: inputValue.value };
  messages.value.push(newMessage);
  inputValue.value = '';
  scrollToBottom();
};

const handleOptionClick = (option) => {
  const newMessage = { role: 'user', content: option };
  messages.value.push(newMessage);
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 메시지 변경 감지
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

</script>

<style scoped>
.workflow-sidebar {
  width: 320px;
  min-width: 320px;
}

.preview-sidebar {
  width: 384px;
  min-width: 384px;
}

.chat-area {
  min-width: 0;
}

.message-bubble {
  max-width: 672px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.step-number {
  width: 24px;
  height: 24px;
  font-size: 11px;
}

.connector-line {
  width: 2px;
  height: 16px;
}

.messages-container {
  scroll-behavior: smooth;
}

.border-s {
  border-inline-start: 1px solid rgba(0, 0, 0, 0.12);
}

.border-e {
  border-inline-end: 1px solid rgba(0, 0, 0, 0.12);
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>