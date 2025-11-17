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
  // 시나리오 1: 설득 과정
  {
    name: '시나리오 1',
    title: '#S1 설득의 과정',
    description: '참가자 A 제시 → 참가자 B 우려 → DoQ 중재 → 합의',
    steps: [
      { id: 1, type: 'start', label: 'DoQ 조항 질문'},
      { id: 2, type: 'user', label: '참가자 A 응답', subtitle: '기간 제시' },
      { id: 3, type: 'user', label: '참가자 B 질문', subtitle: '우려 제기' },
      { id: 4, type: 'ai', label: 'DoQ 중재', subtitle: '타당성 검토' },
      { id: 5, type: 'user', label: '참가자 A 설명', subtitle: '이유 설명' },
      { id: 6, type: 'ai', label: 'DoQ 제안', subtitle: '수정 안내' },
      { id: 7, type: 'user', label: '참가자 B 동의', subtitle: '합의' },
      { id: 8, type: 'end', label: '조항 확정' },
      { id: 9, type: 'start', label: 'DoQ 다음 질문' }
    ],
    messages: [
    { role: 'ai', content: '안녕하세요, DoQ입니다. 계약서 초안을 함께 작성하겠습니다. 먼저, 용역(작업) 기간을 어떻게 정하실 생각이세요?', stepId: 1 },
  { role: 'participantA', content: '11월 1일부터 11월 14일까지, 총 14일 일정으로 진행하면 될 것 같습니다.', stepId: 2 },
  { role: 'participantB', content: '잠깐, 11월 1일부터라는 게... 내일부터 바로 시작한다는 뜻인가요? 그건 좀 빠른 것 같은데요.', stepId: 3 },
    { role: 'ai', content: '좋은 지적입니다. 보통 계약서 체결 후 준비 기간을 두는 것이 일반적입니다. 참가자 A님, 실제 작업 시작은 언제부터 예상하시나요?', stepId: 4 },
  { role: 'participantA', content: '아, 제가 설명을 잘못 드렸네요. 계약 체결 후 3일의 준비 기간을 거쳐서 11월 4일부터 실제 작업을 시작할 계획입니다.', stepId: 5 },
    { role: 'ai', content: '감사합니다. 그렇다면 제3조에 "실제 작업 착수일: 2024년 11월 4일, 종료일: 2024년 11월 17일 (총 14일)"로 기재하겠습니다. 이렇게 하면 양측 모두 명확하지 않을까요?', stepId: 6 },
  { role: 'participantB', content: '네, 그렇게 하면 좋겠습니다. 준비 기간이 있으니까 더 안심이 됩니다.', stepId: 7 },
    { role: 'ai', content: '감사합니다. 용역 기간 조항을 확정했습니다.', confirmed: true, stepId: 8 },
    { role: 'ai', content: '다음은 계약 대금입니다. 대금 규모와 지급 방식은 어떻게 정하셨나요?', stepId: 9 }
    ],
    contractUpdates: [
      { stepId: 8, data: { period: '실제 작업 착수일: 2024년 11월 4일, 종료일: 2024년 11월 17일 (총 14일)' } }
    ]
  },
  // 시나리오 2: 협상 과정
  {
    name: '시나리오 2',
    title: '#S2 협상의 흐름',
    description: '모호한 응답 → 각 참가자 의견 → DoQ 설명 → 옵션 선택 → 확정',
    steps: [
      { id: 1, type: 'start', label: 'DoQ 조항 질문'},
      { id: 2, type: 'user', label: '참가자 A 응답', subtitle: '모호한 응답' },
      { id: 3, type: 'user', label: '참가자 B 의견', subtitle: '우려 표시' },
      { id: 4, type: 'ai', label: 'DoQ 설명', subtitle: '각 방식 설명' },
      { id: 5, type: 'user', label: '참가자 A 의견', subtitle: '입장 표현' },
      { id: 6, type: 'user', label: '참가자 B 제안', subtitle: '절충안 제시' },
      { id: 7, type: 'ai', label: 'DoQ 조정', subtitle: '결정 안내' },
      { id: 8, type: 'user', label: '참가자 A 동의', subtitle: '합의' },
      { id: 9, type: 'end', label: '조항 확정' },
      { id: 10, type: 'start', label: 'DoQ 다음 질문' }
    ],
    messages: [
    { role: 'ai', content: '다음으로, 용역 기간의 계산 기준을 정하겠습니다. 언제부터 계산을 시작하시는 것이 좋을까요?', stepId: 1 },
  { role: 'participantA', content: '계약이 서명되는 날부터 2주일... 아니면 실제 작업을 시작하는 날부터... 글쎄요, 둘 다 가능할 것 같기도 하고...', stepId: 2 },
  { role: 'participantB', content: '음, 계약 체결일부터 바로 2주라고 하면, 우리는 준비하는 동안 기간이 줄어드는 것 아닌가요?', stepId: 3 },
    { role: 'ai', content: '좋은 질문입니다. 두 가지 방식이 있습니다. ① "계약 체결일로부터 14일"은 계약 후 모든 기간을 포함하므로, 준비 시간이 필요하면 위험할 수 있습니다. ② "작업 착수일로부터 14일"은 실제 작업에 필요한 시간만 확보합니다.', stepId: 4 },
  { role: 'participantA', content: '아, 그렇다면 ②번이 더 안전하겠네요. 혹시 도중에 문제가 생기면 기간이 부족할 수 있으니까요.', stepId: 5 },
  { role: 'participantB', content: '맞습니다. 그래서 저는 착수일부터 14일 계산하는 것을 제안합니다. 그렇게 하면 양쪽 모두 안심할 수 있을 테니까요.', stepId: 6 },
    { role: 'ai', content: '완벽한 합의입니다. 제3조에 "작업 착수일(2024년 11월 4일)로부터 14일(11월 17일 종료)"로 확정하겠습니다.', stepId: 7 },
  { role: 'participantA', content: '네, 그렇게 진행해 주세요.', stepId: 8 },
    { role: 'ai', content: '기간 관련 조항을 확정했습니다.', confirmed: true, stepId: 9 },
    { role: 'ai', content: '이제 계약 대금에 대해 이야기해 보겠습니다. 대금 규모와 지급 방식은 어떻게 생각하시나요?', stepId: 10 }
    ],
    contractUpdates: [
      { stepId: 9, data: { period: '작업 착수일(2024년 11월 4일)로부터 14일(11월 17일 종료)' } }
    ]
  },
  // 시나리오 3: 의견 충돌과 합의
  {
    name: '시나리오 3',
    title: '#S3 의견 충돌 → 합의',
    description: '저작권 귀속 관련 참가자 의견 충돌 → DoQ 설명 → 이해 → 합의',
    steps: [
      { id: 1, type: 'start', label: 'DoQ 조항 질문' },
      { id: 2, type: 'user', label: '참가자 A 의견', subtitle: '작업자 중심' },
      { id: 3, type: 'user', label: '참가자 B 반박', subtitle: '의뢰인 중심' },
      { id: 4, type: 'ai', label: 'DoQ 설명', subtitle: '각 옵션 설명' },
      { id: 5, type: 'user', label: '참가자 A 재검토', subtitle: '의견 변화' },
      { id: 6, type: 'ai', label: 'DoQ 중재', subtitle: '합의 지점 찾기' },
      { id: 7, type: 'user', label: '참가자 B 수락', subtitle: '최종 동의' },
      { id: 8, type: 'end', label: '조항 확정' },
      { id: 9, type: 'start', label: 'DoQ 완료 메시지' }
    ],
    messages: [
    { role: 'ai', content: '이제 마지막 조항입니다. 지식재산권(저작권) 관련 항목입니다. 완성된 작업물의 저작권은 어떻게 정하시겠어요?', stepId: 1 },
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
  { role: 'participantA', content: '저는 작업자(우리)가 저작권을 가지는 게 맞다고 생각합니다. 우리가 창작한 결과물이니까요.', stepId: 2 },
  { role: 'participantB', content: '잠깐, 의뢰인이 대금을 지불하는데 저작권까지 의뢰인이 가져야 하지 않을까요? 그래야 나중에 그 결과물을 자유롭게 쓸 수 있으니까요.', stepId: 3 },
    { role: 'ai', content: '좋은 논의입니다. 간단히 설명하면: ① 작업자가 저작권을 가지면, 의뢰인이 작업물을 사용할 때 승인이 필요할 수 있습니다. ② 의뢰인이 저작권을 가지면, 대금 지불 후 자유롭게 사용 가능합니다. 보통 의뢰-수탁 계약에서는 ②번이 일반적입니다.', stepId: 4 },
  { role: 'participantA', content: '아, 그렇군요. 그렇다면 의뢰인이 저작권을 가지는 것도 합리적이네요. 계속 쓸 수 있어야 하니까요.', stepId: 5 },
    { role: 'ai', content: '좋습니다. 그렇다면 제5조에 "모든 산출물의 지식재산권은 의뢰인(갑)에게 귀속된다. 단, 사용 중 이슈 발생 시 작업자(을)에게 협의 요청이 가능하다"로 명시하겠습니다. 이렇게 하면 어떨까요?', stepId: 6 },
  { role: 'participantB', content: '네, 아주 좋습니다. 이제 명확해졌어요.', stepId: 7 },
    { role: 'ai', content: '감사합니다. 지식재산권 관련 조항을 확정했습니다. 모든 주요 항목이 완료되었습니다!', confirmed: true, stepId: 8 },
    { role: 'ai', content: '계약서 초안이 완성되었습니다. 작성된 모든 내용을 검토해 주시고 필요한 부분이 있으면 말씀해 주세요.', stepId: 9 }
    ],
    contractUpdates: [
      { stepId: 8, data: { copyright: '모든 산출물의 지식재산권은 의뢰인(갑)에게 귀속됨. 단, 사용 중 이슈 발생 시 작업자(을)에게 협의 요청 가능' } }
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