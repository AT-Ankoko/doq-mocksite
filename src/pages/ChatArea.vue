<template>
    <v-container fluid class="messages-container | flex-grow-1 | overflow-y-auto | pa-6" ref="messagesContainer">
      
      <div class="d-flex | flex-column | ga-4">
        
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['d-flex', getAlignment(msg.role)]"
        >
          <div 
            :class="[
              'd-flex', 
              'flex-column', 
              getInnerAlign(msg.role)
            ]"
          >
            <div class="message-meta | mb-1">
              <span class="sender-name">{{ getSenderName(msg.role) }}</span>
            </div>

            <v-chip
              :class="[
                'message-bubble',
                'message-text',
                'pa-4',
                'rounded-xl',
                getBubbleClass(msg.role)
              ]"
              rounded="lg"
              color="#FFFFFF"
            >
              {{ msg.content }}
            </v-chip>
            
            <div v-if="msg.options" class="mt-3 | d-flex | flex-column | ga-2 | message-addons">
              <v-btn
                v-for="(option, optIdx) in msg.options"
                :key="optIdx"
                @click="$emit('select-option', option)"
                variant="outlined"
                color="#5200FF"
                class="text-left | justify-start | text-body-2"
                height="auto"
              >
                {{ optIdx + 1 }}. {{ option }}
              </v-btn>
            </div>
            
            <div 
              v-if="msg.confirmed" 
              class="mt-2 | d-flex | align-center | ga-1 | message-addons"
              style="color: #5200FF"
            >
              <v-icon size="16" color="#5200FF">mdi-check</v-icon>
              <span class="text-caption | font-weight-medium">조항 확정됨</span>
            </div>
          </div>
        </div>
      </div>
    </v-container>

    <v-card 
      class="d-flex | align-center | chat-input-area" 
      flat rounded="xl" 
      color="#FFFFFF"
    >
      <!-- 참가자 선택: 챗봇이 중계자, 참가자 A/B가 메시지 입력 -->
      <v-select
        :items="participants"
        item-title="name"
        item-value="id"
        :model-value="selectedSender"
        @update:model-value="$emit('update:selected-sender', $event)"
        variant="outlined"
        rounded="lg"
        hide-details
        dense
        style="width: 160px; margin-right: 12px"
      ></v-select>

      <v-text-field
        :model-value="inputValue"
        @update:model-value="$emit('update:input-value', $event)"
        @keypress.enter="onSend"
        placeholder="메시지를 입력하세요..."
        variant="solo" flat hide-details 
        density="comfortable" 
        bg-color="transparent" 
        class="flex-grow-1"
      ></v-text-field>
      <v-btn
        @click="onSend"
        color="#5200FF"
        density="comfortable"
        icon="mdi-send"
        class="mr-2"
      ></v-btn>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';

// 참가자(2인) + 중계자 시나리오 지원
const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  inputValue: {
    type: String,
    required: true
  },
  currentScenario: {
    type: Object,
    default: () => ({})
  },
  // 참가자 목록 (id, name)
  participants: {
    type: Array,
    default: () => [
      { id: 'participantA', name: '참가자 A' },
      { id: 'participantB', name: '참가자 B' }
    ]
  },
  // 현재 선택된 발신자 (participant id)
  selectedSender: {
    type: [String, Number],
    default: 'participantA'
  }
});

const emit = defineEmits(['update:input-value', 'send-message', 'select-option', 'update:selected-sender']);

const messagesContainer = ref(null);

function onSend() {
  if (!props.inputValue || !props.selectedSender) return;
  // emit 메시지와 발신자 정보
  emit('send-message', { content: props.inputValue, sender: props.selectedSender });
  // 부모가 inputValue를 관리하므로 비우도록 요청
  emit('update:input-value', '');
}

function isMediator(role) {
  return role === 'mediator' || role === 'ai' || role === 'system';
}

function getAlignment(role) {
  const p0 = props.participants[0]?.id;
  const p1 = props.participants[1]?.id;
  if (role === p0) return 'justify-end';
  if (role === p1) return 'justify-start';
  if (isMediator(role)) return 'justify-start';
  return role === 'user' ? 'justify-end' : 'justify-start';
}

function getInnerAlign(role) {
  const p0 = props.participants[0]?.id;
  const p1 = props.participants[1]?.id;
  if (role === p0) return 'align-end';
  if (role === p1) return 'align-start';
  if (isMediator(role)) return 'align-start';
  return role === 'user' ? 'align-end' : 'align-start';
}

function getBubbleClass(role) {
  const p0 = props.participants[0]?.id;
  const p1 = props.participants[1]?.id;
  if (role === p0) return 'participant-a-bubble';
  if (role === p1) return 'participant-b-bubble';
  if (isMediator(role)) return 'ai-bubble';
  return role === 'user' ? 'user-bubble' : 'ai-bubble';
}

function getSenderName(role) {
  if (isMediator(role)) return '중계자 (DoQ)';
  const found = props.participants.find(p => p.id === role);
  if (found) return found.name;
  // fallback for legacy 'user' role
  if (role === 'user') return props.participants[0]?.name || '사용자';
  return role;
}

defineExpose({
  messagesContainer,
  onSend
});
</script>

<style scoped>
.chat-area {
  min-width: 0;
}

/* --- 공통 스타일 --- */
.message-bubble {
  max-width: 672px;
  height: auto !important;
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.message-addons {
  max-width: 672px;
  width: 100%; 
}

.messages-container {
  scroll-behavior: smooth;
}

.chat-input-area {
  padding: 8px;
  margin: 24px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.message-meta {
  max-width: 672px;
}

.sender-name {
  font-size: 12px;
  color: #6B7280; /* gray-500 */
  display: inline-block;
}

/* --- 유형별 버블 스타일 --- */

:deep(.ai-bubble) {
  background-color: #FFFFFF !important;
}

:deep(.ai-bubble .v-chip__content) {
  color: #1F103B !important;
}

:deep(.user-bubble) {
  background-color: #5661F64D !important;
}

:deep(.user-bubble .v-chip__content) {
  color: #1F103B !important;
}

/* 참가자별 버블 스타일 */
:deep(.participant-a-bubble) {
  background-color: #FEE2E2 !important; /* 연한 빨강 계열 */
}

:deep(.participant-a-bubble .v-chip__content) {
  color: #7F1D1D !important;
}

:deep(.participant-b-bubble) {
  background-color: #E8F0FF !important; /* 연한 파랑 계열 */
}

:deep(.participant-b-bubble .v-chip__content) {
  color: #102A6D !important;
}
</style>