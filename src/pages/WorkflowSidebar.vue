<template>
  <v-col class="workflow-sidebar | bg-white | border-e | overflow-y-auto | pa-0">
    <!-- <v-row class="px-6 py-4 | border-b | ma-0">
      <v-col cols="12" class="pa-0">
        <h2 class="text-h6 | font-weight-bold | text-grey-darken-4">워크플로우</h2>
        <p class="text-caption | text-grey-darken-1 | mt-1">대화 흐름도</p>
      </v-col>
    </v-row> -->

    <!-- 시나리오 선택 영역 -->
    <v-row class="px-6 py-4 | border-b | bg-grey-lighten-4 | ma-0">
      <v-col cols="12" class="pa-0">
        <!-- Select Box -->
        <v-select
          :model-value="currentScenario"
          @update:model-value="$emit('select-scenario', $event)"
          :items="scenarioItems"
          item-title="name"
          item-value="value"
          variant="outlined"
          density="comfortable"
          color="primary"
          hide-details
        ></v-select>

        <!-- 선택된 시나리오 정보 카드 -->
        <v-card
          class="mt-3"
          variant="flat"
          color="blue-lighten-5"
          border="md primary"
        >
          <v-card-text class="pa-4">
            <v-row class="ma-0">
              <v-col cols="12" class="pa-0 | text-body-2 | font-weight-bold | text-blue-darken-4">
                {{ currentScenarioInfo.title }}
              </v-col>
              <v-col cols="12" class="pa-0 | text-caption | text-grey-darken-2">
                {{ currentScenarioInfo.description }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 플로우 블록 -->
    <v-row class="px-6 py-6 | ma-0">
      <v-col cols="12" class="d-flex flex-column | ga-3 | pa-0">
        <template v-for="(step, idx) in currentSteps" :key="step.id">
          <v-card
            @click="$emit('select-step', step.id)"
            :variant="selectedStep === step.id ? 'flat' : 'outlined'"
            :color="selectedStep === step.id ? getStepColor(step.type) : 'white'"
            :border="selectedStep !== step.id ? `md ${getStepBorderColor(step.type)}` : undefined"
            :class="[
              'pa-4 | cursor-pointer',
              { 'step-selected': selectedStep === step.id }
            ]"
            hover
          >
            <v-row class="ma-0">
              <v-col cols="12" class="d-flex align-center | ga-2 | pa-0">
                <v-avatar 
                  size="24" 
                  :color="getStepAvatarColor(step.type, selectedStep === step.id)"
                >
                  <span class="text-caption | font-weight-bold | white--text">{{ idx + 1 }}</span>
                </v-avatar>
                <span 
                  class="text-body-2 | font-weight-bold"
                  :class="selectedStep === step.id ? 'white--text' : getStepTextColor(step.type)"
                >
                  {{ step.label }}
                </span>
              </v-col>
              <v-col 
                cols="12" 
                class="text-caption | ml-8 | pa-0"
                :class="selectedStep === step.id ? 'white--text' : 'text-grey-darken-1'"
                :style="selectedStep === step.id ? 'opacity: 0.9;' : ''"
              >
                {{ step.subtitle }}
              </v-col>
            </v-row>
          </v-card>
          
          <!-- 연결선 -->
          <v-row v-if="idx < currentSteps.length - 1" class="ma-0">
            <v-col cols="12" class="d-flex justify-center | pa-0">
              <v-divider 
                vertical 
                thickness="2" 
                length="16"
                class="connector-line"
              ></v-divider>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
import { computed } from "vue";

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

const emit = defineEmits(['select-scenario', 'select-step']);

// Select Box에 표시할 아이템들
const scenarioItems = computed(() => {
  return props.scenarios.map((scenario, idx) => ({
    name: `시나리오 ${idx + 1}`,
    value: idx
  }));
});

// 현재 선택된 시나리오 정보
const currentScenarioInfo = computed(() => {
  return props.scenarios[props.currentScenario] || {};
});

// 현재 시나리오의 단계들
const currentSteps = computed(() => {
  return props.scenarios[props.currentScenario]?.steps || [];
});

// 단계 타입에 따른 색상 반환 (선택 시)
function getStepColor(type) {
  if (type === 'user') {
    return 'orange';
  }
  return 'blue'; // AI 타입
}

// 단계 타입에 따른 테두리 색상 반환 (미선택 시)
function getStepBorderColor(type) {
  if (type === 'user') {
    return 'orange';
  }
  return 'blue'; // AI 타입
}

// 단계 타입에 따른 텍스트 색상 반환 (미선택 시)
function getStepTextColor(type) {
  if (type === 'user') {
    return 'text-orange-darken-2';
  }
  return 'text-blue-darken-2'; // AI 타입
}

// 아바타 색상 반환
function getStepAvatarColor(type, isSelected) {
  if (isSelected) {
    return type === 'user' ? 'orange-darken-2' : 'blue-darken-2';
  }
  return type === 'user' ? 'orange-lighten-4' : 'blue-lighten-4';
}
</script>

<style scoped>
.workflow-sidebar {
  width: 320px;
  min-width: 320px;
  height: 100vh;
}

.cursor-pointer {
  cursor: pointer;
}

.connector-line {
  opacity: 0.3;
}

.border-e {
  border-inline-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* 선택된 카드의 텍스트 색상 */
:deep(.v-card.bg-orange .v-card-text),
:deep(.v-card.bg-blue .v-card-text) {
  color: white !important;
}

:deep(.white--text) {
  color: white !important;
}

/* Select Box 스타일 */
:deep(.v-select .v-field) {
  background-color: white;
}
</style>