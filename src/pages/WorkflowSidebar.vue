<template>
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
          @click="$emit('select-scenario', idx)"
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
      <template v-for="(step, idx) in currentSteps" :key="step.id">
        <v-btn
          @click="$emit('select-step', step.id)"
          :variant="selectedStep === step.id ? 'elevated' : 'flat'"
          :color="step.color"
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
        <div v-if="idx < currentSteps.length - 1" class="d-flex justify-center py-1">
          <div class="connector-line bg-grey-lighten-1"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  scenarios: {
    type: Array,
    required: true
  },
  currentScenario: {
    type: Number,
    required: true
  },
  selectedStep: {
    type: Number,
    default: null
  }
});

const currentSteps = computed(() => {
  return props.scenarios[props.currentScenario]?.steps || [];
});


const emit = defineEmits(['select-scenario', 'select-step']);
// ----- 라이프 사이클 ----- //


// ----- 함수 정의 ----- //

</script>

<style scoped>
.workflow-sidebar {
  width: 320px;
  min-width: 320px;
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

.border-e {
  border-inline-end: 1px solid rgba(0, 0, 0, 0.12);
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>