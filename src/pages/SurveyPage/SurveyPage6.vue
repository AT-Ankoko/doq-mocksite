<template>
  <BoxContainer>
    <SubTitle :title="title" :desc="desc"> </SubTitle>

    <v-row no-gutters justify="start">
      <v-label>소음은 어디까지 허용하나요?</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-3">
      <v-slider
        :max="4" :step="1"
        v-model="noise"
        color="#FF5858" thumb-color="#FF5858" track-color="#D9D9D9" track-fill-color="#FF5858" 
        tick-size="4" show-ticks="always" track-size="4" thumb-size="16" hide-details
      ></v-slider>
    </v-row>
    <v-row no-gutters class="justify-space-between | pt-2">
      <v-label class="small-label">항상 이어폰</v-label>
      <v-label class="small-label">작은소리 허용</v-label>
      <v-label class="small-label">스피커 모드</v-label>
    </v-row>

    <v-row no-gutters justify="start" class="margin-top-42">
      <v-label>룸메와의 물건 공유에 대해 민감한가요?</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-3">
      <v-slider
        :max="4" :step="1"
        v-model="share"
        color="#FF5858" thumb-color="#FF5858" track-color="#D9D9D9" track-fill-color="#FF5858" 
        tick-size="4" show-ticks="always" track-size="4" thumb-size="16" hide-details
      ></v-slider>
    </v-row>
    <v-row no-gutters class="justify-space-between | pt-2">
      <v-label class="small-label">전혀 안함</v-label>
      <v-label class="small-label">공동물품 구비</v-label>
      <v-label class="small-label">완전 공유</v-label>
    </v-row>

    <v-row no-gutters justify="start" class="margin-top-42">
      <v-label>방은 얼마나 자주 비우시나요?</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-3">
      <v-slider
        :max="4" :step="1"
        v-model="home"
        color="#FF5858" thumb-color="#FF5858" track-color="#D9D9D9" track-fill-color="#FF5858" 
        tick-size="4" show-ticks="always" track-size="4" thumb-size="16" hide-details
      ></v-slider>
    </v-row>
    <v-row no-gutters class="justify-space-between | pt-2">
      <v-label class="small-label">잘 안들어옴</v-label>
      <v-label class="small-label">매주마다</v-label>
      <v-label class="small-label">둥지 지킴이</v-label>
    </v-row>

  </BoxContainer>
</template>


<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import BoxContainer from "@/components/BoxContainer.vue";

const title = '일상생활';
const desc ='사소하지만 빼먹을 수 없는 몇 가지만 마지막으로 확인해 볼게요.'

const noise = ref(0);    
const share = ref(0);         
const home = ref(0);

// ----- 라이프 사이클 ----- //
onMounted(() => {
  setCurrentSurvey()
});

onUnmounted(() => {

})

// 변경값 확인 및 업데이트
watch(noise, (newValue, oldValue) => {
  console.log(`--- noise changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("noise", newValue);
});

watch(share, (newValue, oldValue) => {
  console.log(`--- share changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("share", newValue);
});

watch(home, (newValue, oldValue) => {
  console.log(`--- home changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("home", newValue);
});

// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 6}));
  console.log("Updated localStorage userProgress:", localStorage.getItem('userProgress'))

  // 저장된 값이 있다면 가져오기
  const existingSurvey = localStorage.getItem('userSurvey');
  
  if (existingSurvey) {
    const survey = JSON.parse(existingSurvey);
    noise.value = survey.noise || 0;
    share.value = survey.share || 0;
    home.value = survey.home || 0;
  }
}

// 변경값 로컬스토리지에 저장
function updateLocalStorage(field, value) {
  const existingSurvey = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existingSurvey[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existingSurvey));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}

</script>

<style scoped>
/* 슬라이더 틱의 색상 고정 */
:deep(.v-slider__ticks) {
  background-color: #ffffff !important; /* 틱을 하얀색으로 고정 */
  border-radius: 100%; /* 둥근 모양 */
}

:deep(.v-label) {
  color: #000000;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
}

.small-label {
  color: #000000;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
}

.margin-top-42 {
  margin-top: 42px;
}
</style>