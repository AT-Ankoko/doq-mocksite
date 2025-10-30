<template>
  <v-sheet class="d-flex flex-column fill-height" color="transparent">
    <v-container fluid class="messages-container | flex-grow-1 | overflow-y-auto | pa-6" ref="messagesContainer">
      
      <div class="d-flex | flex-column | ga-4">
        
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['d-flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div 
            :class="[
              'd-flex', 
              'flex-column', 
              msg.role === 'user' ? 'align-end' : 'align-start'
            ]"
          >
            <v-chip
              :class="[
                'message-bubble',
                'message-text',
                'pa-4',
                'rounded-xl',
                msg.role === 'user' ? 'user-bubble' : 'ai-bubble'
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
      <v-text-field
        :model-value="inputValue"
        @update:model-value="$emit('update:input-value', $event)"
        @keypress.enter="$emit('send-message')"
        placeholder="메시지를 입력하세요..."
        variant="solo" flat hide-details 
        density="comfortable" 
        bg-color="transparent" 
        class="flex-grow-1"
      ></v-text-field>
      <v-btn
        @click="$emit('send-message')"
        color="#5200FF"
        density="comfortable"
        icon="mdi-send"
        class="mr-2"
      ></v-btn>
    </v-card>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';

// <script setup> 내용은 변경할 필요 없이 그대로입니다.
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
  }
});

const emit = defineEmits(['update:input-value', 'send-message', 'select-option']);

const messagesContainer = ref(null);

defineExpose({
  messagesContainer
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
</style>