<template>
  <BoxContainer>
    <SubTitle :title="title" :desc="desc"> </SubTitle>

    <v-row no-gutters justify="start" class="mt-4">
      <v-col>
        <v-textarea
          class="text-area-custom"
          label="룸메이트 구인 글을 입력해주세요."
          variant="outlined"
          v-model="surveytext"
          :rows="textareaRows"
          max-rows="18"
          auto-grow
          @focus="onFocus"
          @blur="onBlur"
        ></v-textarea>
      </v-col>
    </v-row>

  </BoxContainer>
</template>

<script setup>

import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import BoxContainer from "@/components/BoxContainer.vue";

const title = '구인글로 이미지 생성하기'
const desc = '이미 작성한 룸메이트 구인글이 있다면, 붙여넣기하여 간편하게 둥지동지 이미지로 변환해보세요.'

const isMobile = ref(false);
const textareaRows = ref(15);
const surveytext = ref(null);

// ----- 라이프 사이클 ----- //
onMounted(() => {
  setCurrentSurvey()
});

onUnmounted(() => {
});

// surveytext가 변경될 때마다 localStorage의 notes 업데이트
watch(surveytext, (newValue) => {
  updateLocalStorage("notes", newValue);
});

// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 11}));
  console.log("Updated localStorage userProgress:", localStorage.getItem('userProgress'))

  // 저장된 값이 있다면 가져오기
  const existingSurvey = localStorage.getItem('userSurvey');
  
  if (existingSurvey) {
    const survey = JSON.parse(existingSurvey);
    surveytext.value = survey.notes || null;
  }
}

// 변경값 로컬스토리지에 저장
function updateLocalStorage(field, value) {
  const existingSurvey = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existingSurvey[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existingSurvey));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}

function onBlur() {
  textareaRows.value = 15; 
}

function onFocus() {
  if (isMobile.value) {
    textareaRows.value = 5; 
  }
}

</script>

<style scoped>
.margin-top-100 {
  margin-top: 100px;
}
.title-text {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}
.subtitle-text {
  font-size: 16px;
  text-align: left;
  color: #666;
  margin: 0 10px;
}

.text-area-custom :deep(.v-field__outline) {
  color: #FF6161;
}
.finish-btn {
  font-size: 20px;
  font-weight: bold;
}
</style>