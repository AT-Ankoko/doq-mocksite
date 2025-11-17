<template>
  <v-container fluid class="pa-0 | fill-height">
    <v-row no-gutters class="fill-height">
      
      <v-col cols="auto | synario-border">
        <v-row no-gutters class="synario-box">
          시연을 돕기 위한 시나리오 실행기입니다.
        </v-row>
        <WorkflowSidebar
          :scenarios="scenarios"
          :current-scenario="currentScenario"
          :selected-step="selectedStep"
          @select-scenario="loadScenario"
          @select-step="handleStepClick"
          />
      </v-col>

      <v-col cols="auto">
        <v-sheet
          width="54"
          class="d-flex | flex-column | align-center | ga-3 | pa-2 | fill-height" color="white"
          :style="{
            'border-top-right-radius': '24px',
            'border-bottom-right-radius': '24px'
          }"
        >
          <v-icon class="mt-6 | mb-12">
            <v-img
              src="@/assets/logo.svg"
              width="30" height="30"
            ></v-img>
          </v-icon>

          <v-btn
            icon="mdi-magnify"
            density="comfortable"
            variant="tonal"
            color="#51A1FF"
          ></v-btn>
          
          <v-spacer></v-spacer>

          <v-btn
            icon="mdi-cog-outline"
            density="comfortable"
            variant="tonal"
            color="#51A1FF"
          ></v-btn>
          
          <v-btn
            class="mt-6 | mb-6"
            icon="mdi-account-circle-outline"
            density="comfortable"
            variant="tonal"
            color="#51A1FF"
          ></v-btn>
        </v-sheet>
      </v-col>
      
      <v-col class="d-flex | flex-column" style="overflow-y: hidden; max-height: 1000px;">
            <ChatArea
                ref="chatAreaRef"
                :messages="messages"
                :input-value="inputValue"
                :current-scenario="scenarios[currentScenario]"
                :participants="participants"
                :selected-sender="selectedSender"
                @update:input-value="inputValue = $event"
                @update:selected-sender="selectedSender = $event"
                @send-message="handleSend"
                @select-option="handleOptionClick"
              />
      </v-col>
      
      <v-col 
        cols="auto" class="d-flex | flex-column | mt-6 | mb-6 | mr-6" 
        style="overflow-y: hidden; border-radius: 24px;"
      >
        <ContractPreview
          :contract-data="contractData"
          class="fill-height" style="overflow-y: auto" 
        />
      </v-col>

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

// 참가자 설정 (중계자 + 2인 참가자)
const participants = ref([
  { id: 'participantA', name: '참가자 A' },
  { id: 'participantB', name: '참가자 B' }
]);
const selectedSender = ref(participants.value[0].id);

const scenarios = ref([
  // 시나리오 1
  {
    name: '시나리오 1',
    title: '#S1 명확한 응답',
    description: '사용자가 구체적인 날짜나 정보를 명확하게 제공',
    steps: [
      { id: 1, type: 'start', label: 'AI 조항 질문'},
      { id: 2, type: 'user', label: 'User 응답', subtitle: '명확한 응답' },
      { id: 3, type: 'ai', label: 'AI 변환 및 확인' },
      { id: 4, type: 'user', label: 'User 수락' },
      { id: 5, type: 'end', label: '조항 확정' },
      { id: 6, type: 'start', label: 'AI 조항 질문' }
    ],
    messages: [
    { role: 'ai', content: '안녕하세요, DoQ입니다. 계약서 초안을 함께 작성하겠습니다. 먼저, 용역(작업) 기간을 알려주시겠어요?', stepId: 1 },
  { role: 'participantA', content: '11월 1일부터 11월 14일까지로 진행하면 됩니다.', stepId: 2 },
    { role: 'ai', content: '그럼 제3조(용역 기간)에 "2024년 11월 1일부터 2024년 11월 14일까지 (총 14일)"로 기재하겠습니다. 이 내용으로 확정할까요?', needsConfirm: true, stepId: 3 },
  { role: 'participantB', content: '네, 저도 동의합니다.', stepId: 4 },
    { role: 'ai', content: '확인했습니다. 용역 기간 조항을 확정했습니다.', confirmed: true, stepId: 5 },
    { role: 'ai', content: '다음은 계약 대금 관련입니다. 대금을 어떻게 정하셨나요?', stepId: 6 }
    ],
    // 조항 확정 시점(stepId)과 업데이트할 데이터
    contractUpdates: [
      { stepId: 5, data: { period: '2024년 11월 1일부터 2024년 11월 14일까지 (총 14일)' } }
    ]
  },
  // 시나리오 2: 모호한 응답
  {
    name: '시나리오 2',
    title: '#S2 모호한 응답',
    description: '사용자가 모호한 답변을 하여 명확화 필요',
    steps: [
      { id: 1, type: 'start', label: 'AI 조항 질문'},
      { id: 2, type: 'user', label: 'User 응답', subtitle: '모호한 응답' },
      { id: 3, type: 'ai', label: 'AI 다지선다 제공', subtitle: '옵션 선택' },
      { id: 4, type: 'user', label: 'User 옵션 선택', subtitle: '2번 선택' },
      { id: 5, type: 'end', label: '조항 확정' },
      { id: 6, type: 'start', label: 'AI 조항 질문'}
    ],
    messages: [
    { role: 'ai', content: '안녕하세요, DoQ입니다. 계약서 초안 작성을 시작하겠습니다. 먼저, 용역(작업) 기간은 언제부터 시작하나요?', stepId: 1 },
  { role: 'participantA', content: '다음 주 월요일부터 약 2주 정도 소요될 것 같습니다.', stepId: 2 },
      { 
        role: 'ai', 
        content: '"2주"를 어떻게 계산할지 선택해 주세요. 아래 중 하나를 골라주세요.',
        options: [
          '계약 체결일(오늘)로부터 14일',
          '작업 착수일(다음 주 월요일)로부터 14일',
          '기타 (직접 입력)'
        ],
        stepId: 3
      },
  { role: 'participantB', content: '2번(작업 착수일부터 14일)으로 할게요.', stepId: 4 },
      { role: 'ai', content: '알겠습니다. 제3조에 "작업 착수일(YYYY년 MM월 DD일)로부터 14일"로 명시하겠습니다. 해당 조항을 확정합니다.', confirmed: true, stepId: 5 },
      { role: 'ai', content: '다음으로, 계약 \'대금\'은 얼마로 정하셨나요?', stepId: 6 }
    ],
    contractUpdates: [
      { stepId: 5, data: { period: '작업 착수일(YYYY년 MM월 DD일)로부터 14일' } }
    ]
  },
  // 시나리오 3: 용어 질문
  {
    name: '시나리오 3',
    title: '#S3 질문',
    description: '사용자가 용어나 개념에 대해 질문',
    steps: [
      { id: 1, type: 'start', label: 'AI 조항 질문' },
      { id: 2, type: 'user', label: 'User 응답', subtitle: '키워드 질문' },
      { id: 3, type: 'ai', label: 'AI 용어 설명' },
      { id: 4, type: 'ai', label: 'AI 질문 재제시' },
      { id: 5, type: 'user', label: 'User 옵션 선택', subtitle: '1번 선택' },
      { id: 6, type: 'end', label: '조항 확정' },
      { id: 7, type: 'start', label: 'AI 조항 질문' }
    ],
    messages: [
    { role: 'ai', content: '이어서 지식재산권(저작권) 관련 조항을 정하겠습니다. 작업물의 저작권은 누구에게 귀속되도록 하시겠어요?', stepId: 1 },
  { role: 'participantA', content: '"저작권 귀속"이 정확히 무슨 의미인가요?', stepId: 2 },
    { role: 'ai', content: '간단히 말하면, 완성된 산출물을 법적으로 소유하고 사용할 권리를 누가 가지는지 정하는 항목입니다. (예: 의뢰인 또는 작업자)', stepId: 3 },
      { 
        role: 'ai', 
        content: '완성된 작업물의 저작권을 누구에게 귀속시킬지 선택해 주세요.',
        options: [
          '의뢰인 (돈을 주는 사람)',
          '작업자 (본인)',
          '공동 소유'
        ],
        stepId: 4
      },
  { role: 'participantB', content: '네, 1번(의뢰인)으로 해주세요.', stepId: 5 },
      { role: 'ai', content: '네. 모든 산출물의 지식재산권은 의뢰인(갑)에게 귀속된다고 명시했습니다. 조항을 확정합니다.', confirmed: true, stepId: 6 },
      { role: 'ai', content: '다음으로...', stepId: 7 }
    ],
    contractUpdates: [
      { stepId: 6, data: { copyright: '모든 산출물의 지식재산권은 \'의뢰인(갑)\'에게 귀속됨' } }
    ]
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
function loadScenario(index) {
  // 초기 메시지는 stepId === 1인 메시지들만 불러와 역할 매핑
  const scenario = scenarios.value[index];
  messages.value = scenario.messages
    .filter(msg => msg.stepId === 1)
    .map(msg => ({
      // 매핑: 기존 'ai' 역할을 중계자('mediator')로 표시, 기존 'user'는 참가자 A로 매핑
      role: msg.role === 'ai' ? 'mediator' : (msg.role === 'user' ? participants.value[0].id : msg.role),
      content: msg.content,
      stepId: msg.stepId,
      options: msg.options,
      confirmed: msg.confirmed,
      needsConfirm: msg.needsConfirm
    }));
  contractData.value = {}; // 시나리오 변경 시 계약 데이터 초기화
  currentScenario.value = index;
  selectedStep.value = 1;
}

function handleStepClick(stepId) {
  selectedStep.value = stepId;
  const scenario = scenarios.value[currentScenario.value];
  
  // 선택한 stepId까지의 메시지 필터링 및 역할 매핑
  const filteredMessages = scenario.messages
    .filter(msg => msg.stepId <= stepId)
    .map(msg => ({
      role: msg.role === 'ai' ? 'mediator' : (msg.role === 'user' ? participants.value[0].id : msg.role),
      content: msg.content,
      stepId: msg.stepId,
      options: msg.options,
      confirmed: msg.confirmed
    }));
  messages.value = [...filteredMessages];
  
  // 계약 데이터 업데이트 (해당 stepId까지의 모든 업데이트 적용)
  updateContractData(stepId);
}

function updateContractData(stepId) {
  const scenario = scenarios.value[currentScenario.value];
  
  // 계약 데이터 초기화
  const newContractData = {};
  
  // 현재 stepId까지의 모든 contractUpdates 적용
  if (scenario.contractUpdates) {
    scenario.contractUpdates.forEach(update => {
      if (update.stepId <= stepId) {
        Object.assign(newContractData, update.data);
      }
    });
  }
  
  contractData.value = newContractData;
}

function handleSend(payload) {
  // payload: { content, sender }
  if (!payload || !payload.content || !payload.content.trim()) return;

  const scenario = scenarios.value[currentScenario.value];

  // 마지막 stepId 계산
  const prevMaxStep = messages.value.reduce((acc, m) => Math.max(acc, m.stepId || 0), 0);

  // 참가자(보낸 사람) 메시지 추가
  messages.value.push({ role: payload.sender, content: payload.content, stepId: prevMaxStep + 1 });

  // 부모(채팅 입력 컴포넌트)가 input을 관리하므로 초기화 요청
  inputValue.value = '';

  // 중계자(시나리오의 ai)가 응답해야 하는 경우 찾아 추가
  // 우선적으로 동일 stepId에서 ai 역할 메시지를 찾음
  let aiMsg = scenario.messages.find(m => m.stepId === prevMaxStep + 1 && m.role === 'ai');
  if (!aiMsg) {
    // 없으면 그 다음 ai 메시지 중 가장 작은 stepId를 사용
    const futureAi = scenario.messages.filter(m => m.role === 'ai' && m.stepId > prevMaxStep);
    futureAi.sort((a, b) => a.stepId - b.stepId);
    aiMsg = futureAi[0];
  }

  if (aiMsg) {
    messages.value.push({ role: 'mediator', content: aiMsg.content, stepId: aiMsg.stepId, options: aiMsg.options, confirmed: aiMsg.confirmed, needsConfirm: aiMsg.needsConfirm });

    // 계약 데이터 업데이트가 필요한 경우 적용
    if (aiMsg.confirmed || (scenario.contractUpdates || []).some(u => u.stepId === aiMsg.stepId)) {
      updateContractData(aiMsg.stepId);
    }
  }

  scrollToBottom();
}

function handleOptionClick(option) {
  // 옵션 선택도 발신자(현재 선택된 참가자)로 메시지를 추가
  const sender = selectedSender.value || participants.value[0].id;
  const prevMaxStep = messages.value.reduce((acc, m) => Math.max(acc, m.stepId || 0), 0);
  messages.value.push({ role: sender, content: option, stepId: prevMaxStep + 1 });

  // 이후 중계자 응답 처리 (유사 로직)
  const scenario = scenarios.value[currentScenario.value];
  let aiMsg = scenario.messages.find(m => m.stepId === prevMaxStep + 1 && m.role === 'ai');
  if (!aiMsg) {
    const futureAi = scenario.messages.filter(m => m.role === 'ai' && m.stepId > prevMaxStep);
    futureAi.sort((a, b) => a.stepId - b.stepId);
    aiMsg = futureAi[0];
  }

  if (aiMsg) {
    messages.value.push({ role: 'mediator', content: aiMsg.content, stepId: aiMsg.stepId, options: aiMsg.options, confirmed: aiMsg.confirmed });
    if (aiMsg.confirmed || (scenario.contractUpdates || []).some(u => u.stepId === aiMsg.stepId)) {
      updateContractData(aiMsg.stepId);
    }
  }

  scrollToBottom();
}

function scrollToBottom() {
  nextTick(() => {
    if (chatAreaRef.value?.messagesContainer) {
      chatAreaRef.value.messagesContainer.scrollTop = chatAreaRef.value.messagesContainer.scrollHeight;
    }
  });
}

// 메시지 변경 감지
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

</script> 

<style scoped>
.synario-box {
  justify-content: center;
  padding: 12px;
  background-color: #000000;
  color: #FFFFFF;
}

.synario-border {
  border: solid 3px #000000;
}
</style>