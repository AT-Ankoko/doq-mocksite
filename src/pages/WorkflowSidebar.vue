<template>
  <v-col class="workflow-sidebar | bg-white | border-e | overflow-y-auto | pa-0">
    <v-row 
      class="px-6 py-4 | border-b | ma-0"
    >
      <v-col cols="12" class="pa-0">
        <v-select
          variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#5661F6" color="#5661F6" item-color="#5661F6" 
          :model-value="currentScenario"
          @update:model-value="$emit('select-scenario', $event)"
          :items="scenarioItems"
          item-title="name"
          item-value="value"
          hide-details
        ></v-select>

        <v-card
          class="mt-3"
          variant="flat" rounded="lg" color="#F1F5F9"
        >
          <v-card-text class="pa-4">
            <v-row class="ma-0">
              <v-col 
                cols="12" 
                class="pa-0 | text-body-2 | font-weight-bold"
                style="color: #5661F6;"
              >
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


    <v-row class="px-6 py-6 | ma-0">
      <v-col cols="12" class="d-flex flex-column | ga-3 | pa-0">
        <template v-for="(step, idx) in currentSteps" :key="step.id">
          <v-card
            @click="$emit('select-step', step.id)"
            variant="outlined"
            border="md"
            :style="{ 
              'border-color': getStepBorderColor(step.type),
              'background-color': selectedStep === step.id ? getStepSelectedBgColor(step.type) : 'white' 
            }"
            class="pa-4 | cursor-pointer"
            ripple="false" 
          >
            <v-row class="ma-0">
              <v-col cols="12" class="d-flex align-center | ga-2 | pa-0">
                <v-avatar 
                  size="24" 
                  :color="getStepAvatarColor(step.type, selectedStep === step.id)"
                >
                  <span 
                    class="text-caption | font-weight-bold"
                    :style="{ color: selectedStep === step.id ? 'white' : getStepTextColor(step.type) }"
                  >{{ idx + 1 }}</span>
                </v-avatar>
                <span 
                  class="text-body-2 | font-weight-bold"
                  :style="{ color: getStepTextColor(step.type) }"
                >
                  {{ step.label }}
                </span>
              </v-col>
              <v-col 
                cols="12" 
                class="text-caption | ml-8 | pa-0 | text-grey-darken-1"
              >
                {{ step.subtitle }}
              </v-col>
            </v-row>
          </v-card>
          
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
// <script setup> 부분은 변경할 필요가 없습니다. (그대로 사용)
import { computed } from "vue";

// ----- 색상 변수 정의 -----
const COLOR_BLUE = '#5661F6';
const COLOR_ORANGE = '#FF8513';

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

function getStepSelectedBgColor(type) {
  if (type === 'user') {
    return '#FF851333'; // 주황색 20%
  }
  return '#5661F633'; // 파란색 20%
}

// 단계 타입에 따른 테두리 색상 반환
function getStepBorderColor(type) {
  if (type === 'user') {
    return COLOR_ORANGE;
  }
  return COLOR_BLUE;
}

// 단계 타입에 따른 텍스트 색상 반환
function getStepTextColor(type) {
  if (type === 'user') {
    return COLOR_ORANGE;
  }
  return COLOR_BLUE;
}

// 30% 투명도 hex (아바타 미선택 시)
function getStepAvatarColor(type, isSelected) {
  if (isSelected) {
    return type === 'user' ? COLOR_ORANGE : COLOR_BLUE;
  }
  return type === 'user' ? '#FF85134D' : '#5661F64D';
}
</script>

<style scoped>
/* <style> 부분은 변경할 필요가 없습니다. (그대로 사용) */
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

/* Select Box 스타일 */
:deep(.v-select .v-field) {
  background-color: white;
}
</style>