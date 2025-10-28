<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row class="no-gutters fill-height">
      <!-- 워크플로우 사이드바 -->
      <WorkflowSidebar
        :scenarios="scenarios"
        :current-scenario="currentScenario"
        :selected-step="selectedStep"
        @select-scenario="loadScenario"
        @select-step="handleStepClick"
      />

      <!-- 채팅 영역 -->
      <ChatArea
        ref="chatAreaRef"
        :messages="messages"
        :input-value="inputValue"
        :current-scenario="scenarios[currentScenario]"
        @update:input-value="inputValue = $event"
        @send-message="handleSend"
        @select-option="handleOptionClick"
      />


      <!-- 계약서 미리보기 -->
      <ContractPreview
        :contract-data="contractData"
      />
    </v-row>
  </v-container>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

import WorkflowSidebar from "@/pages/WorkflowSidebar.vue";
import ChatArea from "@/pages/ChatArea.vue";
import ContractPreview from "@/pages/ContractPreview.vue";

const emit = defineEmits(['hide-appbar', 'start-survey', 'restart-survey', 'continue-survey']);

const messages = ref([]);
const inputValue = ref('');
const currentScenario = ref(0);
const selectedStep = ref(null);
const contractData = ref({});
const chatAreaRef = ref(null);

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
  messages.value = scenarios.value[index].messages.filter(msg => msg.stepId === 1);
  contractData.value = { ...contractData.value, ...scenarios.value[index].contractUpdate };
  currentScenario.value = index;
  selectedStep.value = 1;
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
    if (chatAreaRef.value?.messagesContainer) {
      chatAreaRef.value.messagesContainer.scrollTop = chatAreaRef.value.messagesContainer.scrollHeight;
    }
  });
};

// 메시지 변경 감지
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

</script>

<style scoped>
/* 공통 스타일은 각 컴포넌트로 이동 */
</style>