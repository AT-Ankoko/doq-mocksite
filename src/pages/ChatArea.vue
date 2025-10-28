<template>
  <v-sheet class="chat-area d-flex flex-column flex-grow-1">
    
    <v-sheet color="white" class="border-b px-6 py-4 d-flex align-center justify-space-between">
      <div class="d-flex align-center ga-3">
        <v-avatar color="blue-darken-2" size="40" rounded="lg">
          <v-icon color="white" size="24">mdi-file-document-outline</v-icon>
        </v-avatar>
        <div>
          <h1 class="text-h6 font-weight-bold text-grey-darken-4">DoQ</h1>
          <p class="text-caption text-grey-darken-1">용역계약서 작성 도우미</p>
        </div>
      </div>
    </v-sheet>

    <v-container fluid class="messages-container flex-grow-1 overflow-y-auto pa-6" ref="messagesContainer">
      <div class="d-flex flex-column ga-4">
        
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
            <v-sheet
              :color="msg.role === 'user' ? 'blue-darken-2' : 'white'"
              :class="['message-bubble', 'pa-4', { 'border': msg.role !== 'user' }]"
              rounded="lg"
            >
              <p class="text-body-2 message-text">{{ msg.content }}</p>
            </v-sheet>
            
            <div v-if="msg.options" class="mt-3 d-flex flex-column ga-2 message-addons">
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
            
            <div v-if="msg.confirmed" class="mt-2 d-flex align-center ga-1 text-green-darken-2 message-addons">
              <v-icon size="16" color="green-darken-2">mdi-check</v-icon>
              <span class="text-caption font-weight-medium">조항 확정됨</span>
            </div>
          </div>
        </div>
      </div>
    </v-container>

    <v-sheet color="white" class="border-t px-6 py-4">
      <v-card 
        max-width="1024" 
        class="mx-auto pa-2 d-flex align-center" 
        flat 
        rounded="xl" 
        color="grey-lighten-4"
      >
        <v-text-field
          :model-value="inputValue"
          @update:model-value="$emit('update:input-value', $event)"
          @keypress.enter="$emit('send-message')"
          placeholder="메시지를 입력하세요..."
          variant="solo" 
          flat 
          hide-details 
          density="comfortable" 
          bg-color="transparent" 
          class="flex-grow-1"
        ></v-text-field>
        <v-btn
          @click="$emit('send-message')"
          color="blue"
          icon="mdi-send"
          variant="plain" 
        ></v-btn>
      </v-card>
    </v-sheet>
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

.message-bubble {
  max-width: 672px;
}

/* [추가] 부가 요소(선택지, 확정)가 버블의 최대 너비를 넘지 않도록 설정 */
.message-addons {
  max-width: 672px;
  /* d-flex flex-column과 함께 사용되어 
    내부의 v-btn 등이 100% 너비를 갖도록 함 
  */
  width: 100%; 
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.messages-container {
  scroll-behavior: smooth;
}
</style>