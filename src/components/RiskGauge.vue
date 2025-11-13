<template>
  <div class="risk-gauge-container">
    <div class="risk-header d-flex items-center justify-space-between">
      <div class="text-subtitle-2 font-weight-medium">조항 위험도</div>
      <div class="risk-info">
        <span class="risk-percent">{{ riskPercent }}%</span>
        <span class="risk-level">{{ riskLevel }}</span>
      </div>
    </div>

    <div class="risk-track mt-2">
      <div class="risk-fill" :style="{ width: riskPercent + '%', background: riskColor }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  contractData: {
    type: Object,
    default: () => ({})
  }
})

const filledFields = ['workContent', 'period', 'payment', 'copyright']

const filledCount = computed(() => {
  return filledFields.reduce((acc, key) => acc + (props.contractData && props.contractData[key] ? 1 : 0), 0)
})

const riskPercent = computed(() => {
  const filled = filledCount.value
  const total = filledFields.length
  return Math.round((1 - filled / total) * 100)
})

const riskLevel = computed(() => {
  const p = riskPercent.value
  if (p <= 33) return '낮음'
  if (p <= 75) return '보통'
  return '높음'
})

const riskColor = computed(() => {
  const p = riskPercent.value
  if (p <= 33) return '#5661F6'
  if (p <= 75) return '#5661F6'
  return '#FF8513'
})
</script>

<style scoped>
.risk-gauge-container {
  padding: 12px 16px;
  border-bottom: 1px solid #eef0f2;
  background: #fff;
}
.risk-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.risk-info {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #616161;
}
.risk-percent {
  font-weight: 600;
}
.risk-level {
  font-size: 0.85rem;
  color: #424242;
}
.risk-track {
  height: 8px;
  background: #f1f1f1;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 8px;
}
.risk-fill {
  height: 100%;
  width: 0%;
  transition: width 300ms ease-in-out, background 200ms linear;
}
</style>
