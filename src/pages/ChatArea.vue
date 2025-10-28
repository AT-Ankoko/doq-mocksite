<template>
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
                @click="$emit('select-option', option)"
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
          :model-value="inputValue"
          @update:model-value="$emit('update:input-value', $event)"
          @keypress.enter="$emit('send-message')"
          placeholder="메시지를 입력하세요..."
          variant="outlined"
          density="comfortable"
          hide-details
          class="flex-grow-1"
        ></v-text-field>
        <v-btn
          @click="$emit('send-message')"
          color="blue-darken-2"
          size="large"
          icon
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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

.messages-container {
  scroll-behavior: smooth;
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>